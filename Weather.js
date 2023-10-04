const place=document.getElementById("place");
const image=document.getElementById("image");
const wind_speed=document.getElementById("speed");
const temperature=document.getElementById("temp-desc");
const max=document.getElementById("max");
const min=document.getElementById("min");

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async function(position){
        const long=position.coords.longitude;
        const lat=position.coords.latitude;
        const data=await getweatherData(lat,long);  
        drawMap(lat,long,data);      
    })
}

async function getweatherData(lat,long){
    const api=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=1284186ccfb3e1eb21ae5516b77ce205`;
    const response=await fetch(api);
    const data=await response.json();
    weatherdataHandler(data);
    return data;
}

function weatherdataHandler(data){
    const {temp,temp_min,temp_max}=data.main;
    const{speed}= data.wind;
    place.innerHTML=data.name;
    temperature.innerHTML="temp "+ temp + " °C";
    max.innerHTML="max: " + temp_max + " °C";
    min.innerHTML="min: " + temp_min + "°C";
    wind_speed.innerHTML="speed: " + speed + "m/s"; 
}

function drawMap(lat,long,data){
    var map = L.map('map').setView([20.5937,78.9629], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 19,attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var marker = L.marker([lat,long]).addTo(map);
    marker.bindPopup(data.name).openPopup();

    map.on('click', async function (e) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
        const data = await getweatherData(e.latlng.lat, e.latlng.lng);
     
        // Draw the marker for the new place
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        marker.bindPopup(data.name).openPopup();
    });

}
