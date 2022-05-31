'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = sequelize => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {}
  }
  Job.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      companyId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      JobId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.BIGINT,
        references: {
          model: 'skillCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      duration: {
        type: Sequelize.STRING,
      },
      workWeek: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      minimumPayRate: {
        type: Sequelize.INTEGER,
      },
      maximumPayRate: {
        type: Sequelize.INTEGER,
      },
      acceptedPayRate: {
        type: Sequelize.INTEGER,
      },
      preferredCountry: {
        type: Sequelize.STRING,
      },
      englishLevelRequirement: {
        type: Sequelize.STRING,
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
      tableName: 'jobs',
      timestamps: true,
      modelName: 'Job',
    }
  );
  return Job;
};
