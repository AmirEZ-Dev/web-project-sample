import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default class TokenManagement {
  #email = "";
  #token = "";
  generateToken = (email) => {
    this.#email = email;
    const key = process.env.SECRET_KEY;
    const payload = {
      email: this.#email,
    };
    const options = {
      expiresIn: "1h",
      algorithm: "HS256",
    };
    try {
      return jwt.sign(payload, key, options);
    } catch (error) {
      throw new Error("Error in generate token" + error);
    }
  };

  verifyToken = (token) => {
    this.#token = token;
    const key = process.env.SECRET_KEY;
    try {
      jwt.verify(this.#token, key);
      return { status: true, message: "The token is valid" };
    } catch (error) {
      console.error(error);
      return { status: false, message: "The token is not valid" };
    }
  };
}
