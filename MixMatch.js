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
  Modal,
  Image,
  Dimensions,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
  FlatList,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import * as firebase from "firebase";

export default class MixMatch extends Component<{}> {

  static navigationOptions = {
    header: null
  };

  constructor(props){
    super(props);

    this.state = {
      username: '',
      useremail: '',
      verticals: [],
      activeSlide: 0,
      selectCategoryModal: false,
      myCategories: [],
      selectedSlides: [],
      collectionList: []
    }

  }

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {
      this.setState({
        username: username
      })
      const getMyCategories = firebase.database().ref(username + '/categories');
      getMyCategories.on('child_added', function(data){
        const getData = data.val();
        this.state.myCategories.push({
          categoryName: getData.categoryName,
          categoryID: data.key
        });
        this.setState({
          myCategories: this.state.myCategories
        })
      }.bind(this))
    })
  }


  addNewHorizontalList = (data) => {
    this.state.verticals.push({
      images: data
    });
    this.state.selectedSlides.push(data[0]);
    this.setState({
      verticals: this.state.verticals,
      selectedSlides: this.state.selectedSlides
    })
  }

  renderHorizons = ({item, index}) => {
    return(
      <View style={{height: 100, width: 100, backgroundColor: 'white' }}>
        <Image
          source={{uri: item}}
          style={{height: 100, width: 100}}
        />
      </View>
    )
  }

  renderVerticals = ({item, index}) => {
    return(
      <View style={{height: 100}}>
        <Carousel
          inactiveSlideOpacity={0.2}
          inactiveSlideScale={1}
          data={item.images}
          renderItem={this.renderHorizons}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={100}
          inactiveIndicatorColor='white'
          onSnapToItem={(slideNumber) => {
            this.state.selectedSlides[index] = item.images[slideNumber];
            this.setState({
              selectedSlides: this.state.selectedSlides
            })
          }}
        />
      </View>
    )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={{height: 80, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Mix and Match
          </Text>
        </View>

        <View style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 15}}>
            Select garment category
          </Text>
        </View>

        <Modal
            hardwareAccelerated={true}
            animationType={"fade"}
            transparent={true}
            visible={this.state.selectCategoryModal}
            onRequestClose={() => this.setState({selectCategoryModal: false})}
            >
            <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex:1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{width: 250, borderRadius: 5, backgroundColor:'white', elevation: 4, padding: 15, justifyContent:'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#565656'}}>
                  Choose your category
                </Text>


                <View>
                  {this.state.myCategories.map(function(i, key){
                    return(
                      <View key={key}>
                        <TouchableHighlight
                          onPress={()=>{
                            // navigate('SelectGarments', {data: i, addNewHorizontalList: this.addNewHorizontalList});
                            const getCollectList = firebase.database().ref(this.state.username + '/categories/' + i.categoryID + '/uploads');
                            getCollectList.on('child_added', function(data){
                              const getData = data.val();
                              this.state.collectionList.push(getData.url);
                              this.setState({
                                collectionList: this.state.collectionList
                              })
                            }.bind(this))

                            this.addNewHorizontalList(this.state.collectionList);
                            this.setState({
                              selectCategoryModal: false,
                              collectionList: []

                            })
                          }}
                          >

                            <View style={{backgroundColor:'#FFD140', width: 150, alignItems: 'center'}}>
                              <Text>
                                {i.categoryName}
                              </Text>
                            </View>
                          </TouchableHighlight>

                        </View>
                      )
                    }.bind(this))}
                  </View>
              </View>
            </View>
          </Modal>
        <FlatList
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.verticals}
          renderItem={this.renderVerticals}
        />
        <View style={{position: 'absolute', top: 22, right: 20, backgroundColor: 'white', borderRadius: 25, elevation: 2}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={()=>{
              if(this.state.verticals.length === 0){
                ToastAndroid.show(
                    'Collection is empty. Press "+" to add.',
                    ToastAndroid.LONG
                  )
              }else{
                navigate('MyMatches', {data: this.state.selectedSlides});
              }
            }}
          >
            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="check" size={18} color="black" />
            </View>
          </TouchableHighlight>
        </View>

        <View style={{position: 'absolute', top: 22, left: 20, backgroundColor: 'white', borderRadius: 25, elevation: 2}}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={()=>{
            this.setState({
              selectCategoryModal: true
            })
          }}
          >
            <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="plus" size={18} color="black" />
            </View>
          </TouchableHighlight>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center', height: 40, width: 40, position: 'absolute', right: 20, bottom: 20, backgroundColor: '#CCCCCC', borderRadius: 25, elevation: 2}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={()=>{
              this.setState({
                verticals: [],
                collectionList: [],
                selectedSlides: []
              })
            }}
          >
            <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="refresh" size={20} color="black" />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
