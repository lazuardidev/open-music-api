const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelAlbum } = require('../../utils/albums');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const coverUrl = null;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, name, year, coverUrl, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album.');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModelAlbum);
  }

  async getAlbumById(id) {
    const albumQueryById = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const album = await this._pool.query(albumQueryById);

    if (!album.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const songsQueryByAlbumId = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const songs = await this._pool.query(songsQueryByAlbumId);

    const result = {
      ...album.rows.map(mapDBToModelAlbum)[0],
      songs: songs.rows
    };

    return result;
  }

  async updateAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update album. Id not found.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Id not found.');
    }
  }

  async checkAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album not found.');
    }
  }

  async editAlbumToAddCoverById(id, fileLocation) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2',
      values: [fileLocation, id],
    };

    await this._pool.query(query);
  }

  async addLikeAlbumById(albumId, userId) {
    const queryCheckLike = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const resultCheckLike = await this._pool.query(queryCheckLike);

    if (resultCheckLike.rowCount) throw new ClientError('Unable to add like.');

    const id = `album-like-${nanoid(16)}`;
    const queryAddLike = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    await this._pool.query(queryAddLike);
    await this._cacheService.delete(`user_album_likes:${albumId}`);

    return 'Success to add like.';
  }

  async getLikeAlbumById(id) {
    try {
      const likes = await this._cacheService.get(`user_album_likes:${id}`);

      return { likes: +likes, source: 'cache' };
    } catch (error) {
      await this.checkAlbumById(id);

      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);
      const likes = result.rowCount;
      await this._cacheService.set(`user_album_likes:${id}`, likes);

      return { likes, source: 'server' };
    }
  }

  async unLikeAlbumById(albumId, userId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    const queryDeleteLike = {
      text: 'DELETE FROM user_album_likes WHERE id = $1 RETURNING id',
      values: [result.rows[0].id],
    };

    await this._pool.query(queryDeleteLike);
    await this._cacheService.delete(`user_album_likes:${albumId}`);
  }
}

module.exports = AlbumsService;
