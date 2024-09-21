import * as fs from "fs/promises";

import { fileURLToPath } from "url";

import path from "path";

import readFile from "../file/readFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserAuthentication {
  #email = "";
  #password = "";
  constructor(req) {
    this.#RequestInitialization(req);
  }
  #RequestInitialization = (req) => {
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
      console.error("Error parsing the request : ", error);
      throw new Error();
    }
  };
  #getAllUsers = async () => {
    try {
      const filePath = path.join(__dirname, "../../../Database/usersTable.txt");
      let dataBase = await readFile(filePath, "utf8");
      const users = dataBase.split("||").map((user) => {
        return JSON.parse(user);
      });
      return users;
    } catch (error) {
      console.error("error in read users database from users table : ", error);
      throw new Error();
    }
  };

  _findUser = async () => {
    try {
      const users = await this.#getAllUsers();
      const user = users.find((user) => user.email === this.#email);

      if (user) {
        return { status: true, message: "User found", information: user };
      } else {
        return { status: false, message: "User not found" };
      }
    } catch (error) {
      console.error("error in find user from users table: " + error);
      throw new Error();
    }
  };
  getEmail() {
    return this.#email;
  }

  getPassword() {
    return this.#password;
  }
}

export class UserRegister extends UserAuthentication {
  #hashingService = "";
  #tokenManagement = "";
  constructor(req, HashingService, TokenManagement) {
    super(req);
    this.#hashingService = HashingService;
    this.#tokenManagement = TokenManagement;
  }

  #appendUsersTable = async (email, hashedPassword) => {
    try {
      const filePath = path.join(__dirname, "../../../Database/usersTable.txt");
      await fs.appendFile(
        filePath,
        `||{"email":"${email}" , "password":"${hashedPassword}"}`,
        "utf-8"
      );
    } catch (error) {
      console.error("error in append user data to users table : ", error);
      throw new Error();
    }
  };

  register = async () => {
    try {
      const findUserResult = await this._findUser();
      if (findUserResult.status === true) {
        return {
          status: "Failed",
          message:
            "There is a user with this profile. Please enter another email",
        };
      } else {
        const passwordHash = await this.#hashingService.hash(
          this.getPassword()
        );
        const token = this.#tokenManagement.generateToken(this.getEmail());
        await this.#appendUsersTable(this.getEmail(), passwordHash.hash);
        return {
          status: "successful",
          message: "User registration was successful",
          authToken: token,
        };
      }
    } catch (error) {
      console.error("Error in the user registration process : ", error);
      throw new Error();
    }
  };
}

export class UserSignIn extends UserAuthentication {
  #hashingService = "";
  #tokenManagement = "";
  constructor(req, HashingService, TokenManagement) {
    super(req);
    this.#hashingService = HashingService;
    this.#tokenManagement = TokenManagement;
  }

  signIn = async () => {
    try {
      const findUserResult = await this._findUser();
      const hashingServiceResult = await this.#hashingService.verify(
        findUserResult.information.password,
        this.getPassword()
      );
      if (
        findUserResult.status === true &&
        hashingServiceResult.status === true
      ) {
        const newToken = this.#tokenManagement.generateToken(this.getEmail());
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
      console.error("Error in the user sign in process ", error);
      throw new Error();
    }
  };
}
