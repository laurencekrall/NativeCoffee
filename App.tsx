import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ActivityIndicator} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { declareExportAllDeclaration, declareTypeAlias } from '@babel/types';
import axios, {AxiosResponse, AxiosError} from 'axios';
import ImageRequest from './DTO/ImageRequest';
import ProductSeachResult from './DTO/ProductSearchResult';
import RateProductRequest from './DTO/RateProductRequest';
import MatchedProduct from './src/components/MatchedProducts';
import styles, { styleColors } from './src/styles/styles';
import ShowImageResult from './src/components/ShowImageResult';
import NewProductForm from './src/components/NewProductForm';
import CreateRateableRequest from './DTO/CreateRateableRequest';
import PendingView from './src/components/PendingView';
import CameraScreen from './src/components/CameraScreen';
import RateProductForm from './src/components/RateProductForm';

const apiUrl = "https://laurenceazure.azurewebsites.net/api";



interface Props {}
export default class App extends Component<Props,
{
  location : string, 
  pictureUrl : string, 
  base64 : string, 
  addWasSuccess : boolean, 
  rateWasSuccess : boolean, 
  productResults : ProductSeachResult[], 
  currentEditProduct? : ProductSeachResult
  errorText : string
}>{

  constructor(props : any) {
    super(props);

    this.state = {
      pictureUrl : "",
      productResults : [],
      errorText : "",
      location : '',
      base64 : '',
      addWasSuccess : false,
      rateWasSuccess : false, 
      currentEditProduct : undefined
    }
  }

  clearLastPicture = () => {
    this.setState({ pictureUrl: "" });
  }
  showNewProductForm = () => {
    this.setState({ location : 'showForm' })
  }

  takePicture = async (camera : RNCamera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);  
    
    data.base64 && this.getMatches(data.base64);
    
    this.setState({pictureUrl : data.uri, base64 : data.base64 ? data.base64 : '', productResults : [] })
    console.log(data.uri);
  };
  
  getMatches(base64 : string){
    var request : ImageRequest = {
      base64Image : base64
    };
    let promise = axios.post(`${apiUrl}/image/GetSimilar`, request).then(
      (x : AxiosResponse<ProductSeachResult[]>) => {
          this.setState({productResults : x.data});
          console.log(JSON.stringify(x.data));
      }).catch( (error : AxiosError) => {
        this.setState({errorText : error.message})
        console.log(error);
      });
  }
  
  saveNewProduct = (name : string, rating : number) => {
    let fileName = `${encodeURI(name.replace(/\s/g, ''))}.png`;

    let request : CreateRateableRequest = {
      base64Image : this.state.base64,
      name : name,
      fileName : fileName,
      rating : rating
    }

    let promise = axios.post(`${apiUrl}/image/Add`, request).then(
      (x : AxiosResponse<number>) => {
          this.setState({addWasSuccess : x.data > 0});
          console.log(JSON.stringify(x.data));
          return x.data;
      }).catch( (error : AxiosError) => {
        this.setState({errorText : error.message})
        console.log(error);
        return 0;
      });
      return promise;
  }

  showRateForm = (id : number) => {
    let item = this.state.productResults.find(x => x.id === id);
    if(item){
      this.setState({location : 'rateForm', currentEditProduct : {...item}})
    }
  }

  rateProduct = (id : number, rating : number) => {
    let request : RateProductRequest = {
      rating : rating
    }
    let promise = axios.post(`${apiUrl}/image/Rate/${id}`, request).then(
      (x : AxiosResponse<void>) => {
          this.setState({rateWasSuccess : true});
          return true;
      }).catch( (error : AxiosError) => {
        this.setState({rateWasSuccess : false})
        this.setState({errorText : error.message})
        console.log(error);
        return false;
      });
      return promise;
  }

  render() {
    if(this.state.location === 'rateForm' && this.state.currentEditProduct){
      return <RateProductForm product={this.state.currentEditProduct} onFormSubmit={this.rateProduct} goBack={() => this.setState({location : '', currentEditProduct : undefined})}  />
    }
    else if(this.state.location === 'showForm' && this.state.pictureUrl.length > 0){
      return <NewProductForm localImageUri={this.state.pictureUrl} onFormSubmit={this.saveNewProduct} goBack={() => this.setState({location : ''})}  />
    }
    else if(this.state.pictureUrl.length > 0){
      return <ShowImageResult {...this.state} clearLastPicture={this.clearLastPicture} rateItem={this.showRateForm} saveAsNewProduct={this.showNewProductForm} />
    }
    else{
      return (<CameraScreen takePicture={this.takePicture} /> )
    }
  }

}
