import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../DbConnection';
import { vaccineModel } from './VaccineModel';

export interface vaccineAllergyAttributes {
    id?: number;
    vaccineId: number;
    description: string;
    immuneMediatedReaction: string;
    clinicalManifestation: string;
    created?: Date;
    modified?: Date;
    deleted?: Date;
}

export interface vaccineAllergyCreationAttributes extends Optional<vaccineAllergyAttributes, 'id'> { }

export interface vaccineAllergyInstance extends Model<vaccineAllergyAttributes, vaccineAllergyCreationAttributes>, vaccineAllergyAttributes { }

export const vaccineAllergyModel = connection.define<vaccineAllergyInstance>('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vaccineId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'vaccines',
            key: 'id',
        }
    },
    description: {
        type: DataTypes.STRING
    },
    immuneMediatedReaction: {
        type: DataTypes.STRING,
    },
    clinicalManifestation: {
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
        type: DataTypes.DATE
    }
}
    , {
        freezeTableName: true,
        timestamps: false
    }
);

vaccineModel.hasMany(vaccineAllergyModel, { as: 'vaccineAllergy', foreignKey: 'vaccineId' });