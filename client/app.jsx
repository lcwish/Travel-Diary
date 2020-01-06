
import React from 'react';
import { Component } from "react";
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
// import mapDisplay from './components/testMapDisplay.jsx'
import MapDisplay from './components/mapDisplay.jsx';
import MarkerForm from './components/markerForm.jsx';
import ImageDisplay from './components/imageDisplay.jsx';
import MarkerInfoBox from './components/markerInfoBox.jsx';

//this one renders ya know the app.

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: [],
            userWhiteList: [],
            markerList: [{tag: 'food', location: {lat: 45, lng: 45}, description: 'this tag is a test of tags', imgURL: 'this is a URL '}],
            locationInfo: '',
            tagInfo: '',
            descriptionInfo: '',
            imgURL: '',
            searchTag: '',
            savedTag: '',
            whiteListUserInfo: '',
            clickedMarker: ''
    }
    this.onChange = this.onChange.bind(this);
    this.clickMap = this.clickMap.bind(this);
    this.clickMarker = this.clickMarker.bind(this);
    this.onSubmit= this.onSubmit.bind(this);
    this.buttonSubmit=this.buttonSubmit.bind(this);
    }
    
    
    clickMarker(e) {
        // console.log(e)
        // console.log( "Latitude: "+e.latLng.lat()+" "+", longitude: "+e.latLng.lng())
        let clickedMarker = [...this.state.markerList];
        clickedMarker = clickedMarker.filter((marker) => {
            return (marker.location.lat == e.latLng.lat() && marker.location.lng == e.latLng.lng())
        })
        this.setState({clickedMarker: clickedMarker[0]})
        // console.log('current saved marker' , this.state.clickedMarker)
    }
    clickMap(e) {
        
        // console.log( "Latitude: "+e.latLng.lat()+" "+", longitude: "+e.latLng.lng())
        let newMarker = {tag:'', location: {lat: e.latLng.lat(), lng:e.latLng.lng()}, description: ''}
        let newMarkerList = [...this.state.markerList]
        newMarkerList.push(newMarker);
        // console.log(newMarkerList)
        this.setState({markerList: newMarkerList})
        fetch('/addMarker', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({...newMarker, longitude: newMarker.location.lng, latitude: newMarker.location.lat}), // body data type must match "Content-Type" header
            //mode: 'cors', // no-cors, *cors, same-origins
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            //redirect: 'follow', // manual, *follow, error q q
            //referrerPolicy: 'no-referrer', // no-referrer, *client
            
          })
          .then((res)=> {
              console.log('inside post then', res)})

        ///works but in reality we should be doing fetch/post here instead of changing state

    }
    onChange(e) {
      //takes typed information and sets relevant state
      // console.log(e.target.value);
      this.setState({[e.target.name]: e.target.value},()=>{
          
        // console.log('after setState onChange', this.state.markerList);
      })
    }
    buttonSubmit(){
      this.setState({savedTag: this.state.searchTag, searchTag: ''},()=>{
        console.log(`savedTag`,this.state.savedTag);
        console.log(`searchTag`,this.state.searchTag);

      });
    }
    onSubmit(e) {
        //does stuff on forms submits
        //take the stored information and update the state   
        e.preventDefault();     
        const clicked = this.state.clickedMarker;
        let imgProps = '';
        let imgListVar = this.state.imgURL;
        console.log(this.state.imgURL)
        imgListVar = imgListVar.split('-');
        console.log('imglistvariable' , imgListVar)
        if (imgListVar[0]) {
            imgProps = imgListVar

            if (clicked.imgURL) {
            imgProps = imgListVar.concat(clicked.imgURL)
            }
        }
        console.log('before modified marker' ,this.state.descriptionInfo)
        const modifiedMarker = Object.assign(clicked, {tag: this.state.tagInfo || clicked.tag, description: this.state.descriptionInfo || clicked.description, imgURL: imgProps || clicked.imgURL});
        console.log('in submit showing modMarker' , modifiedMarker, modifiedMarker.description)
        let newMarkerList = [...this.state.markerList];
        newMarkerList = newMarkerList.filter((marker) => {
          return (marker.location.lat !== this.state.clickedMarker.location.lat || marker.location.lng !== this.state.clickedMarker.location.lng)
        })
        newMarkerList.push(modifiedMarker);
        this.setState({tagInfo: '', descriptionInfo: '', imgURL: '', clickedMarker: '', markerList: newMarkerList}, ()=>{
          console.log(`after setState for onsubmit`,this.state);
          console.log('before fetch-lng-lat: ' , modifiedMarker.location.lng, modifiedMarker.location.lat)
        });
        console.log('before fetch-lng-lat: ' , modifiedMarker.location.lng, modifiedMarker.location.lat)
        fetch('/updateMarker', {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({...modifiedMarker, longitude: modifiedMarker.location.lng, latitude: modifiedMarker.location.lat}), // body data type must match "Content-Type" header
            //mode: 'cors', // no-cors, *cors, same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer', // no-referrer, *client
            
          })
          .then((res)=> {
              console.log('inside patch then', res)})
    }
    componentDidMount() {
        fetch('/api')
          .then(res => res.json())
          .then((markers) => {
            //console.log('inside this.componentDidMount res:', markers)
            let newMarkerList;
            markers = markers.markersList;
             
                newMarkerList = [...this.state.markerList]
                for (let i = 0; i < markers.length; i += 1) {
                    let currMarker = markers[i];
                    currMarker.location = {lat: parseInt(currMarker.latitude), lng: parseInt(currMarker.longitude)}
                    console.log('current Marker is ' , currMarker)
                    newMarkerList.push(currMarker)
                }
                //console.log(newUserList)
            
            // console.log(this.state.markerList)
            // console.log(newMarkerList)

            return this.setState({
              markerList: newMarkerList,
            });
          })
          .catch(err => console.log('users.componentDidMount: get users: ERROR: ', err));
      }
    render() {
      let markerForm;
      let markerInfoBox; 
      let imageDisplay;
      if(this.state.clickedMarker){
        markerForm = <MarkerForm imgURL={this.state.imgURL} tagInfo = {this.state.tagInfo} locationInfo={this.state.locationInfo} descriptionInfo={this.state.descriptionInfo} onChange ={this.onChange} onSubmit={this.onSubmit}/>
      }
      
      if(this.state.clickedMarker.tag || this.state.clickedMarker.description){
        markerInfoBox = <MarkerInfoBox clickedMarker ={this.state.clickedMarker}/>
      }
      if (this.state.clickedMarker ) {
          imageDisplay = <ImageDisplay clickedMarker={this.state.clickedMarker}/>
      }
        return (
            <div id="map">This is the app.jsx div
              {imageDisplay}
            <div>
              <MapDisplay clickedMarker={this.state.clickedMarker} clickMarker={this.clickMarker} clickMap={this.clickMap} markerList={this.state.markerList} onChange ={this.onChange} searchTag = {this.state.searchTag} buttonSubmit ={this.buttonSubmit} savedTag = {this.state.savedTag}/>
              {markerInfoBox}
            </div>
            {markerForm}
            </div>
        )
    }
}