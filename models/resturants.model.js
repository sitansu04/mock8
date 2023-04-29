const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zip: { type: String },
});

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
});

const resturanstSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: addressSchema,
  menu: [menuSchema],
});

const Resturantsmodel = mongoose.model("resturants", resturanstSchema);

module.exports = {
  Resturantsmodel,
};
