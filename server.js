const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
//Connect Database
connectDB();

//Init Middleware
//bodyParser is now included in express
app.use(express.json({ extended: false }));

//Define routes
app.use("/api/users", require("./Routes/api/users"));
app.use("/api/auth", require("./Routes/api/auth"));
app.use("/api/profile", require("./Routes/api/profile"));
app.use("/api/posts", require("./Routes/api/posts"));

//serve static assest in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));
