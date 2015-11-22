var Rooms = module.exports = {
  ws_rooms: new Array(),

  add_room: function(room) {
    Rooms.ws_rooms[Rooms.ws_rooms.length] = room;
  },

  replace_room: function(index, room) {
    Rooms.ws_rooms[index] = room;
  }
}