const express = require('express');
const router = express.Router();
const farmerController = require('../controller/farmer.controller');
const superController = require('../controller/superUser.controller');
const  {protect} = require('../middleware/farm-Auth'); 
const  {authorize} = require('../middleware/authorazation');
const multer = require('multer');

/**
 *@swagger
 * /farmers/login:
 *   post:
 *      description : Farmer Can Login To The Page If He/She Has Token. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.post('/login', farmerController.farmLogin);

/**
 *@swagger
 * /farmers/signup:
 *   post:
 *      description : New Farmer Can Signup to Regester for The first time. 
 *      responses:
 *        "201":
 *            description : New Farmer successfuly Created. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.post('/signup',farmerController.farmSignup);

/**
 *@swagger
 * /farmers/products:
 *   post:
 *      description : Farmer Can Upload Image and Add Products To The Page. This router has Multer middleware that can help to handle to upload the mulie data file. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.post('/products', protect, authorize('Farmer') , multer().single('image'), farmerController.addProducts);

/**
 *@swagger
 * /farmers/products:
 *   get:
 *      description : Farmer Can GET all Products in the list. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/products', protect,  authorize('Farmer'), farmerController.getAllProducts);

/**
 *@swagger
 * /farmers/products/:products_id:
 *   patch:
 *      description : Farmer Can UPDATE the products detail by using specific Product Id. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */

router.patch('/products/:products_id',  protect,  authorize('Farmer'), farmerController.updateProducts);

/**
 *@swagger
 * /farmers/products/:products_id:
 *   delete:
 *      description : Farmer Can DELETE  specific Product by using Product Id. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.delete('/products/:products_id', protect,  authorize('Farmer'), farmerController.deleteProducts);

/**
 *@swagger
 * /farmers/orders:
 *   get:
 *      description : Farmer Can GET  all Orders that are sent from customers. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get("/orders", protect,  authorize('Farmer'), farmerController.getOrders);

/**
 *@swagger
 * /farmers/orders/:orderid:
 *   patch:
 *      description : Farmer Can UPDATE  The specific Order by using order Id. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.patch("/orders/:orderid" ,  protect,  authorize('Farmer'), farmerController.changeStatus);

/**
 *@swagger
 * /farmers/farmlists:
 *   get:
 *      description : Super user can GET all farmers in the list. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/farmlists', protect,  authorize('Admin'), superController.getAllFarmers);
/**
 *@swagger
 * /farmers/password/:farmerid:
 *   patch:
 *      description : Super user can UPDATE The specific farmer password by using farmer id. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.patch('/password/:farmerid',protect, authorize('Admin'), superController.reSetPasswords);

/**
 *@swagger
 * /farmers/activates/:farmerid:
 *   patch:
 *      description : Super user can UPDATE The specific farmer status(Activate & DeActivate) by using farmer id . 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.patch('/activates/:farmerid',protect, authorize('Admin'), superController.changeFarmerStatus);


module.exports= router;
