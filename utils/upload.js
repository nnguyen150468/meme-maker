const multer = require('multer')
const path = require('path')
const { loadData } = require('./data')


const pathToUpload = path.join(__dirname, "../public/uploads/originals")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathToUpload)
    },
    filename: function (req, file, cb) {
        //protect file types on backend
      const allows = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
      if(!allows.includes(file.mimetype)){
          let err = new Error("File type not allowed.")
          cb(err, undefined)
      }
      const data = loadData();

      //make sure pictures are not the same
      // if(data.some(item => item.originalname === file.originalname)){
      //     let err = new Error("File already existed.")
      //     return cb(err, undefined)
      // }

      console.log('file in upload.js',file)

      cb(null, file.originalname)
    }
  })
   
  const upload = multer({ storage: storage }).single('fileUpload')

module.exports = upload
