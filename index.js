import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import { GoogleProjection } from 'jsfreemaplib';
import 'three.js'

AFRAME.registerComponent("poi", {
    init: function () {
        console.log('POI');
        this.loaded = false;
        window.addEventListener('gps-camera-update-position', e => {
            if (this.loaded === false) {
                this.loaded = true;
            }

        })

        // google projection



        navigator.geolocation.watchPosition(

            async (gpspos) => {
                console.log(`Lat ${gpspos.coords.latitude} Lon ${gpspos.coords.longitude}`)
                
                document.getElementById('info').innerHTML = (`Current Location: Lat ${gpspos.coords.latitude} Lon ${gpspos.coords.longitude}`)


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

                //forEach loop
                parsedJson.features.forEach(feature => {

                    console.log(`name: ${feature.properties.name},${feature.geometry.coordinates}`);

                    const pointText = document.createElement('a-entity')
                    const point = document.createElement('a-entity')
                    const text = document.createElement('a-entity')
                    //TEST NO MODEL
                    //point.setAttribute('geometry', { primitive: 'box' });
                    //point.setAttribute('material', { color: 'blue' });
                    //POINTER MODEL

                    if (`${feature.properties.amenity}` === "cafe") {
                        console.log("cafe")
                        point.setAttribute('gltf-model', '#cafe');

                    } else if (`${feature.properties.amenity}` === "restaurant") {
                        console.log("restaurant")
                        point.setAttribute('gltf-model', '#restaurant');

                    } else if (`${feature.properties.amenity}` === "pub") {
                        console.log("pub")
                        point.setAttribute('gltf-model', '#pub');

                    } else {
                        console.log("other")
                        point.setAttribute('gltf-model', '#pointer');
                    }
                    point.setAttribute('scale', { x: 30, y: 30, z: 30})
                    text.setAttribute('text', { value: `${feature.properties.name}` })
                    text.setAttribute('scale', { x: 100, y: 100, z: 100 });

                    const [entlat, entlon] = location.project(feature.geometry.coordinates[0], feature.geometry.coordinates[1])

                    point.setAttribute('position', {
                        x: entlat,
                        y: 0,
                        z: -entlon
                    });
                    text.setAttribute('position', {
                        x: entlat,
                        y: 0.5,
                        z: -entlon
                    });


                    pointText.appendChild(point);
                    pointText.appendChild(text);
                    this.el.sceneEl.appendChild(pointText);

                    console.log(`entlat: ${entlat}, entlon: ${entlon}`);
                });




                //},
                //{
                //    enableHighAccuracy:true, 
                //    maximumAge: 10000 
            });
    }
});
