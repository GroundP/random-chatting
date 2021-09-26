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
    drawNewChat(`me: ${inputValue}`, true); // 내가 쓴 채팅 내용
    event.target.elements[0].value = ''; // 입력하고 입력창 비우기
  }
};

// draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
      <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
        ${message}
      </div>
      `;
  else
    chatBox = `
      <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
        ${message}
      </div>
      `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
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
  formElement.addEventListener('submit', handleSubmit); // 이벤트 연결
}

init();
