const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const postRouter = require("./routes/post");
const validators = require("./validators");

const port = process.env.PORT || 7000;
const frontPath = path.join(__dirname, "front");

mongoose
  .connect(validators.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.error(err));

const myApp = express();
myApp.use(bodyParser.json());
myApp.use("/api/post", postRouter);
myApp.use(express.static(frontPath));

myApp.listen(port, () => {
  console.log(`Server has been started on port ${port}`);
});
