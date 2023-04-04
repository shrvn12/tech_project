const express = require("express");
const cors = require("cors");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/product.routes");
const logger = require("./configs/winston");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use(function(req, res, next) {
  var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  logger.log('request', req.method, req.url, ip);
  next();
});


app.get("/", (req, res) => {
  // console.log(__dirname+'/frontend/user/index.html');
  // res.sendFile(__dirname+'/frontend/user/index.html');
  res.send({msg:"welcome from server"});
});

app.use("/",userRouter);
app.use("/products",productRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log("error while connecting to server");
    console.log(error);
  }
  console.log(`server is running at ${process.env.port}`);
});
