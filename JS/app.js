const proxy = 'https://api.allorigins.win/raw?url';
const countryAPI = 'https://restcountries.herokuapp.com/api/v1/region/';
const coronoAPI = 'http://corona-api.com/countries/';

const statusNames = ['confirmed', 'critical' ,'deaths' ,'recovered','rate'];

const display = document.querySelector('.chart');
const contButtons = document.querySelector('.btnBoxCont').querySelectorAll('button');
const statusButtons = document.querySelector('.btnBoxStatus').querySelectorAll('button');
const singleCountry = document.querySelector('.btnBox2');
const overlay = document.querySelector('.overlay');
const loader = document.querySelector('#loader');
const start = document.querySelector('.showCase').querySelector('button');

const getRegionStatus = async (continent , status ) => {
    const data = await fetch(`${proxy}=${countryAPI}${continent}`);
    const jsonDataNF = await data.json();
    const jsonData = await jsonDataNF.filter((item)=> {
        return item.cca2 !== 'XK';
    });
    let countriesNames = [];
    let countriesCodes = [];
    let countriesStats = [];
    for (let i=0; i<jsonData.length; i++) {
        countriesNames.push(jsonData[i].name.common);
        countriesCodes.push(jsonData[i].cca2);
        countriesStats.push(await getData(jsonData[i].cca2 , status));
    }
      newCHart(countriesNames,countriesStats,continent , status);
      brekToCountries(countriesNames , countriesCodes);
}

const getData = async (countryCode , status) => {
    const data = await fetch(`${proxy}=${coronoAPI}${countryCode}`);
    const jsonData = await data.json();
    const theData = await jsonData.data;
    let theCountryDetails = {
        confirmed: theData.latest_data.confirmed,
        critical: theData.latest_data.critical,
        deaths: theData.latest_data.deaths,
        recovered: theData.latest_data.recovered,
        rate : (theData.latest_data.confirmed / theData.population).toFixed(2),
        updated: theData.updated_at
    }
    return theCountryDetails[status];
}

const getConButton =  async (e)=>{
  singleCountry.style.visibility = 'hidden';
  loader.style.visibility = 'visible';
  removeEvents();
  const formCon = document.querySelector('.btnBoxCont').querySelector('.clicked');  
  formCon.classList.remove('clicked');
  e.target.classList.add('clicked');
  let curCon = e.target.innerHTML.toLowerCase();
  let curStauts = document.querySelector('.btnBoxStatus').querySelector('.clicked');
  let curStat = curStauts.innerHTML.toLowerCase();
  await getRegionStatus(curCon,curStat);
  loader.style.visibility = 'hidden';
  singleCountry.style.visibility = 'visible';
  addEvents();
}

const getStausButton = async(e) =>{
    loader.style.visibility = 'visible';
    removeEvents();
    const formStatus = document.querySelector('.btnBoxStatus').querySelector('.clicked');  
    formStatus.classList.remove('clicked');
    e.target.classList.add('clicked');
    let curStas = e.target.innerHTML.toLowerCase();
    let curCon = document.querySelector('.btnBoxCont').querySelector('.clicked');
    let curContinent = curCon.innerHTML.toLowerCase();
    await getRegionStatus(curContinent, curStas);
    loader.style.visibility = 'hidden';
    addEvents();
}

const newCHart = async (arr , arrData ,continent , status) => {
    document.getElementById("myChart").remove(); // canvas
    display.firstElementChild.insertAdjacentHTML("afterbegin", "<canvas id='myChart'></canvas>"); //adding the canvas again
    var ctx =  document.getElementById('myChart');
    var chart = await  new Chart(ctx, {
        type: 'line',
        data: {
            labels:  arr,
            datasets: [{
                label: `${continent.toUpperCase()} | ${status.toUpperCase()}`,
                backgroundColor: '#1dbab4',
                borderColor: '#1dbab4',
                data: arrData
            }]
        },
        options: {}
    });
}

const  showTheInfoOfACountry = async() => {
   overlay.children.innerHTML='';
   let selectBox = document.querySelector('select');
   let myoption =  selectBox.options[selectBox.selectedIndex];
   overlay.children[1].innerHTML =  myoption.innerHTML;
   for(let i=0; i<statusNames.length; i++){
       overlay.children[i+2].innerHTML =statusNames[i].toUpperCase();
       let statusNum = await getData(myoption.value , statusNames[i]);
       overlay.children[i+7].innerHTML = statusNum;
   }
   let lastUpdated = await  getData(myoption.value ,'updated');
   let lastUpdatedFix = lastUpdated.replace('T', ' ');
    overlay.lastElementChild.innerHTML =
    `*Rate: Total cases per population* | Last Updated : ${lastUpdatedFix}`;
    overlay.style.visibility = 'visible';
    overlay.firstElementChild.addEventListener('click', ()=>{
        overlay.style.visibility = 'hidden';
    })
}

const brekToCountries =  (arr1 , arr2 ) => {  
    
    singleCountry.innerHTML='';       // the function will get 2 arr
    let select = document.createElement('select');
    let getinfobtn = document.createElement('button');
    let descrip = document.createElement('h4');
    descrip.innerHTML = 'Get Specific Country Details'
    getinfobtn.classList.add('btn','clicked','selectbtn');
    getinfobtn.innerHTML = 'Get Info';
    getinfobtn.addEventListener('click',showTheInfoOfACountry);
    for( let i=0 ; i<arr1.length; i++) {
        let option = document.createElement('option');
        if(arr1[i]==='Serbia') {
            arr1[i] = 'Serbia(with Kosovo)'
        }
        option.innerHTML = arr1[i];
        option.value = arr2[i];
        select.appendChild(option);
    }
    singleCountry.appendChild(descrip);
    singleCountry.appendChild(select);
    singleCountry.appendChild(getinfobtn);
    
}

const addEvents = () => {
    contButtons.forEach(btn => btn.addEventListener('click', getConButton));
    statusButtons.forEach(btn => btn.addEventListener('click', getStausButton));
}

const removeEvents = () => {
    contButtons.forEach(btn => btn.removeEventListener('click', getConButton));
    statusButtons.forEach(btn => btn.removeEventListener('click', getStausButton));
}

const startApp = async () => {
    loader.style.visibility = 'visible';
    const show =  document.querySelector('.showCase');
    show.style.visibility = 'hidden';
    display.style.animation = 'expand 1s ease-in';
    display.style.visibility = 'visible';
    await getRegionStatus('africa','confirmed');
    loader.style.visibility = 'hidden';
}

addEvents();
start.addEventListener('click', startApp);