'use strict';
const { Model, Sequelize } = require('sequelize');
const { encrypt, decrypt } = require(`${root}/utils/encryption`);
const { randomBytes } = require('crypto');

module.exports = sequelize => {
  class AuthCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {}

    /**
     *
     * @param {String} code - The code entered by the user
     * @param {String} storedCode - The code stored in the database
     * @param {Date} expiresAt - The date the code expires
     * @returns {Boolean,String} - Whether the code is valid, expired, or invalid
     */
    validCode(code, storedCode, expiresAt, authCode) {
      if (code == storedCode && day().isBefore(expiresAt)) return true;
      if (day().isAfter(expiresAt)) {
        // Delete expired code
        authCode.destroy();

        // Create new code
        AuthCode.create({
          userId: authCode.userId,
          code: process.env.NODE_ENV === 'production' ? randomBytes(3).toString('hex') : '111111',
          type: authCode.type,
          expiresAt: day().add(1, 'day'),
        });

        // TODO - Send new code to user
        return 'Expired';
      }
      return false;
    }
  }
  AuthCode.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        set(val) {
          this.setDataValue('code', encrypt(val.toLowerCase()));
        },
        get() {
          if (this.getDataValue('code')) {
            return decrypt(this.getDataValue('code'));
          }
        },
      },
      type: {
        type: Sequelize.ENUM('signup', 'password-reset', '2fa'),
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      tableName: 'authCodes',
      timestamps: true,
      modelName: 'AuthCode',
    }
  );
  return AuthCode;
};
