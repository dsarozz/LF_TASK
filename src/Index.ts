import app from './App';
import { PORT } from './Config';
import { connection } from './DbConnection';

try {
    connection.authenticate().then(() => {
        connection.sync();
        app.listen(PORT, function () {
            console.log('Server is running in port :' + PORT);
        });
    })

    console.log('Connection successful to :' + PORT);
} catch (error) {
    console.log('Connection failed due to: ' + error.message); 
}