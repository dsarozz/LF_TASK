import { userAttributes, userCreationAttributes, userInstance, userModel } from '../model/UserModel';
import * as bcrypt from 'bcrypt';
import { roleModel } from '../model/RoleModel';
import { vaccineModel } from '../model/VaccineModel';
import { userVaccineModel } from '../model/UserVaccineModel';
import * as common from '../common/helper';

export async function Login(email: string, password: string) {
    return userModel.findOne({ where: { email: email }, include: [{ model: roleModel, as: 'role' }] }).then(async (user) => {
        if (user === null) {
            throw new Error('Invalid credentials.');
        }
        let match = await bcrypt.compare(password, user.password)
        if (match == true) {
            return user;
        } else {
            throw new Error('Invalid credentials.');
        }
    }).catch(error => {
        return error;
    });
};

export async function getUsers(whereClause, orderBy, orderDir, page, pageSize) {
    return userModel.count({ where: whereClause }).then(async (count) => {
        if (count > 0) {
            return userModel.findAll({
                where: whereClause,
                attributes: { exclude: ['password'] },
                order: [[orderBy, orderDir]],
                offset: ((page - 1) * pageSize),
                limit: pageSize
            }).then(async (users) => {
                return users;
            })
        }
    }).catch(error => {
        return error;
    });
}

export async function getUser(whereClause) {
    return userModel.findOne({
        where: whereClause,
        attributes: { exclude: ['password'] }
    }).then(async (users) => {
        return users;
    }).catch(error => {
        return error;
    });
}

export async function addUser(data: userAttributes) {
    return userModel.create(data).then(async (result) => {
        if (result && result.roleId !== 1) {
            vaccineModel.findAll({ where: { deleted: null, mandatory: true } })
                .then(async (vaccines) => {
                    if (vaccines?.length > 0) {
                        let vaccineChunks = await common.chunkData(2, vaccines);
                        for (let chunk in vaccineChunks) {
                            let insertableVaccines: any[] = vaccineChunks[chunk].map(vaccine => {
                                return {
                                    userId: result.id,
                                    vaccineId: vaccine.id
                                };
                            });
                            userVaccineModel.bulkCreate(insertableVaccines);
                        }
                    };
                });
        };
        return result;
    }).catch(error => {
        return error;
    })
}

export async function updateUser(data: any) {
    let date = new Date(), updateClause: any = { modified: date }, whereClause = { id: data.id, deleted: null };

    if (data.email) {
        updateClause = { ...updateClause, email: data.email };
    }
    if (data.password) {
        updateClause = { ...updateClause, password: data.password };
    }
    if (data.loggedIn) {
        updateClause = { ...updateClause, loggedIn: data.loggedIn };
    }
    if (data.refreshToken) {
        updateClause = { ...updateClause, refreshToken: data.refreshToken };
    }
    if (data.firstName) {
        updateClause = { ...updateClause, firstName: data.firstName };
    }
    if (data.lastName) {
        updateClause = { ...updateClause, lastName: data.lastName };
    }
    if (data.roleId) {
        updateClause = { ...updateClause, roleId: data.roleId };
    }

    common.isExist(userModel, whereClause).then(exists => {
        if (exists === true) {
            userModel.update(updateClause,
                {
                    where: whereClause
                }).then(result => {
                    return result;
                }).catch(error => {
                    return error;
                });
        } else {
            throw new Error('User does not exist.');
        }
    }).catch(error => {
        return error;
    });
}

export async function deleteUser(whereClause) {
    let date = new Date();
    whereClause = { ...whereClause, deleted: null };
    common.isExist(userModel, whereClause).then(exists => {
        if (exists) {
            return userModel.update({
                deleted: date,
            }, {
                where: whereClause
            }).then(result => {
                if (result) {
                    userVaccineModel.update({
                        deleted: date
                    },
                        {
                            where: {
                                userId: whereClause.id
                            }
                        })
                }
                return result;
            }).catch(error => {
                return error;
            });
        } else {
            throw new Error('User does not exist.');
        }
    }).catch(error => {
        return error;
    })
};
