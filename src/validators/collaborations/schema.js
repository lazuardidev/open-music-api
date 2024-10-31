const Joi = require('joi');

const CollaborationPayloadaSchema = Joi.object({
  userId: Joi.string().required(),
  playlistId: Joi.string().required(),
});

module.exports = { CollaborationPayloadaSchema };
