const mongoose = require("mongoose");
require('dotenv').config();
const connection = mongoose.connect("mongodb+srv://sitansugcelt:smandal@cluster0.x1yj8ov.mongodb.net/mockeight?retryWrites=true&w=majority");

module.exports = {
  connection,
};
