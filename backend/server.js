const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const fileUpload = require('express-fileupload');
app.use(express.json());

app.use(fileUpload());

const port = 9000;

const pathToFrontend = (path.join(`${__dirname}/../frontend`))

app.get("/", (req, res, next) => {                  
    res.sendFile(`${pathToFrontend}/index.html`);
}) 

app.get("/image-list", (req, res, next) => {                  
    res.sendFile(`${pathToFrontend}/data.json`);
}) 


const uploads = path.join(`${pathToFrontend}/img/`)

// If there is a data.json, read the data from the file, if not, use an empty Array
let jsonData = [];
try {
    let data = fs.readFileSync(`${pathToFrontend}/data.json`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${pathToFrontend}/data.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}

app.post("/", (req, res) => {
    // Upload image
    const picture = req.files.picture;

    if (picture) {
        picture.mv(uploads + picture.name, error => {
            return res.status(500).send(error);
        });
    }
    
    // Upload data from form
    const formData = req.body; 
    jsonData.push(formData);

    fs.writeFile(`${pathToFrontend}/data.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
    res.send(formData);
});

app.delete("/delete/:id", (req, res) => {
  console.log(req.body); 
   res.send("delete request")
    
})

app.use('/pub', express.static(`${pathToFrontend}/pub`));
app.use('/img', express.static(`${pathToFrontend}/img`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})