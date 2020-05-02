const fs = require('fs');
const path = require('path');

const pathToData = path.join(__dirname, '../images.json');


const loadData = () => {
    const buffer = fs.readFileSync(pathToData);
    const data = buffer.toString();
    return JSON.parse(data)
}

const saveData = (data) => {
    fs.writeFileSync(pathToData, JSON.stringify(data));
}

module.exports = { loadData, saveData }