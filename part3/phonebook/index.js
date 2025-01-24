const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();
const PhoneNumber = require("./models/phonenumber");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

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
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).end("Invalid id");
    }
    PhoneNumber.findById(id)
        .then((phoneNumber) => {
            if (!phoneNumber) {
                response.status(404).end("Phone number not found");
            } else {
                response.json(phoneNumber);
            }
        })
        .catch((error) => {
            console.log(error);
            response.status(500).end("Unexpected error:", error);
        });
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).end("Invalid id");
    }
    PhoneNumber.deleteOne({ _id: id })
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => {
            response.json(error);
        });
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;

    if (!name) {
        return response.status(400).end("missing name");
    }

    if (!number) {
        return response.status(400).end("missing number");
    }

    PhoneNumber.find({ name }).then((phoneNumber) => {
        if (phoneNumber) {
            return response.status(400).end("name must be unique");
        }
    });

    const newPhoneNumber = new PhoneNumber({ name, number });
    newPhoneNumber.save().then((result) => {
        response.json(newPhoneNumber);
    });
});

app.put("/api/persons/:id", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;
    const id = body.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).end("Invalid id");
    }

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
