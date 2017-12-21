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

export default class Advertisements extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      setNameModal: false,
      setName: '',
      myPosts: [],
      newImageModal: false,
      postImageURL: '',
      caption: ''
    }

  }

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {

      const getPosts = firebase.database().ref( username + '/posts/');
      getPosts.on('child_added', function(data){
        const getData = data.val();
        this.state.myPosts.push(getData)
        this.setState({
          myPosts: this.state.myPosts
        })
      }.bind(this))


      this.setState({
        username: username,
      });

    });
  }


  renderItem = ({item, index}) => {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').width, width: Dimensions.get('window').width, backgroundColor: 'white' }}>
          <View style={{padding: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={{uri: item.postImageURL}}
              style={{height: Dimensions.get('window').width - 10, width: Dimensions.get('window').width - 10}}
              resizeMode="contain"
            />
            <View style={{padding: 10}}>
              <Text>
                {item.caption}
              </Text>
            </View>
            <View style={{height: 20}}></View>
          </View>
          <View style={{height: 30}}></View>
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
           visible={this.state.newImageModal}
           onRequestClose={() => this.setState({newImageModal: false})}
           >
           <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex:1, justifyContent: 'center', alignItems: 'center' }}>
             <View style={{width: 300, borderRadius: 5, backgroundColor:'white', elevation: 4, padding: 15, justifyContent:'center', alignItems: 'center'}}>
               <Text style={{fontSize: 18, fontWeight: 'bold', color: '#2196f3'}}>
                 New Post
               </Text>
               <TextInput
                 underlineColorAndroid="transparent"
                 autoCapitalize="sentences"
                 autoCorrect={true}
                 style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
                 onChangeText={(postImageURL) => {
                   this.setState({
                       postImageURL,
                   });
                 }}
                 value={this.state.postImageURL}
                 placeholder="URL of your post"
               />
               <View style={{ height: 10}}></View>
               <TextInput
                 underlineColorAndroid="transparent"
                 autoCapitalize="sentences"
                 autoCorrect={true}
                 style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
                 onChangeText={(caption) => {
                   this.setState({
                       caption,
                   });
                 }}
                 value={this.state.caption}
                 placeholder="caption for your image"
               />
               <View style={{ height: 10}}></View>

               <View style={{flexDirection: 'row'}}>
                 <TouchableHighlight
                   onPress={()=>{
                     this.setState({
                       newImageModal: false,
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
                       newImageModal: false
                     });
                     if(this.state.postImageURL === '' && this.state.caption === ' '){
                       return;
                     }
                     const savePost = firebase.database().ref(this.state.username + '/posts/');
                     savePost.push({
                       postImageURL: this.state.postImageURL,
                       caption: this.state.caption
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
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Thanks for using our app.
            Here's what's in this season!
          </Text>
        </View>
        <FlatList
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.myPosts}
          renderItem={this.renderItem}
        />

        {this.state.username === 'Jessjess' ? (
          <View style={{alignItems: 'center', justifyContent: 'center', height: 40, width: 40, position: 'absolute', right: 20, bottom: 20, backgroundColor: '#CCCCCC', borderRadius: 25, elevation: 2}}>
            <TouchableHighlight
              underlayColor='transparent'
              onPress={()=>{
                this.setState({
                  newImageModal: true
                })
              }}
              >
                <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                  <Icon name="plus" size={20} color="black" />
                </View>
              </TouchableHighlight>
            </View>
        ) : null}

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
