import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  ToastAndroid,
  TouchableOpacity ,
  Image,
  NativeModules
} from 'react-native';

import Dimensions from 'Dimensions';
var windowSize = Dimensions.get('window');

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

const {FirebaseAuth} = NativeModules;

export class FacebookLogin extends Component {
    
    
    constructor(props) {
        super(props);
    }
    
    handleLogin(error, result){
        if(error)
            ToastAndroid.show('Login failed!');
        else{
            
            AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    FirebaseAuth.handleFacebookAccessToken(data.accessToken.toString(), this.onSuccess.bind(this), this.onFailure.bind(this));
                  }
                );
            
        }
    }
    
    onSuccess() {
        this.props.navigator.push({
            id: 'message',
        });
    }
    
    onFailure(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    
    signout() {
        FirebaseAuth.signOut();
        this.props.navigator.pop();
    }
    
    render() {
        return ( 
            
            <View style={styles.fb}>
                <LoginButton
                    publishPermissions={["publish_actions"]}
                    onLoginFinished={(error, result) => this.handleLogin(error, result)}
                    onLogoutFinished={() => this.signout()}/>
            </View>
        ); 
    }
}

var styles = StyleSheet.create({
  fb: {
      width: 48,
      height: 48,
      marginTop: 50,
      justifyContent: 'center',
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
});

module.exports = FacebookLogin;