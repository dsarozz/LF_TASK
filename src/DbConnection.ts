import { Sequelize } from 'sequelize';
import { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_DIALECT } from './Config';

export const connection = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    dialect: DB_DIALECT,
});
