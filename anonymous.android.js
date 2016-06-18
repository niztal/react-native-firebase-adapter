import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  ToastAndroid,
  NativeModules
} from 'react-native';

import Dimensions from 'Dimensions';
var windowSize = Dimensions.get('window');

const {FirebaseAuth} = NativeModules;

export class SignInAnonymously extends Component {
    
    constructor(props) {
        super(props);
    }
    
    signIn() {
        FirebaseAuth.signInAnonymously(this.onSuccess.bind(this), this.onFailure.bind(this));
    }
    
    onSuccess() {
        Alert.alert("Pay attention that you will be a guest!")
        this.props.navigator.push({
            id: 'message',
        });
    }
    
    onFailure() {
        ToastAndroid.show('Login failed!');
    }
    
    render() {
        return ( 
            <View style={styles.label}>
                <Text style={styles.whiteFont} onPress={this.signIn.bind(this)}>Sign In Anonymously</Text>
            </View>
        ); 
    }
}

var styles = StyleSheet.create({
  label: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
});

module.exports = SignInAnonymously;