const Joi = require('joi');

const SongsPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  SongsPlaylistPayloadSchema,
  PlaylistPayloadSchema,
};
