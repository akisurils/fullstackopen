import { useEffect, useState } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_WEATHER_API_KEY;

const CountryInputForm = ({ country, setCountry }) => {
  const handleInputChange = (event) => {
    // console.log(event.target.value);
    setCountry(event.target.value);
  };
  return (
    <div>
      Find countries:{" "}
      <input
        type="text"
        placeholder="United State"
        onChange={handleInputChange}
        value={country}
      />
    </div>
  );
};

const CountryDetail = ({ country }) => {
  const [weatherDetail, setWeatherDetail] = useState(null);

  useEffect(() => {
    axios
      .get(`http://api.weatherapi.com/v1/current.json?key=${api_key}`, {
        params: { q: country.capital[0] },
      })
      .then((response) => {
        setWeatherDetail(response.data);
      });
  }, [country.capital]);

  return (
    <div>
      {country.name.common}
      <h1>{country.name.common}</h1>
      <div>Capital: {country.capital[0]}</div>
      <div>Area: {country.area} km2</div>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((l, id) => (
          <li key={id}>{l}</li>
        ))}
      </ul>
      <img width={100} src={country.flags.svg} alt={country.flags.alt} />
      <h3>Weather in {country.capital[0]}</h3>
      {weatherDetail === null ? (
        <div>Loading weather detail</div>
      ) : (
        <div>
          <div>Temperature {weatherDetail.current.temp_c} Celcius</div>
          <img
            src={weatherDetail.current.condition.icon}
            alt={weatherDetail.current.condition.text}
          />
          <div>Wind {weatherDetail.current.wind_kph} kph</div>
        </div>
      )}
    </div>
  );
};

const SearchResult = ({
  country,
  countryList,
  singleCountryView,
  setSingleCountryView,
}) => {
  const matchedCountries = countryList.filter((ct) => {
    return ct.name.common.toLowerCase().search(country.toLowerCase()) != -1;
  });

  console.log(matchedCountries);
  if (countryList.length == 0) {
    return <div>Loading, please wait...</div>;
  }

  if (singleCountryView.isViewing) {
    return <div></div>;
  }

  if (matchedCountries.length == 1) {
    const matchedCountry = matchedCountries[0];
    return <CountryDetail country={matchedCountry} />;
  }

  const handleSingleCountryView = (ct) => {
    const newView = { cca2: ct.cca2, isViewing: true };
    setSingleCountryView(newView);
  };

  if (matchedCountries.length <= 10) {
    return (
      <div>
        {matchedCountries.map((ct, id) => {
          return (
            <div key={id}>
              {ct.name.common}{" "}
              <button onClick={() => handleSingleCountryView(ct)}>show</button>
            </div>
          );
        })}
      </div>
    );
  }

  return <div></div>;
};

const SingleCountryView = ({
  countryList,
  singleCountryView,
  setSingleCountryView,
}) => {
  if (singleCountryView.isViewing) {
    return (
      <div>
        <CountryDetail
          country={countryList.find((ct) => ct.cca2 == singleCountryView.cca2)}
        />
        <button
          onClick={() => {
            const newView = { cca2: null, isViewing: false };
            setSingleCountryView(newView);
          }}
        >
          back
        </button>
      </div>
    );
  }
  return <div></div>;
};

function App() {
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [singleCountryView, setSingleCountryView] = useState({
    cca2: null,
    isViewing: false,
  });

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response.data);
        setCountryList(response.data);
      });
  }, []);

  return (
    <>
      <CountryInputForm country={country} setCountry={setCountry} />
      <SearchResult
        country={country}
        countryList={countryList}
        singleCountryView={singleCountryView}
        setSingleCountryView={setSingleCountryView}
      />
      <SingleCountryView
        countryList={countryList}
        singleCountryView={singleCountryView}
        setSingleCountryView={setSingleCountryView}
      />
    </>
  );
}

export default App;
