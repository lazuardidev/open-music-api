const routes = require('./routes');
const ExportsHandler = require('./handler');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, playlistsService, exportsValidator }) => {
    const exportsHandler = new ExportsHandler(producerService, playlistsService, exportsValidator);
    server.route(routes(exportsHandler));
  },
};
