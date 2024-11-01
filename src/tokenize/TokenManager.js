const Jwt = require('@hapi/jwt');
const config = require('../utils/config/config');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.jwt.accessToken),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.jwt.refreshToken),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwt.refreshToken);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token is invalid.');
    }
  },
};

module.exports = TokenManager;
