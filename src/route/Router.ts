import { authenticationController } from '../controller/AuthenticationController';
import { vaccineController } from '../controller/vaccineController';
import { userController } from '../controller/userController';

export class Routes {
    public AuthenticationController: authenticationController = new authenticationController();
    public VaccineController: vaccineController = new vaccineController();
    public UserController: userController = new userController();

    public routes(app): void {
        app.route('/signin').post(this.AuthenticationController.SignIn);
        app.route('/signup').post(this.UserController.AddUser);
        app.route('/vaccines').get(this.VaccineController.getVaccines);
    }
}