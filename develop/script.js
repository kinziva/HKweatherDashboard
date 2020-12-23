//load function when page loads
$(document).ready(function () {
  const apiKey = "&appid=e41d4c7f22d5b276e8ecfb561977d5c6";
  let date = new Date();
  const displaycurrentDate = document.getElementById("currentDate");
  const displayCurrentCityName = document.getElementById("cityName");
  const currentWeatherIcon = document.getElementById("current-weather-icon");
  const currentCityTemp = document.getElementById("temperature");
  const currentCityHumidity = document.getElementById("humidity");
  const currentCityWind = document.getElementById("windSpeed");
  const currentCityUV = document.getElementById("UV");
  const clearButton = document.getElementById("clearHistorybutton");
  const allHistory = document.getElementById("history");
  let historyCities = JSON.parse(localStorage.getItem("search")) || [];

  //start search for weather for input city name
  $("#search-button").on("click", function () {
    // get the value of the input from user
    city = $("#getCityName").val();

    // clear city name input
    $("#getCityName").val("");

    // current weather and forecast
    getWeatherforCity(city);

    // add city into the search history array
    historyCities.push(city);
    // local storage
    localStorage.setItem("search", JSON.stringify(historyCities));
    renderHistory();
  });

  //weather for current city and forecast of 5 days function
  function getWeatherforCity(city) {
    // url to call weather api
    const queryUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      getCurrentWeather(response);
      UVindexDisplay(response);
      get5DayForecast(city);
    });
  }

  //get and display current weather function
  function getCurrentWeather(response) {
    // Display current date
    displaycurrentDate.innerHTML = "Date: " + date.toLocaleDateString("en-US");
    console.log("city name :    " + response.name);
    // display current city
    displayCurrentCityName.innerHTML = "City: " + response.name;

    // get current city weather icon
    let weatherPic = response.weather[0].icon;
    // display current city weather icon
    currentWeatherIcon.setAttribute(
      "src",
      "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
    );
    // set current city weather description
    currentWeatherIcon.setAttribute("alt", response.weather[0].description);

    //Get  temperature F
    let tempF = (response.main.temp - 273.15) * 1.8 + 32;
    //round up temperature
    tempF = Math.floor(tempF);

    // display current city weather temperature
    currentCityTemp.innerHTML = "Temperature: " + tempF + " &#176F";

    // display current city weather Humidity
    currentCityHumidity.innerHTML = "Humidity: " + response.main.humidity + "%";

    // display current city weather Wind Speed
    currentCityWind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
  }

  //get and display UV index
  function UVindexDisplay(response) {
    // get location of the city
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    console.log("city lat    " + lat);
    console.log("city lon   " + lon);

    // url to call forecast UV index api with current location
    let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + apiKey +"&cnt=1";

    $.ajax({
      url: UVQueryURL,
      method: "GET",
    }).then(function (responseUV) {
      let UVindexDisplay = document.createElement("li");
      UVindexDisplay.setAttribute("class", "badge badge-danger");

      // display current city weather UV Index
      UVindexDisplay.innerHTML = responseUV[0].value;
      currentCityUV.innerHTML = "UV Index: ";
      currentCityUV.append(UVindexDisplay);
    });
  }

  function get5DayForecast(city) {
    let forecastQueryURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;

    console.log("forecastQueryURL: " + forecastQueryURL);

    // weather forecast call
    $.ajax({
      url: forecastQueryURL,
      method: "GET",
    }).then(function (response) {
      const forecastDisplay = document.querySelectorAll(".fiveDays");
      console.log("forecast: count" + forecastDisplay.length);

      for (i = 0; i < forecastDisplay.length; i++) {
        forecastDisplay[i].innerHTML = "";
        const forecastIndex = i * 8 + 4;

        // forecast DATE
        const forecastDate = new Date(response.list[forecastIndex].dt * 1000);

        console.log("forecastDate: " + forecastDate);

        const dayForecast = forecastDate.getDate();
        const monthForecast = forecastDate.getMonth() + 1;
        const yearforecast = forecastDate.getFullYear();

        const forecastDateDisplay = document.createElement("p");

        forecastDateDisplay.setAttribute("class", "mt-3 mb-0 forecast-date");
        forecastDateDisplay.innerHTML = monthForecast + "/" + dayForecast + "/" + yearforecast;
        forecastDisplay[i].append(forecastDateDisplay);

        // forecast icon
        const forecastWeatherDisplay = document.createElement("img");
        forecastWeatherDisplay.setAttribute( "src","https://openweathermap.org/img/wn/" +response.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastWeatherDisplay.setAttribute("alt",response.list[forecastIndex].weather[0].description );
        forecastDisplay[i].append(forecastWeatherDisplay);

        //temperature converstion
        let forecastTemp =(response.list[forecastIndex].main.temp - 273.15) * 1.8 + 32;
        //round up temperature
        forecastTemp = Math.floor(forecastTemp);

        // forecast Temperature
        const forecastTempDisplay = document.createElement("p");
        forecastTempDisplay.innerHTML = "Temp: " + forecastTemp + " &#176F";
        forecastDisplay[i].append(forecastTempDisplay);

        // forecast Humidity
        const forecastHumidityDisplay = document.createElement("p");
        forecastHumidityDisplay.innerHTML ="Humidity: " + response.list[forecastIndex].main.humidity + "%";
        forecastDisplay[i].append(forecastHumidityDisplay);
      }
    });
  }

  clearButton.addEventListener("click", function () {
    historyCities = [];
    renderHistory();
  });

  function renderHistory() {
    allHistory.innerHTML = "";
    for (let i = 0; i < historyCities.length; i++) {
      const eachCityinHistory = document.createElement("input");
      eachCityinHistory.setAttribute("type", "text");
      eachCityinHistory.setAttribute("readonly", true);
      eachCityinHistory.setAttribute("class", "form-control d-block bg-white");
      eachCityinHistory.setAttribute("value", historyCities[i]);
      eachCityinHistory.addEventListener("click", function () {
      getWeatherforCity(eachCityinHistory.value);
      });
      allHistory.append(eachCityinHistory);
    }
  }

  renderHistory();
});
