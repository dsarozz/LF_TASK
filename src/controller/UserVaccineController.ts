import { Request, Response } from 'express';
import * as userVaccineService from '../services/UserVaccineService';
import { userVaccineCreationAttributes, userVaccineModel } from '../model/UserVaccineModel';


export class userVaccineController {
    public async GetUserVaccines(req, res) {
        let orderBy = req.query.orderBy ?? 'name';
        let orderDir = req.query.orderDir ?? 'asc';
        let page = req.query.page ?? 1;
        let pageSize = req.query.pageSize ?? 10;
        let whereClause = { deleted: null, userId: req.user.id };
        userVaccineService.getUserVaccines(whereClause, orderBy, orderDir, page, pageSize)
            .then(userVaccines => { return res.status(200).json(userVaccines) })
            .catch(error => { return res.status(400).json(error) });
    }

    public async addUserVaccine(req: Request, res: Response) {
        const params: userVaccineCreationAttributes = req.body;
        userVaccineModel.create(params).then(userVaccine => {
            return res.status(200).json(userVaccine);
        }).catch(error => {
            return res.status(500).json(error);
        })
    }

    public async DeleteUserVaccine(req: Request, res: Response) {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Id required.' });
        }
        let deleteClause = { id: id }
        userVaccineService.deleteUserVaccine(deleteClause)
            .then(async (userVaccine) => {
                return res.status(200).json(userVaccine);
            }).catch(error => {
                return res.status(500).json(error);
            });
    }

}    
