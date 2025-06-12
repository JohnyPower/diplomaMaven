const helper = require('../../../app/helpers/helper');
const bcrypt = require("bcryptjs");

const user = {

  login: async (connection, options) => {
    const user = await connection.Users.findOne({
      where: { email: options.email }
    });

    if (!user) {
      return helper.doom.error.wrongEmailOrPassword(options.email);
    }

    const isPasswordsEquals = bcrypt.compareSync(options.password, user.password);
    if (!isPasswordsEquals) {
      return helper.doom.error.wrongEmailOrPassword();
    }

    const tokens = helper.token.generateTokens({
      sub: user.id,
      email: user.email,
      type: user.type,
      group: user.group
    });

    user.refresh_token = tokens.refreshToken;
    await user.save();

    return {
      success: true,
      result: { ...tokens, email: user.email, id: user.id }
    };
  },

  logout: async (connection, refreshToken) => {
    await connection.Users.update(
      { refresh_token: null },
      {
        where: { refresh_token: refreshToken },
        returning: true
      }
    );

    return {
      success: true,
      result: {
        message: 'Logout successfully.'
      }
    };
  },

  refresh: async (connection, refreshToken) => {
    if (!refreshToken) {
      return helper.doom.error.Unauthorized();
    }

    const userData = helper.token.validateRefreshToken(refreshToken);
    const user = await connection.Users.findOne({ where: { refresh_token: refreshToken } });

    if (!userData || !user) {
      return helper.doom.error.Unauthorized();
    }

    const tokens = helper.token.generateTokens({
      sub: user.id,
      email: user.email,
      type: user.type,
      group: user.group
    });

    user.refresh_token = tokens.refreshToken;
    await user.save();

    return {
      success: true,
      result: { ...tokens, email: user.email, id: user.id }
    };
  },
};

module.exports = user;
