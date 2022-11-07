import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../DbConnection';
import { vaccineAllergyModel } from './VaccineAllegryModel';

export interface vaccineAttributes {
    id: number;
    name: string;
    description: string;
    dosage: number;
    image?: string;
    mandatory: boolean;
    created?: Date;
    modified?: Date;
    deleted?: Date;
}

export interface vaccineCreationAttributes extends Optional<vaccineAttributes, 'id'> { }

export interface vaccineInstance extends Model<vaccineAttributes, vaccineCreationAttributes>, vaccineAttributes { }

export const vaccineModel = connection.define<vaccineInstance>('vaccines', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    dosage: {
        type: DataTypes.INTEGER
    },
    image: {
        type: DataTypes.STRING
    },
    mandatory: {
        type: DataTypes.BOOLEAN
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
    }
}
    , {
        freezeTableName: true,
        timestamps: false
    });