import jwt from "jsonwebtoken";

const jwtAuthGuard = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      const token = bearerToken.slice(7);
      const decoded = jwt.verify(token, process.env.SECRET);
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Token Expired",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Malfored JWT" });
  }
};

export default jwtAuthGuard;
