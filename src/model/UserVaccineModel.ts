import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../DbConnection';
import { vaccineModel as vaccineModel } from './VaccineModel';
import { userModel } from './UserModel';

export interface userVaccineAttributes {
    id: number;
    userId: number;
    vaccineId: number;
    dosage: number;
    vaccineDate: Date;
    created: Date;
    modified: Date;
    deleted: Date;
}

export interface userVaccineCreationAttributes extends Optional<userVaccineAttributes, 'id'> { }

export interface userVaccineInstance extends Model<userVaccineAttributes, userVaccineCreationAttributes>, userVaccineAttributes { }

export const userVaccineModel = connection.define<userVaccineInstance>('userVaccines', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    vaccineId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'vaccines',
            key: 'id',
        }
    },
    dosage: {
        type: DataTypes.INTEGER
    }
    ,
    vaccineDate: {
        type: DataTypes.DATE,
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

userVaccineModel.belongsTo(userModel, {
    as: 'User',
    foreignKey: 'userId',
    // otherKey: 'subjectid'
});

userVaccineModel.belongsTo(vaccineModel, {
    as: 'Vaccine',
    foreignKey: 'vaccineId',
    // otherKey: 'studentid'
});
