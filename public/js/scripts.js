const socket = io('/chattings');
const getElementById = (id) => document.getElementById(id) || null;

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// global socket handler(broadcast)
socket.on('user_connected', (username) => {
  //console.log(`${username} connected!`);
  drawNewChat(`[connect] ${username}`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username}: ${chat}`); // 남이 쓴 채팅 내용
});

socket.on('disconnect_user', (username) =>
  drawNewChat(`[disconnect] ${username}`),
);

// event callback functions
const handleSubmit = (event) => {
  // submit을 보냈을 때 호출되는 함수
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    // 화면에 그리기
    drawNewChat(`me: ${inputValue}`); // 내가 쓴 채팅 내용
    event.target.elements[0].value = ''; // 입력하고 입력창 비우기
  }
};

// draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
  <div>
    ${message}
  </div>`;

  wrapperChatBox.innerHTML = chatBox; // HTML코드 삽입(message와 div태그)
  chattingBoxElement.append(wrapperChatBox); // 하위 돔요소 삽입
};

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
    console.log(data);
  });
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}

init();
