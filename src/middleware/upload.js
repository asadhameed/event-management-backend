const multer = require('multer');
const path = require('path')

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', 'images'),
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext)
            const fileName = name.replace(/\s/g, '') + '-' + Date.now() + ext;
            cb(null, fileName)
        }
    })
}