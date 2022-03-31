const express = require("express");

// App
const app = express();
app.set("port", process.env.PORT || 5000);

// your angular-project folder
app.use("/", express.static(__dirname + "/"));

app.listen(app.get("port"), function () {
  console.log("running: port", app.get("port"));
});
