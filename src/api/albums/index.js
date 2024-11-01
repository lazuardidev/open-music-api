const routes = require('./routes');
const AlbumsHandler = require('./handler');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator, storageService, uploadsValidator }) => {
    const albumsHandler = new AlbumsHandler(service, validator, storageService, uploadsValidator);
    server.route(routes(albumsHandler));
  },
};
