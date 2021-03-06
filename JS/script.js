const country = 'https://restcountries.herokuapp.com/api/v1/region/';
const covidCountry = 'http://corona-api.com/countries/';
const proxy = 'https://api.allorigins.win/raw?url';

let asia = document.querySelector(".asia")
let europe = document.querySelector(".europe")
let africa = document.querySelector(".africa")
let americas = document.querySelector(".americas")
let world = document.querySelector(".world")

const getCountryByRegion = async (continent) => {
    const data = await fetch(`${proxy}=${country}${continent}`);
    const countryData = await data.json();
    let countryArray = [];
    countryData.forEach((item) => {
        let theCountry = {
            name: item.name.common,
            code: item.cca2
        }
        countryArray.push(theCountry);
    });
    console.log(countryArray);

    let namesArray = countryArray.map((item) => {
        return item.name
    })
    console.log(namesArray);

    let outputArray = []
    for (let i = 0; i < countryArray.length; i++) {
        outputArray.push(await mainData(countryArray[i].code))
    }
    console.log(outputArray);
    
    worldChart(namesArray,outputArray);
}

//getCountryByRegion('americas');
;

world.addEventListener("click", getCountryByRegion('countries'))
asia.addEventListener("click", getCountryByRegion('asia'))
europe.addEventListener("click", getCountryByRegion('europe'))
africa.addEventListener("click", getCountryByRegion('africa'))
americas.addEventListener("click", getCountryByRegion('americas'))




const mainData = async (countryCode) => {
    const data = await fetch(`${proxy}=${covidCountry}${countryCode}`);
    const cData = await data.json();
    const theData = await cData.data;
    let theCountryDetails = {
        code: theData.code,
        confirmed: theData.latest_data.confirmed,
        critical: theData.latest_data.critical,
        deaths: theData.latest_data.deaths,
        recovered: theData.latest_data.recovered
    }
    return theCountryDetails.confirmed;
}



const worldChart = async (arr , arrData) => {
    var ctx =  document.getElementById('myChart').getContext('2d');
    var chart = await  new Chart(ctx, {
        type: 'line',

        data: {
            labels:  arr,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 199, 132)',
                borderColor: 'rgb(255, 199, 132)',
                data: arrData
            }]
        },

        options: {}
    });
}
