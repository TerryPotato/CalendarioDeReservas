const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

dotenv.config(); // Carga las variables de entorno

const app = express(); // Inicializa la aplicación Express
const PORT = process.env.PORT || 8000;

connectDB(); // Conectar a MongoDB

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de Swagger
const swaggerDocument = require("../swagger.json"); // Ajusta la ruta si es necesario
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Configuración de rutas
app.use("/api/eventos", require("./routes/eventosRoutes"));
app.use("/api/usuarios", require("./routes/userRoutes"));

// Ruta principal
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`.yellow.bold);
});
