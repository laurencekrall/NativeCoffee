
import React, {Component, useState} from 'react';
import { View, Image, ImageSourcePropType, Text, TextInput, ActivityIndicator } from 'react-native';
import { number } from 'prop-types';
import { styleColors } from '../styles/styles';
import ProductSeachResult from '../../DTO/ProductSearchResult';

const RateProductForm : React.FC<{product : ProductSeachResult, onFormSubmit : (id : number, rating : number) => Promise<boolean>, goBack : () => void}> = (props) => {
    
    let [rating, setRating] = useState(0);
    let [responseMessage, setResponseMessage] = useState('');
    let [loading, setLoading] = useState(false);

    const setNumberRating = (value : string) => {
        let numberVal = Number.parseFloat(value);
        if(!isNaN(numberVal)){
            if(numberVal >= 1 && numberVal <= 5){
                setRating(numberVal);
            }
        }
    }
    const formValid = () => {
        return rating > 0;
    }

    const submitForm = () => {
        if(formValid){
            setLoading(true);
            props.onFormSubmit(props.product.id, rating)
            .then( x => {                    
                    setResponseMessage(x.toString());
                    setLoading(false);
                }
            )
            .catch((error) => {
                setLoading(false);
            })
        }
    }
    const valid = formValid();
    return(        
        <View style={{padding : 10}}>        
            {props.product.referenceImages.length > 0 && <Image style={{width : "100%", aspectRatio : 1}} source={{uri : props.product.referenceImages[0]}} />}

            {loading ? <ActivityIndicator size="large" color={styleColors.blue} /> : 
            <>
                <Text onPress={props.goBack} style={{backgroundColor : styleColors.red, color : 'white'}}>Back</Text>         
                <View style={{padding : 10}}>
                    {responseMessage.length > 0 && <Text>{responseMessage}</Text>}
                    <Text>Product Name</Text>
                    <TextInput style={{height : 40, borderColor : 'grey', borderWidth : 1, margin : 10}} value={props.product.productName} />

                    <Text style={{marginTop : 10}}>Product Rating</Text>
                    <TextInput style={{height : 40, borderColor : 'grey', borderWidth : 1, margin : 10}} value={rating.toString()} onChangeText={setNumberRating} />
                </View>
                <Text onPress={valid ? submitForm : undefined} style={valid ? {backgroundColor : styleColors.orange, color : 'white'} : {backgroundColor : '#ccc'}}>Submit</Text>
            </>
        }            
        </View>
    );
}

export default RateProductForm;
