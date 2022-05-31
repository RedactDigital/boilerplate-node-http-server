'use strict';
const day = require('dayjs');
const { encrypt } = require('../../utils/encryption');

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
      'authCodes',
      [
        {
          userId: 1,
          code: encrypt('12345'),
          type: 'signup',
          expiresAt: day().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          userId: 2,
          code: encrypt('12345'),
          type: 'signup',
          expiresAt: day().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'), // Expired date for testing
          createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
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
    await queryInterface.bulkDelete('authCodes', null, {});
  },
};
