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
  FlatList,
  AsyncStorage,
  TouchableHighlight,
  Image,
  Dimensions,
  Modal,
  TextInput
} from 'react-native';

import * as firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SelectGarments extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      mySets: [],
      removeItemModal: false
    }

  }

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {
      this.setState({
        username: username,
      });

    });
  }


  renderItem = ({item, index}) => {
      return(
        <View style={{borderWidth: 5, borderColor: 'transparent'}}>
          <TouchableHighlight
            onLongPress={()=>{
              this.setState({
                itemIndex: index,
                removeItemModal: true
              })
            }}
          >
            <Image
              source={{uri: item}}
              style={{height: Dimensions.get('window').width / 2, width: Dimensions.get('window').width / 2}}
            />
        </TouchableHighlight>
        </View>
      )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <Modal
           hardwareAccelerated={true}
           animationType={"fade"}
           transparent={true}
           visible={this.state.removeItemModal}
           onRequestClose={() => this.setState({removeItemModal: false})}
           >
           <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex:1, justifyContent: 'center', alignItems: 'center' }}>
             <View style={{width: 300, borderRadius: 5, backgroundColor:'white', elevation: 4, padding: 15, justifyContent:'center', alignItems: 'center'}}>
               <Text style={{fontSize: 18, fontWeight: 'bold', color: '#2196f3'}}>
                 Delete Item
               </Text>
               <View style={{flexDirection: 'row'}}>
                 <TouchableHighlight
                   onPress={()=>{
                     this.setState({
                       removeItemModal: false,
                     })
                   }}
                 >
                   <Text>
                     Cancel
                   </Text>
                 </TouchableHighlight>
                 <View style={{width: 30, backgroundColor: 'transparent'}}></View>
                 <TouchableHighlight
                   onPress={()=>{
                     this.setState({
                       removeItemModal: false
                     });
                     const deleteItem = firebase.database().ref(this.state.username + '/sets/' + this.props.navigation.state.params.data.setID + '/images/' + this.state.itemIndex);
                     deleteItem.set(null);
                     const { navigate } = this.props.navigation;
                     navigate('Sets')
                   }}
                 >
                   <Text>
                     OK
                   </Text>
                 </TouchableHighlight>
               </View>
             </View>
           </View>
         </Modal>

        <View style={{height: 80, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>
            {this.props.navigation.state.params.data.name}
          </Text>
        </View>
        <FlatList
          numColumns={2}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.props.navigation.state.params.data.images}
          renderItem={this.renderItem}
        />

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
