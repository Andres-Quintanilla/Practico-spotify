const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");


const app = express();
const port = 3000;
const db = require("./models/");

app.use("/public", express.static("public"));



app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  optionsSuccessStatus: 200
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

db.sequelize.sync({
}).then(() => {
    console.log("db resync");
});

require("./routes")(app);

app.listen(port, () => {
  console.log(`API REST escuchando en http://localhost:${port}`);
});
