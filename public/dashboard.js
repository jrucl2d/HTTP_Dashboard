const logoutBtn = document.querySelector("#logout");
const dashboard = document.querySelector("#dashboard");
const submitForm = document.querySelector("#submit");
const words = document.querySelector("#words");

let theUser = "";

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await axios.get("/logout");
  alert(`${theUser}님 안녕히 가세요`);
  location.reload(true);
});
submitForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = words.value;
  words.value = "";
  try {
    await axios.post("/words");
  } catch (err) {
    console.error(err);
    return;
  }
});

window.onload = getInfo();

async function getInfo() {
  const result = await axios.get("/info");
  const { id, words } = result.data;
  theUser = id;
  document.querySelector("#user").textContent = `로그인된 사용자 : ${id}`;
}
