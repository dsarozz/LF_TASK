import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Routes } from './route/Router';
import { AuthRoutes } from './route/AuthRouter'
import { authenticationController } from './controller/AuthenticationController';
const fileUpload = require('express-fileupload');
class App {
    public app: express.Application;
    public router: Routes = new Routes();
    public authRouter: AuthRoutes = new AuthRoutes();
    public authMiddleware: authenticationController = new authenticationController();

    constructor() {
        this.app = express();
        this.config();
        this.router.routes(this.app);
        this.authRouter.authRoutes(this.app.use(this.authMiddleware.authentication));
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(fileUpload({
            createParentPath: true
        }));
    }
}

export default new App().app;