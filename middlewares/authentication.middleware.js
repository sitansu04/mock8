const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(400).send({ msg: "There is no Tokens" });
  }
  try {
    const decoded = jwt.verify(token, "sitansu");
    const userID = decoded.userID;
    req.body.userID = userID;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
};
