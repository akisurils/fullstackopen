import { useEffect, useState } from "react";
import axios from "axios";

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

const SearchResult = ({ country, countryList }) => {
  const matchedCountries = countryList.filter((ct) => {
    return ct.name.common.toLowerCase().search(country.toLowerCase()) != -1;
  });
  console.log(matchedCountries);
  if (countryList.length == 0) {
    return <div>Loading, please wait...</div>;
  }

  if (matchedCountries.length == 1) {
    const matchedCountry = matchedCountries[0];
    return (
      <div>
        {matchedCountry.name.common}
        <h1>{matchedCountry.name.common}</h1>
        <div>Capital: {matchedCountry.capital[0]}</div>
        <div>Area: {matchedCountry.area} km2</div>
        <h3>Languages:</h3>
        <ul>
          {Object.values(matchedCountry.languages).map((l) => (
            <li>{l}</li>
          ))}
        </ul>
        <img src={matchedCountry.flags.svg} alt={matchedCountry.flags.alt} />
      </div>
    );
  }

  if (matchedCountries.length <= 10) {
    return (
      <div>
        {matchedCountries.map((ct, id) => {
          return <div key={id}>{ct.name.common}</div>;
        })}
      </div>
    );
  }

  return <div></div>;
};

function App() {
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState([]);

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
      <SearchResult country={country} countryList={countryList} />
    </>
  );
}

export default App;
