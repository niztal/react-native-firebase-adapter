import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  NativeModules
} from 'react-native';

import SignIn from './signin';
import SignInAnonymously from './anonymous';
import SignUp from './signup';
import FacebookLogin from './facebookLogin';

import Dimensions from 'Dimensions';
const windowSize = Dimensions.get('window');

export default class Login extends Component {
  
    navToSignUp() {
        this.props.navigator.push({
            id: "signup"
        });
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
                    <View style={styles.header}>
                        <Image style={styles.mark} source={{uri: 'https://cdn4.iconfinder.com/data/icons/google-i-o-2016/512/google_firebase-256.png'}} />
                    </View>
                
                <SignIn navigator={this.props.navigator} />
                <FacebookLogin navigator={this.props.navigator}/>
                <View style={styles.signup}>
                    <Text style={styles.greyFont}>Don't have an account?<Text style={styles.whiteFont} onPress={this.navToSignUp.bind(this)}> Sign Up</Text></Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.greyFont}>Or</Text>
                </View>
                <SignInAnonymously navigator={this.props.navigator} />
                
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
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center'
    },
      signup: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .15,
        marginTop: 40
      },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
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
    whiteFont: {
      color: '#FFF'
    }
})

module.exports = Login;