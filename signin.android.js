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
var windowSize = Dimensions.get('window');

const {FirebaseAuth} = NativeModules;

export default class SignIn extends Component {
    
    constructor(props){
        super(props);
        this.state = {
                    email: '',
                    password: ''
                    };  
    }
    
    signIn() {
        const {email} = this.state;
        const {password} = this.state;
        
        if(email && password)
            FirebaseAuth.signInWithEmailAndPassword(email, password, this.onSuccess.bind(this), this.onFailure.bind(this));
        else
            ToastAndroid.show('Please enter email and password', ToastAndroid.SHORT);
    }
    
    onSuccess() {
  
        this.props.navigator.push({
            id: 'message',
        });
    }
    
    onFailure(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    
    render() {
        return (
                    <View style={styles.inputs}>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
                            <TextInput 
                                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                placeholder="Email"
                                placeholderTextColor="#FFF"
                                keyboardType = "email-address"
                                value={this.state.email}
                                onChangeText = {(email) => this.setState({email})}
                            />
                        </View>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                        <TextInput
                            secureTextEntry = {true}
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            placeholder="Pasword"
                            placeholderTextColor="#FFF"
                            value={this.state.password}
                            onChangeText = {(password) => this.setState({password})}
                        />
                    </View>
                <TouchableNativeFeedback onPress={this.signIn.bind(this)}>
                    <View style={styles.signin}>
                        <Text style={styles.whiteFont}>Sign In</Text>
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
    whiteFont: {
      color: '#FFF'
    }
})

module.export = SignIn;