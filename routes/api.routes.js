const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../models/user.model");
const { Resturantsmodel } = require("../models/resturants.model");
const { Ordermodel } = require("../models/orders.model");
const {
  authentication,
} = require("../../Mock_7/backend/middlewares/authentication.middleware");
const apiRouter = express.Router();
// ------------------------------------CHECKING API ROUTER------------------------>
apiRouter.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: `api router is working` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
// ---------------------------------------User endpoints------------------------------->
// -----------Register User------->
apiRouter.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address: { street, city, state, country, zip },
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !street ||
      !city ||
      !state ||
      !country ||
      !zip
    ) {
      return res.status(400).send({ msg: "Plaese fill all the feilds" });
    }
    console.log(name, email, password);
    const ex_user = await Usermodel.findOne({ email });
    if (ex_user) {
      res.send({ msg: `please try to log in` });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send(err);
        } else {
          const user = new Usermodel({
            name,
            email,
            password: hash,
            address: {
              street,
              city,
              state,
              country,
              zip,
            },
          });
          await user.save();
          res.status(201).send("Registered");
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
// -----------Login User------->
apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.find({ email: email });
    const hash_pass = user[0].password;
    console.log(hash_pass);
    if (user.length > 0) {
      bcrypt.compare(password, hash_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "sitansu");
          res
            .status(200)
            .send({ msg: `User logged in Successfull`, token: token });
        } else {
          res.status(400).send({ msg: `Login Failed` });
        }
      });
    } else {
      res.status(400).send({ msg: `User does not exists please register` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
// -----------Reset password User------->
apiRouter.patch("/user/:id/reset", async (req, res) => {
  try {
    const userID = req.params.id;
    const password = req.body;
    if (!password) {
      res.send("please fill the details");
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.send(err);
      }
      const user = await Usermodel.findByIdAndUpdate(
        { _id: userID },
        { password: hash }
      );
      if (user) {
        res.status(204).send({ msg: "passoword updated susseccefully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

apiRouter.put("/user/:id/reset", async (req, res) => {
  try {
    const userID = req.params.id;
    const password = req.body;
    if (!password) {
      res.send("please fill the details");
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.send(err);
      }
      const user = await Usermodel.findByIdAndUpdate(
        { _id: userID },
        { password: hash }
      );
      if (user) {
        res.status(204).send({ msg: "passoword updated susseccefully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// ---------------------------------------Resturants endpoints------------------------------->
//----------------all Resturants---------------->
apiRouter.get("/resturant", async (req, res) => {
  try {
    const resturants = await Resturantsmodel.find();
    if (resturants) {
      res.status(200).send(resturants);
    } else {
      res.status(400).send({ msg: "there are no resturansts" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
});

//---------------------Find Resturanst by id--------------------->
apiRouter.get("/resturant/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const resturants = await Resturantsmodel.findOne({ _id: id });
    if (resturants) {
      res.status(200).send(resturants);
    } else {
      res.status(400).send({ msg: "there are no resturansts" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
});

//-------------------------Get a resturant menu------------------>

apiRouter.get("/resturant/:id/menu", async (req, res) => {
  try {
    const id = req.params.id;
    const resturant = await Resturantsmodel.findById(id);
    if (resturant) {
      res.status(200).send(resturant.menu);
    } else {
      res.status(400).send({ msg: "thre are no menus in this resturant" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
// ---------------------------Add Menu-------------------->
apiRouter.post("/resturant/:id/menu", async (req, res) => {
  try {
    const payload = req.body;
    const id = req.params.id;
    const resturant = await Resturantsmodel.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          menu: payload,
        },
      }
    );
    if (resturant) {
      res.status(201).send({ msg: `Resturanst menu updated` });
    } else {
      res.status(400).send({ msg: `resturant not flound` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
});
// ---------------------------Delete Menu-------------->
apiRouter.delete("/resturant/:resid/menu/:id", async (req, res) => {
  try {
    const resID = req.params.resid;
    const id = req.params.id;
    const resturant = await Resturantsmodel.findByIdAndUpdate(
      { _id: resID },
      {
        $pull: {
          menu: { _id: id },
        },
      }
    );
    if (resturant) {
      res.status(202).send({ msg: `Menu deleted successfull` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//-------------------------------GetOrders------------------>
apiRouter.get("/orders/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let order = await Ordermodel.findById(id);
    if (order) {
      res.status(200).send(order);
    } else {
      res.status(400).send({ msg: "User have not placed order with this id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
});
//-------------------------------Post order-------------------------->
// apiRouter.post("/orders",authentication,async(req,res)=>{
//   try {

//   } catch (error) {

//   }
// })
//-----------------------------post Resturanst-------------->
apiRouter.post("/resturant", async (req, res) => {
  try {
    const {
      name,
      address: { street, city, state, country, zip },
      menu: [],
    } = req.body;

    const resturanst = new Resturantsmodel({
      name,
      address: {
        street,
        city,
        state,
        country,
        zip,
      },
      menu: [],
    });
    await resturanst.save();
    res.send(resturanst);
  } catch (error) {
    console.log(error);
  }
});
module.exports = {
  apiRouter,
};

///////////////userbody//////////////
// {
//   "name": "A Mandal",
//   "email": "a@gmail.com",
//   "password": "123456",
//   "address": {
//     "street": "Beliatore",
//     "city": "Bankura",
//     "state": "WB",
//     "country": "INDIA",
//     "zip": "722203"
//   }
// }
/////////////////////resturantbody//////////
// {
//   "name": "beliatore",
//   "address": {
//     "street": "Beliatore",
//     "city": "Bankura",
//     "state": "WB",
//     "country": "INDIA",
//     "zip": "722203"
//   },
//   "menu": []
// }