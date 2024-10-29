class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title = 'untitled',
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Song successfully added',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const songs = await this._service.getSongs(request.query);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.updateSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song successfully updated',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song successfully deleted',
    };
  }
}

module.exports = SongsHandler;
