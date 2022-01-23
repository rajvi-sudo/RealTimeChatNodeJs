const users = [];

//Join user 
 function userJoin(id, username, room){
 	const user = {id, username, room }
 	users.push(user)
 	return user;
 } 

 //Get Current User 
function getCurrentUser(id){
	return users.find(currentUser => currentUser.id === id)
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.username.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers}
