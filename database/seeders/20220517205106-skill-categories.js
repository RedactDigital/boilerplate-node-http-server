'use strict';
const day = require('dayjs');

module.exports = {
  async up(queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'skillCategories',
      [
        {
          name: 'Administrative',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'General Software',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Accounting & Bookkeeping',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'CRM & Sales Software',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Marketing',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'E-Signature Software',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Sales & Business Development',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Project Management',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Property Management Skills',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Property Management Software',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Short Term Rental',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'Short Term Software',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
        {
          name: 'HOA Software',
          createdAt: day().format(),
          updatedAt: day().format(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('skillCategories', null, {});
  },
};
