import * as fs from "fs/promises";

import { fileURLToPath } from "url";

import path from "path";

import readFile from "../file/readFile.js";
import HashingService from "../Security/Encryption/HashingService.js";
import TokenManagement from "../Security/Encryption/TokenManagement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class UserServices {
  #email = "";
  #password = "";

  constructor(req) {
    try {
      let body = "";
      req.on("data", (chunc) => {
        body += chunc;
      });
      req.on("end", () => {
        const { email, password } = JSON.parse(body);
        this.#email = email;
        this.#password = password;
      });
    } catch (error) {
      throw new Error("Error parsing the request : " + error);
    }
  }

  #getAllUsers = async () => {
    try {
      const filePath = path.join(__dirname, "../../../Database/usersTable.txt");
      let dataBase = await readFile(filePath, "utf8");
      const users = dataBase.split("||").map((user) => {
        return JSON.parse(user);
      });
      return users;
    } catch (error) {
      throw new Error(
        "error in read users database from users table : /n" + error
      );
    }
  };

  #findUser = async () => {
    try {
      const users = await this.#getAllUsers();
      const user = users.find((user) => user.email === this.#email);

      if (user) {
        return { status: true, message: "User found", information: user };
      } else {
        return { status: false, message: "User not found" };
      }
    } catch (error) {
      throw new Error("error in find user from users table: " + error.message);
    }
  };

  #appendUsersTable = async (email, password) => {
    try {
      const filePath = path.join(__dirname, "../../../Database/usersTable.txt");
      await fs.appendFile(
        filePath,
        `||{"email":"${email}" , "password":"${password}"}`,
        "utf-8"
      );
    } catch (error) {
      throw new Error("error in append user data to users table : " + error);
    }
  };

  registerUser = async () => {
    try {
      const findUserResult = await this.#findUser();
      if (findUserResult.status === true) {
        return {
          status: "Failed",
          message:
            "There is a user with this profile. Please enter another email",
        };
      } else {
        const hashingService = new HashingService();
        const tokenManagement = new TokenManagement();
        const passwordHash = await hashingService.hash(this.#password);
        const token = tokenManagement.generateToken(this.#email);
        await this.#appendUsersTable(this.#email, passwordHash.hash);
        return {
          status: "successful",
          message: "User registration was successful",
          authToken: token,
        };
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error in the user registration process : " + error);
    }
  };

  signInUser = async () => {
    try {
      const hashingService = new HashingService();
      const tokenManagement = new TokenManagement();
      const findUserResult = await this.#findUser();
      const hashingServiceResult = await hashingService.verify(
        findUserResult.information.password,
        this.#password
      );

      if (
        findUserResult.status === true &&
        hashingServiceResult.status === true
      ) {
        const newToken = tokenManagement.generateToken(this.#email);
        return {
          status: "successful",
          message: "Sign in was successful",
          authToken: newToken,
        };
      } else {
        return {
          status: "Failed",
          message: "Sign in was not successful",
        };
      }
    } catch (error) {
      throw new Error("Error in the user registration process : " + error);
    }
  };
}
