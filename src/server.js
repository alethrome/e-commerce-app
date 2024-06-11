const dotenv = require("dotenv");

const app = require("./app");

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`App is listening to port ${process.env.PORT}`);
});

