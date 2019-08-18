import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ActivityIndicator} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { declareExportAllDeclaration, declareTypeAlias } from '@babel/types';
import axios, {AxiosResponse, AxiosError} from 'axios';
import ImageRequest from './DTO/ImageRequest';
import ProductSeachResult from './DTO/ProductSearchResult';
import MatchedProduct from './src/components/MatchedProducts';
import styles, { styleColors } from './src/styles/styles';
import ShowImageResult from './src/components/ShowImageResult';
import NewProductForm from './src/components/NewProductForm';
import CreateRateableRequest from './DTO/CreateRateableRequest';

const apiUrl = "https://laurenceazure.azurewebsites.net/api";

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  ><Text>Waiting</Text></View>
);


interface Props {}
export default class App extends Component<Props,
{
  showForm : boolean, 
  pictureUrl : string, 
  base64 : string, 
  addWasSuccess : boolean, 
  productResults : 
  ProductSeachResult[], 
  errorText : string
}>{

  constructor(props : any) {
    super(props);

    this.state = {
      pictureUrl : "",
      productResults : [],
      errorText : "",
      showForm : false,
      base64 : '',
      addWasSuccess : false
    }
  }

  camera : any;

  clearLastPicture = () => {
    this.setState({ pictureUrl: "" });
  }
  showNewProductForm = () => {
    this.setState({ showForm : true })
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

  render() {
    if(this.state.showForm && this.state.pictureUrl.length > 0){
      return <NewProductForm localImageUri={this.state.pictureUrl} onFormSubmit={this.saveNewProduct} goBack={() => this.setState({showForm : false})}  />
    }
    else if(this.state.pictureUrl.length > 0){
      return <ShowImageResult {...this.state} clearLastPicture={this.clearLastPicture}  saveAsNewProduct={this.showNewProductForm} />
    }
    else{
      return (
        <View style={styles.container}>
          <RNCamera captureAudio={false} ref={(ref : any) => { this.camera = ref; }} style={{ flex: 1, width: '100%', justifyContent : 'flex-end'}} >{({ camera, status, recordAudioPermissionStatus }) => {
              if (status !== 'READY') return <PendingView />;
              return (
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}>SNAP</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </RNCamera>
        </View>
      );
    }
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
  
}
