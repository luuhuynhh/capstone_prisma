const express = require("express")
const { rootRoute } = require("./routes/rootRoute");



const app = express();
const port = 8000;

app.use(express.json());
app.use("/", rootRoute);

app.listen(port, () => {
    console.log("connected with", port);
})
