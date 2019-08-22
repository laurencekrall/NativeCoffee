
import React, {Component, useState} from 'react';
import { View, Image, ImageSourcePropType, Text, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { number } from 'prop-types';
import { styleColors } from '../styles/styles';

const NewProductForm : React.FC<{localImageUri : string, onFormSubmit : (name : string, rating : number) => Promise<number>, goBack : () => void}> = (props) => {
    
    let [productName, setProductName] = useState('');
    let [rating, setRating] = useState('');
    let [responseMessage, setResponseMessage] = useState('');
    let [loading, setLoading] = useState(false);

    const getNumberRating = (number : string) => {
        var numberVal = Number.parseFloat(number);
        if(!isNaN(numberVal)){
            if(numberVal >= 1 && numberVal <= 5){
                return numberVal;
            }
        }
        return 0;
    }

    const formValid = () => {
        return productName.length > 0 && getNumberRating(rating) != 0
    }

    const submitForm = () => {
        if(formValid){
            setLoading(true);
            props.onFormSubmit(productName, getNumberRating(rating))
            .then( x => {                    
                    setResponseMessage(x.toString());
                    setLoading(false);
                }
            )
            .catch((error) => {
                setLoading(false);
            })
        }
        else{
            setResponseMessage('Form invalid. Check number');
        }
    }
    const valid = formValid();
    return(        
        <ScrollView style={{padding : 10}}>        
            <Image style={{width : "100%", aspectRatio : 1}} source={{uri : props.localImageUri}} />

            {loading ? <ActivityIndicator size="large" color={styleColors.blue} /> : 
            <>
                <Text onPress={props.goBack} style={{backgroundColor : styleColors.red, color : 'white'}}>Back</Text>         
                <View style={{padding : 10}}>
                    {responseMessage.length > 0 && <Text>{responseMessage}</Text>}
                    <Text>Product Name</Text>
                    <TextInput style={{height : 40, borderColor : 'grey', borderWidth : 1, margin : 10}} value={productName} onChangeText={setProductName} />

                    <Text style={{marginTop : 10}}>Product Rating</Text>
                    <TextInput style={{height : 40, borderColor : 'grey', borderWidth : 1, margin : 10}} value={rating.toString()} onChangeText={setRating} />
                </View>
                <Text onPress={valid ? submitForm : undefined} style={valid ? {backgroundColor : styleColors.orange, color : 'white'} : {backgroundColor : '#ccc'}}>Submit</Text>
            </>
        }            
        </ScrollView>
    );
}

export default NewProductForm;
