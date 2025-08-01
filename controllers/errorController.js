exports.throwError = (req, res, next) => {
  // 故意丟出錯誤
  throw new Error("This is a 500 test error triggered intentionally.");
};