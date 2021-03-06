const baseEndpoint = 'https://restcountries.herokuapp.com/api/v1/region/';
const countryProxy = 'https://api.allorigins.win/raw?url';




const getCountryByRegion = async (continent) => {
    const data = await fetch(`${countryProxy}=${baseEndpoint}${continent}`);
    const jsonData = await data.json();
    let countruieArray = [];
    jsonData.forEach((item) => {
        let theCountry = {
            name: item.name.common,
            code: item.cca2
        }
        countruieArray.push(theCountry);
    });
    console.log(countruieArray);

    let onlyNmaesArray = countruieArray.map((item) => {
        return item.name
    })
    console.log(onlyNmaesArray);

    let onlycodeOutpurArray = []
    for (let i = 0; i < countruieArray.length; i++) {
        onlycodeOutpurArray.push(await getData(countruieArray[i].code))
    }
    console.log(onlycodeOutpurArray);
    
    newCHart(onlyNmaesArray,onlycodeOutpurArray);
}

getCountryByRegion('americas');
getCountryByRegion('asia');


const endPoint = 'http://corona-api.com/countries/';
const proxy = 'https://api.allorigins.win/raw?url';

const getData = async (countryCode) => {
    const data = await fetch(`${proxy}=${endPoint}${countryCode}`);
    const jsonData = await data.json();
    const theData = await jsonData.data;
    let theCountryDetails = {
        code: theData.code,
        confirmed: theData.latest_data.confirmed,
        critical: theData.latest_data.critical,
        deaths: theData.latest_data.deaths,
        recovered: theData.latest_data.recovered
    }
    return theCountryDetails.confirmed;
}

// getData('IL');


const newCHart = async (arr , arrData) => {
    var ctx =  document.getElementById('myChart').getContext('2d');
    var chart = await  new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels:  arr,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: arrData
            }]
        },

        // Configuration options go here
        options: {}
    });
}



