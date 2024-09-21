import argon2 from "argon2";
const Pepper = process.env.PEPPER;

export default class HashingService {
  #pepperedPassword = "";
  hash = async (password) => {
    try {
      this.#pepperedPassword = password + Pepper;
      const hashedPassword = await argon2.hash(this.#pepperedPassword, {
        type: argon2.argon2id,
        memory: 65536,
        iterations: 3,
        parallelism: 1,
      });
      return { hash: hashedPassword };
    } catch (error) {
      console.error("Error hashing password", error);
      throw new Error();
    }
  };

  verify = async (storedHash, password) => {
    try {
      this.#pepperedPassword = password + Pepper;
      const result = (await argon2.verify(storedHash, this.#pepperedPassword))
        ? { status: true, message: "Verification was done successfully" }
        : { status: false, message: "Verification failed" };
      return result;
    } catch (error) {
      console.error("Error verifying password :", error);
      throw new Error();
    }
  };
}
