const config = require('../../utils/config/config');

class AlbumsHandler {
  constructor(service, validator, storageService, uploadsValidator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._uploadsValidator = uploadsValidator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'unnamed', year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album successfully added',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();

    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.updateAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album successfully updated',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album successfully deleted',
    };
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    await this._service.checkAlbumById(id);

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`;

    await this._service.editAlbumToAddCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Cover successfully uploaded.',
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkAlbumById(id);

    const message = await this._service.addLikeAlbumById(id, credentialId);

    return h.response({
      status: 'success',
      message,
    }).code(201);
  }

  async getLikeAlbumByIdhandler(request, h) {
    const { id } = request.params;
    const { likes, source } = await this._service.getLikeAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikeAlbumByIdhandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkAlbumById(id);
    await this._service.unLikeAlbumById(id, credentialId);

    return h.response({
      status: 'success',
      message: 'Cancel like album.',
    }).code(200);
  }
}

module.exports = AlbumsHandler;
