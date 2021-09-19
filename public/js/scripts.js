const socket = io('/');
const getElementById = (id) => document.getElementById(id) || null;

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const userName = prompt('What is your name?');
  socket.emit('new_user', userName);
  console.log(userName);
}

function init() {
  helloUser();
}

init();
