import router from "../../router/router.js";
import routerStatic from "../../routerStatic/routerStatic.js";
export default function checkURL(url, req, res) {
  const mainRouter = ["/", "/home", "/signIn", "/signUp", "/authentication"];
  if (mainRouter.includes(url)) {
    router(req, res);
  } else {
    routerStatic(req, res);
  }
}
