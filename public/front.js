const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const registerBtn = document.querySelector("#register");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#id").value;
  const password = document.querySelector("#password").value;
  // 여기서 아이디와 비밀번호 검사 로직 필요
  if (!id || !password) {
    alert("아이디와 비밀번호를 모두 적어주세요");
    return;
  }
  await axios.post("/login", { id, password });
  const result = await axios.get("/dashboard"); // 여기서 대시보드 정보 받아서 표현해줘야 함
});
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#regId").value;
  const password = document.querySelector("#regPassword").value;
  if (!id || !password) {
    alert("아이디와 비밀번호를 모두 적어주세요");
    return;
  }
  const result = await axios.post("/register", { id, password });
  if (result.data === "exist") {
    alert("이미 존재하는 계정입니다");
    return;
  }
  registerForm.className = "hide";
  loginForm.className = "show";
  document.querySelector("#regId").value = "";
  document.querySelector("#regPassword").value = "";
});

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.className = "hide";
  registerForm.className = "show";
});
