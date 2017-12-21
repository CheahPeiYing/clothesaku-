/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  FlatList,
  TouchableHighlight,
  Modal,
  Image,
  TextInput,
  Dimensions
} from 'react-native';
import * as firebase from "firebase";
import GarmentsIcon from './images/garments_main.png';
import CreateIcon from './images/create_main.png';
import OutfitsIcon from './images/outfits_main.png';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class HomeScreen extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      showCameraGalleryModal: false
    }



  }

  static navigationOptions = {
   header: null
 };

 componentDidMount(){

   const { navigate } = this.props.navigation;

   AsyncStorage.getItem('username').then( (username) => {
     AsyncStorage.getItem('useremail').then( (useremail) => {
      if(useremail === null || username === null){
        navigate('Login');
      }else{
        this.setState({
          username: username,
          useremail: useremail
        });
      }
    })
  })
 }

  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container}>

        <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>
            Welcome
          </Text>

        </View>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={()=>{
            navigate('Garments')
          }}>
          <Image
            resizeMode="contain"
            source={GarmentsIcon}
            style={{height:Dimensions.get('window').width - 270 , width: Dimensions.get('window').width - 230 }}
          />
        </TouchableHighlight>
        <View style={{height: 15}}></View>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={()=>{
            navigate('MixMatch')
          }}>
          <Image
            resizeMode="contain"
            source={CreateIcon}
            style={{height:Dimensions.get('window').width - 270 , width: Dimensions.get('window').width - 230 }}
          />

        </TouchableHighlight>
          <View style={{height: 15}}></View>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={()=>{
            navigate('Sets')
          }}>
          <Image
            resizeMode="contain"
            source={OutfitsIcon}
            style={{height:Dimensions.get('window').width - 270 , width: Dimensions.get('window').width - 230 }}
          />

        </TouchableHighlight>


        <View style={{height: 100}}></View>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={()=>{
            AsyncStorage.clear();
            navigate('Login')
          }}
        >
          <Text>
            Sign Out
          </Text>
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
