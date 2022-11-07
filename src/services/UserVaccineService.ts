import { userVaccineInstance, userVaccineModel } from '../model/UserVaccineModel';
import * as common from '../common/helper';
import { userModel } from '../model/UserModel';
import { vaccineModel } from '../model/VaccineModel';

export async function getUserVaccines(whereClause, orderBy, orderDir, page, pageSize) {
    return userVaccineModel.findAll({
        where: whereClause,
        order: [[{ model: vaccineModel, as: 'vaccine' }, orderBy, orderDir]],
        include: [
            {
                model: userModel,
                attributes: { exclude: ['password'] }
            },
            { model: vaccineModel }
        ],
        offset: ((page - 1) * pageSize),
        limit: pageSize
    }).then(async (vaccines) => {
        return vaccines;
    }).catch(error => {
        return error;
    });
}

export async function getUserVaccine(whereClause: any = {}) {
    return userVaccineModel.findOne({
        where: whereClause
    }).then(async (vaccines) => {
        return vaccines;
    }).catch(error => {
        return error;
    });
}

export async function addUserVaccine(data: userVaccineInstance) {
    return userVaccineModel.create(data).then(result => {
        return result;
    }).catch(error => {
        return error;
    })
}

export async function updateUserVaccine(data: userVaccineInstance) {
    let date = new Date(), updateClause: any = { modified: date }, whereClause = { id: data.id, deleted: null };

    if (data.userId) {
        updateClause = { ...updateClause, name: data.userId };
    }
    if (data.vaccineId) {
        updateClause = { ...updateClause, description: data.vaccineId };
    }
    if (data.dosage) {
        updateClause = { ...updateClause, dosage: data.dosage };
    }


    userVaccineModel.update(updateClause,
        {
            where: whereClause
        }).then(result => {
            return result;
        }).catch(error => {
            return error;
        });
}

export async function deleteUserVaccine(whereClause) {
    let date = new Date();
    whereClause = { ...whereClause, deleted: null };
    common.isExist(userVaccineModel, whereClause).then(exists => {
        if (exists) {
            return userVaccineModel.update({
                deleted: date,
            }, {
                where: whereClause
            }).then(async (result) => {
                return result;
            }).catch(error => {
                return error;
            });
        } else {
            throw new Error('Record does not exist.');
        }
    }).catch(error => {
        return error;
    })
};
