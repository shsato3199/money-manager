// 必須項目の共通エラーメッセージ
export const REQUIRED_MESSAGE = "必須項目です。";
//個別エラーメッセージ
export const POSITIVE_INTEGER_MESSAGE = "1円以上の整数で入力してください。";
export const MAX_LENGTH_500_MESSAGE = "500文字以内で入力してください。";

// 必須チェック
export const isRequired = (value) => {
  // null / undefined は未入力として扱う。
  if (value === null || value === undefined) {
    return false;
  }

  // 文字列の場合は、前後の空白を除いて空なら未入力として扱う。
  if (typeof value === "string") {
    return value.trim() !== "";
  }

  // 数値やBooleanなど、文字列以外は値が存在すれば入力済みとして扱う。
  return true;
};

// 1以上の整数かチェック
export const isPositiveInteger = (value) => {
  return Number.isInteger(Number(value)) && Number(value) >= 1;
};

// 支払日（1〜31）チェック
export const isValidPaymentDay = (value) => {
  return (
    Number.isInteger(Number(value)) &&
    Number(value) >= 1 &&
    Number(value) <= 31
  );
};

// 開始年月と終了年月の前後関係をチェック
export const isValidYearMonthRange = (startYearMonth, endYearMonth) => {
  // 終了年月が未入力ならOK。
  if (!endYearMonth) {
    return true;
  }

  return endYearMonth >= startYearMonth;
};

// 最大文字数チェック

export const isWithinMaxLength = (value, maxLength) => {
  // 未入力はエラーにしない。
  if (value === null || value === undefined || value === "") {
    return true;
  }
  return String(value).length <= maxLength;

};