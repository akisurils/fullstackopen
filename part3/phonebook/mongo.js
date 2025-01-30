const mongoose = require("mongoose");

const url = process.env.VITE_MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneNumberSchema = mongoose.Schema({
    name: String,
    number: String,
});

const PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

// node mongo.js [password] [name] [number]
const phoneNumber = new PhoneNumber({
    name: process.argv[3],
    number: process.argv[4],
});

if (process.argv.length === 5) {
    phoneNumber
        .save()
        .then(() => {
            console.log(
                `${process.argv[3]}'s number: ${process.argv[4]} has been saved to PhoneBook`
            );
            mongoose.connection.close();
        })
        .catch((err) => {
            console.log(err);
        });
    return;
}

if (process.argv.length === 3) {
    console.log("Phonebook:");
    PhoneNumber.find({}).then((result) => {
        result.forEach((note) => {
            console.log(`${note.name} ${note.number}`);
        });
        mongoose.connection.close();
    });
}
