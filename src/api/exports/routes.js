const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (request, h) => handler.postToExportPlaylistsHandler(request, h),
    options: {
      auth: 'musicapi_jwt',
    },
  },
];

module.exports = routes;
