// 全角数字を半角数字へ変換する。
export const normalizeNumber = (value) => {
  return String(value)
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .replace(/[^0-9]/g, "");
};