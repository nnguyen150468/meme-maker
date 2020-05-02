const fs = require('fs');
const path = require('path');

const pathToData = path.join(__dirname, '../memes.json');

const loadMemeData = () => {
    const buffer = fs.readFileSync(pathToData);
    const data = buffer.toString();
    return JSON.parse(data)
}

const saveMemeData = (data) => {
    fs.writeFileSync(pathToData, JSON.stringify(data));
}

module.exports = { loadMemeData, saveMemeData }