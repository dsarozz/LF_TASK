import * as bcrypt from 'bcrypt';
import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../DbConnection';
import { roleModel } from './RoleModel';
const saltRounds = 10;

export interface userAttributes {
    id?: number;
    email: string;
    password: string;
    loggedIn?: boolean;
    firstName?: string;
    lastName?: string;
    roleId: number;
    created?: Date;
    modified?: Date;
    deleted?: Date;
}

export interface userCreationAttributes extends Optional<userAttributes, 'id'> { }

export interface userInstance extends Model<userAttributes, userCreationAttributes>, userAttributes { }

export const userModel = connection.define<userInstance>('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    loggedIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'id',
        }
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
        type: DataTypes.DATE
    }
}
    , {
        freezeTableName: true,
        timestamps: false
    }
)
userModel.hasMany(roleModel, { as: 'role', foreignKey: 'id' });

userModel.beforeCreate(function (user, options) {
    return bcrypt.hash(user.password, saltRounds).then(hashedPassword => {
        user.password = hashedPassword
    })
});