var express = require('express');
var router = express.Router();
const upload = require('../utils/upload')
const { loadData, saveData } = require('../utils/data')
const Jimp = require('jimp');
const path = require('path')

const pathToUpload = path.join(__dirname, "../public/uploads/originals")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MEMEMAKER' });
});

router.get('/browse', (req, res) => {
  const data = loadData();
  return res.render('allImages', {images: data})
})

router.post('/upload', upload, async (req, res) => {
  const file = req.file
  if(!file){
    return res.render('allImages', {error: "No image uploaded"})
  }

  await Jimp.read(file.path)
  .then(item => {
      console.log('item',item)
      return item
      .resize(400, 300)
      .quality(60)
      .greyscale()
      .write(file.path)
  })
  .catch(err => {
      console.error(err)
  })

  const data = loadData();
  data.push(file);
  saveData(data);

  return res.render('allImages', {images: data})
})

module.exports = router;
