const express = require("express")
const bodyParser = require('body-parser')

const { rootRoute } = require("./routes/rootRoute");



const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("."));

app.use("/", rootRoute);

app.listen(port, () => {
    console.log("connected with", port);
})
