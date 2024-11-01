const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongById(playlistId) {
    const queryPlaylist = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const querySongs = {
      text: `SELECT song.id, song.title, song.performer FROM songs song
      JOIN playlist_songs playlist ON song.id = playlist.song_id
      WHERE playlist.playlist_id = $1`,
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const resultSongs = await this._pool.query(querySongs);

    return {
      playlist: {
        ...resultPlaylist.rows[0],
        songs: resultSongs.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
