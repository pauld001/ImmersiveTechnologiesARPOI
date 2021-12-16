import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import { GoogleProjection } from 'jsfreemaplib';
import 'three.js'
AFRAME.registerComponent("poi", {
    init: function () {
             console.log('working');
             this.loaded = false;
        window.addEventListener('gps-camera-update-position', e =>{
            if(this.loaded === false) {
                this.loaded = true;
            }                
            console.log(`your initial location is: ${e.detail.position.longitude} ${e.detail.position.latitude}`);

        })
   
        // google projection
        navigator.geolocation.getCurrentPosition(async (gpspos) => {
            const location = new GoogleProjection();
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
            const south = gpspos.coords.latitude - 0.02
            const east = gpspos.coords.longitude + 0.05
            const north = gpspos.coords.latitude + 0.02
            console.log(`west: ${west}, south: ${south}, east: ${east}, north: ${north}`);

            const response = await fetch(`https://hikar.org/webapp/map/all?bbox=${west},${south},${east},${north}`)
            const parsedJson = await response.json();
            console.log('output')
            console.log(parsedJson);
            parsedJson.features.forEach(feature => {

                console.log(`name: ${feature.properties.name},${feature.geometry.coordinates}`);

                const point = document.createElement('a-entity')
                const text = document.createElement('a-entity')
                //TEST NO MODEL
                //point.setAttribute('geometry', { primitive: 'box' });
                //point.setAttribute('material', { color: 'blue' });
                //POINTER MODEL
                point.setAttribute('gltf-model', '#pointer');
                point.setAttribute('scale',{x:20, y:20, z:20})
                //point.setAttribute('text', {value: 'point'});
                text.setAttribute('text',{ value: `${feature.properties.name}`})
               /// text.setAttribute('look-at',{}) 
                text.setAttribute('scale',{x:100, y:100, z:100});                
                
                const [entlat, entlon] = location.project(feature.geometry.coordinates[0], feature.geometry.coordinates[1])

                point.setAttribute('position', {
                    x: entlat,
                    y: 0,
                    z: -entlon
                });
                text.setAttribute('position', {
                    x: entlat,
                    y: 0,
                    z: -entlon
                });
                
                
                this.el.sceneEl.appendChild(point);
                this.el.sceneEl.appendChild(text);
                console.log(`entlat: ${entlat}, entlon: ${entlon}`);
            });




        });
    }
});
