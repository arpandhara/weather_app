// let place = "Durgapur"; 

// the input 

const apiKey = 'f6eaccb109da411389991432250507';
let inputLocation = document.querySelector(".searchBar");
let searchBtn = document.querySelector(".searchBtn");
let temprature = document.querySelector(".tempDisplay");
let celcius = document.querySelector(".C");
let farenheit = document.querySelector(".F");
let conditionImg = document.querySelector(".condition");
let conditionValue = document.querySelector(".condition_value");
let popValue = document.querySelector(".pop_value");
let timeValue = document.querySelector(".time_value");
let exactlocationValue = document.querySelector(".exactLocation_value");
let navLocation = document.querySelector(".otherInfoNav p");
let feelsLikeTemperature = document.querySelector(".feelslike_temp h1");
let uvIndex = document.querySelector(".uvIndex_left_bottom h1");
let uvCondition = document.querySelector(".UV_condition");
let uvWarning = document.querySelector(".uv_warning");
let visibilityCondition = document.querySelector(".visibility_condition");
let visibilityValue = document.querySelector(".visibility_left_bottom h1");
let visibilityFeedback = document.querySelector(".visibility_right p");
let humidityValue = document.querySelector(".humidityValue");
let humidityCondition = document.querySelector(".humidityCondition");
let humidityIcon = document.querySelector(".humidity_center_box");
let aqiIndexValue = document.querySelector(".aqi_Index_value");
let aqiImg = document.querySelector(".aqi_displayImg");
let windSpeedValue = document.querySelector(".wSL_windSpeed h1");
let windDirectionValue = document.querySelector(".wSL_windDirection h1");
let compass = document.querySelector(".windSpeedRight");
let currentLocation = document.querySelector(".weatherLocation h1");
let loc;
let rainCodes = [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1276];
let cloudyCodes = [1003, 1006, 1009];
let fogCodes = [1030, 1135, 1147];
let sunnyCodes = [1000];


