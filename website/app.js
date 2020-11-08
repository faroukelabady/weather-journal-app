/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = '9ea801f0fb9f6cb0927948bc4ca20b43';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const content = document.getElementById('content');

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
  const zipCode = document.getElementById('zip').value;
  const feeling = document.getElementById('feelings').value;
  getWeatherData(baseUrl, zipCode, apiKey).then( data => {
    console.log(data)
    if(data.cod != '200') {
      date.innerHTML = 'Could not get the weather info';
      throw new Error('Could not get the weather info');
    }
    postWeatherFeeling('/postData', {
      temperature : data.main.temp,
      date: newDate,
      feeling: feeling
    });  
  }).then( recentEntry => {
    updateUI(recentEntry);
  })


}

const getWeatherData = async (baseurl = '', zipCode,  apiId = apiKey) => {

  date.innerHTML = 'Loading weather';
  temp.innerHTML = '';
  content.innerHTML = '';
  const url = baseurl + zipCode + '&units=metric&appid=' + apiId;
  const response = await fetch(url);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    date.innerHTML = 'Could not get the weather info';
    console.log('error', error);
  }
}

const postWeatherFeeling = async (url = '', data = {}) => {
  const response = await fetch(url , {
    method: "POST", 
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(data)
  })
  try {
    const latestEntries = await response.json();
    const date = document.getElementById('date');
    date.innerHTML = '';
    return latestEntries; 
  } catch (error) {
    console.log('error', error);
  }
}

const updateUI = async (recentEntries) => {
  const response = await fetch('/all');
  try {
    const data = await response.json();
    date.innerHTML = 'Current Date : ' + data.date;
    temp.innerHTML = 'Temperature celsuis : ' + data.temperature + `&deg;C`;
    content.innerHTML = 'How I feel : ' + data.feeling;
  } catch (error) {
    console.log('error', error);
  }
}