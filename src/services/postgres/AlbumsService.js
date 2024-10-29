const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbum } = require('../../utils/albums');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
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
      ...album.rows[0],
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
}

module.exports = AlbumsService;
