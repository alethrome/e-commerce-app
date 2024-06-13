const dotenv = require("dotenv");

const app = require("./app");
const sequelize = require('./config/database.js');

dotenv.config();

sequelize
    .sync()
    .then(res => {
        console.log('Database is connected.')
    })
    .catch(err => {
        console.log(err);
    }); 

app.listen(process.env.PORT, () => {
    console.log(`App is listening to port ${process.env.PORT}`);
});