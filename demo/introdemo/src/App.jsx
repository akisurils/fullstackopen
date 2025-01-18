import Note from "./components/Note";
import Notification from "./components/Notification";
import noteService from "./services/notes";
import axios from "axios";
import { useState, useEffect } from "react";

const Footer = () => {
    const footerStyle = {
        color: "green",
        fontStyle: "italic",
        fontSize: 16,
    };

    return (
        <div style={footerStyle}>
            <br />
            <em>
                Note, app. Department of Computer Science, University of
                Helsinki, 2004
            </em>
        </div>
    );
};

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        // console.log("effect");
        noteService //
            .getAll()
            .then((initialNotes) => {
                // console.log("Promise fulfilled, yay!");
                setNotes(initialNotes);
            });
    }, []);

    // console.log("render", notes.length, "notes");

    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important === true);

    const addNote = (event) => {
        event.preventDefault();
        console.log("Clicked", event.target);
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        };

        noteService //
            .create(noteObject)
            .then((newNote) => {
                setNotes(notes.concat(newNote));
                setNewNote("");
            });
    };

    const handleNoteChange = (event) => {
        console.log(event.target.value);
        setNewNote(event.target.value);
    };

    const toggleImportance = (_id) => {
        console.log(`importance of ${_id} need to be toggle`);
        const note = notes.find((note) => note._id === _id);
        const changedNote = { ...note, important: !note.important };

        noteService //
            .update(_id, changedNote)
            .then((returnedNote) => {
                setNotes(notes.map((n) => (n._id === _id ? returnedNote : n)));
            })
            .catch((error) => {
                setErrorMessage(
                    `The note '${note.content}' was already deleted from server`
                );
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((n) => n._id !== _id));
            });
    };

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    Show {showAll ? "important" : "all"}
                </button>
            </div>
            {notesToShow.map((note) => (
                <Note
                    key={note._id}
                    note={note}
                    toggleImportance={() => toggleImportance(note._id)}
                />
            ))}
            <form onSubmit={addNote}>
                <input
                    type="text"
                    placeholder="a new note.."
                    value={newNote}
                    onChange={handleNoteChange}
                />
                <button type="submit">Save</button>
            </form>
            <Footer />
        </div>
    );
};

export default App;
