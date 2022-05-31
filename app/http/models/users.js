'use strict';
const { Model, Sequelize } = require('sequelize');
const { encrypt, decrypt } = require(`${root}/utils/encryption`);
const bcrypt = require('bcrypt');

module.exports = sequelize => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AuthCode }) {
      User.hasOne(AuthCode, { as: 'authCode', foreignKey: 'userId' });
    }
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      imageId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'files',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      oAuthId: {
        type: Sequelize.STRING,
        unique: true,
        set(val) {
          this.setDataValue('oAuthId', encrypt(val));
        },
        get() {
          return decrypt(this.getDataValue('oAuthId'));
        },
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        set(password) {
          if (password) {
            this.setDataValue('password', bcrypt.hashSync(password, +process.env.SALT));
          }
        },
      },
      accountType: {
        type: Sequelize.ENUM('assistant', 'employer'),
      },
      firstName: {
        type: Sequelize.STRING,
        set(val) {
          let result = val.split(' ');

          for (let i = 0; i < result.length; i++) {
            result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1);
          }

          this.setDataValue('firstName', result.join(' '));
        },
      },
      lastName: {
        type: Sequelize.STRING,
        set(val) {
          let result = val.split(' ');

          for (let i = 0; i < result.length; i++) {
            result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1);
          }

          this.setDataValue('lastName', result.join(' '));
        },
      },
      name: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
        },
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
      },
      affiliateSlug: {
        type: Sequelize.STRING,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        set(val) {
          this.setDataValue('affiliateSlug', val.toLowerCase());
        },
      },
      profileCompletionStep: {
        type: Sequelize.INTEGER,
      },
      verifiedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
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
      tableName: 'users',
      timestamps: true,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['password', 'oAuthId'],
        },
      },
    }
  );
  return User;
};
