import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Please sign in to continue." });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    req.body ||= {};
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Your session expired. Please sign in again." });
  }
};
export default authMiddleware;
