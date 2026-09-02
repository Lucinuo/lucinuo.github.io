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
import {
  COLLISION_RECTS,
  FURNITURE,
  INTERACTION_POINTS,
  ROLE_WALKABLE_AREAS,
  TABLE_POINTS,
  WORLD,
  pointBlocked as scenePointBlocked,
  roleWalkable,
} from "../site/four-shifts/scene-v2.mjs";

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

function decodeIndexedPng(path) {
  const file = readFileSync(path);
  const width = file.readUInt32BE(16);
  const height = file.readUInt32BE(20);
  assert.equal(file[24], 8, `${path} is 8-bit`);
  assert.equal(file[25], 3, `${path} is indexed PNG-8`);
  assert.equal(file[28], 0, `${path} is not interlaced`);

  const parts = [];
  let palette;
  let transparency = Buffer.alloc(0);
  for (let offset = 8; offset < file.length;) {
    const length = file.readUInt32BE(offset);
    const type = file.toString("ascii", offset + 4, offset + 8);
    const data = file.subarray(offset + 8, offset + 8 + length);
    if (type === "IDAT") parts.push(data);
    if (type === "PLTE") palette = data;
    if (type === "tRNS") transparency = data;
    offset += 12 + length;
  }
  assert.ok(palette, `${path} has a palette`);

  const raw = inflateSync(Buffer.concat(parts));
  const pixels = Buffer.alloc(width * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (width + 1)];
    const line = raw.subarray(y * (width + 1) + 1, (y + 1) * (width + 1));
    for (let x = 0; x < width; x += 1) {
      const a = x > 0 ? pixels[y * width + x - 1] : 0;
      const b = y > 0 ? pixels[(y - 1) * width + x] : 0;
      const c = x > 0 && y > 0 ? pixels[(y - 1) * width + x - 1] : 0;
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
      pixels[y * width + x] = value & 0xff;
    }
  }

  return {
    width,
    height,
    palette,
    pixels,
    alpha(index) {
      return index < transparency.length ? transparency[index] : 255;
    },
    colour(index) {
      return palette.subarray(index * 3, index * 3 + 3);
    },
  };
}

const room = decodePng(join(here, "../site/four-shifts/assets/pixel-restaurant-v2.png"));
assert.deepEqual({ width: room.width, height: room.height }, { width: 960, height: 540 }, "background matches the world size");

// 前場／客席是磚紅地磚，廚房是灰地磚。
const isDiningFloor = ([r, g, b]) => r > 80 && r - g > 20 && g - b > 2;
const isKitchenFloor = ([r, g, b]) => Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && r > 50 && r < 195;
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
  // 窄收銀走道與動態門區改由下面的實際站位檢查，避免家具前緣拉低整區平均。
  if (["cashier-customer", "entrance-lane"].includes(area.name)) continue;
  const ratio = floorRatio(area, isDiningFloor, BLOCKED_RECTS);
  assert.ok(ratio > 0.8, `walkable area ${area.name} is painted as floor (${(ratio * 100).toFixed(0)}%)`);
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
assert.ok(isDiningFloor(room.at(POINTS.checkoutCustomer.x, POINTS.checkoutCustomer.y)), "the customer checkout anchor is on painted floor in front of the counter");

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
const furniture = ["cashier-counter", "table-1", "table-2", "table-3", "table-4", "plant-bottom-right"];
for (const name of furniture) {
  const rect = BLOCKED_RECTS.find((item) => item.name === name);
  assert.ok(rect, `${name} exists in the collision map`);
  const darkRatio = floorRatio(rect, (colour) => luminance(colour) < 60);
  assert.ok(darkRatio > 0.4, `${name} collision rect covers the painted dark furniture silhouette (${(darkRatio * 100).toFixed(0)}% dark pixels)`);
}

// 4. 座位：seatPoint 必須落在椅子上（有畫東西），而且緊貼椅子的落地線。
for (const table of TABLES) {
  const seat = table.seatPoints[0];
  const chair = table.chairBlockedArea;
  assert.ok(seat.x > chair.left && seat.x < chair.right, `table ${table.id} seat sits inside the painted chair horizontally`);
  assert.ok(seat.x < chair.left + 20 && seat.y > chair.top && seat.y < chair.bottom, `table ${table.id} seat uses the left chair, not the table centre`);
  // 單一像素會踩到椅面高光，取一小段取樣看多數。
  const above = [12, 20, 25, 30, 40].map((offset) => luminance(room.at(seat.x, seat.y - offset)));
  assert.ok(above.filter((value) => value < 80).length >= 3, `table ${table.id} seat has a painted chair behind it, not bare floor`);
}

