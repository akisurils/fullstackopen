import { useState } from "react";

const FilterForm = ({ filterName, setFilterName }) => {
  return (
    <div>
      Filter:
      <input
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />
    </div>
  );
};

const Persons = ({ persons, filterName }) => {
  return (
    <div>
      {persons
        .filter((person) => {
          // console.log(person.name.toLowerCase());
          // console.log(filterName.toLowerCase());
          return (
            person.name.toLowerCase().search(filterName.toLowerCase()) != -1
          );
        })
        .map((person) => {
          return (
            <div key={person.id}>
              {person.name} {person.number}
            </div>
          );
        })}
    </div>
  );
};

const AddPersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    if (
      persons.find(
        (person) => person.name.toUpperCase() === newName.toUpperCase()
      ) != undefined
    ) {
      alert(newName + " has already exist!");
      setNewName("");
      setNewPhoneNumber("");
      return;
    }

    const newPerson = {
      name: newName,
      number: newPhoneNumber,
      id: persons.length + 1,
    };
    setPersons(persons.concat(newPerson));
    setNewPhoneNumber("");
    setNewName("");
  };

  return (
    <form>
      <div>
        Name:{" "}
        <input
          placeholder="Jone Doe"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        Number:
        <input
          placeholder="999-919293"
          value={newPhoneNumber}
          onChange={(e) => setNewPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <button onClick={addPerson}>add</button>
      </div>
    </form>
  );
};

// Main app
const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  
  const [filterName, setFilterName] = useState("");

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filterName={filterName} setFilterName={setFilterName} />
      <h2>Add a person</h2>
      <AddPersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filterName} />
    </div>
  );
};

export default App;
