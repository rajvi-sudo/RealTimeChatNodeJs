const chatForm = document.getElementById('chat-form')
const chatMesasge = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io();

// Get username and room from URL : used 'qs' module - A querystring parsing and stringifying library 
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,  //To bypass the leading question mark
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

 //display message from server 
socket.on('message', msg=>{
	outputMessage(msg);

	//scroll Down - user always stays at the bottom of the page
  chatMesasge.scrollTop = chatMesasge.scrollHeight
})

//message when user submits form 
chatForm.addEventListener('submit', (e)=>{
	e.preventDefault(); 
    
	//get message entered by user 
	const msg  = e.target.elements.msg.value;

	//emit message to server 
	socket.emit('chatMsg',msg)

	// Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

})

//Output Mesage to DOM
function outputMessage(msg){
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML ='<p class="meta">'+msg.username+' <span>'+msg.time+'</span></p><p class="text">'+msg.text +'</p>'
	document.querySelector('.chat-messages').appendChild(div)				
						
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}


// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username.username
    userList.appendChild(li);
  });
}


