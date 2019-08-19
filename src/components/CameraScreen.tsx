import { View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { RNCamera, FaceDetector } from 'react-native-camera';
import PendingView from "./PendingView";
import styles from "../styles/styles";


const CameraScreen : React.FC<{ takePicture : (camera : RNCamera) => void  }> = (props) => {

    let camera : RNCamera;

    return (
        <View style={styles.container}>
          <RNCamera captureAudio={false} ref={(ref : RNCamera) => { camera = ref; }} style={{ flex: 1, width: '100%', justifyContent : 'flex-end'}} >
          {({ camera, status, recordAudioPermissionStatus }) => {
              if (status !== 'READY') return <PendingView />;
              return (
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => props.takePicture(camera)} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}>SNAP</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </RNCamera>
        </View>
      );
}

export default CameraScreen;