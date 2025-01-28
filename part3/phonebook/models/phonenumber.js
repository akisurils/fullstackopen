const mongoose = require("mongoose");

const url = process.env.VITE_MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
    .connect(url)
    .then((result) => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Cannot connect to MongoDB:", error.message);
    });

const phoneNumberSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: (v) => {
                return /\d{2,3}-\d+/.test(v);
            },
            message: (props) =>
                `${props.value} is not valid. Number must have at least 8 digits with "-" seperate at second or third digit.`,
        },
    },
});

mongoose.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("PhoneNumber", phoneNumberSchema);
