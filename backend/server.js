const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());

const port = 9000;

const pathToFrontend = (path.join(`${__dirname}/../frontend`))

app.get("/", (req, res, next) => {                  
    res.sendFile(`${pathToFrontend}/index.html`);
}) 

app.get("/image-list", (req, res, next) => {                  
    res.sendFile(`${pathToFrontend}/data.json`);
}) 


app.use('/pub', express.static(`${pathToFrontend}/pub`));
app.use('/dist', express.static(`${pathToFrontend}/dist`));

app.use('/img', express.static(`${pathToFrontend}/img`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})