import { Request, Response } from 'express';
import { REFRESH_TOKEN_LIFE, REFRESH_TOKEN_SECRET, TOKEN_LIFE, TOKEN_SECRET } from '../Config';
import * as userService from '../services/UserService';
const jwt = require('jsonwebtoken');

export class authenticationController {
    public async SignIn(req: Request, res: Response) {
        const { email, password } = req.body;

        userService.Login(email, password).then(async (user) => {
            if (user) {
                let userAttributes = {
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId
                }
                const token = jwt.sign(userAttributes, TOKEN_SECRET, { expiresIn: TOKEN_LIFE });
                const refreshToken = jwt.sign(userAttributes, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });
                user.loggedIn = true;
                userService.updateUser(user).then(async (data) => {
                    const response = {
                        "status": "Logged in"
                    };
                    res.setHeader('X-Security-AuthKey', token);
                    res.setHeader('X-Security-RefreshKey', refreshToken);
                    return res.status(200).json(response);
                });
            } else {
                return res.status(401).json({ message: 'Login Failed' });
            }
        }).catch(error => {
            return res.status(500).json({ message: error.message });
        });
    };

    public async authentication(req: Request, res: Response, next) {
        try {
            var auth = req.get('X-Security-AuthKey');
            var refreshAuth = req.get('X-Security-RefreshKey');
            if (!auth && !refreshAuth) {
                return res.status(401).json({ "error": true, "message": 'Invalid tokens.' });
            }
            if (auth) {
                await jwt.verify(auth, TOKEN_SECRET, async function (err, decoded) {
                    if (err) {
                        await jwt.verify(refreshAuth, REFRESH_TOKEN_SECRET, function (err, rtDecoded) {
                            if (err) {
                                return res.status(401).json({ "error": true, "message": 'Session timeout.' });
                            }
                            userService.getUser({ deleted: null, id: rtDecoded.id })
                                .then(async (user) => {
                                    if (!user.loggedIn) {
                                        return res.status(401).send('Session timeout.');
                                    }
                                })
                            let userAttributes = {
                                id: rtDecoded.id,
                                email: rtDecoded.email,
                                roleId: rtDecoded.roleId
                            }
                            const token = jwt.sign(userAttributes, TOKEN_SECRET, { expiresIn: TOKEN_LIFE });
                            req['user'] = rtDecoded;
                            res.setHeader('X-Security-Authkey', token);
                            next();
                        });
                    } else {
                        userService.getUser({ deleted: null, id: decoded.id })
                            .then(async (user) => {
                                if (!user.loggedIn) {
                                    return res.status(401).send('Session timeout.');
                                }
                                req['user'] = decoded;
                                next();
                            });
                    }
                });
            } else {
                return res.status(401).send('Unauthorized');
            }
        }
        catch (error) {
            return res.status(500).send({ message: error.message });
        }
    };

    public async SignOut(req, res) {
        try {
            var auth = req.get('X-Security-AuthKey');
            if (auth) {
                await jwt.verify(auth, TOKEN_SECRET, async function (err, decoded) {
                    if (err) {
                        return res.status(401).json({ "error": true, "message": 'Session timeout.' });
                    }
                    let updateClause = { id: decoded.id, loggedIn: false };
                    userService.updateUser(updateClause).then(result => {
                        return res.status(200).json();
                    });
                });
            };
        }
        catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
}
