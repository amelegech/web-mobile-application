import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  AsyncStorage,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { set } from "react-native-reanimated";

const Cart = ({ route: { params }, navigation: { navigate } }) => {
  const farmerid = params.data;
  //console.log("from Cart component param " ,farm);

  const [cartState, setCartState] = React.useState({ data: [] });
  const [totalState, setTotalState] = React.useState(0);
  let totalPrice = 0;
  
  const getcart = async () => {
    /**Need to get Token */
   let myToken = await AsyncStorage.getItem("token");
    console.log('from get cart ....', myToken);

    /*======== Axios fetch  to GET carts list =========*/
    const cartItems = await axios.get("/customers/carts", {
     headers: { Authorization: myToken }
});

    console.log("from grt cart===== ", cartItems);
    /**Set the state  */
    setCartState({ ...cartState, data: cartItems.data.data.products });
    console.log("STATE CART ", cartState.data);

    // console.log("from cart storage cart items....", cartItems.data.data.products);
    // console.log('erorr from get cat', error.message);

  };

   /*======== use effect call both after the first render and after every update  ========*/
  useEffect(() => {
    getcart();
  }, []);

  // const GoToCheckout = () => {
  //   navigate("CHECKOUT");
  // };

  
  const makeMyOrder = async () => {
    //console.log("from post order",);
    try {
      console.log("send order from checkout");
      let token = await AsyncStorage.getItem("token");
      console.log("token from make order", token);
      const config = {
        //headers: { "Content-Type": "application/json", Authorization: token },
      };
      // let body = JSON.stringify(cartState.data);
            let body = cartState.data
      console.log("order body--->", body);
   /*====== Axios Post  to send  cartsdata which is the list of products in the list as a Body & farmer Id to plase Order ======*/
      const orders = await axios.post("/customers/orders", {
        body,
        farmer: farmerid,
        headers:{Authorization: token}
      });
      console.log("axios orders result=====", orders);
      alert("seccessfully make order!");
    } catch (error) {
      console.log("from add to cart error", error.message);
    }
  };
  const checkOut =()=>{
    alert(`THANK YOU! YOU HAVE PAID `)
    console.log('from check out',totalPrice )
  }
  

const orderHistory =()=>{
  navigate('OrderHistory')
}



  /*======== To get total ptice make "total" variable globally =======*/
  //let total = 0;
  
  return (
    //<ImageBackground source={require('../assets/friutmix.jpg')}>
    <View style={styles.container}>
      <>
        {cartState.data ? (
          <>
            <Text style={styles.title}> Your total price is:{totalState}</Text>
            <FlatList
              style={styles.carts}
              data={cartState.data}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                 let totalPrice = 0;
                totalPrice += item.price;
                 setTotalState(totalPrice);
                 console.log("Total inside Flatlist",totalPrice )
                  
                return (
                  <View>
                   <Text>{item.prodName}</Text>
                    <Text>{item.price}</Text>
                <Text></Text>
                  </View>
                );
              }}
            />
          </>
        ) : (
          <Text>NO ITEMS FOUND</Text>
        )}
      </>

      <TouchableOpacity style={styles.button} onPress={() => makeMyOrder()}>
        <Text>Make Order</Text>
      </TouchableOpacity>
      <View>
      <TouchableOpacity
        style={styles.button}
         onPress={()=>checkOut()}>
                
         <Text>Pay</Text>
        </TouchableOpacity>  
      </View>
      <View>
      <TouchableOpacity style={styles.button} onPress={() => orderHistory()}>
        <Text>Order List</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    padding: 30,
  },
  carts: {
    marginTop: 24,
    padding: 20,
    backgroundColor: "white",
    fontSize: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: "center",
    color: "brown",
    fontFamily:'timenewroman'
  },
 
  button: {
    padding: 8,
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center',
    height: 50,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'aqua' 
},
});
export default Cart;

