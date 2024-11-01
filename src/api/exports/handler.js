class ExportsHandler {
  constructor(producerService, playlistsService, exportsValidator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._exportsValidator = exportsValidator;
  }

  async postToExportPlaylistsHandler(request, h) {
    this._exportsValidator.validateExportPlaylistsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const { targetEmail } = request.payload;
    const message = { playlistId, targetEmail };

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Your request is in queue.',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
