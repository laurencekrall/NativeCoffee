import { View, Text, ActivityIndicator, Image } from "react-native";
import styles, { styleColors } from "../styles/styles";
import React from "react";
import MatchedProduct from "./MatchedProducts";
import ProductSeachResult from "../../DTO/ProductSearchResult";

const ShowImageResult : React.FC<{ pictureUrl : string, productResults : ProductSeachResult[], clearLastPicture : () => void }> = (props) => 
<View>
    <Image
    source={{ uri: props.pictureUrl }}
    style={styles.preview}
    />
    <Text
    style={styles.cancel}
    onPress={props.clearLastPicture}
    >Cancel
    </Text>
    <View style={{backgroundColor:"#0c0", width : "100%"}}>
    <Text style={styles.heading1}>Results</Text>
    {props.productResults.length == 0 ? <ActivityIndicator size="large" color={styleColors.blue} /> : 
        props.productResults.map(x => <MatchedProduct {...x} key={x.productName} /> )}        
    </View>        
</View>

export default ShowImageResult;
