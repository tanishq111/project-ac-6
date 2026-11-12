import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const [scheme, accessToken] = (req.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.SECRET_KEY, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ message: "Access token invalid or expired" });
  }

  req.user = payload;
  next();
};

export default authenticate;
