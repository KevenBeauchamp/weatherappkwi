import React, { useEffect, useRef, useState } from 'react';
import './weather.css';
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import humidity_icon from "../assets/humidity.png";
import wind_icon from "../assets/wind.png";
import search_icon from "../assets/search.png";


// import meta.APP_API_KEY from "env";
    export default function Weather(props){
        // const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const apiKey = import.meta.env.VITE_APP_API_KEY;
        // console.log( process.env)
        
        // console.log(process.env)
        const [location, setLocation] = useState(null);
        const handleKeyDown = (event) => {
            console.log(event.key)
            if (event.key === 'Enter') {
              // Perform search logic here using the searchTerm
            //   console.log('Searching for:');
            searchWeather(inputSearchRef.current.value)
            }
          };
        function handleLocationClick() {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(success, error);
            } else {
              console.log("Geolocation not supported");
            }
          }
        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLocation({ latitude, longitude });
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            const allICons = {
                "01d": clear_icon,
                "01n": clear_icon,
                "02d": cloud_icon,
                "02n": cloud_icon,
                "03d": cloud_icon,
                "03n": cloud_icon,
                "04d": drizzle_icon,
                "04n": drizzle_icon,
                "09d": rain_icon,
                "09n": rain_icon,
                "10d": rain_icon,
                "10n": rain_icon,
                "13d": snow_icon,
                "13n": snow_icon,
                
            }

            // Make API call to OpenWeatherMap
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
              .then(response => response.json())
              .then(data => {
                // setWeather(data);
                console.log(data);
                const icon = data.weather[0].icon;

                setWeather({
                    humidity: data.main.humidity,
                    wind: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    sunrise:convert(data.sys.sunrise,data.timezone),
                    sunset: convert(data.sys.sunset,data.timezone),
                    feels_like: Math.floor(data.main.feels_like), 
                    icons: allICons[icon]
                })
              })
              .catch(error => console.log(error));
          }
          function error() {
            console.log("Unable to retrieve your location");
          }
        function convert(num,timezone) {
            let unix_timestamp = num ;

            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds
            var date = new Date((unix_timestamp ) * 1000);
            console.log(date.toUTCString());
            // Hours part from the timestamp
            var hours = date.getHours();

            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();

            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) ;
            

            return formattedTime;
            
        }
        function convertTimestampToDatetime(timestamp) {
            const date = new Date(timestamp * 1000);
          
            const options = {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              timeZoneName: 'short'
            };
          
            return date.toLocaleString(undefined, options);
          }

          function unixTimestampToGmtDatetime(unixTimestamp) {
            const date = new Date(unixTimestamp * 1000);
            return date.toUTCString();
          }
        const [weather_data, setWeather] = useState(false);
        const inputSearchRef = useRef();

        const allICons = {
            "01d": clear_icon,
            "01n": clear_icon,
            "02d": cloud_icon,
            "02n": cloud_icon,
            "03d": cloud_icon,
            "03n": cloud_icon,
            "04d": drizzle_icon,
            "04n": drizzle_icon,
            "09d": rain_icon,
            "09n": rain_icon,
            "10d": rain_icon,
            "10n": rain_icon,
            "13d": snow_icon,
            "13n": snow_icon,
            
        }
        const searchWeather = async (city) => {
            if(city === ""){
                alert("Enter a name");
                return;
            }
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${apiKey}`;
                
                const response = await fetch(url);
                const data = await response.json();
                if(!response.ok){
                    alert(data.message);
                    return;
                }
                console.log(response);
                // const icone = allICons[data.Weather[0].icon] || clear_icon
                // console.log(data.Weather[0].icon)
                // console.log(allICons[data.Weather[0].icon])
                const icon = data.weather[0].icon;
                // console.log(icon)
                // console.log()
                
                setWeather({
                    humidity: data.main.humidity,
                    wind: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    sunrise:unixTimestampToGmtDatetime(data.sys.sunrise,data.timezone),
                    sunset: unixTimestampToGmtDatetime(data.sys.sunset,data.timezone),
                    feels_like: Math.floor(data.main.feels_like), 
                    icons: allICons[icon]
                })
            } catch (error) {
                setWeather(false);
                // console.error("Error data");
            }
            
        }

        useEffect(
            ()=>{
                handleLocationClick()
                
            },[]
        )
        
    
      return (
        <div className='weather'>
            <div className='search'>
                <input onKeyDown={handleKeyDown} ref={inputSearchRef} type="text" name="" placeholder="search" id="" />
                <img  onClick={()=>searchWeather(inputSearchRef.current.value)} src={search_icon} alt="" />            
            </div>
            {weather_data?
            <>
                 <div>
                    <div>
                        <img src={weather_data.icons} alt="" />
                    </div>
                    <div>
                        <h4>{weather_data.location}</h4>
                        <span>Today</span>
                        <div>
                            <p>{weather_data.temperature}°  F </p>
                            <span>Feel Like {weather_data.feels_like}° F</span>
                        </div>
                        
                        <div className="content">
                            <div className='margeRight'>
                                <span>Wind Speed</span>
                                    <div className="content space">
                                        <img className="spaceRight" src={wind_icon} alt="" srcset="" width="25px" height="25px" />
                                        <span >{weather_data.wind} Km/h</span>
                                        
                                    </div>
                            </div>
                            <div>
                                <span>Humidity</span>
                                <div className="content space">
                                    <img className='spaceRight' src={humidity_icon} alt="" srcset=""  width="18px" height="15px"/>
                                    <span className='humidityProp' >{weather_data.humidity} %</span>
                                    
                                </div>
                            </div>                         
                        </div>
                        {/* <div className="content"> */}
                            
                            {/* <p className='margeRight'>Sunrise : {weather_data.sunrise}</p> */}
                            {/* <p>Sunset : {weather_data.sunset}</p> */}
                        {/* </div> */}

                    </div>
                 </div>
            </> 
            :<>
                {/* <p>Erreur</p> */}
            </>
            }
           
          
        </div>
      )

    }

    
