const logoutBtn = document.querySelector("#logout");

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await axios.get("/logout");
  alert("안녕하 가세요");
  location.reload(true);
});
