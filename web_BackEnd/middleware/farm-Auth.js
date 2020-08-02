const jwt = require("jsonwebtoken");
const Farmer = require("../model/model.farmers");



exports.protect = async (req, res, next) => {


/*=========Token ========*/
 console.log('Protector is working')
  let token;
 if (
    req.headers.authorization
   
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

 

  if (!token) {
    console.log('Protector from farm !token line 20')
    return res
      .status(401)
      .json({ success: false, data: "Not authorized to access this route" });
  }

  try {
    // verify Token process.env.JWT_SECRET get the secret key

    const  verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
    req.farmer = await Farmer.findById(verifiedToken.id);
    return next();
  } catch (err) {
    return res
      .status(401 )
      .json({ success: false, data: "Not authorized to access this route" });
  }
};


