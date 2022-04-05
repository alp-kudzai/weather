import logo from './logo.svg';
import './App.css';
import React from 'react'
import githubIcon from './github.png'
import emailIcon from './email.png'
import twitterIcon from './twitter.png'
import linkedinIcon from './linkedin.png'

const defValues = {
  exclude: 'minutely',
  units: 'metric'
}

//function that extracts current weather data from the API
function getCurrent(data){
  return data.current
}
function getDaily(data){
  return data.daily
}

function getHourly(data){
  return data.hourly
}
//function that convert dt to date and wind speed to km/h
function convertDt(dt){
  return new Date(dt*1000)
}
function convertWind(wind){
  return Math.round(wind*3.6)
}
function convertTemp(temp){
  return Math.round(temp)
}
function convertMoon(moon){
  
  if (moon ===0 || moon === 1){
    return 'wi wi-moon-alt-new'
  }
  else if (moon > 0 && moon < 0.25){
    return 'wi wi-moon-alt-waxing-crescent-4'
  }
  else if(moon === 0.25){
    return 'wi wi-moon-alt-first-quarter'
  }
  else if (moon > 0.25 && moon < 0.5){
    return 'wi wi-moon-alt-waxing-gibbous-4'
  }
  else if (moon === 0.5){
    return 'wi wi-moon-alt-full'
  }
  else if (moon > 0.5 && moon < 0.75){
    return 'wi wi-moon-alt-waning-gibbous-4'
  }
  else if (moon === 0.75){
    return 'wi wi-moon-alt-third-quarter'
  }
  else if (moon > 0.75 && moon < 1){
    return 'wi wi-moon-alt-waning-crescent-4'
  }
  
}
function convertRain(rain){
  return Math.round(rain*100)
}

function InputComponent(props){
  const {input, setInput, data, setData, getData} = props
  function handleEnter (e){
    if (e.key === 'Enter'){
      getData()
    }
  }
  const [time, setTime] = React.useState(new Date())

  const refreshTime = () =>{
    setTime(new Date())
  }

  React.useEffect(()=>{
    const timeId = setInterval(refreshTime, 1000)
    return ()=>{
      clearInterval(timeId)
    }
  }, [])
  return (
    <div className='InputComponent'>
      <div className='input-square'>
        <div className='input-logo'>
          <i className='wi wi-fog' ></i>
          <p className='input-title'>OVERCAST</p>
        </div>
        <div className='input-inner-square'>
          <div className='input-wrapper'>
            <button className='button' onClick={getData}><i className="bi bi-search"></i></button>
            <input className='input-box' type="text" placeholder='Sandton' onChange={(e) => setInput({...input, area: e.target.value})} onKeyDown={handleEnter}/>
            <input className='iso' type="text" placeholder='ZA' onChange={(e) => setInput({...input, code: e.target.value})} onKeyDown={handleEnter}/>
          </div>
        </div>
      </div>
      <div className='button-wrapper'>
        <p className='date-nav'>{new Date().toDateString()}</p>
        
        <p className='time-nav'>{time.toLocaleTimeString('en-ZA')}</p>
      </div>
      
    </div>
  )
}

function OutputComponent(props){
  const {data} = props
  const current = getCurrent(data)
  const daily = getDaily(data)
  const hourly = getHourly(data)
  return (
    <div className='OutputComponent'>
      <Current current={current}/>
      <Daily daily={daily}/>
      <Hourly hourly={hourly}/>
    </div>
  )
}

function WeatherMain(props){
  const {weather} = props
  return (
    <div className='weather-main'>
      <img className='weather-main-img' alt='' src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}/>
      <p className='weather-main-text'>{capsFirstLetters(weather.description)}</p>
    </div>
  )
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function capsFirstLetters(string){
  if (string.includes(' ')){
    return string.split(' ').map(word => capitalizeFirstLetter(word)).join(' ')
  }
}

function Current(props){
  const {current} = props
  return (
    <div className='current-wrapper'>
      <h2 className='current-head'>Current Weather</h2>
      <WeatherMain weather={current.weather[0]}/>
      <div className='current-info'>
        <div className='current-text'>
          <i className='wi wi-thermometer' ></i>
          <p className='current-text-value'>{convertTemp(current.temp)}°C</p>
        </div>
        <div className='current-text'>
          <i className='wi wi-humidity' ></i>
          <p className='current-text-value'>{current.humidity}%</p>
        </div>
        <div className='current-text'>
          <i className='wi wi-strong-wind' ></i> 
          <p className='current-text-value'>{convertWind(current.wind_speed)}km/h</p>
        </div>
        <div className='current-text'>
          <i className='wi wi-cloudy' ></i>
          <p className='current-text-value'>{current.clouds}%</p>
        </div>
      </div>
    </div>
  )
}

