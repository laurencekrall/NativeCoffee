import { StyleSheet } from "react-native";

export const styleColors = {
    blue : '#0A2342',
    red : '#D62828',
    orange : '#F6511D',
    yellow : '#FCBF49',
    ivory : '#EAE2B7'
}

export const baseStyles = StyleSheet.create({
    row : {
        flex : 1,
        flexDirection : 'row',
        flexWrap : 'wrap',
        alignItems : 'flex-start'
    },
    square : {
        aspectRatio : 1
    },
    col6 : {
        width : "50%"
    },
    col3 : {
        width : "25%"
    }
});

const styles = StyleSheet.create({
    heading1 : {
        color : styleColors.blue,
        fontSize : 18
    },
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

  export default styles;