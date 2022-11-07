import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as userService from '../services/UserService';
import { userCreationAttributes, userModel } from '../model/UserModel';
const { Op } = require("sequelize");

export class userController {
    public async GetUsers(req: Request, res: Response) {
        let orderBy = req.query.orderBy ?? 'firstName';
        let orderDir = req.query.orderDir ?? 'asc';
        let page = req.query.page ?? 1;
        let pageSize = req.query.pageSize ?? 10;
        let { emailSearch, nameSearch } = req.query, whereClause: any = { deleted: null, roleId: { [Op.ne]: 1 } };
        if (emailSearch) {
            whereClause = { ...whereClause, email: emailSearch };
        };
        if (nameSearch) {
            nameSearch = `%${nameSearch}%`;
            whereClause = { ...whereClause, [Op.or]: [{ firstName: { [Op.iLike]: nameSearch } }, { lastName: { [Op.iLike]: nameSearch } }] };
        };
        userService.getUsers(whereClause, orderBy, orderDir, page, pageSize)
            .then(users => { return res.status(200).json(users) })
            .catch(error => { return res.status(400).json(error) });
    };

    public async AddUser(req: Request, res: Response) {
        const params: userCreationAttributes = req.body;
        if (!params.email) {
            return res.status(400).json({ message: 'Email required.' });
        }
        if (!params.password) {
            return res.status(400).json({ message: 'Password required.' });
        }
        if (!params.roleId) {
            return res.status(400).json({ message: 'RoleId required.' });
        }
        userService.addUser(params).then(result => {
            res.send(result);
        }).catch(error => {
            res.send('Failed with error:' + error);
        })
    }

    public async DeleteUser(req: Request, res: Response) {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Id required.' });
        }
        let deleteClause = { id: id }
        userService.deleteUser(deleteClause)
            .then(async (vaccine) => {
                return res.status(200).json(vaccine);
            }).catch(error => {
                return res.status(500).json(error);
            });
    }

}    
