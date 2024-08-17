import router from "../../router/router.js";
import routerStatic from "../../routerStatic/routerStatic.js";
export default function check(url, req, res) {
  const Router = [
    "/",
    "/home",
    "/books",
    "/user",
    "/profile",
    "/signIn",
    "/signUp",
    "/token",
    "/verifyToken",
  ];
  if (Router.includes(url)) {
    router(req, res);
  } else {
    routerStatic(req, res);
  }
}
