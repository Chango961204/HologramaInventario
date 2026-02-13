require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const movementsRoutes = require("./routes/movements.routes");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API inventario funcionando");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/movements", movementsRoutes);

app.listen(process.env.PORT, () => {
  console.log("API corriendo en puerto", process.env.PORT);
});
