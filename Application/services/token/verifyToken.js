import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function verifyToken(token) {
  const secret = process.env.SECRET_KEY;
  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    console.log("Error in verifyToken:", error.message);
    return false;
  }
}