async function getData(targetLocation , apiKey) {
    let raw = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${targetLocation}&aqi=yes`);
    let data = await raw.json();
    return await data;
}

searchBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    var place = inputLocation.value;
    let temp = await getData(place , apiKey);
    temprature.textContent = Math.floor(temp.current.temp_c);
    loc = place;
    inputLocation.value = "";
    conditionCheck(temp);
    pop(temp);
    dateAndTime(temp);
    exactlocation(temp);
    feelsLike(temp);
    uvIndexData(temp);
    visibility(temp);
    humidity(temp);
    aqi(temp);
    windSpeedAndDirection(temp);
    console.log(temp);
});

inputLocation.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
        var place = inputLocation.value;
        let temp = await getData(place , apiKey);
        temprature.textContent = Math.floor(temp.current.temp_c);
        loc = place;
        inputLocation.value = "";
        conditionCheck(temp);
        pop(temp);
        dateAndTime(temp);
        exactlocation(temp);
        feelsLike(temp);
        uvIndexData(temp);
        visibility(temp);
        humidity(temp);
        aqi(temp);
        windSpeedAndDirection(temp);
        console.log(temp);
    }
});

async function conditionCheck(data) {
    let conditionCode = await data.current.condition.code;
    let conditionText = await data.current.condition.text;
    let day = data.current.is_day;
    conditionValue.textContent = conditionText;
    if (rainCodes.includes(conditionCode)) {
        conditionImg.style.backgroundImage = await "url(assets/rain.svg)"
    } else if (cloudyCodes.includes(conditionCode) && day == 0) {
        conditionImg.style.backgroundImage = await "url(assets/nightcloudy.svg)"
    } else if (cloudyCodes.includes(conditionCode)) {
        conditionImg.style.backgroundImage = await "url(assets/cloudy.svg)"
    } else if (fogCodes.includes(conditionCode)) {
        conditionImg.style.backgroundImage = await "url(assets/tooMuchCloudy.svg)"
    } else if (sunnyCodes.includes(conditionCode)) {
        conditionImg.style.backgroundImage = await "url(assets/sunny.svg)"
    }
}

async function pop(data) {
    let precip_in = await data.current.precip_in;
    if (precip_in == 0) {
        popValue.textContent = "0%"
    } else if (precip_in >= 0.01 && precip_in <= 1) {
        popValue.textContent = "28%"
    } else if (precip_in >= 1 && precip_in <= 3) {
        popValue.textContent = "50%"
    } else {
        popValue.textContent = "80%"
    }
}

async function dateAndTime(data) {
    let localTime = await data.location.localtime;
    timeValue.textContent = localTime;
}

async function exactlocation(data) {
    let locationName = await data.location.name;
    let region = await data.location.region;
    exactlocationValue.textContent = `${locationName}, ${region}`;
    navLocation.textContent = locationName;
}


farenheit.addEventListener("click", async function () {
    let temp = await getData(loc , apiKey);
    temprature.textContent = Math.floor(temp.current.temp_f);
    farenheit.style.backgroundColor = "rgb(252, 55, 55)";
    celcius.style.backgroundColor = "black";
    feelsLikeTemperature.textContent = Math.floor(temp.current.feelslike_f);
})


celcius.addEventListener("click", async function () {
    let temp = await getData(loc , apiKey);
    temprature.textContent = Math.floor(temp.current.temp_c);
    console.log(temp);
    celcius.style.backgroundColor = "rgb(252, 55, 55)";
    farenheit.style.backgroundColor = "black";
    feelsLike(temp);
})

async function feelsLike(data) {
    let feelsLikeTemp = await data.current.feelslike_c;
    feelsLikeTemperature.textContent = Math.floor(feelsLikeTemp);
}

async function uvIndexData(data) {
    let uv = data.current.uv;
    uvIndex.textContent = Math.trunc(uv);
    if (uv >= 0 && uv <= 2) {
        uvCondition.textContent = "Low";
        uvWarning.textContent = "Minimal Risk , safe to be outside";
    } else if (uv >= 3 && uv <= 5) {
        uvCondition.textContent = "Moderate";
        uvWarning.textContent = "Moderate Risk . Use Sunscreen";
    } else if (uv >= 6 && uv <= 7) {
        uvCondition.textContent = "High";
        uvWarning.textContent = "High Risk , wear protective clothing , avoid midday sun";
    } else if (uv >= 8 && uv <= 10) {
        uvCondition.textContent = "Very High";
        uvWarning.textContent = "Very high Risk. Prefer to stay in shade or home";
    } else {
        uvCondition.textContent = "Extreme";
        uvWarning.textContent = "Avoid Sun . Even brief exposure can cause skin damage";
    }
}


async function visibility(data) {
    let visbValue = data.current.vis_km;
    visibilityValue.textContent = Math.trunc(visbValue);
    if (visbValue < 0.1) {
        visibilityCondition.textContent = "Low";
        visibilityFeedback.textContent = "Likely due to dense fog, smoke, or blizzard conditions.";
    } else if (visbValue >= 0.1 && visbValue < 0.5) {
        visibilityCondition.textContent = "Low";
        visibilityFeedback.textContent = "Travel should be avoided unless absolutely necessary.";
    } else if (visbValue >= 0.5 && visbValue < 1) {
        visibilityCondition.textContent = "Low";
        visibilityFeedback.textContent = "Exercise caution while driving or walking.";
    } else if (visbValue >= 1 && visbValue < 2) {
        visibilityCondition.textContent = "Moderate";
        visibilityFeedback.textContent = "Some haze or mist may be present.";
    } else if (visbValue >= 2 && visbValue < 4) {
        visibilityCondition.textContent = "High";
        visibilityFeedback.textContent = "Suitable for most outdoor activities.";
    } else if (visbValue >= 4 && visbValue <= 10) {
        visibilityCondition.textContent = "High";
        visibilityFeedback.textContent = "Clear and safe conditions.";
    } else {
        visibilityCondition.textContent = "High";
        visibilityFeedback.textContent = "Ideal for travel and outdoor activities.";
    }
}

async function humidity(data) {
    let humidValue = data.current.humidity;
    humidityValue.textContent = `${humidValue}%`;
    if(humidValue>=0 && humidValue<30){
        humidityCondition.textContent = "Low";
        humidityIcon.style.backgroundImage = `url(assets/humidity_low_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg)`
    }else if(humidValue>=30 && humidValue<60){
        humidityCondition.textContent = "Moderate";
        humidityIcon.style.backgroundImage = `url(assets/humidity_mid_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg)`
    }else{
        humidityCondition.textContent="High";
        humidityIcon.style.backgroundImage = `url(assets/humidity_high_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg)`
    }
}

async function aqi(data){
    let aqiValue = await data.current.air_quality["gb-defra-index"];
    aqiIndexValue.textContent = aqiValue;
    if(aqiValue>=1 && aqiValue<=3){
        aqiImg.style.backgroundImage = `url(assets/aqi_low.svg)`
    }else if(aqiValue>3 && aqiValue<=7){
        aqiImg.style.backgroundImage = `url(assets/aqi_moderate.svg)`
    }else{
        aqiImg.style.backgroundImage = `url(assets/aqi_high.svg)`
    }
}

async function windSpeedAndDirection(data) {
    let windSvalue = data.current.wind_kph;
    let windDvalue = data.current.wind_dir[0];
    let currentLoc = data.location.country;

    windDirectionValue.textContent = windDvalue;
    windSpeedValue.textContent = windSvalue;


    compass.style.transform = `rotate(0deg)`


    if(windDvalue == "N"){
        compass.style.transform = `rotate(-90deg)`
    }else if(windDvalue == "S"){
        compass.style.transform = `rotate(90deg)`
    }else if(windDvalue == "E"){
        compass.style.transform = `rotate(180deg)`
    }else{
        compass.style.transform = `rotate(0deg)`
    }

    currentLocation.textContent = currentLoc;
}


