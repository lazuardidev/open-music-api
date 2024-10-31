const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request) => handler.getPlaylistsHandler(request),
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: (request) => handler.deletePlaylistByIdHandler(request),
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: (request) => handler.getSongsFromPlaylistByIdHandler(request),
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: (request) => handler.deleteSongFromPlaylistByIdHandler(request),
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: (request) => handler.getActivitiesByPlaylistIdHandler(request),
    options: {
      auth: 'musicapi_jwt',
    },
  },
];

module.exports = routes;
