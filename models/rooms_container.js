var Rooms = module.exports = {
  ws_rooms: new Array(),

  add_room: function(room) {
    Rooms.ws_rooms[Rooms.ws_rooms.length] = room;
  },

  replace_room: function(index, room) {
    Rooms.ws_rooms[index] = room;
  },

  delete_room: function(index) {
    var t = Rooms.ws_rooms[index];
    Rooms.ws_rooms[index] = Rooms.ws_rooms[Rooms.ws_rooms.length - 1];
    Rooms.ws_rooms[Rooms.ws_rooms.length - 1] = t;
    Rooms.ws_rooms.pop();
  }
}