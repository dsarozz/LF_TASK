import { vaccineController } from '../controller/VaccineController';
import { userVaccineController } from '../controller/UserVaccineController';
import { authenticationController } from '../controller/AuthenticationController';
import { userController } from '../controller/userController';

export class AuthRoutes {
    public AuthenticationController: authenticationController = new authenticationController();
    public UserController: userController = new userController();
    public VaccineController: vaccineController = new vaccineController();
    public UserVaccineController: userVaccineController = new userVaccineController();

    public authRoutes(app): void {
        //#SignOut
        app.route('/signout').post(this.AuthenticationController.SignOut);

        //#Vaccines
        app.route('/vaccine').get(this.VaccineController.getVaccines);
        app.route('/vaccine/:id').get(this.VaccineController.getVaccine);
        app.route('/vaccine').post(this.VaccineController.addVaccine);
        app.route('/vaccine/:id').patch(this.VaccineController.updateVaccine);
        app.route('/vaccine/:id').delete(this.VaccineController.deleteVaccine);

        //#User Vaccines routes
        app.route('/patient').get(this.UserController.GetUsers);
        app.route('/patient/vaccine').get(this.UserVaccineController.GetUserVaccines);
        app.route('/patient/:vaccineId').delete(this.UserVaccineController.DeleteUserVaccine);
        app.route('/patient/:id').delete(this.UserController.DeleteUser);
    }
}