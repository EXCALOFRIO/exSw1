const data = require("./data.json");
const fs = require('fs');

fs.readFile('./data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    console.log('File data:', jsonString) 
})