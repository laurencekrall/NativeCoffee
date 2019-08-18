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

const apiUrl = "https://laurenceazure.azurewebsites.net/api";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

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
export default class App extends Component<Props, {pictureUrl : string, text : string[], productResults : ProductSeachResult[]}> {

  constructor(props : any) {
    super(props);

    this.state = {
      pictureUrl : "",
      text : ["no"],
      productResults : []
    }
  }

  camera : any;

  clearLastPicture = () => {
    this.setState({ pictureUrl: "" });
  }

renderImage() {
  return (
    <View>
      <Image
        source={{ uri: this.state.pictureUrl }}
        style={styles.preview}
      />
      <Text
        style={styles.cancel}
        onPress={this.clearLastPicture}
      >Cancel
      </Text>
      <View style={{backgroundColor:"#0c0", width : "100%"}}>
        <Text style={styles.heading1}>Results</Text>
        {this.state.productResults.length == 0 ? <ActivityIndicator size="large" color={styleColors.blue} /> : this.state.productResults.map(x => <MatchedProduct {...x} key={x.productName} /> )}        
      </View>        
    </View>
  );
}
  componentDidMount(){
    // this.setState({ text: ["did mount"] }, () => {
    //   let promise = axios.get(`${apiUrl}/image`).then(
    //     (x: AxiosResponse<string[]>) => {
    //       this.setState({ text: x.data });
    //     }).catch((error: AxiosError) => {
    //       this.setState({ text: [error.message] })
    //       console.log(error);
    //     });
    //   promise.then(x => {
    //     this.setState({ text: [...this.state.text, "after call mount"] });
    //   })
    // });    
  }
  render() {
    if(this.state.pictureUrl.length > 0){
      return <ShowImageResult {...this.state} clearLastPicture={this.clearLastPicture} />
    }
    else{
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Laurence K</Text>
          {/* {this.state.text.map(x => <Text>{x}</Text>)} */}
          <RNCamera captureAudio={false} ref={(ref : any) => { this.camera = ref; }} style={{ flex: 1, width: '100%'}} >{({ camera, status, recordAudioPermissionStatus }) => {
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
        <Text style={styles.welcome}>{this.state.pictureUrl}</Text>
        </View>
      );
    }
  }

  takePicture = async (camera : RNCamera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);  
    
    data.base64 && this.getMatches(data.base64);
    
    this.setState({pictureUrl : data.uri, productResults : [] })
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
        this.setState({text : [error.message]})
        console.log(error);
      });
  }
  
}
