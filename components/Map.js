import React, { useEffect, useRef, useState } from "react";

import {Loader} from '@googlemaps/js-api-loader';

const MAPS_API_KEY = process.env.MAPS_API_KEY;

const setMarker = (map, resident) => {
  const infowindow = new google.maps.InfoWindow({
    content: `<div className="info-window"><h4>${resident.name}</h4><p>${resident.jobTitle}</p><div>`,
  });

  // <div><img width="150" height="150" src="${resident.photo}" /></div>

  const geocoder = new google.maps.Geocoder();
  
  
  geocoder.geocode({
    address: `${resident.address}, ${resident.city}`
  }).then((res) => {
    const location = res.results[0].geometry.location;

    const marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      map: map,
      position: {lat: location.lat(), lng: location.lng()},
      icon: {
        url: 'https://static.thenounproject.com/png/331569-200.png',
        scaledSize: new google.maps.Size(50, 50)
      }
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }).catch((err) => {

  });
};

const Map = ({ residents }) => {
    residents = residents || [];

    if (residents.length <=0 ) return <h5 className="error-alert">No exists data about residents</h5>

    const googlemap = useRef(null);

    let map; 
    
    const loader = new Loader({
        apiKey: MAPS_API_KEY,
        version: 'weekly',
    });
    
    loader.load().then(() => {
        const google = window.google;

        map = new google.maps.Map(googlemap.current, {
        center: {lat: 24.6623331, lng: -69.3376495},
        zoom: 2,
        disableDefaultUI: true
        });

        residents.map((resident) => {
            setMarker(map, resident);
        });
    });
    
    return (
        <div className="map-container">           
            <div id="map" ref={googlemap} />         
        </div>
    );
};



export default Map;