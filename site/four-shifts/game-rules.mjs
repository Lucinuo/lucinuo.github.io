export const SHIFTS = [
  {
    label: "第 1 班", time: "報到 10:30", crowd: "準備營業", context: "制服、打卡、站位，都在同一個上午出現。",
    speaker: "主管對你說：", line: "先跟著看，等一下再教你。", thought: "我今天到底應該學會哪些事？",
    choices: ["請對方先列出今天的完整流程", "跟著看，把不懂的先記下來", "先找眼前能幫忙的事"],
  },
  {
    label: "第 2 班", time: "週日 12:20", crowd: "客滿", context: "人潮一下子湧進來，沒有人能停下手邊的事。",
    speaker: "資深同事對你說：", line: "先把這個做完。", thought: "可是，接下來呢？",
    choices: ["追問完整流程與注意事項", "先照做，記下疑問", "去處理最急的事"],
  },
  {
    label: "第 3 班", time: "平日 15:10", crowd: "店內消毒", context: "今天客人少一點，原以為終於能完整練習。",
    speaker: "同事一邊整理器具一邊說：", line: "今天先消毒，有空再練。", thought: "人少了，練習卻還是沒有開始。",
    choices: ["問能否保留一段完整練習時間", "一邊消毒，一邊拼湊流程", "把所有清潔工作先做完"],
  },
  {
    label: "第 4 班", time: "傍晚 18:40", crowd: "人潮回升", context: "你已經看過幾次操作，但沒有人從頭說過一次。",
    speaker: "資深同事指著工作檯說：", line: "這個照剛才那樣做。", thought: "剛才只看過一次。完整流程、順序和注意事項呢？",
    choices: ["停下來確認每一個步驟", "照印象完成，再問哪裡有錯", "先撐過人潮再說"],
  },
];

export const initialState = () => ({ shift: 0, learned: 23, assumed: 68, strain: 0, asked: 0 });

export function applyChoice(state, choice) {
  if (!Number.isInteger(choice) || choice < 0 || choice > 2 || state.shift >= SHIFTS.length) return state;
  const effects = [
    { learned: 12, assumed: 8, strain: 4, asked: 1 },
    { learned: 7, assumed: 13, strain: 9, asked: 0 },
    { learned: 3, assumed: 17, strain: 14, asked: 0 },
  ][choice];
  return {
    shift: state.shift + 1,
    learned: Math.min(100, state.learned + effects.learned),
    assumed: Math.min(100, state.assumed + effects.assumed),
    strain: Math.min(100, state.strain + effects.strain),
    asked: state.asked + effects.asked,
  };
}

export function endingFor(state) {
  const gap = state.assumed - state.learned;
  if (state.asked >= 3) return { title: "你把問題說得很清楚。", copy: `你多次要求完整流程，但學習與期待之間仍差了 ${gap}%。離開不是否定自己的能力，而是拒絕繼續替制度的缺口負責。` };
  if (state.strain >= 40) return { title: "你撐過了每一次眼前的急事。", copy: `店裡越來越相信你什麼都會，實際學習卻追不上。最後留下的 ${gap}% 差距，不該只由新人承擔。` };
  return { title: "你努力把碎片拼成流程。", copy: `你確實學會了一些，但店裡的期待仍比完整訓練走得更快。那 ${gap}% 的空白，是工作環境沒有交代完的部分。` };
}
