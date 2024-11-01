const mapDBToModelAlbum = ({ id, name, year, cover, songs }) => ({
  id,
  name,
  year,
  coverUrl: cover,
  songs,
});

module.exports = {
  mapDBToModelAlbum,
};
