var express = require('express');
var router = express.Router();
const upload = require('../utils/upload')
const { loadData, saveData } = require('../utils/data')
const { loadMemeData, saveMemeData } = require('../utils/memesData')
const Jimp = require('jimp');
const path = require('path')



const pathToUpload = path.join(__dirname, "../public/uploads/originals")
const pathToMemes = path.join(__dirname, "../public/uploads/memes")

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
    return res.render('upload', {error: "No image uploaded"})
  }
  
  await Jimp.read(`${pathToUpload}/${file.originalname}`)
  .then(item => {
      console.log('item',item)
      return item
      .resize(Jimp.AUTO, 800, Jimp.RESIZE_NEAREST_NEIGHBOR)
      .quality(60)
      .write(`${pathToUpload}/${file.originalname}`)
  })
  .catch(err => {
      console.error(err)
  })

  console.log('file in index:',file)
  const data = loadData();

  if(data.some(item => item.originalname === file.originalname || item.size === file.size)){
    return res.render("upload", {title: "MEMEMAKER",error: "File already existed. Please choose another file."})
  }

  file.id = data.length ===0? 1 : data[0].id + 1

  data.unshift(file);
  saveData(data);

  return res.render('allImages', {images: data})
})


router.get('/memes', async (req, res) => {
  const dataMeme = await loadMemeData();
  return res.render('memes', {memes: dataMeme})
})

//edit memes
router.post('/memes', async (req, res) => {
  const query = req.body
  console.log('query', query)
  console.log('memes id, ', query.id)
  const data = loadData();
  let found = data.find(item => item.id===parseInt(query.id))
  
  console.log('found', found)


  let loadedImage;
  let time = Date.now().toString()
  let suffix = time.substring(time.length-4)
  let name = found.originalname.split('.')[0]



  await Jimp.read(`${pathToUpload}/${found.originalname}`)
    .then(function (image) {
        loadedImage = image;
        
        console.log('loadedImage.bitmap', loadedImage.bitmap)
        return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    })
    .then(function (font) {
        let maxWidth = loadedImage.bitmap.width
        let maxHeight = loadedImage.bitmap.height
        loadedImage.print(font, 0, 0, 
          { text: query.top, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP 
          }, maxWidth, maxHeight )

        loadedImage.print(font, 0, 0, 
          { text: query.bottom, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM 
          }, maxWidth, maxHeight )
          // .resize(800, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR)
                .write(`${pathToMemes}/meme-${name}-${suffix}.jpg`)
                   ;
        
        const dataMeme = loadMemeData()
        console.log('dataMeme', dataMeme)
        loadedImage.path = `meme-${name}-${suffix}.jpg`
        loadedImage.id = dataMeme.length === 0? 1 : dataMeme[0].id +1
        console.log('loadedImage 2', loadedImage)
        let imageData = {id:loadedImage.id , path: loadedImage.path, name: `meme-${name}-${suffix}`}
        dataMeme.unshift(imageData)
        saveMemeData(dataMeme)
        return res.render("memes", {memes: dataMeme})
    })
    .catch(function (err) {
        console.error(err);
    });

    console.log('loadedImage after Jimp', loadedImage)

})

router.get('/upload', (req, res) => {
  res.render('upload', {})
})


module.exports = router;
