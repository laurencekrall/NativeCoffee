import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { declareExportAllDeclaration } from '@babel/types';

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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Laurence K</Text>
        <RNCamera captureAudio={false} ref={(ref : any) => { this.camera = ref; }} style={{ flex: 1, width: '100%'}} >{({ camera, status, recordAudioPermissionStatus }) => {
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

  takePicture = async (camera : RNCamera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    this.setState({pictureUrl : data.uri })
    console.log(data.uri);
  };

  
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
});