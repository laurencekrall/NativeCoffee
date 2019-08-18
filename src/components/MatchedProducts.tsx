
import React, {Component} from 'react';
import ProductSearchResult from '../../DTO/ProductSearchResult';
import { View, Image, ImageSourcePropType, Text } from 'react-native';

const MatchedProduct : React.FC<ProductSearchResult> = (props) => {
    
    return(
    <View style={{padding : 10}}>
        <View style={{padding : 10}}>
            <Text>Name : {props.productName}</Text>
            <Text>Score : {props.score}</Text>
            <Text>Rating : {props.ratings && props.ratings.reduce((a,b) => a + b, 0).toFixed(1)}</Text>
        </View>        
        {props.referenceImages && props.referenceImages.length > 0 && <Image style={{width : "100%", aspectRatio : 1}} source={{uri : props.referenceImages[0]}} />}
    </View>
    );
}

export default MatchedProduct;
