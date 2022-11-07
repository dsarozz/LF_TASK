import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../DbConnection';

export interface roleAttributes {
    id: number;
    name: string;
    created: Date;
    modified: Date;
    deleted: Date;
}

export interface roleCreationAttributes extends Optional<roleAttributes, 'id'> { }

export interface roleInstance extends Model<roleAttributes, roleCreationAttributes>, roleAttributes { }

export const roleModel = connection.define<roleInstance>('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    modified: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    deleted: {
        type: DataTypes.DATE,
    },
}, {
    freezeTableName: true,
    timestamps: false
});