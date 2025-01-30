const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    return;
}

const password = process.argv[2];

const url = `mongodb+srv://akisuri:${password}@fullstackopen.tehbi.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstackopen`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//     content: "Mongoose make thing easy",
//     important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   console.log(result);
//   mongoose.connection.close();
// });

Note.find({ important: true }).then((result) => {
    result.forEach((note) => {
        console.log(note);
    });
    mongoose.connection.close();
});
