const { io } = require('socket.io-client');

// TODO add a queue for all broadcast events

/*
 * Example:
 *  const broadcast = require('../middleware/Broadcast');
 *  broadcast.event('notification', userId, data);
 *  broadcast.event('message-created', roomId, data);
 *
 * Backend Listeners
 * - login
 * - join-chat
 * - left-chat
 * - user-typing
 * - message
 * - message-read
 * - message-delete
 * - notification
 * - notification-read
 * - notification-delete
 *
 * Frontend Listeners:
 * - join-chat
 * - left-chat
 * - user-typing
 * - message
 * - message-delete
 * - notification
 * - notification-read
 * - notification-delete
 */
if (process.env.NODE_ENV !== 'test') {
  const socket = io(process.env.WEBSOCKET_SERVER || 'http://localhost:5001');

  // Event listener method
  const broadcast = (event, room, data) => {
    socket.emit(event, room, data);
  };

  module.exports = broadcast;
}

/*
  !front end
  ? Get messages from db
  ? Get notifications from db
  ? Get new comments, reactions, and conversations from db
  ? Get notifications from websocket
  ? Get new messages from websocket
  ? Get new comments, reactions, and conversations from websocket
  ? emit user connected to websocket
  ? emit user disconnected to websocket
  ? emit typing to websocket

  !backend
  ? Emit on new message endpoint
  ? Emit on new notification endpoint
  ? Emit on new conversation endpoint
  ? Emit on new comment endpoint
  ? Emit on new reaction endpoint for comment
  ? Emit on new reaction endpoint for conversation

  !! ----------- Public events ----------------
  ? --------------- BACKEND -------------------
  ! io.emit('event-created', data);`
  ? so this part from server is gonna send everyone
  ? your frontend part should receive this event.

  ? --------------- FRONTEND -------------------
  ! socket.on("event-created", function(data) {
  ? this is gonna be a public event anyway so everyone can see it
  ? so here you have your newly created event's data so use it as needed =)
  !});

  !! ----------- Private events ----------------
  ? --------------- BACKEND --------------------
  ! socket.on('private-event-created', data => {
    ? here the data coming from frontend
    ? while sending this down just make sure data has a property called users as usernames and array maybe?

    ? since you created this event what you can do is send an emit to ach user like following:

    ??????? data.users.forEach(username => io.in(username).emit('private-event', data));

    ? So basically we are sending this event to every user selected by the creator of this private event
    ? again the part giving this ability is | .in(username) | this part
  ! });

  ? --------------- FRONTEND --------------------
  ! socket.on('private-event', function(data) {
    ? here do the private events objectives.
    ? and the good part that even me(single user)
    ? I'll know who has this private-event by
    ? data.users
  ! });
*/
