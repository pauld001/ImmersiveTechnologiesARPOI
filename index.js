import 'aframe';
import '@ar-js-org/ar.js';
//import 'aframe-look-at-component';
import {GoogleProjection} from 'jsfreemaplib';

AFRAME.registerComponent("dynamic-content", {
    init: function()
    {
        console.log('working');
        // google projection
        navigator.geolocation.getCurrentPosition(async (gpspos) => {
        const location = new  GoogleProjection();
        //long lat gps
        console.log(`long:${gpspos.coords.longitude},lat:${gpspos.coords.latitude}`)
        const lon = gpspos.coords.longitude
        const lat = gpspos.coords.latitude

        const projected = location.project(lon, lat);
        console.log(`Easting: ${projected[0]}, x: ${projected[0]}, northing: ${projected[1]}, z: ${-projected[1]}`);

        
        document.querySelector("[camera]").setAttribute("position", {
            x: projected[0],
            y: 0,
            z: -projected[1]
        });
      
        const west = gpspos.coords.longitude - 0.05
        const south = gpspos.coords.latitude - 0.05
        const east = gpspos.coords.longitude + 0.05
        const north = gpspos.coords.latitude + 0.05
        console.log(`west: ${west}, south: ${south}, east: ${east}, north: ${north}`);

        const response = await fetch(`https://hikar.org/webapp/map/all?bbox=${west},${south},${east},${north}`);
        console.log('fetched')
        const parsedJson = await response.json();
        parsedJson.response.array.forEach( features => {
        console.log(`name: ${features.properties.name}`);

    });  

    });    
}});
