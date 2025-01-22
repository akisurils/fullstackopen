const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const url = process.env.VITE_MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneNumberSchema = mongoose.Schema({
    name: String,
    number: String,
});

const PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

morgan.token("reqbody", (request, response) => {
    return JSON.stringify(request.body);
});
app.use(
    morgan(
        ":method :url :status :req[content-length] - :response-time ms :reqbody"
    )
);

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/info", (request, response) => {
    const currentDate = Date(Date.now);
    response.send(
        `<div>Phonebook have infomation of ${
            persons.length
        } people</div> <br /> <div>${currentDate.toString()}</div>`
    );
});

app.get("/api/persons", (request, response) => {
    PhoneNumber.find({}).then((phoneNumber) => {
        response.json(phoneNumber);
    });
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const phoneNumbers = PhoneNumber.find({ _id: id }).then((phoneNumber) => {
        console.log(phoneNumber);
        if (phoneNumber) {
            response.json(phoneNumber);
        } else {
            response.status(404).end("Phone number not found");
        }
    });
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const phoneNumbers = PhoneNumber.find({ _id: id }).then((phoneNumber) => {
        const note = notes.find((n) => (n._id = id));
    });

    if (phoneNumbers) {
        response.json(phoneNumbers);
    } else {
        response.status(404).end("Phone number not found");
    }

    if (!person) {
        return response.status(404).end("404 not found");
    }

    persons = persons.filter((p) => p.id !== id);
    return response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;
    const id = body.id;

    if (!name) {
        return response.status(400).end("missing name");
    }

    if (!number) {
        return response.status(400).end("missing number");
    }

    if (persons.find((person) => person.name === name)) {
        return response.status(400).end("name must be unique");
    }

    if (persons.find((person) => person.id === id)) {
        return response.status(400).end("id must be unique");
    }

    newPerson = { name, number, id };
    persons = persons.concat(newPerson);
    return response.json(newPerson);
});

app.put("/api/persons/:id", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;
    const id = body.id;

    if (!name) {
        return response.status(400).end("missing name");
    }

    if (!number) {
        return response.status(400).end("missing number");
    }

    newPerson = { name, number, id };
    persons = persons.map((p) => (p.id === id ? newPerson : p));
    return response.json(newPerson);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port: ${PORT}`);
