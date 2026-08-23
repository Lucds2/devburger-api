'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'address_user', {
      allowNull: false,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('users', 'payment_on_delivery', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'cliente_retira', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'address_user');
    await queryInterface.removeColumn('users', 'payment_on_delivery');
    await queryInterface.removeColumn('users', 'cliente_retira');
  },
};