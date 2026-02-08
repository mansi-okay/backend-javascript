import multer from "multer"

const storage = multer.diskStorage(
    {
        destination: (req,file,cb) => {
            cb(null,"./public/temp")
        },

        filename: (req,file,cb) => {
            cb(null,file.originalname)   
             // try not to keep og name cuz there could be multiple ones which same name
             // even if file stays for short time
        }
    }
)

export const upload = multer({
    storage
})