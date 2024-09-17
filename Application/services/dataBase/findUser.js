import readDataBase from "./readDataBase.js";

export default async function findUser(email, password) {
  const users = await readDataBase();
  const result = users.find((user) => {
    return user.email == email && user.password == password;
  })
    ? { status: true }
    : { status: false };
  return result;
}
