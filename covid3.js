const proxy = `https://api.allorigins.win/raw?url=`;
const countriesList = `${proxy}https://restcountries.herokuapp.com/api/v1`;
const covidList = `${proxy}https://corona-api.com/countries/` //covid update daily worldwide


let countryName = [];
let continent = {};

//displaying the countries
async function displayCountry(){
    const countryData = await fetch(countriesList)
    const data = await countryData.json();
    
    data.forEach((item) => {
      let countryObj = {
          name: item.name.common,
          code: item.cca2
      }
      countryName.push(countryObj);
  });
  //console.log(countryName)
  
  
//   let countryNameArray = countryName.map((item) => {
//       return item.name
//   })
//   console.log(countryNameArray);
  
  
  }
  displayCountry()

//dispslaying the covid data
async function displayCovidbyCountry(cCode){
    const covidData = await fetch (`${covidList}${cCode}`)
    const dataTwo = await covidData.json();
    console.log(dataTwo)
    let finalCovidData = await dataTwo.covidData;
    console.log(finalCovidData)

    const covidByCountryObj = {
        code: finalCovidData.code,
        confirmed: finalCovidData.latest_data.confirmed,
        critical: finalCovidData.latest_data.critical,
        deaths: finalCovidData.latest_data.deaths,
        recovered: finalCovidData.latest_data.recovered
    }
    return covidByCountryObj;
}





















// const getConButton =  async (e)=>{
//     const formCon = document.querySelector('.continents-btns').querySelector('.clicked');  
//     formCon.classList.remove('clicked');
//     e.target.classList.add('clicked');
//     let curCon = e.target.innerHTML.toLowerCase();
//     let curStauts = document.querySelector('.btnBoxStatus').querySelector('.clicked');
//     let curStat = curStauts.innerHTML.toLowerCase();
//     await getRegionStatus(curCon,curStat);
//     loader.style.visibility = 'hidden';
//     singleCountry.style.visibility = 'visible';
//     addEvents();
//   }

//52
//spliting the countryObj into two arrays





function displayChart(keys, values, region) {

    //document.getElementById("myChart").remove(); // canvas
    //const div = document.querySelector(".canvas"); // parent element
    //div.insertAdjacentHTML("afterbegin", "<canvas id='myChart'></canvas>"); //adding the canvas again

    const ctx = document.getElementById('myChart').getContext('2d');
    const myLineChart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: keys,
            datasets: [{
                label: region,
                backgroundColor: 'rgb(107, 255, 99)',
                borderColor: 'rgb(120, 122, 119)',
                data: values
            }]
        },
        // Configuration options go here
        options: {}
    });
}


// const covidChart = async (arr , arrData) => {
    
    
//     var ctx =  document.getElementById('myChart').getContext('2d');
//     var chart = await new Chart(ctx, {
//         //type of chart 
//         type: 'line',

//         //data for the dataset
//         data: {
//             labels:  arr,
//             datasets: [{
//                 label: 'My First dataset',
//                 backgroundColor: 'rgb(255, 99, 132)',
//                 borderColor: 'rgb(255, 99, 132)',
//                 data: arrData
//             }]
//         },

        
//         options: {}
//     });
// }



const continentBtns = document.querySelectorAll('.continentBtn');
for (let i = 0; i < continentBtns.length; i++) {
    continentBtns[i].addEventListener('click', () => {
        currentContinent = continentBtns[i].textContent
        //convetObjToArrays('confirmed');
    });
}