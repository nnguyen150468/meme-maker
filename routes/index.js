var express = require('express');
var router = express.Router();
const upload = require('../utils/upload')
const { loadData } = require('../utils/data')
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

router.post('/upload', upload, (req, res) => {
  const file = req.file
  if(!file){
    return res.render('allImages', {error: "No image uploaded"})
  }

  console.log('index.js',`${pathToUpload}/${file.originalname}`)

  // Jimp.read(`${pathToUpload}/${file.originalname}`)
  // .then(item => {
  //     return item
  //     .resize(400, 300)
  //     .quality(60)
  //     .greyscale()
  //     .write(file.originalname)
  // })
  // .catch(err => {
  //     console.error(err)
  // })
  const data = loadData();

  console.log('data index.js',data)

  return res.render('allImages', {images: data})
})

module.exports = router;
