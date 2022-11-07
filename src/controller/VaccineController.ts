import { Request, Response } from 'express';
import * as vaccineService from '../services/VaccineService';
import { GoogleDriveService } from '../services/GoogleDriveService';
import { vaccineAttributes, vaccineCreationAttributes, vaccineModel } from '../model/VaccineModel';
import { GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_FOLDER, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN } from '../Config';
import * as common from '../common/helper';

export class vaccineController {
    public getVaccines(req: Request, res: Response) {
        let orderBy = req.query.orderBy ?? 'name';
        let orderDir = req.query.orderDir ?? 'asc';
        let page = req.query.page ?? 1;
        let pageSize = req.query.pageSize ?? 10;
        let { nameSearch, descriptionSearch, dosageSearch } = req.query, whereClause: any = { deleted: null };
        if (nameSearch) {
            whereClause = { ...whereClause, name: nameSearch };
        };
        if (descriptionSearch) {
            whereClause = { ...whereClause, description: descriptionSearch };
        };
        if (dosageSearch) {
            whereClause = { ...whereClause, name: dosageSearch };
        };

        vaccineService.getVaccines(whereClause, orderBy, orderDir, page, pageSize)
            .then(vaccines => { return res.status(200).json(vaccines); })
            .catch(error => { return res.status(400).json(error) });
    }

    public getVaccine(req: Request, res: Response) {
        let id = req.params.id, whereClause: any = { deleted: null, id };
        vaccineService.getVaccine(whereClause)
            .then(async (vaccine) => {
                if (vaccine.image) {
                    const googleDriveService = new GoogleDriveService(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN);
                    let imageData = await googleDriveService.getFile(vaccine.image);
                    vaccine = vaccine.dataValues;
                    vaccine = { ...vaccine, imageData };
                }
                return res.status(200).json(vaccine);
            })
            .catch(error => {
                return res.status(400).json(error)
            });
    }

    public async addVaccine(req, res) {
        const params: vaccineCreationAttributes = req.body;
        let fileData: any;
        var image: any;
        if (req.files?.image) {
            fileData = req.files.image
            if (!fileData.name.endsWith('.jpeg')) {
                return res.status(200).json({ message: 'Invalid image type. Only jpeg files are accepted.' })
            }
            await common.resizeImage(fileData.data, 256, 80).then(async (result) => {
                await result.getBuffer("image/jpeg", async (err, Buff) => {
                    if (err) {
                        return err;
                    }
                    image = Buff;
                })
            });
        }
        const googleDriveService = new GoogleDriveService(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN);

        let result = await googleDriveService.saveFile(GOOGLE_DRIVE_FOLDER, fileData.name, image, fileData.mimetype).catch((error) => {
            return res.status(400).json(error);
        });

        if (result) {
            params.image = result.data.id;
        }

        vaccineService.addVaccine(params)
            .then(async (vaccine) => { res.status(200).json(vaccine); })
            .catch(error => { return res.status(400).json(error); });
    }

    public async updateVaccine(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Id required.' })
        }

        let params: vaccineAttributes = req.body;
        let fileData: any;
        var image: any;
        if (req.files?.image) {
            fileData = req.files.image
            if (!fileData.name.endsWith('.jpeg')) {
                return res.status(200).json({ message: 'Invalid image type. Only jpeg files are accepted.' })
            }
            await common.resizeImage(fileData.data, 256, 80).then(async (result) => {
                await result.getBuffer("image/jpeg", async (err, Buff) => {
                    if (err) {
                        return err;
                    }
                    image = Buff;
                })
            });
        }
        const googleDriveService = new GoogleDriveService(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN);

        let result = await googleDriveService.saveFile(GOOGLE_DRIVE_FOLDER, fileData.name, image, fileData.mimetype).catch((error) => {
            return res.status(400).json(error);
        });

        if (result) {
            params.image = result.data.id;
        }

        let whereClause = { id: id }
        vaccineService.updateVaccine(whereClause, params)
            .then(async (vaccine) => { res.status(200).json(vaccine); })
            .catch(error => { return res.status(500).json(error); });;
    }

    public async deleteVaccine(req: Request, res: Response) {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Id required.' });
        }
        let deleteClause = { id: id }
        vaccineService.deleteVaccine(deleteClause)
            .then(async (vaccine) => {
                return res.status(200).json(vaccine);
            }).catch(error => {
                return res.status(500).json(error);
            });
    }

}

