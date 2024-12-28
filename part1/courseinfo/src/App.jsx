const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (id, props) => {
  return (
    <p key={id}>
      {props.name} {props.exercise}
    </p>
  );
};

const Content = (props) => {
  return props.parts.map((part, id) => Part(id, part));
};

const Total = (props) => {
  let sum = 0;
  for (const i in props.parts) {
    sum += props.parts[i].exercises;
  }
  return <p>Number of exercises {sum}</p>;
};

const App = () => {
  const course = "Half Stack application developement";
  const parts = [
    {
      name: "Fundamental of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    {
      name: "State of a component",
      exercises: 14,
    },
  ];
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
