import { useEffect, useState } from "react";
import phoneService from "./services/personPhone";
import Notification from "./components/Notification";

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

const Persons = ({ persons, filterName, setPersons, setMessage }) => {
    const notifyAction = (msg, isError) => {
        setMessage({
            message: msg,
            isError: isError,
        });
        setTimeout(() => {
            setMessage({
                message: null,
                isError: isError,
            });
        }, 3000);
    };

    const handleDelete = (person) => {
        const confirmed = window.confirm(
            `Do you want to delete ${person.name} phone number?`
        );

        if (confirmed)
            phoneService
                .deletePhone(person._id)
                .then(setPersons(persons.filter((p) => p._id !== person._id)))
                .catch((er) => {
                    notifyAction(
                        `${person.name} has already been deleted from the phone book.`
                    );
                });
    };

    return (
        <div>
            {persons
                .filter((person) => {
                    // console.log(person.name.toLowerCase());
                    // console.log(filterName.toLowerCase());
                    return (
                        person.name
                            .toLowerCase()
                            .search(filterName.toLowerCase()) != -1
                    );
                })
                .map((person) => {
                    return (
                        <div key={person._id}>
                            {person.name} {person.number}{" "}
                            <button
                                onClick={() => {
                                    handleDelete(person);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    );
                })}
        </div>
    );
};

const AddPersonForm = ({ persons, setPersons, setMessage }) => {
    const [newName, setNewName] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");

    const addPerson = () => {
        const newPerson = {
            name: newName,
            number: newPhoneNumber,
        };

        phoneService.addPhone(newPerson).then(() => {
            setPersons(persons.concat(newPerson));
        });

        setNewPhoneNumber("");
        setNewName("");
    };

    const handleDuplicateName = (duplicatedId) => {
        const replacing = window.confirm(
            `${newName} has already existed in the phonebook. Replace the old number with the new one?`
        );

        if (replacing) {
            const newPerson = {
                name: newName,
                number: newPhoneNumber,
            };
            phoneService
                .changePhone(duplicatedId, newPerson)
                .then(() => {
                    setPersons(
                        persons.map((p) =>
                            p._id === duplicatedId ? newPerson : p
                        )
                    );
                    notifyAction(
                        `${newName}'s number has been changed.`,
                        false
                    );
                })
                .catch((error) => {
                    notifyAction(
                        `${newName} has been deleted from the phonebook.`,
                        false
                    );
                    persons.filter((p) => p !== duplicatedId);
                });
        }
    };

    const notifyAction = (msg, isError) => {
        setMessage({
            message: msg,
            isError: isError,
        });
        setTimeout(() => {
            setMessage({
                message: null,
                isError: isError,
            });
        }, 3000);
    };

    const handleAddAction = (event) => {
        event.preventDefault();
        let duplicatedId = persons.find(
            (person) => person.name.toUpperCase() === newName.toUpperCase()
        );
        if (duplicatedId != undefined) {
            // console.log(duplicatedId);
            handleDuplicateName(duplicatedId._id);
            setNewPhoneNumber("");
            setNewName("");
            return;
        }

        addPerson();
        notifyAction(`${newName} has been added to the phonebook.`, false);
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
                <button onClick={handleAddAction}>add</button>
            </div>
        </form>
    );
};

// Main app
const App = () => {
    const [persons, setPersons] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [message, setMessage] = useState({ message: null, isError: false });

    useEffect(() => {
        phoneService.getAllPhone().then((phones) => {
            console.log(phones);
            setPersons(phones);
        });
    }, []);

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message.message} isError={message.isError} />
            <FilterForm filterName={filterName} setFilterName={setFilterName} />
            <h2>Add a person</h2>
            <AddPersonForm
                persons={persons}
                setPersons={setPersons}
                setMessage={setMessage}
            />
            <h2>Numbers</h2>
            <Persons
                persons={persons}
                filterName={filterName}
                setPersons={setPersons}
                setMessage={setMessage}
            />
        </div>
    );
};

export default App;
