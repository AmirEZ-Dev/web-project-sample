function navigateTo(path) {
  const authToken = localStorage.getItem("authToken");
  if (path === "/home") {
    if (authToken === null) {
      window.alert("برای رفتن به صفحه خانه ابتدا باید احراز هویت بکنید");
      window.location.href = "/";
    } else {
      fetch("http://localhost:8000/verifyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authToken }),
      })
        .then((response) => {
          if (response.status === 200) {
            window.location.href = "/home";
          } else {
            alert(
              "توکن شما منقضی شده است. لطفا دوباره وارد حساب کاربری خود شوید"
            );
            window.location.href = "/signIn";
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } else window.location.href = path;
}
