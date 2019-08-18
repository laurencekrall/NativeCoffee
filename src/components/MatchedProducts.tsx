
import React, {Component} from 'react';
import ProductSearchResult from '../../DTO/ProductSearchResult';
import { View, Image, ImageSourcePropType, Text } from 'react-native';

const MatchedProduct : React.FC<ProductSearchResult> = (props) => {
    
    return(
    <View style={{backgroundColor : "#cecece", width : "50%"}}>
        <Text>Name : {props.productName}</Text>
        <Text>Score : {props.score}</Text>
        {props.referenceImages && props.referenceImages.length > 0 && <Image style={{width : "100%", aspectRatio : 1}} source={{uri : props.referenceImages[0]}} />}
    </View>
    );
}

export default MatchedProduct;
