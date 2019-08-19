import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import styles, { styleColors, baseStyles } from "../styles/styles";
import React from "react";
import MatchedProduct from "./MatchedProducts";
import ProductSeachResult from "../../DTO/ProductSearchResult";

const ShowImageResult : React.FC<
    { 
        pictureUrl : string, 
        productResults : ProductSeachResult[], 
        clearLastPicture : () => void, 
        saveAsNewProduct : () => void, 
        rateItem : (id : number) => void 
    }> = (props) => {
    let row = 0;

    return(
        <ScrollView>
            <Image source={{ uri: props.pictureUrl }} style={styles.preview} />
            <Text style={styles.cancel} onPress={props.clearLastPicture} >Cancel</Text>
            <View style={{padding : 10, backgroundColor : styleColors.ivory}}>
                <Text style={{padding : 10, backgroundColor : styleColors.blue, color : '#fff'}} onPress={props.saveAsNewProduct}>Save as new product</Text>
            </View>
            <View style={{backgroundColor:"#ccc", width : "100%"}}>
            <Text style={styles.heading1}>Results</Text>
            {props.productResults.length == 0 ? <ActivityIndicator size="large" color={styleColors.blue} /> : 
                <View style={baseStyles.row}> 
                {props.productResults.map( (x, i) => {
                    let odd = i % 2 === 1;
                    if(!odd){
                        row++;
                    }
                    let oddRow = row % 2 === 1;

                    return(
                        <View key={x.productName} style={{...baseStyles.col6, ...baseStyles.square, height : 400, backgroundColor : (odd && oddRow) ? '#f2f2f2' : '#cecece'}} >
                            <MatchedProduct {...x} key={x.productName}  />
                            <Text onPress={() => props.rateItem(x.id)} style={{padding : 10, backgroundColor : styleColors.blue, color : 'white'}}>Rate</Text> 
                        </View>
                    )             
                })}      
                </View>  
            }
            </View>        
        </ScrollView>
    )}


export default ShowImageResult;
