const logoutBtn = document.querySelector("#logout");
const dashboard = document.querySelector("#dashboard");
const submitForm = document.querySelector("#submit");
const words = document.querySelector("#words");

let theUser = "";

const getInfo = async () => {
  const result = await axios.get("/info");
  const { user, words } = result.data;
  theUser = user;
  document.querySelector("#user").textContent = `로그인된 사용자 : ${user}`;
  dashboard.innerHTML = "";
  for (let key in words) {
    console.log(words[key]);
    const oneElem = document.createElement("div");
    oneElem.className = "oneElem";
    const nameElem = document.createElement("span");
    nameElem.className = "name";
    nameElem.textContent = words[key].id;
    oneElem.appendChild(nameElem);
    const wordsElem = document.createElement("textArea");
    wordsElem.textContent = words[key].words;
    wordsElem.className = "words";
    wordsElem.readOnly = true;
    if (words[key].id === theUser) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      oneElem.append(editBtn, delBtn);
      editBtn.addEventListener("click", async () => {
        const data = prompt("새로운 글을 입력하세요");
        if (!data) {
          alert("글을 입력하세요");
          return;
        }
        try {
          const sendingData = {};
          sendingData["id"] = theUser;
          sendingData["words"] = data;
          await axios.put(`/words/${key}`, sendingData);
          getInfo();
        } catch (err) {
          console.error(err);
          return;
        }
      });
      delBtn.addEventListener("click", async () => {
        try {
          await axios.delete(`/words/${key}`);
          getInfo();
        } catch (err) {
          console.error(err);
          return;
        }
      });
    }
    oneElem.appendChild(wordsElem);
    dashboard.appendChild(oneElem);
  }
};

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await axios.get("/logout");
  alert(`${theUser}님 안녕히 가세요`);
  location.reload(true);
});
submitForm.addEventListener("click", async (e) => {
  e.preventDefault();
  const data = words.value;
  if (!data) {
    alert("글을 입력하세요");
    return;
  }
  words.value = "";
  try {
    const sendingData = {};
    sendingData["id"] = theUser;
    sendingData["words"] = data;
    await axios.post("/words", sendingData);
    getInfo();
  } catch (err) {
    console.error(err);
    return;
  }
});

window.onload = getInfo();
