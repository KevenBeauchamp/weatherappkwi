import logo from './logo.svg';
import './App.css';
import Weather from './components/weather';
import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [location, setLocation] = useState(null);
  function success(pos) {
    var crd = pos.coords;
    // console.log("Your current position is:");
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
    // return crd;
    const latitude = crd.latitude;
    const longitude = crd.longitude;
    setLocation({ latitude, longitude });
    // console.log(latitude,longitude);
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          // console.log(result);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);
  // console.log(location)
  return (
    <div className="App">
      <Weather data={location} />
      {/* <Weather /> */}
    </div>
  );
}

export default App;
