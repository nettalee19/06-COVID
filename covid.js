let proxy = `https://api.allorigins.win/raw?url=`;
const countrys = `${proxy}https://restcountries.herokuapp.com/api/v1`;
const covidCountries = `${proxy}https://corona-api.com/countries/` //covid update daily worldwide

let countryName = [];
let continent = {};

//displaying the countries
async function displayCountry(){
  const countryData = await fetch(countrys)
  const data = await countryData.json();
  //showJoke.innerHTML = data.value
  //console.log(data)
  data.forEach((item) => {
    let countryObj = {
        name: item.name.common,
        code: item.cca2
    }
    countryName.push(countryObj);
});
console.log(countryName)

let countryNameArray = countryName.map((item) => {
    return item.name
})
console.log(countryNameArray);


}
displayCountry()

//dispslaying the covid data
async function displayCovidbyCountry(cCode){
    const covidData = await fetch (`${covidCountries}${cCode}`)
    const dataTwo = await covidData.json();
    console.log(dataTwo)
    let finalCovidData = await dataTwo.covidData;
    //console.log(finalCovidData)

    const covidByCountryObj = {
        code: finalCovidData.code,
        confirmed: finalCovidData.latest_data.confirmed,
        critical: finalCovidData.latest_data.critical,
        deaths: finalCovidData.latest_data.deaths,
        recovered: finalCovidData.latest_data.recovered
    }
    return covidByCountryObj;
}
displayCovidbyCountry('FR')

//52
//spliting the countryObj into two arrays








const covidChart = async (arr , arrData) => {
    
    
    var ctx =  document.getElementById('myChart').getContext('2d');
    var chart = await new Chart(ctx, {
        //type of chart 
        type: 'line',

        //data for the dataset
        data: {
            labels:  arr,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: arrData
            }]
        },

        
        options: {}
    });
}



const continentBtns = document.querySelectorAll('.continentBtn');
for (let i = 0; i < continentBtns.length; i++) {
    continentBtns[i].addEventListener('click', () => {
        currentContinent = continentBtns[i].textContent
        convetObjToArrays('confirmed');
    });
}