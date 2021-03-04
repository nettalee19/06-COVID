window.onload = function() {
    getGlobalData()
};

function getGlobalData() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
      
        fetch("https://coronavirus-19-api.herokuapp.com/countries")
        .then(response => {return response.json()})
        .then(result => {
            let world = result[0]; //World data. Use world.deaths and etc to get certain data
            //Find the html element with id and change its text to number from API. 

            //Total data
            document.getElementById('cases').innerHTML = world.cases.toLocaleString('en');
            document.getElementById('recovered').innerHTML = world.recovered.toLocaleString('en');
            document.getElementById('active').innerHTML = world.active.toLocaleString('en'); 
            document.getElementById('critical').innerHTML = world.critical.toLocaleString('en');  
            document.getElementById('deaths').innerHTML = world.deaths.toLocaleString('en');
            //Daily data
            document.getElementById('new-cases').innerHTML = '+' + world.todayCases.toLocaleString('en'); 
            document.getElementById('new-deaths').innerHTML = '+' +world.todayDeaths.toLocaleString('en');
            return makeDonutChart(world)
        })

        .catch(error => console.log('ERROR: ', error))
        setTimeout(getGlobalData, 42300000)
};

const dropdownMobile = document.querySelector(".dropdown-mobile")
const hamburger = document.querySelector(".navbar__ham")
if (window.screen.width <= 1014){
    //Press Enter to call onClick function getCountryData()
    var input = document.getElementById("country-search-mobile");

    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn-mobile").click();
        }
    });
    //Get the name of the searched Country and call API for data on that country
    function getCountryName() {
        dropdownMobile.classList.remove('active')
        var name = document.getElementById("country-search-mobile").value;
        console.log(document.getElementById("country-search-mobile").value) //delete
        if (name == ''){
            hamburger.classList.remove('open')
            // alert('Please enter the country')
        } else{
            //CountryName - name in russian, countryEng - name in english
            countryName = upperCaseName(name)
            countryEng = dictionary[countryName]
            return getCountryData(countryName, countryEng)
        }

    }
    
} else{
    //Press Enter to call onClick function getCountryData()
    var input = document.getElementById("country-search-pc");
    

    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn-pc").click();
        }
    });
    //Get the name of the searched Country and call API for data on that country
    function getCountryName() {
        dropdownMobile.classList.remove('active')
        var name = document.getElementById("country-search-pc").value;
        console.log(document.getElementById("country-search-pc").value) // delete
        if (name == ''){
            hamburger.classList.remove('open')
            // alert('Please enter the country')
        } else{
            //CountryName - name in russian, countryEng - name in english
            countryName = upperCaseName(name)
            countryEng = dictionary[countryName]
            return getCountryData(countryName, countryEng)
        }
    }
}
//Uppercase first letter of each word
function upperCaseName(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    if (splitStr == 'Сша'){
        return splitStr = 'США';
    } else if (splitStr == 'Usa'){
        return splitStr = 'USA';
    } else if (splitStr == 'Оаэ'){
        return splitStr = 'ОАЭ';
    } else if (splitStr == 'Дрк'){
        return splitStr = 'ДРК';
    }
    return splitStr.join(' '); 
 }

