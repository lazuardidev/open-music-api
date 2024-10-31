const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSong, mapDBToModelSongs } = require('../../utils/songs');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song.');
    }

    return result.rows[0].id;
  }

  async getSongs(requestQuery) {
    const { title, performer } = requestQuery;

    const baseQuery = 'SELECT id, title, performer FROM songs';
    const filters = [];
    const values = [];

    if (title) {
      filters.push('LOWER(title) LIKE $' + (filters.length + 1));
      values.push(`%${title.toLowerCase()}%`);
    }

    if (performer) {
      filters.push('LOWER(performer) LIKE $' + (filters.length + 1));
      values.push(`%${performer.toLowerCase()}%`);
    }

    const filterQuery = filters.length > 0 ? ` WHERE ${filters.join(' AND ')}` : '';
    const query = baseQuery + filterQuery;
    const result = await this._pool.query(query, values);

    return result.rows.map(mapDBToModelSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song not found');
    }

    return result.rows.map(mapDBToModelSong)[0];
  }

  async updateSongById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update song. Id not found.');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song. Id not found.');
    }
  }
}

module.exports = SongsService;
