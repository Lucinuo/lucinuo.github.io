// 規格 vs 背景圖對帳。
//
// 為什麼要有這支：場景檢查器只比對「規格 vs 規格」（互動點有沒有落在宣告的碰撞矩形裡），
// 宣告錯了它就跟著錯——所以 2026-08-25 之前它一路 PASS，畫面上人卻坐在椅子外面、
// 店員站在櫃體裡面。這支改成比對「規格 vs 圖上真正畫了什麼像素」。
//
// 沒有外部相依：PNG 用 node:zlib 自己解。

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  BLOCKED_RECTS,
  CASHIER_STAFF_ZONE,
  FRONT_FACES,
  KITCHEN_BLOCKED_RECTS,
  KITCHEN_POINTS,
  KITCHEN_WALKABLE_AREA,
  POINTS,
  TABLES,
  WAITING_QUEUE_POINTS,
  WALKABLE_AREAS,
} from "../site/four-shifts/game-rules.mjs";

const here = dirname(fileURLToPath(import.meta.url));

function decodePng(path) {
  const file = readFileSync(path);
  const width = file.readUInt32BE(16);
  const height = file.readUInt32BE(20);
  assert.equal(file[24], 8, "background PNG is 8-bit");
  assert.equal(file[25], 2, "background PNG is truecolour RGB");
  assert.equal(file[28], 0, "background PNG is not interlaced");

  const parts = [];
  for (let offset = 8; offset < file.length;) {
    const length = file.readUInt32BE(offset);
    const type = file.toString("ascii", offset + 4, offset + 8);
    if (type === "IDAT") parts.push(file.subarray(offset + 8, offset + 8 + length));
    offset += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(parts));

  const stride = width * 3;
  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let x = 0; x < stride; x += 1) {
      const a = x >= 3 ? pixels[y * stride + x - 3] : 0;
      const b = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const c = x >= 3 && y > 0 ? pixels[(y - 1) * stride + x - 3] : 0;
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      pixels[y * stride + x] = value & 0xff;
    }
  }
  return {
    width,
    height,
    at(x, y) {
      const index = Math.round(y) * stride + Math.round(x) * 3;
      return [pixels[index], pixels[index + 1], pixels[index + 2]];
    },
  };
}

const room = decodePng(join(here, "../site/four-shifts/assets/pixel-restaurant.png"));
assert.deepEqual({ width: room.width, height: room.height }, { width: 960, height: 540 }, "background matches the world size");

// 前場／客席是磚紅地磚，廚房是灰地磚。
const isDiningFloor = ([r, g, b]) => r > 110 && r - g > 40 && g - b > 4;
const isKitchenFloor = ([r, g, b]) => Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 90 && r < 195;
const isAnyFloor = (colour) => isDiningFloor(colour) || isKitchenFloor(colour);
// 椅子的木頭色跟地磚一樣是棕的，只靠色相分不開；亮度才分得開（家具在暗部，地板被打亮）。
const luminance = ([r, g, b]) => r * 0.3 + g * 0.59 + b * 0.11;

const insideRect = (point, rect) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;

function floorRatio(rect, test, skip = []) {
  let total = 0;
  let floor = 0;
  for (let x = rect.left + 4; x <= rect.right - 4; x += 8) {
    for (let y = rect.top + 4; y <= rect.bottom - 4; y += 8) {
      // 只檢查「角色真的走得到」的格子；家具本來就不該是地板。
      if (skip.some((item) => insideRect({ x, y }, item))) continue;
      total += 1;
      if (test(room.at(x, y))) floor += 1;
    }
  }
  return total ? floor / total : 1;
}