function Daily(props){
  const {daily} = props
  return (
    <div className='daily-wrapper'>
      <h2 className='daily-head'>The Week's Forecast</h2>
      <div className='daily-tiles'>
        {daily.map((day, index) => {
          return (
            <div className='daily-tile' key={index}>
              <div className='daily-tile-date'>
                <p className='daily-tile-date-text'>{convertDt(day.dt).toDateString()}</p>
              </div>
              <div className='daily-tile-weather'>
                <WeatherMain weather={day.weather[0]}/>
              </div>
              <div className='daily-tile-info'>
                <div className='daily-info'>
                  <p className='daily-info-text'><i className='wi wi-thermometer' ></i>max./min.</p>
                  <p className='daily-info-value'>{convertTemp(day.temp.max)}°C/{convertTemp(day.temp.min)}°C</p>
                </div>
                <div className='daily-info'>
                  <i className='wi wi-rain' ></i>
                  <p className='daily-info-value'>{convertRain(day.pop)}%</p>
                </div>
                <div className='daily-info'>
                  <p className='daily-info-text'>Moon Phase</p>
                  <i className={convertMoon(day.moon_phase)} ></i>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

//display in intervals of 3 hours
function Hourly(props){
  const {hourly} = props
  return (
    <div className='hourly-wrapper'>
      <h2 className='hourly-head'>48hr Forecast</h2>
      <div className='hourly-tiles'>
        {hourly.map((hour, index) => {
          if (index % 3 === 0 || index === 0){
            return (
              <div className='hourly-tile' key={index}>
                <div className='hourly-tile-date'>
                  <p className='hourly-tile-date-text'>{convertDt(hour.dt).toLocaleTimeString().slice(0,5)}</p>
                </div>
                <div className='hourly-tile-weather'>
                  <WeatherMain weather={hour.weather[0]}/>
                </div>
                <div className='hourly-tile-info'>
                  <div className='hourly-tile-info-temp'>
                    <i className='wi wi-thermometer' ></i>
                    <p className='hourly-tile-info-value'>{convertTemp(hour.temp)}°C</p>
                  </div>
                  <div className='hourly-tile-info-rain'>
                    <i className='wi wi-rain' ></i>
                    <p className='hourly-tile-info-value'>{convertRain(hour.pop)}%</p>
                  </div>
                </div>
              </div>
            )
          }else{return null}
        })}
      </div>
    </div>
  )
}

function Footer(){
  return (
    <div className='footer'>
      <p className='footer-text'>Created by <a href='https://alp-kudzai.github.io/webportfolio/'>Alp Kudzai</a></p>
      <div id='footer-socials'>
        <a href='https://github.com/alp-kudzai'>
            <img className='github-icon' src={githubIcon} alt='github'/>
        </a>
        <a href='https://twitter.com/KudzaiAlpha'>
          <img className='twitter-icon' src={twitterIcon} alt='' />
        </a>
        <a href='https://www.linkedin.com/in/kudzai-matsika-117698182/'>
          <img className='linkedin-icon' src={linkedinIcon} alt='' />
        </a>
        <a href='mailto:alpha.kudzai@gmail.com'>
          <img className='email-icon' src={emailIcon} alt='' />
        </a>
      </div>
      <p>&copy; Copyright {new Date().getFullYear()}</p>
      <p>The data used is retrived from openweathermap.org's API</p>
    </div>
  )
}

function App() {
  const [input, setInput] = React.useState({
    area: 'alexandra',
    code: 'ZA'
  })
  const [data, setData] = React.useState(null)

  const [loading, setLoading] = React.useState(false)


  const getData = () => {
    setLoading(true)
    setData(null)
    fetch(`/api/${input.area}&${input.code.toUpperCase()}&${defValues.exclude}&${defValues.units}`)
    .then(result => result.json())
    .then(data => {
      if(Object.keys(data).includes('error')){
        alert(data.error)
        setLoading(false)
        setData(null)
      }
      else{
        console.log(data)
        setLoading(false)
        setData(data)
      }
    })
  }
  return (
    <div className="App">
      <InputComponent input={input} setInput={setInput} data={data} setData={setData} getData={getData}/>
      {data ? <OutputComponent data={data}/> : <NoData loading={loading}/>}
      <Footer/>
    </div>
  );
}

function NoData (props){
  const {loading} = props
  return (
    <div id='no-data' className='no-data'>
      {loading ? <div className='loading-spinner'><i className='wi wi-thunderstorm loading-logo'></i></div> : <div></div>}
    </div>
  )
}

export default App;
