const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");


const app = express();
const port = 3000;
const db = require("./models/");

app.use("/public", express.static("public"));


// Middleware CORS para permitir peticiones desde tu frontend React
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  optionsSuccessStatus: 200
}));

// Middleware para recibir datos en formato JSON y formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para subir archivos (audio, imágenes)
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Sincronizar modelos con la base de datos
db.sequelize.sync({
    // force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

// Registrar las rutas
require("./routes")(app);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API REST escuchando en http://localhost:${port}`);
});
