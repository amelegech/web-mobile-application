const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller');
const superController = require('../controller/superUser.controller');
const  {protect} = require('../middleware/customer-Auth');
const  {authorize} = require('../middleware/authorazation');
/**
 *@swagger
 * /customers/login:
 *   post:
 *      description : Customer can Login If he/she has Token. 
 *      responses:
 *        "200":
 *            description : Customor Logged In Successesfully 
 *        "401":
 *            description : Unauthorized Request
 
 */
router.post('/login', customerController.customerLogin);
/**
 *@swagger
 * /customers/signup:
 *   post:
 *      description : New Customer Regstration. 
 *      responses:
 *        "201":
 *            description : Customor successfuly Created. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.post('/signup', customerController.customerSignup);
/**
 *@swagger
 * /customers/farmer:
 *   get:
 *      description : Customer Can See All The Farmers In The List. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/farmer', customerController.getFarmList);
/**
 *@swagger
 * /customers/farmer/:farmer_id:
 *   get:
 *      description : Customer Can get all the products  by using specific Farmer id. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/farmer/:farmer_id', protect, customerController.getProductsList);

/**
 *@swagger
 * /customers/addcarts:
 *   post:
 *      description : Customer Can select productes and Add in to his/her cart. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.post('/addcarts', protect, customerController.addCart); 

/**
 *@swagger
 * /customers/carts:
 *   get:
 *      description : Customer Can GET the list of the products in the cart. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/carts',protect, customerController.getcarts);

/**
 *@swagger
 * /customers/orders:
 *   post:
 *      description : Customer Can  Make/ pleas order and send to the farmer with "Pending" Status. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */

router.post('/orders', protect, customerController.makeOrder);


/**
 *@swagger
 * /customers/customerlist:
 *   get:
 *      description : Super User can GET all customers, update there password and can do activate & deactivate. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/customerlist',  superController.getAllCustomers);
//router.get('/customerlist', authorize('Admin'), superController.getAllCustomers);

/**
 *@swagger
 * /customers/orderlist:
 *   get:
 *      description : Customer can GET all orders history. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.get('/orderlist', protect, customerController.getAllOrder);

/**
 *@swagger
 * /customers/active/:customerid:
 *   patch:
 *      description : Super user can UPDATE or change the customers satatus by using the specific customer id . 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.patch('/active/:customerid', protect, superController.changeCustomerStatus);

/**
 *@swagger
 * /customers/password/:customerid:
 *   patch:
 *      description : Super user can UPDATE or change the specific customer password by using id. 
 *      responses:
 *        "200":
 *            description : successful response. 
 *        "401":
 *            description : Unauthorized Request
 *        "500":
 *            description :  Internal Server Error
 
 */
router.patch('/password/:customerid',protect, superController.reSetCustomerPasswords);



module.exports = router;