//Get API data for specific country
function getCountryData(countryName, countryEng) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    if (countryEng == undefined){
        countryEng = countryName
    }
    fetch(`https://coronavirus-19-api.herokuapp.com/countries/${countryEng}`)
    .then(response => {return response.json()})
    .then(result => {
        //Find the html element with id and change its text to number from API. 
        //Total data
        document.getElementById('country-name').innerHTML = countryName.toLocaleString('en');
        if (result.cases == null) {document.getElementById('cases').innerHTML = ''} 
        else {document.getElementById('cases').innerHTML = result.cases.toLocaleString('en')}
        if (result.recovered == null) {document.getElementById('recovered').innerHTML = 'Information unavailable'} 
        else {document.getElementById('recovered').innerHTML = result.recovered.toLocaleString('en')}
        if (result.active == null) {document.getElementById('active').innerHTML = 'Information unavailable'} 
        else {document.getElementById('active').innerHTML = result.active.toLocaleString('en')}
        if (result.critical == null) {document.getElementById('critical').innerHTML = 'Information unavailable'} 
        else {document.getElementById('critical').innerHTML = result.critical.toLocaleString('en')}
        if (result.deaths == null) {document.getElementById('deaths').innerHTML = 'Information unavailable'} 
        else {document.getElementById('deaths').innerHTML = result.deaths.toLocaleString('en')}

        //Daily data
        if (result.todayCases == null) {document.getElementById('new-cases').innerHTML = 'Information unavailable'} 
        else {document.getElementById('new-cases').innerHTML = '+' + result.todayCases.toLocaleString('en')}
        if (result.todayDeaths == null) {document.getElementById('new-deaths').innerHTML = 'Information unavailable'} 
        else {document.getElementById('new-deaths').innerHTML = '+' + result.todayDeaths.toLocaleString('en')}
        if(result.recovered == null || result.active == null || result.deaths == null){
            document.getElementById('no-info').innerHTML = 'Information unavailable'
            document.getElementById('donutchart').classList.add('hidden')
        } else{
            document.getElementById('no-info').innerHTML = ''
            document.getElementById('donutchart').classList.remove('hidden')
            return makeDonutChart(result)
        }

    })

    .catch(error => alert('ERROR: Country not found'), hamburger.classList.remove('open'))
};
function makeDonutChart(result){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        if(result.recovered == null || result.active == null || result.deaths == null){
            var data = google.visualization.arrayToDataTable([
                ['COVID-19 летальность', 'Mortality rate'],
                ['Recovered',     0],
                ['Active',     0],
                ['Died',  0]
            ]);
        }else{
            var data = google.visualization.arrayToDataTable([
                ['COVID-19 летальность', 'Mortality rate'],
                ['Recovered',     result.recovered],
                ['Active',     result.active],
                ['Died',  result.deaths]
            ]);
        }
        if (window.screen.width <= 400){
            var options = {
                titlePosition: 'none',
                pieHole: 0.3,
                pieSliceTextStyle: {
                    color: '#1a1a1a',
                    fontName: 'Montserrat',
                    fontSize: '18',
                    bold: true
                  },
                backgroundColor:{
                    fill: 'transparent'
                },
                colors: ['#84d184','#ffaa92','#d35656'],
                chartArea: {
                     width:'80%',height:'70%'
                },
                legend: {
                    textStyle: {color: '#f1dcdc',fontName: 'Montserrat',fontSize: '13'},
                    alignment: 'center',
                    position: 'top'
                },
                height: '300',
                width: '90%'
            };
        } else{
            var options = {
                titlePosition: 'none',
                pieHole: 0.3,
                pieSliceTextStyle: {
                    color: '#1a1a1a',
                    fontName: 'Montserrat',
                    fontSize: '18',
                    bold: true
                  },
                backgroundColor:{
                    fill: 'transparent'
                },
                colors: ['#84d184','#ffaa92','#d35656'],
                chartArea: {
                     width:'100%',height:'70%'
                },
                legend: {
                    textStyle: {color: '#f1dcdc',fontName: 'Montserrat',fontSize: '15'},
                    alignment: 'center',
                    position: 'top'
                },
                height: '400',
                width: '90%'
            };
        }
    
        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
        }
}

