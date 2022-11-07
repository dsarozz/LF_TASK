import { vaccineAttributes, vaccineCreationAttributes, vaccineInstance, vaccineModel } from '../model/VaccineModel';
import * as common from '../common/helper';
import { userModel } from '../model/UserModel';
import { userVaccineModel } from '../model/UserVaccineModel';
const { Op } = require("sequelize");

export async function getVaccines(whereClause, orderBy, orderDir, page, pageSize) {
    return vaccineModel.count({ where: whereClause }).then(async (count) => {
        if (count > 0) {
            return vaccineModel.findAll({
                where: whereClause,
                order: [['mandatory', 'desc'], [orderBy, orderDir]],
                offset: ((page - 1) * pageSize),
                limit: pageSize
            }).then(async (vaccines) => {
                return vaccines;
            })
        }
    }).catch(error => {
        return error;
    });
}

export async function getVaccine(whereClause) {
    return vaccineModel.findOne({
        where: whereClause
    }).then(async (vaccines) => {
        return vaccines;
    }).catch(error => {
        return error;
    });
}

export async function addVaccine(data: vaccineCreationAttributes) {
    return vaccineModel.create(data).then(async (vaccine) => {
        if (vaccine && vaccine.mandatory == true) {
            userModel.findAll({ where: { deleted: null, roleId: { [Op.ne]: 1 } } }).then(async (users) => {
                if (users?.length > 0) {
                    let userChunks = await common.chunkData(2, users);
                    for (let chunk in userChunks) {
                        let insertableUsers: any[] = userChunks[chunk].map(user => {
                            return {
                                userId: user.id,
                                vaccineId: vaccine.id
                            };
                        });
                        userVaccineModel.bulkCreate(insertableUsers);
                    };
                };
            });
        };
        return vaccine;
    }).catch(error => {
        return error;
    })
}

export async function updateVaccine(whereClause: any, data: vaccineAttributes) {
    let date = new Date(), updateClause: any = { modified: date };
    whereClause = { ...whereClause, deleted: null };

    if (data.name) {
        updateClause = { ...updateClause, name: data.name };
    }
    if (data.description) {
        updateClause = { ...updateClause, description: data.description };
    }
    if (data.dosage) {
        updateClause = { ...updateClause, dosage: data.dosage };
    }
    if (data.mandatory) {
        updateClause = { ...updateClause, mandatory: data.mandatory };
    }
    if (data.image) {
        updateClause = { ...updateClause, image: data.image };
    }

    vaccineModel.update(updateClause,
        {
            where: whereClause
        }).then(result => {
            return result;
        }).catch(error => {
            return error;
        });
}

export async function deleteVaccine(whereClause) {
    let date = new Date();
    whereClause = { ...whereClause, deleted: null };
    common.isExist(vaccineModel, whereClause).then(exists => {
        if (exists) {
            return vaccineModel.update({
                deleted: date,
            }, {
                where: whereClause
            }).then(async (result) => {
                if (result) {
                    userVaccineModel.update({
                        deleted: date
                    },
                        {
                            where: {
                                vaccineId: whereClause.id
                            }
                        })
                }
                return result;
            }).catch(error => {
                return error;
            });
        } else {
            throw new Error('Vaccine does not exist.');
        }
    }).catch(error => {
        return error;
    })
};
