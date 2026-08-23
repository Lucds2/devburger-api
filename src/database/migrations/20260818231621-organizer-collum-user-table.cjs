'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'cliente_retira');
  },

  async down (queryInterface, Sequelize) {
  
     await queryInterface.addColumn('users', 'cliente_retira', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
     
  }
};
