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

export default class SignUp extends Component {
    
    constructor(props){
        super(props);
        this.state = {
                        email: '',
                        password: ''
                     };    
    }
    
    signUp(){
        const {email} = this.state;
        const {password} = this.state;
        
        if(email && password) {
            
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(re.test(email)){
                FirebaseAuth.createUserWithEmailAndPassword(email, password, this.onSuccess.bind(this), this.onFailure.bind(this));
            }
            else{
                ToastAndroid.show('Invalid email!', ToastAndroid.SHORT);
            }
        }
        else{
            ToastAndroid.show('Please enter email and password', ToastAndroid.SHORT);
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
    
    render() {
        return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'https://s-media-cache-ak0.pinimg.com/736x/e8/48/3b/e8483bf0d259fd9ebf692e30f9d834ed.jpg'}} />
            <View style={styles.header}>
                    <Image style={styles.mark} source={{uri: 'http://www.clker.com/cliparts/I/i/d/F/6/B/white-question-mark-teal-background-hi.png'}} />
            </View>
            <Text style={styles.whiteFont}>Enter your email and password for signing up</Text>
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
                </View>
                <TouchableNativeFeedback onPress={this.signUp.bind(this)}>
                    <View style={styles.signup}>
                        <Text style={styles.whiteFont}>Sign Up</Text>
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
    },
    signup: {
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center'
    },
})

module.export = SignUp;