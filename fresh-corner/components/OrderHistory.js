import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
} from "react-native";
import axios from "axios";
import Axios from "axios";

const OrderHistory = ({ route: { params }, navigation: { navigate } }) => {

  const [orderData, setOrderData] = React.useState({ data: [] });
  //console.log('Orderlist from order history', orderData.data)

  let OrderList= async ()=>{

try {
  /*======== Axios Get to fetch all orders in a specific customer(logged in customer)  ========*/
  let result = await Axios.get("/customers/orderlist")

  console.log('from order list axios result', result);
  console.log('After set state ======', result.data.ProdList);
  setOrderData((ps)=>{return {...ps, data :result.data.ProdList}});
  console.log('After set state =======', result.data.ProdList);
} catch (error) {
  +  

  console.log(error);
}

  }
/*======== use effect call both after the first render and after every update  ========*/
useEffect(() => {
  OrderList();
}, []);

const farmerRate =()=>{
  navigate('FARMRATE')
}

  return (

    <View style={styles.container}>
      <Text style={{color:'brown', margin:20, fontSize:20, fontFamily:'timenewroman'}}>Your Orders So Far!</Text>
      <>
        <FlatList
          data={orderData.data}
          renderItem={({ item }) => (
           
              <View style={styles.farmers}>
                <Text>{item.prodName}</Text>
              </View>
           
          )}
          keyExtractor={(item) => {
            item._id;
          }}
        />
      </>
      <View>
      <TouchableOpacity style={styles.button} onPress={() => farmerRate()}>
        <Text>Rate Farmer</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
     
  
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    justifyContent: "center",
    padding: 30,
  },
  farmers: {
    marginTop: 24,
    padding: 40,
    backgroundColor: "white",
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: "center",
    color:"brown",
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
export default OrderHistory;
