'use strict';
const { hash } = require('bcrypt');
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
    await queryInterface.bulkInsert('users', [
      {
        oAuthId: null,
        email: 'unverified@test.com',
        accountType: 'employer',
        firstName: 'unverified',
        lastName: 'unverified',
        password: await hash('password', Number(process.env.SALT_ROUNDS)),
        affiliateSlug: 'unverified',
        createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        oAuthId: null,
        email: 'unverifiedExpired@test.com',
        accountType: 'employer',
        firstName: 'unverified',
        lastName: 'expired',
        password: await hash('password', Number(process.env.SALT_ROUNDS)),
        affiliateSlug: 'expired',
        createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        oAuthId: null,
        email: 'jondoe@test.com',
        accountType: 'employer',
        firstName: 'Jon',
        lastName: 'Doe',
        password: await hash('password', Number(process.env.SALT_ROUNDS)),
        affiliateSlug: 'jondoe',
        createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        oAuthId: null,
        email: 'maryjane@test.com',
        accountType: 'assistant',
        firstName: 'Jon',
        lastName: 'Doe',
        password: await hash('password', Number(process.env.SALT_ROUNDS)),
        phone: '5553555555',
        affiliateSlug: 'maryjane',
        createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        oAuthId: null,
        email: 'patrick@geeklymedia.com',
        accountType: 'employer',
        firstName: 'Patrick',
        lastName: 'Employer',
        password: await hash('password', Number(process.env.SALT_ROUNDS)),
        phone: '5554555555',
        affiliateSlug: 'employer',
        createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        oAuthId: null,
        email: 'patrick.d.rizzardi@gmail.com',
        accountType: 'assistant',
        firstName: 'Patrick',
        lastName: 'Assistant',
        password: await hash('password', Number(process.env.SALT_ROUNDS)),
        phone: '5555555556',
        affiliateSlug: 'assistant',
        createdAt: day().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: day().format('YYYY-MM-DD HH:mm:ss'),
      },
    ]);
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
