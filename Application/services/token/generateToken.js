import jwt from "jsonwebtoken";
export default function generateToken(em, pas) {
  const payload = {
    email: em,
    password: pas,
  };
  const secret = process.env.SECRET_KEY;
  const options = {
    expiresIn: "1h",
    algorithm: "HS256",
  };
  const token = jwt.sign(payload, secret, options);
  return token;
}