//Hamburger button
function hamburgerOpen(){
    if (!dropdownMobile.classList.contains("active")){
        dropdownMobile.classList.add('active')
    } else{
        dropdownMobile.classList.remove('active')
    }
    if (!hamburger.classList.contains("open")){
        hamburger.classList.add('open')
    } else{
        hamburger.classList.remove('open')
    }

}
function hamburgerClose(){
    dropdownMobile.classList.remove('active')
    hamburger.classList.remove('open')
}
// Language change dropdown option
function myFunctionPC() {
    document.getElementById("myDropdown-pc").classList.toggle("show");
}
function myFunctionMobile() {
    document.getElementById("myDropdown-mobile").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(e) {
        if (!e.target.matches('.dropbtn1')) {
            var myDropdownPC = document.getElementById("myDropdown-pc");
              if (myDropdownPC.classList.contains('show')) {
                myDropdownPC.classList.remove('show');
              }
        }
        if (!e.target.matches('.dropbtn2')) {
            var myDropdownMobile = document.getElementById("myDropdown-mobile");
              if (myDropdownMobile.classList.contains('show')) {
                myDropdownMobile.classList.remove('show');
              }
        }
}


// Activate mobile navbar
window.onorientationchange = function() { window.location.reload(); };

if (window.screen.width <= 1014){
    document.querySelector('.navbar').classList.add('hidden')
    document.querySelector('.navbar-mobile').classList.remove('hidden')
}


const dictionary = {
    'Россия' : 'Russia',
    'США' : 'USA',
    'Мир' : 'World',
    'Индия' : "India", 
    'Бразилия' : "Brazil",
    'Франция' : "France",
    'Испания' : "Spain", 
    'Великобритания' : "UK",
    'Италия' : "Italy", 
    'Аргентина' : "Argentina",
    'Колумбия': "Colombia",
    'Мексика': "Mexico",
    'Перу': "Peru",
    'Германия': "Germany",
    'Польша': "Poland",
    'Иран': "Iran",
    'Южная Африка': "South Africa",
    'Украина': "Ukraine",
    'Бельгия': "Belgium",
    'Чили': "Chile",
    'Ирак': "Iraq",
    'Чехия': "Czechia",
    'Недерланды': "Netherlands",
    'Турция': "Turkey",
    'Бангладеш': "Bangladesh",
    'Румыния': "Romania",
    'Филиппины': "Philippines", 
    'Пакистан': "Pakistan", 
    'Саудовская Аравия': "Saudi Arabia",
    'Канада': "Canada", 
    'Израиль': "Israel",
    'Марокко': "Morocco", 
    'Швейцария': "Switzerland",
    'Португалия': "Portugal", 
    'Австрия': "Austria",
    'Швеция': "Sweden",
    'Непал': "Nepal",
    'Иордания': "Jordan",
    'Эквадор': "Ecuador", 
    'Венгрия': "Hungary", 
    'ОАЭ': "UAE",
    'Панама': "Panama", 
    'Боливия': "Bolivia", 
    'Кувейт': "Kuwait", 
    'Доминиканская Республика': "Dominican Republic",
    'Катар': "Qatar",
    'Япония': "Japan", 
    'Коста-Рика': "Costa Rica",  
    'Армения': "Armenia", 
    'Беларусь': "Belarus", 
    'Казахстан': "Kazakhstan", 
    'Сербия': "Serbia", 
    'Болгария': "Bulgaria", 
    'Оман': "Oman", 
    'Гватемала': "Guatemala",
    'Ливан': "Lebanon",
    'Египет': "Egypt",
    'Грузия': "Georgia", 
    'Хорватия': "Croatia",
    'Эфиопия': "Ethiopia",
    'Гондурас': "Honduras", 
    'Венесуэла': "Venezuela",
    'Азербайджан': "Azerbaijan",
    'Молдова': "Moldova",
    'Словакия': "Slovakia", 
    'Греция': "Greece",
    'Тунис': "Tunisia", 
    'Бахрейн': "Bahrain", 
    'Мьянма': "Myanmar",
    'Босния и Герцеговина': "Bosnia and Herzegovina",
    'Ливия': "Libya",
    'Кения': "Kenya",
    'Парагвай': "Paraguay",
    'Алжир': "Algeria",
    'Палестина': "Palestine",
    'Дания': "Denmark",
    'Узбекистан': "Uzbekistan",
    'Ирландия': "Ireland", 
    'Кыргызстан': "Kyrgyzstan", 
    'Словения': "Slovenia",
    'Нигерия': "Nigeria", 
    'Малайзия': "Malaysia", 
    'Сингапур': "Singapore", 
    'Северная Македония': "North Macedonia",
    'Гана': "Ghana",
    'Литва': "Lithuania", 
    'Афганистан': "Afghanistan",
    'Сальвадор': "El Salvador", 
    'Албания': "Albania",
    'Норвегия': "Norway", 
    'Черногория': "Montenegro", 
    'Южная Корея': "S. Korea",
    'Люксембург': "Luxembourg", 
    'Австралия': "Australia", 
    'Камерун': "Cameroon",
    'Финляндия': "Finland",  
    "Кот-д'Ивуар": "Ivory Coast", 
    'Шри-Ланка': "Sri Lanka",
    'Уганда' : "Uganda",
    'Замбия': "Zambia",
    'Мадагаскар' : "Madagascar", 
    'Судан' : "Sudan", 
    'Сенегал' : "Senegal",
    'Мозамбик' : "Mozambique", 
    'Ангола' : "Angola",
    'Намибия' : "Namibia", 
    'Латвия' : "Latvia", 
    'Французская Полинезия' : "French Polynesia",
    'Гвинея' : "Guinea", 
    'Мальдивы' : "Maldives",
    'ДРК' : "DRC", 
    'Таджикистан' : "Tajikistan", 
    'Французская Гвиана' : "French Guiana",
    'Ямайка' : "Jamaica", 
    'Кабо-Верде' : "Cabo Verde", 
    'Эстония' : "Estonia", 
    'Ботсвана' : "Botswana", 
    'Зимбабве' : "Zimbabwe", 
    'Гаити' : "Haiti", 
    'Габон' : "Gabon", 
    'Мальта' : "Malta", 
    'Кипр' : "Cyprus",
    'Гваделупа' : "Guadeloupe", 
    'Мавритания' : "Mauritania", 
    'Куба' : "Cuba",
    'Реюньон' : "Réunion", 
    'Багамы' : "Bahamas", 
    'Сирия' : "Syria", 
    'Тринидад и Тобаго' : "Trinidad and Tobago",
    'Андорра' : "Andorra", 
    'Эсватини' : "Eswatini",
    'Малави' : "Malawi",
    'Гонконг' : "Hong Kong",
    'Руанда' : "Rwanda", 
    'Никарагуа' : "Nicaragua",
    'Джибути' : "Djibouti", 
    'Конго' : "Congo", 
    'Исландия' : "Iceland", 
    'Суринам' : "Suriname",
    'Белиз' : "Belize", 
    'Гайана' : "Guyana", 
    'Экваториальная Гвинея' : "Equatorial Guinea", 
    'Майотта' : "Mayotte",
    'Центральноафриканская Республика' : "Central African Republic",
    'Уругвай' : "Uruguay", 
    'Аруба' : "Aruba",
    'Мартиника' : "Martinique", 
    'Сомали' : "Somalia", 
    'Мали' : "Mali", 
    'Тайланд' : "Thailand", 
    'Гамбия' : "Gambia", 
    'Южный Судан' : "South Sudan",
    'Бенин' : "Benin", 
    'Того' : "Togo", 
    'Буркина-Фасо' : "Burkina Faso", 
    'Гвинея-Бисау' : "Guinea-Bissau", 
    'Сьерра-Леоне' : "Sierra Leone", 
    'Йемен' : "Yemen", 
    'Лесото' : "Lesotho", 
    'Новая Зеландия' : "New Zealand", 
    'Кюрасао' : "Curaçao", 
    'Чад' : "Chad", 
    'Либерия' : "Liberia", 
    'Сан-Марино' : "San Marino",  
    'Нигер' : "Niger", 
    'Вьетнам' : "Vietnam", 
    'Лихтенштейн' : "Liechtenstein", 
    'Нормандские острова' : "Channel Islands", 
    'Синт-Мартен' : "Sint Maarten", 
    'Сан-Томе и Принсипи' : "Sao Tome and Principe",
    'Гибралтар' : "Gibraltar", 
    'Теркс и Кайкос' : "Turks and Caicos", 
    'Алмазная принцесса' : "Diamond Princess", 
    'Сен-Мартен' : "Saint Martin", 
    'Монголия' : "Mongolia",
    'Бурунди' : "Burundi",
    'Папуа - Новая Гвинея' : "Papua New Guinea", 
    'Тайван' : "Taiwan",
    'Коморские острова' : "Comoros",
    'Монако' : "Monaco",
    'Эритрея' : "Eritrea",
    'Танзания' : "Tanzania",
    'Фарерские острова' : "Faeroe Islands",
    'Маврикий' : "Mauritius", 
    'Бутан' : "Bhutan", 
    'Остров Мэн' : "Isle of Man",
    'Камбоджа' : "Cambodia", 
    'Каймановы острова' : "Cayman Islands",
    'Барбадос' : "Barbados", 
    'Бермуды' : "Bermuda",
    'Санкт-Люсия' : "Saint Lucia",
    'Сейшельские острова' : "Seychelles",
    'Карибские Нидерланды' : "Caribbean Netherlands", 
    'Бруней' : "Brunei",  
    'Антигуа и Барбуда' : "Antigua and Barbuda", 
    'Сен-Барт' : "St. Barth", 
    'Сент-Винсент Гренадины' : "St. Vincent Grenadines",
    'Доминика' : "Dominica",
    'Британские Виргинские острова' : "British Virgin Islands",
    'Макао' : "Macao", 
    'Гренада' : "Grenada", 
    'Лаос' : "Laos", 
    'Фиджи' : "Fiji",
    'Новая Каледония' : "New Caledonia", 
    'Тимор-Лешти' : "Timor-Leste",
    'Ватикан' : "Vatican City", 
    'Сент-Китс и Невис' : "Saint Kitts and Nevis", 
    'Гренландия' : "Greenland", 
    'Фолклендские острова' : "Falkland Islands", 
    'Сен-Пьер Микелон' : "Saint Pierre Miquelon", 
    'Соломоновы острова' : "Solomon Islands",
    'Монсеррат' : "Montserrat", 
    'Западная Сахара' : "Western Sahara", 
    'МС Заандам' : "MS Zaandam",
    'Ангилья' : "Anguilla", 
    'Маршалловы острова' : "Marshall Islands", 
    'Уоллис и Футуна' : "Wallis and Futuna", 
    'Самоа' : "Samoa", 
    'Вануату' : "Vanuatu", 
    'Китай' : "China"
}