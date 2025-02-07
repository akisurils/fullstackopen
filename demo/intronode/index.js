const express = require("express");
const cors = require("cors");
const config = require("./utils/configs");
const logger = require("./utils/loggers");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.errorHandler);

app.listen(config.PORT);
logger.info(`Server is running on port ${config.PORT}`);
