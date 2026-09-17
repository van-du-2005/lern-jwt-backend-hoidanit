"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
      "User",
      [
        {
          username: "fake",
          password: "1234",
          email: "fake@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "fake1",
          password: "1234",
          email: "fake1@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "fake3",
          password: "1234",
          email: "fake3@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "fake2",
          password: "1234",
          email: "fake2@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
