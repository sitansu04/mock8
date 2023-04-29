const express = require("express");
const cors = require("cors");

const { connection } = require("./config/db.js");
const { apiRouter } = require("./routes/api.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  try {
    res.status(200).send({ msg: `welcome to resturants api` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(8000, async () => {
  try {
    await connection;
    console.log("Server is connected to DB and port 8000");
  } catch (error) {
    console.log(error);
  }
});
