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
    number: String,
});

mongoose.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("PhoneNumber", phoneNumberSchema);
