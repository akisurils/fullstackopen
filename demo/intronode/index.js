const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];

const url = process.env.VITE_MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);
const note = new Note({
    content: "Mongoose make thing easy",
    important: true,
});

app.get("/", (request, response) => {
    response.send("<h1>Hello WORLD!</h1>");
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes);
        console.log(notes);
    });
});

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const note = notes.find((n) => n.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end("Nahh bro tripping ts aint exist");
    }
});

app.put("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const body = request.body;
    const oldNote = notes.find((n) => n.id === id);

    if (!body.content) {
        return response.status(400).end("missing content");
    }

    if (!body.id) {
        return response.status(400).end("missing id");
    }

    if (!Object.hasOwn(body, "important")) {
        // console.log(body.important);
        return response.status(400).end("missing important");
    }

    if (!oldNote) {
        return response.status(404).end("note does not exist");
    }

    const newNote = {
        id: body.id,
        content: body.content,
        important: body.important,
    };
    notes = notes.map((n) => {
        return n.id === id ? newNote : n;
    });
    // console.log(notes);
    return response.status(200).json(newNote);
});

app.delete("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    notes = notes.filter((note) => note.id !== id);

    response.status(204).end();
});

const generatedId = () => {
    const maxId =
        notes.length > 0 //
            ? Math.max(...notes.map((n) => Number(n.id)))
            : 0;
    return String(maxId + 1);
};

app.post("/api/notes", (request, response) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({ error: "content missing" });
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generatedId(),
    };

    notes = notes.concat(note);

    response.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
