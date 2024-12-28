import { useState } from "react";

const StatisticLine = (props) => {
  const { text, value } = props;
  return (
    <>
      <td>{text}</td>

      <td>
        {value}
        {text == "Positive" ? "%" : ""}
      </td>
    </>
  );
};

const Statistics = (props) => {
  return (
    <table>
      <tbody>
        <tr>
          <StatisticLine text="Good" value={props.good} />
        </tr>
        <tr>
          <StatisticLine text="Neutral" value={props.neutral} />
        </tr>
        <tr>
          <StatisticLine text="Bad" value={props.bad} />
        </tr>
        <tr>
          <StatisticLine
            text="Average"
            value={(props.good - props.bad) / props.all}
          />
        </tr>
        <tr>
          <StatisticLine
            text="Positive"
            value={(props.good / props.all) * 100}
          />
        </tr>
      </tbody>
    </table>
  );
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);

  function handleGood() {
    setGood(good + 1);
    setAll(all + 1);
  }

  function handleBad() {
    setBad(bad + 1);
    setAll(all + 1);
  }

  function handleNeutral() {
    setNeutral(neutral + 1);
    setAll(all + 1);
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGood} text="Good" />
      <Button onClick={handleNeutral} text="Neutral" />
      <Button onClick={handleBad} text="Bad" />
      <h1>Statistics</h1>
      {all > 0 ? (
        <Statistics good={good} neutral={neutral} bad={bad} all={all} />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
}

export default App;
