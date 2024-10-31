const mapDBToModelSongs = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelSong = ({ id, title, year, performer, genre, duration, album_id }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = {
  mapDBToModelSongs,
  mapDBToModelSong,
};
