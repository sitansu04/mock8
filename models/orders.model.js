const mongoose = require("mongoose");
const addressSchema = mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zip: { type: String },
});

const ordersSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryAddress: addressSchema,
  status: {
    type: String,
    enum: ["placed", "preparing", "on the way", "delivered"],
  },
});

const Ordermodel = mongoose.model("order", ordersSchema);
module.exports = {
  Ordermodel,
};
