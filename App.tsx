import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { declareExportAllDeclaration, declareTypeAlias } from '@babel/types';
const vision = require('@google-cloud/vision');

const productSearchClient = new vision.ProductSearchClient({keyFilename : './token.json'});
const imageAnnotatorClient = new vision.ImageAnnotatorClient({keyFilename : './token.json'});


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
export default class App extends Component<Props, {pictureUrl : string}> {

  constructor(props : any) {
    super(props);

    this.state = {
      pictureUrl : ""
    }
  }

  camera : any;

renderImage() {
  return (
    <View>
      <Image
        source={{ uri: this.state.pictureUrl }}
        style={styles.preview}
      />
      <Text
        style={styles.cancel}
        onPress={() => this.setState({ pictureUrl: "" })}
      >Cancel
      </Text>
      <Text style={styles.welcome}>{this.state.pictureUrl}</Text>        
    </View>
  );
}
  render() {
    if(this.state.pictureUrl.length > 0){
      return this.renderImage();
    }
    else{
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Laurence K</Text>
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

    var result = await this.getSimilarProductsFile(
      "ninth-terminal-245420",
      "europe-west1",
      "1",
      "packagedgoods-v1",
      "",
      data.base64)
      
    this.setState({pictureUrl : data.uri })
    console.log(data.uri);
  };

   getSimilarProductsFile = async (
    projectId : string,
    location : string,
    productSetId : string,
    productCategory : string,
    filter : any,
    base64? : any,
  ) => {
    // Imports the Google Cloud client library
    // const vision = require('@google-cloud/vision');
    // const fs = require('fs');
    // // Creates a client
    // const productSearchClient = new vision.ProductSearchClient();
    // const imageAnnotatorClient = new vision.ImageAnnotatorClient();
  
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const projectId = 'nodejs-docs-samples';
    // const location = 'us-west1';
    // const productSetId = 'indexed_product_set_id_for_testing';
    // const productCategory = 'apparel';
    // const filePath = './resources/shoes_1.jpg';
    // const filter = '';
    const productSetPath = productSearchClient.productSetPath(
      projectId,
      location,
      productSetId
    );
    //const content = fs.readFileSync(filePath, 'base64');
    const request = {
      // The input image can be a GCS link or HTTPS link or Raw image bytes.
      // Example:
      // To use GCS link replace with below code
      // image: {source: {gcsImageUri: filePath}}
      // To use HTTP link replace with below code
      // image: {source: {imageUri: filePath}}
      image: {content: base64},
      features: [{type: 'PRODUCT_SEARCH'}],
      imageContext: {
        productSearchParams: {
          productSet: productSetPath,
          productCategories: [productCategory],
          filter: filter,
        },
      },
    };
    const [response] = await imageAnnotatorClient.batchAnnotateImages({
      requests: [request],
    });
    const results = response['responses'][0]['productSearchResults']['results'];
    console.log('\nSimilar product information:');
    results.forEach( (result : any) => {
      console.log('Product id:', result['product'].name.split('/').pop(-1));
      console.log('Product display name:', result['product'].displayName);
      console.log('Product description:', result['product'].description);
      console.log('Product category:', result['product'].productCategory);
    });
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    height: 400,
    width: 400
  },
  cancel: {    
    backgroundColor: '#ccc',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  }
});