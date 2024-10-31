const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({ playlistId, songId, credentialId, action }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, credentialId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add activity.');
    }
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, psa.action, psa.time
            FROM playlist_song_activities psa
            JOIN users ON users.id = psa.user_id
            JOIN songs ON songs.id = psa.song_id
            WHERE psa.playlist_id = $1
            ORDER BY time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found.');
    }

    return result.rows;
  }
}

module.exports = PlaylistsSongsActivitiesService;