// 1. 宣告「可以走」的地方，圖上必須真的是地板。
for (const area of WALKABLE_AREAS) {
  // door-lane 是門與門外的街，不是地板，改由下面的門檢查負責。
  if (area.name === "door-lane") continue;
  const ratio = floorRatio(area, isDiningFloor, BLOCKED_RECTS);
  assert.ok(ratio > 0.9, `walkable area ${area.name} is painted as floor (${(ratio * 100).toFixed(0)}%)`);
}
assert.ok(!isDiningFloor(room.at(POINTS.entranceDoor.x, POINTS.entranceDoor.y)), "the entrance door is a painted door, not floor spilling into the void");
assert.ok(floorRatio(KITCHEN_WALKABLE_AREA, isKitchenFloor, KITCHEN_BLOCKED_RECTS) > 0.9, "kitchen walkable area is painted as kitchen floor");
// 店員站的那一格在螢幕上落在櫃體裡（那是背景畫不出來的「櫃台後方」）。
// 該驗的不是它是不是地板，而是櫃台正面真的會蓋住她——否則就會變成站在櫃體上。
const cashierFront = FRONT_FACES.find((face) => face.name === "cashier-front");
assert.ok(cashierFront, "the cashier counter declares a front face");
assert.ok(
  CASHIER_STAFF_ZONE.left >= cashierFront.rect.left && CASHIER_STAFF_ZONE.right <= cashierFront.rect.right
  && CASHIER_STAFF_ZONE.bottom <= cashierFront.baseline,
  "the staff stand-behind band is fully covered by the counter front face"
);
assert.ok(floorRatio({ left: 240, top: 452, right: 350, bottom: 460 }, isDiningFloor) > 0.8, "there is painted floor in front of the counter for customers");

// 2. 每個角色會站上去的互動點，腳底下必須是地板。
const standingPoints = {
  queueHost: POINTS.queueHost,
  entranceInside: POINTS.entranceInside,
  queueEntry: POINTS.queueEntry,
  exitBypass: POINTS.exitBypass,
  guestAisleStart: POINTS.guestAisleStart,
  guestAisleEnd: POINTS.guestAisleEnd,
  pickupWaiter: POINTS.pickupWaiter,
  drinkPickupWaiter: POINTS.drinkPickupWaiter,
  checkoutCustomer: POINTS.checkoutCustomer,
  checkoutQueue: POINTS.checkoutQueue,
  checkoutExitApproach: POINTS.checkoutExitApproach,
};
for (const [name, point] of Object.entries(standingPoints)) {
  assert.ok(isDiningFloor(room.at(point.x, point.y)), `${name} stands on painted floor, not on furniture`);
}
for (const [name, point] of Object.entries(KITCHEN_POINTS)) {
  assert.ok(isKitchenFloor(room.at(point.x, point.y)), `kitchen ${name} stands on painted kitchen floor`);
}
WAITING_QUEUE_POINTS.forEach((point, index) => {
  assert.ok(isDiningFloor(room.at(point.x, point.y)), `queue slot ${index + 1} stands on painted floor`);
});
for (const table of TABLES) {
  assert.ok(isDiningFloor(room.at(table.seatApproachPoint.x, table.seatApproachPoint.y)), `table ${table.id} approachPoint stands on painted floor`);
  assert.ok(isDiningFloor(room.at(table.servicePoint.x, table.servicePoint.y)), `table ${table.id} servicePoint stands on painted floor`);
}

// 3. 宣告「擋住」的家具，圖上必須真的畫了東西——不能拿空地當碰撞區。
const furniture = ["cashier-counter", "table-1", "table-2", "table-3", "table-4", "right-plant"];
for (const name of furniture) {
  const rect = BLOCKED_RECTS.find((item) => item.name === name);
  assert.ok(rect, `${name} exists in the collision map`);
  const ratio = floorRatio(rect, isAnyFloor);
  assert.ok(ratio < 0.35, `${name} collision rect covers painted furniture, not bare floor (${(ratio * 100).toFixed(0)}% floor)`);
}

// 4. 座位：seatPoint 必須落在椅子上（有畫東西），而且緊貼椅子的落地線。
for (const table of TABLES) {
  const seat = table.seatPoints[0];
  const chair = table.chairBlockedArea;
  assert.ok(seat.x > chair.left && seat.x < chair.right, `table ${table.id} seat sits inside the painted chair horizontally`);
  assert.ok(Math.abs(seat.y - chair.bottom) <= 6, `table ${table.id} seat sits on the chair's floor line, not below it`);
  // 單一像素會踩到椅面高光，取一小段取樣看多數。
  const above = [12, 20, 25, 30, 40].map((offset) => luminance(room.at(seat.x, seat.y - offset)));
  assert.ok(above.filter((value) => value < 80).length >= 3, `table ${table.id} seat has a painted chair behind it, not bare floor`);
}

console.log("Restaurant Rookie art/spec reconciliation passed");
