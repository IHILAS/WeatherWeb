
        const place = document.getElementById("place");
        const image = document.getElementById("image");
        const wind_speed = document.getElementById("speed");
        const temperature = document.getElementById("temp-desc");
        const max = document.getElementById("max");
        const min = document.getElementById("min");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                const long = position.coords.longitude;
                const lat = position.coords.latitude;
                const data = await getWeatherData(lat, long);
                drawMap(lat, long, data);
            });
        }

        async function getWeatherData(lat, long) {
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=1284186ccfb3e1eb21ae5516b77ce205`;
            const response = await fetch(api);
            const data = await response.json();
            weatherDataHandler(data);
            return data;
        }

        function weatherDataHandler(data) {
            const { temp, temp_min, temp_max } = data.main;
            const { speed } = data.wind;
            place.innerHTML = data.name;
            temperature.innerHTML = `Temp: ${temp} °C`;
            max.innerHTML = `Max: ${temp_max} °C`;
            min.innerHTML = `Min: ${temp_min} °C`;
            wind_speed.innerHTML = `Speed: ${speed} m/s`;
        }

        function drawMap(lat, long, data) {
            const map = L.map('map').setView([lat, long], 10);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            const marker = L.marker([lat, long]).addTo(map);
            marker.bindPopup(data.name).openPopup();

            map.on('click', async function (e) {
                const clickedData = await getWeatherData(e.latlng.lat, e.latlng.lng);
                marker.setLatLng([e.latlng.lat, e.latlng.lng]);
                marker.bindPopup(clickedData.name).openPopup();
            });
        }
