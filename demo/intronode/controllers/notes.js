const notesRouter = require("express").Router();
const mongoose = require("mongoose");
const Note = require("../models/note");

notesRouter.get("/", (request, response) => {
    response.send("<h1>Hello WORLD!</h1>");
});

notesRouter.get("/api/notes", (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes);
    });
});

notesRouter.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    Note.findById(id)
        .then((note) => {
            response.json(note);
        })
        .catch((error) =>
            response.status(404).end("UHH NOT FOUND", error.messsage)
        );
});

notesRouter.put("/api/notes/:id", (request, response) => {
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

notesRouter.delete("/api/notes/:id", (request, response, next) => {
    const id = request.params.id;
    Note.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// const generatedId = () => {
//     const maxId =
//         notes.length > 0 //
//             ? Math.max(...notes.map((n) => Number(n.id)))
//             : 0;
//     return String(maxId + 1);
// };

notesRouter.post("/api/notes", (request, response, next) => {
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

module.exports = notesRouter;
