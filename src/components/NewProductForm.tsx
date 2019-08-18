
import React, {Component, useState} from 'react';
import { View, Image, ImageSourcePropType, Text, TextInput } from 'react-native';
import { number } from 'prop-types';
import { styleColors } from '../styles/styles';

const NewProductForm : React.FC<{localImageUri : string, onFormSubmit : (name : string, rating : number) => Promise<number>, goBack : () => void}> = (props) => {
    
    let [productName, setProductName] = useState('');
    let [rating, setRating] = useState(0);
    let [responseMessage, setResponseMessage] = useState('');

    const setNumberRating = (value : string) => {
        let numberVal = Number.parseFloat(value);
        if(!isNaN(numberVal)){
            if(numberVal >= 1 && numberVal <= 5){
                setRating(numberVal);
            }
        }
    }
    const formValid = () => {
        return productName.length > 0 && rating != 0
    }

    const submitForm = () => {
        if(formValid){
            props.onFormSubmit(productName, rating).then(
                x => {                    
                    setResponseMessage(x.toString())
                }
            )
        }
    }
    const valid = formValid();
    return(        
    <View style={{padding : 10}}>        
        <Image style={{width : "100%", aspectRatio : 1}} source={{uri : props.localImageUri}} />
        <Text onPress={props.goBack} style={{backgroundColor : styleColors.red, color : 'white'}}>Back</Text>         
        <View style={{padding : 10}}>
            {responseMessage.length > 0 && <Text>{responseMessage}</Text>}
            <Text>Product Name</Text>
            <TextInput style={{height : 40, borderColor : 'grey', borderWidth : 1, margin : 10}} value={productName} onChangeText={setProductName} />

            <Text style={{marginTop : 10}}>Product Rating</Text>
            <TextInput style={{height : 40, borderColor : 'grey', borderWidth : 1, margin : 10}} value={rating.toString()} onChangeText={setNumberRating} />
        </View>
        <Text onPress={valid ? submitForm : undefined} style={valid ? {backgroundColor : styleColors.orange, color : 'white'} : {backgroundColor : '#ccc'}}>Submit</Text>    
     
    </View>
    );
}

export default NewProductForm;
