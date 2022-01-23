const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const moment = require('moment');
const port = 3000;
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server)
var qs = require('qs');
const  { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users.js')



io.on('error', function (err) {
    console.log(err.message);
});

const boat = 'chatBoat'
//run when client connects 
io.on('connection', (socket) =>{	
	//get username and room from client side when user connects
	socket.on('joinRoom', (username,room)=>{
        const user = userJoin(socket.id, username,room);
        socket.join(user.username.room)
		socket.emit('message',  formatMessage(boat,'Welcome to Chatcord!')); // Mesage to display user when user joins

		//broadcast to particular room when user connects 
		socket.broadcast.to(user.username.room).emit('message', formatMessage(boat, user.username.username +' has just joined the chat'));
		 
		// Send users and room info to client to display 
		io.to(user.username.room).emit('roomUsers', {
	      room: user.username.room,
	      users: getRoomUsers(user.username.room)

	    });

		 //listen for chatMessage for particular room 
		 socket.on('chatMsg', msg=>{
		 	io.to(user.username.room).emit('message', formatMessage(user.username.username, msg))
		 })

		  //runs when client disconnect 
		 socket.on('disconnect', ()=>{
		 	const user = userLeave(socket.id)
		 	if(user){
		 		io.to(user.username.room).emit('message', formatMessage(boat,user.username.username + ' disconnected'))

		 		// Send users and room info
			      io.to(user.room).emit('roomUsers', {
			        room: user.room,
			        users: getRoomUsers(user.room)
			      });
		 	}
		 	
		 })
		})
})



//message to display when user join chat 
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

server.listen(port, (err)=>{
	console.log(`server is listening on ${port}`);
}) 

//set static folder 

app.use(express.static(path.join(__dirname,'public')))
