const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistsSongsService, playlistsSongsActivitiesService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, playlistsSongsService, playlistsSongsActivitiesService, validator);
    server.route(routes(playlistsHandler));
  },
};
