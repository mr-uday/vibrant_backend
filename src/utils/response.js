export const ok = (res, data) => res.json({ success: true, data });
export const error = (res, msg = "Error", code = 400) =>
  res.status(code).json({ success: false, message: msg });
