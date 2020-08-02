const express = require('express');
const nodemailer = require('nodemailer');
const mongoose= require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc =require('swagger-jsdoc');
const swaggerUi =require('swagger-ui-express');
const app = express();
const farmRoute =require('./routes/farmer.route');
const customerRoute = require('./routes/Customer.route');


/*================Used To connect MongoDB ATLAS ====================*/
    // Connect To MongoDB & access the link in the .env
dotenv.config(); 
    //mongoose.connect(process.env.DB_CONNECT,
     // {useNewUrlParser:true, useUnifiedTopology: true}, ()=>{
      // console.log('My MongoDB Is Connected...!')
      //} )
  /*============================== ==================================*/

app.use(bodyParser.json());
app.use(express.json({extended: false}));
app.use(cors());

/*=================***** SWAGGER JS DOC Fanctionality ****==============*/
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Fresh Corner Routes",
        description: "Customer and Farmers API Information",
        contact: {
          name: "AmeleWork Cheklie"
        },
        servers: ["http://localhost:2020"]
      }
    },
    // ['.routes/*.js']
    apis: ['./routes/*.js']
  };
 
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  //app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   /*======================SWAGGER JS DOC ============================*/
  
/***==== Routes =====***/
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/farmers', farmRoute);
app.use('/customers', customerRoute);
 

/**================ App listening port =================**/   
const port = 2020;
mongoose.connect('mongodb://localhost:27017/Fresh-Corner',{
    useNewUrlParser:true, useUnifiedTopology:true
}).then((e)=>{
    console.log('DB compass connected')
    app.listen(port,()=>{
        console.log(`server is running on port: ${port}` )
    })
}).catch(err=>{
    console.log(err)
})
