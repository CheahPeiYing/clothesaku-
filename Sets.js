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

export default class Sets extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      setNameModal: false,
      setName: '',
      mySets: [],
      deleteItemModal: false,
      deletedItemIndex: 0
    }

  }

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {

      const getMySets = firebase.database().ref(username + '/sets');
      getMySets.on('child_added', function(data){

        const getData = data.val();

        this.state.mySets.push({
          name: getData.setName,
          images: getData.images,
          setID: data.key
        });

        this.setState({
          mySets: this.state.mySets
        });

      }.bind(this));

      this.setState({
        username: username,
      });

    });
  }


  renderItem = ({item, index}) => {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').width / 3, width: Dimensions.get('window').width / 3, backgroundColor: 'white', borderWidth: 5, borderColor: '#FFD140'}}>
        <TouchableHighlight
          underlayColor="transparent"
          onLongPress={()=>{
            this.setState({
              deleteItemModal: true,
              setID: item.setID,
              deletedItemIndex: index
            })
          }}
          onPress={()=>{
            const { navigate } = this.props.navigation;

            navigate('ViewSet', {data: item});
          }}
        >
          <View style={{justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').width / 3, width: Dimensions.get('window').width / 3}}>
            <Text style={{fontSize: 15}}>
              {item.name}
            </Text>
          </View>
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
           visible={this.state.deleteItemModal}
           onRequestClose={() => this.setState({deleteItemModal: false})}
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
                       deleteItemModal: false,
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
                     const deleteItem = firebase.database().ref(this.state.username + '/sets/' + this.state.setID);
                     deleteItem.set(null);
                     this.state.mySets.splice( this.state.deletedItemIndex, 1);
                     this.setState({
                       mySets: this.state.mySets,
                       deleteItemModal: false
                     });
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
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Outfits
          </Text>
        </View>
        <FlatList
          numColumns={3}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.mySets}
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
    backgroundColor: '#FFD140',
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
