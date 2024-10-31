const mapDBToModelAlbum = ({ id, name, year, songs }) => ({
  id,
  name,
  year,
  songs,
});

module.exports = {
  mapDBToModelAlbum,
};
