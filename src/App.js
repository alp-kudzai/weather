import logo from './logo.svg';
import './App.css';
import React from 'react'
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
    return 'New Moon'
  }
  else if (moon > 0 && moon < 0.25){
    return 'Waxing Crescent'
  }
  else if(moon === 0.25){
    return 'First Quarter Moon'
  }
  else if (moon > 0.25 && moon < 0.5){
    return 'Waxing Gibbous'
  }
  else if (moon === 0.5){
    return 'Full Moon'
  }
  else if (moon > 0.5 && moon < 0.75){
    return 'Waning Gibbous'
  }
  else if (moon === 0.75){
    return 'Last Quarter Moon'
  }
  else if (moon > 0.75 && moon < 1){
    return 'Waning Crescent'
  }
  
}
function convertRain(rain){
  return Math.round(rain*100)
}

function InputComponent(props){
  const {input, setInput, data, setData, getData} = props
  return (
    <div className='InputComponent'>
      <div className='input-square'>
        <div className='input-wrapper'>
          <p className='input-text'>Area</p>
          <input className='input-box' type="text" value={input.area} onChange={(e) => setInput({...input, area: e.target.value})}/>
        </div>
        <div className='input-wrapper'>
          <p className='input-text'>Code</p>
          <input className='input-box' type="text" value={input.code} onChange={(e) => setInput({...input, code: e.target.value})}/>
        </div>
      </div>
      <button className='button' onClick={getData}>Get Data</button>
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
      <p className='weather-main-text'>{weather.description.toUpperCase()}</p>
    </div>
  )
}

function Current(props){
  const {current} = props
  return (
    <div className='current-wrapper'>
      <h2 className='current-title title'>Current Weather</h2>
      <WeatherMain weather={current.weather[0]}/>
      <div className='current-info'>
        <div className='current-text'>
          <p className='current-text-title'>Temperature</p>
          <p className='current-text-value'>{convertTemp(current.temp)}°C</p>
        </div>
        <div className='current-text'>
          <p className='current-text-title'>Humidity</p>
          <p className='current-text-value'>{current.humidity}%</p>
        </div>
        <div className='current-text'>
          <p className='current-text-title'>Wind Speed</p>
          <p className='current-text-value'>{convertWind(current.wind_speed)}km/h</p>
        </div>
        <div className='current-text'>
          <p className='current-text-title'>Cloud Coverage</p>
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
      <h2 className='daily-head'>Daily Weather</h2>
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
                  <p className='daily-info-text'>Temp.(min)</p>
                  <p className='daily-info-value'>{convertTemp(day.temp.min)}°C</p>
                </div>
                <div className='daily-info'>
                  <p className='daily-info-text'>Temp.(max)</p>
                  <p className='daily-info-value'>{convertTemp(day.temp.max)}°C</p>
                </div>
                <div className='daily-info'>
                  <p className='daily-info-text'>Rain</p>
                  <p className='daily-info-value'>{convertRain(day.pop)}%</p>
                </div>
                <div className='daily-info'>
                  <p className='daily-info-text'>Moon Phase</p>
                  <p className='daily-info-value'>{convertMoon(day.moon_phase)}</p>
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
      <h2 className='hourly-head'>Hourly Weather</h2>
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
                    <p className='hourly-tile-info-text'>Temperature</p>
                    <p className='hourly-tile-info-value'>{convertTemp(hour.temp)}°C</p>
                  </div>
                  <div className='hourly-tile-info-rain'>
                    <p className='hourly-tile-info-text'>Rain</p>
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

function App() {
  const [input, setInput] = React.useState({
    area: 'alexandra',
    code: 'ZA'
  })
  const [data, setData] = React.useState(null)

  const getData = () => {
    fetch(`/api/${input.area}&${input.code}&${defValues.exclude}&${defValues.units}`)
    .then(result => result.json())
    .then(data => {
      if(Object.keys(data).includes('error')){
        alert(data.error)
      }
      else{
        console.log(data)
        setData(data)
      }
    })
  }
  return (
    <div className="App">
      <InputComponent input={input} setInput={setInput} data={data} setData={setData} getData={getData}/>
      {data ? <OutputComponent data={data}/> : <div className='no-data'></div>}
    </div>
  );
}

export default App;
