import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  FlatList,
  Image
} from "react-native";
import {MaterialCommunityIcons} from  "react-native-vector-icons"; 
import Icon from  "react-native-vector-icons/FontAwesome";
import axios from "axios";

const RateFarmer= (props) => {
  //let token = await AsyncStorage.getItem(token)
  const [farmData, setFarmData] = React.useState({ data: [] });
  const [farmRate, setFarmRate] = React.useState({rating: 0});
 //console.log("GET FARMER LIST--->", farmData.data);

  const getAllFarmers = async () => {
    try {
      /*=======Get the Token from asyncStorage ========*/
      let token = await AsyncStorage.getItem(token);
      console.log("ASYNC STORAGE =====", token);
      /*=======Axios Fetch to Get All Farmers ========*/
      let result = await axios.get("/customers/farmer", {
        headers: { Authorization: token },
      });
      console.log(" from web back =======", result);
      setFarmData(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  /*======== use effect  By default, it runs both after the first render and after every update  ========*/
  useEffect(() => {
    getAllFarmers();
  }, []);

/*=======Send singl farm data to get  product details to ProductsList component =====*/
    /* No Need to use this functionality in this component */
  const productDetail = (item) => {
    console.log("From farmers list  what is in the item", item);
    props.navigation.navigate("ProductsList", { data: item });
  };
/*=========Iterate in through farmData which is farmers array  send single farmer  ============ */
  return (
    <View style={styles.container}>
      <Text style={{color:'brown', margin:20, fontSize:20, fontFamily:'timenewroman'}}> Give Stars Rate Farmers</Text>
      <View>
        {farmData? (
        <FlatList
        style={styles.farmList}
        contentContainerStyle={styles.farmstyle}
          data={farmData}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => (
            <View>
              <View style={styles.farmers}>
                <Text>{item.farmName}</Text>
                <View style={styles.menuBox}>
                <Image style={styles.menuBox} source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSknAvcz_6xk6FbkgmRCPgw_j3KpNJ6nBUVUw&usqp=CAU'}}/>
                <Text >98% Like</Text>
              
              </View>
              <View>
              <View style={styles.stars}>
              {[1,2,3,4,5].map(i=>{
                return (
                  <TouchableOpacity 
                  onPress={()=> setFarmRate({...farmRate, rating:i})}
                  style={styles.starButton}
                  key={i}
                  >
                  <Icon name="star" size={15}
                  color={i<= farmRate.rating ?'green':'#cccccc'}
                  
                  />
                  </TouchableOpacity>
                )
              })}
    
            </View>
            </View>
            </View>
            </View>
          )}
          keyExtractor={(item) => {
            item._id;
          }}
        />
        ) : (
          <Text>Farmers List Not Found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    justifyContent: "center",
    padding: 15,
  },
  farmList: {
    paddingHorizontal: 5,
    backgroundColor:"#E6E6E6" 
  },
  farmstyle:{
    alignItems:'center'
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
  stars: {
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 5,
  },
  button: {
    height: 20,
    flexDirection: "row",
    backgroundColor: "blue",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "blue",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  menuBox:{
    backgroundColor: "#DCDCDC",
    width:85,
    height:60,
    alignItems: 'center',
    justifyContent: 'center',
     margin:8,
    shadowColor: 'black',
    padding:1,
    shadowOpacity: .2,
    shadowOffset: {
      height:2,
      width:-3
    },
    elevation:4,
  },
  icon: {
    width:20,
    height:20,
  },
  info:{
    fontSize:22,
    color: "#696969",
  }
 
});
export default RateFarmer;