assert.deepEqual({ width: room.width, height: room.height }, { width: WORLD.width, height: WORLD.height }, "v2 scene matches the 960×540 world");
for (const item of FURNITURE) {
  for (const value of [item.x, item.y, item.width, item.height]) assert.equal(value % WORLD.grid, 0, `${item.id} aligns to the 20px grid`);
}
for (const rect of COLLISION_RECTS) {
  assert.ok(rect.left >= 0 && rect.top >= 0 && rect.right <= WORLD.width && rect.bottom <= WORLD.height, `${rect.id} stays inside the world`);
}
for (const [role, areas] of Object.entries(ROLE_WALKABLE_AREAS)) {
  assert.ok(areas.length > 0, `${role} has a walkable map`);
  for (const area of areas) {
    for (const value of [area.left, area.top, area.right, area.bottom]) assert.equal(value % WORLD.grid, 0, `${role}/${area.id} aligns to the grid`);
  }
}
for (const point of INTERACTION_POINTS) {
  const isDoor = point.id === "entranceDoor";
  assert.equal(point.x % WORLD.grid, WORLD.grid / 2, `${point.id} uses the centre of its grid cell`);
  assert.equal(point.y % WORLD.grid, WORLD.grid / 2, `${point.id} uses the centre of its grid cell`);
  assert.ok(isDoor || roleWalkable(point.role, point, { doorOpen: true }), `${point.id} is legal for ${point.role}`);
}
for (const table of TABLE_POINTS) {
  assert.ok(roleWalkable("customer", table.approachPoint, { doorOpen: true }), `table ${table.id} approach is walkable`);
  assert.ok(scenePointBlocked(table.seatPoint), `table ${table.id} seat is seated-only inside the chair collision`);
  assert.ok(roleWalkable("waiter", table.servicePoint, { doorOpen: true }), `table ${table.id} service point is outside furniture`);
}

const openDoor = decodePng(join(here, "../site/four-shifts/assets/pixel-restaurant-v2-door-open.png"));
assert.deepEqual({ width: openDoor.width, height: openDoor.height }, { width: 100, height: 100 }, "open-door overlay matches the dynamic entrance region");

const spriteSpecs = [
  { name: "pixel-atlas-v3.png", width: 576, height: 320, rows: 4 },
  { name: "female-waiter-v3.png", width: 576, height: 80, rows: 1 },
];
const sprites = spriteSpecs.map((spec) => ({
  ...spec,
  path: join(here, `../site/four-shifts/assets/${spec.name}`),
  image: decodeIndexedPng(join(here, `../site/four-shifts/assets/${spec.name}`)),
}));
assert.ok(sprites.every(({ path }) => readFileSync(path).length <= 60 * 1024), "sprite atlases stay under 60 KB");
assert.deepEqual(sprites[0].image.palette, sprites[1].image.palette, "sprite atlases share one palette");

const usedColours = new Set();
for (const { name, width, height, rows, image } of sprites) {
  assert.deepEqual({ width: image.width, height: image.height }, { width, height }, `${name} matches its A-phase dimensions`);
  const runs = new Map();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width;) {
      const index = image.pixels[y * width + x];
      const alpha = image.alpha(index);
      assert.ok(alpha === 0 || alpha === 255, `${name} uses hard transparency`);
      if (alpha === 0) {
        x += 1;
        continue;
      }
      usedColours.add(Buffer.from(image.colour(index)).toString("hex"));
      const [red, green, blue] = image.colour(index);
      assert.ok(!(red > 180 && blue > 180 && green < 80), `${name} has no visible magenta fringe`);
      let end = x + 1;
      while (end < width && image.pixels[y * width + end] === index) end += 1;
      runs.set(end - x, (runs.get(end - x) || 0) + 1);
      x = end;
    }
  }
  assert.equal(runs.get(1) || 0, 0, `${name} uses deliberate pixel blocks instead of single-pixel colour noise`);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < 12; column += 1) {
      let left = 48;
      let right = 0;
      let bottom = 0;
      for (let y = 0; y < 80; y += 1) {
        for (let x = 0; x < 48; x += 1) {
          const index = image.pixels[(row * 80 + y) * width + column * 48 + x];
          if (image.alpha(index) === 0) continue;
          left = Math.min(left, x);
          right = Math.max(right, x + 1);
          bottom = Math.max(bottom, y + 1);
        }
      }
      if (column < 4) {
        assert.ok(right > left, `${name} row ${row} column ${column} contains its A-phase pose`);
        assert.equal(bottom, 80, `${name} row ${row} column ${column} places feet on the cell bottom`);
        assert.ok(Math.abs((left + right) / 2 - 24) <= 1, `${name} row ${row} column ${column} is horizontally centred`);
      } else {
        assert.equal(right, 0, `${name} row ${row} column ${column} stays empty until phase B or C`);
      }
    }
  }
}
assert.ok(usedColours.size <= 32, `sprite atlases use at most 32 visible colours (${usedColours.size})`);

console.log("Restaurant Rookie art/spec reconciliation passed (v2 scene)");
