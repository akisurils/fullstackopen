const express = require("express");
const cors = require("cors");
const config = require("./utils/configs");
const logger = require("./utils/loggers");
const Note = require("./models/note");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

const errorHandler = (error, request, response, next) => {
    if (error.name === "ValidationError") {
        console.log(error.message);
        return response.status(400).json({ error: error.message });
    } else if (error.name === "CastError") {
        return response.status(400).json({ error: error.message });
    }
    response.status(500).end("Unexpected error");
    next(error);
};

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

app.get("/", (request, response) => {
    response.send("<h1>Hello WORLD!</h1>");
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes);
    });
});

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    Note.findById(id)
        .then((note) => {
            response.json(note);
        })
        .catch((error) =>
            response.status(404).end("UHH NOT FOUND", error.messsage)
        );
});

app.put("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const body = request.body;

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).end("Invalid id");
    }

    Note.findById(id)
        .then((note) => {
            note.important = body.important;
            response.status(200).json(note);
        })
        .catch((error) => {
            response.status(404).end("Error:", error);
        });
});

app.delete("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    notes = notes.filter((note) => note.id !== id);

    response.status(204).end();
});

// const generatedId = () => {
//     const maxId =
//         notes.length > 0 //
//             ? Math.max(...notes.map((n) => Number(n.id)))
//             : 0;
//     return String(maxId + 1);
// };

app.post("/api/notes", (request, response, next) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({ error: "content missing" });
    }

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    });

    note.save()
        .then(() => {
            console.log(note);
            response.json(note);
        })
        .catch((error) => next(error));
});

app.use(errorHandler);

app.listen(config.PORT);
logger.info(`Server is running on port ${config.PORT}`);
