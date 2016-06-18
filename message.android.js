import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  ToastAndroid,
  Image,
  TextInput,
  TouchableNativeFeedback,
  NativeModules
} from 'react-native';

import Dimensions from 'Dimensions';
const windowSize = Dimensions.get('window');
const {FirebaseAuth} = NativeModules;
const {FirebaseDB} = NativeModules;

  
export default class Message extends Component{
    
    constructor(props){
        super(props);
        this.state = {message: ''};
    }
    
    /*
    Limitations: You can only set a value via the Firebase adapter by setting an object!
    */
    submit() {
        FirebaseDB.setValue('messages', {
            message:this.state.message
        }, this.onSuccess.bind(this), this.onFailure.bind(this));
    }
    
    onSuccess() {
        ToastAndroid.show('message submitted..', ToastAndroid.SHORT);    
    }
    
    onFailure() {
        ToastAndroid.show('error, please try again..', ToastAndroid.SHORT)
    }
    render() {
        return(
            <View style={styles.container}>
                <Image style={styles.bg} source={{uri: 'https://s-media-cache-ak0.pinimg.com/736x/41/e9/a1/41e9a196c7fae74b37b52de23b608bf5.jpg'}} />
                <View>
                    <Text>The message is : {this.state.submittedMessage}</Text>
                </View>
                
                <View style={styles.header}>
                <TextInput 
                                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                placeholder="Enter message"
                                placeholderTextColor="#000"
                                value={this.state.message}
                                onChangeText = {(message) => this.setState({message})}
                            />
                </View>
                
                 <TouchableNativeFeedback onPress={this.submit.bind(this)}>
                    <View style={styles.signin}>
                        <Text style={styles.blackFont}>Submit</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            
        );
    }
}

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    deleteImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 50,
        height: 50
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .5,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#00BCD4',
        padding: 20,
        alignItems: 'center'
    },
    delete: {
        padding: 10,
        alignItems: 'center'
    },
      signup: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .15
      },
    inputs: {
        marginTop: 10,
        marginBottom: 80,
        flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21
    },
    inputUsername: {
      marginLeft: 15,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 14
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    blackFont: {
      color: '#000',
      fontSize:20
    }
})

module.export = Message;