import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.header("Authorization");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const secretKey = "mysecrettoken";
    const decodedUser = jwt.verify(token, secretKey);

    req.user = decodedUser.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not validate" });
  }
};
