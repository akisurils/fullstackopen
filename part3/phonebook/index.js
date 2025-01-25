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

const unexpectedErrorHandler = (error, request, response, next) => {
    console.log(error.message);
    response.status(500).end("Unexpected error");
    next(error);
};

app.get("/info", (request, response) => {
    const currentDate = Date(Date.now);
    response.send(
        `<div>Phonebook have infomation of ${
            persons.length
        } people</div> <br /> <div>${currentDate.toString()}</div>`
    );
});

app.get("/api/persons", (request, response) => {
    PhoneNumber.find({})
        .then((phoneNumber) => {
            response.json(phoneNumber);
        })
        .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
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
            next(error);
        });
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).end("Invalid id");
    }
    PhoneNumber.deleteOne({ _id: id })
        .then(() => {
            console.log(response);
            response.status(204).end();
        })
        .catch((error) => {
            next(error);
        });
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;

    if (!name) {
        return response.status(400).end("missing name");
    }

    if (!number) {
        return response.status(400).end("missing number");
    }

    PhoneNumber.find({ name })
        .then((phoneNumber) => {
            console.log(phoneNumber);
            if (phoneNumber.length !== 0) {
                return response.status(400).end("name must be unique");
            }
            const newPhoneNumber = new PhoneNumber({ name, number });
            newPhoneNumber
                .save()
                .then((result) => {
                    response.json(newPhoneNumber);
                })
                .catch((error) => next(error));
            console.log("saved new phone number");
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;
    const id = request.params.id;

    if (!name) {
        return response.status(400).end("missing name");
    }

    if (!number) {
        return response.status(400).end("missing number");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).end("Invalid id");
    }

    PhoneNumber.findById(id)
        .then((phoneNumber) => {
            phoneNumber.number = body.number;
            console.log(phoneNumber.number);
            phoneNumber.save().then(() => {
                return response.json({ name, number, id });
            });
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(unexpectedErrorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port: ${PORT}`);
