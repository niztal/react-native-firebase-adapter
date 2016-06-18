/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Navigator
} from 'react-native';
import Login from './login';
import SignUp from './signup';
import Message from './message';

export default class HomePage extends Component {
  
  render() {
    return (
        <Navigator
          style={ styles.container }
  		    renderScene={ this.renderScene }
  		    initialRoute={{ id: 'first' }}
        />
    );
  }
  
  renderScene(route, navigator) {
    switch(route.id){
      case 'signup':
        return (<SignUp navigator={navigator} />);
      case 'message':
        return (<Message />);
      default:
        return (<Login navigator={navigator} />);
    }
  }
}

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    }
});



AppRegistry.registerComponent('HomePage', () => HomePage);
