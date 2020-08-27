const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const registerBtn = document.querySelector("#register");
const loginBtn = document.querySelector("#login");
const logoutBtn = document.querySelector("#logout");

let loginnedID = "";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#id").value;
  const password = document.querySelector("#password").value;
  if (!id || !password) {
    alert("아이디와 비밀번호를 모두 적어주세요");
    return;
  }
  const loginRes = await axios.post("/login", { id, password });
  document.querySelector("#id").value = "";
  document.querySelector("#password").value = "";
  // 여기서 아이디와 비밀번호 검사 로직 필요
  if (loginRes.data === "no") {
    alert("없는 계정입니다. 회원가입을 해주세요");
    return;
  }
  loginForm.className = "hide";
  logoutBtn.className = "show";
  loginnedID = id;
  await axios.get("/");
});
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#regId").value;
  const password = document.querySelector("#regPassword").value;
  document.querySelector("#regId").value = "";
  document.querySelector("#regPassword").value = "";
  if (!id || !password) {
    alert("아이디와 비밀번호를 모두 적어주세요");
    return;
  }
  const result = await axios.post("/register", { id, password });
  if (result.data === "exist") {
    alert("이미 존재하는 계정입니다");
    return;
  }
  alert("회원가입을 완료했습니다");
  registerForm.className = "hide";
  loginForm.className = "show";
});

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.className = "hide";
  registerForm.className = "show";
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.className = "show";
  registerForm.className = "hide";
});
logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await axios.get("/logout");
  alert(`안녕히 가세요 ${loginnedID}님`);
  logoutBtn.className = "hide";
  loginForm.className = "show";
});
