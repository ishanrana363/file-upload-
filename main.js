const { error } = require("console");
const express = require("express");
const multer = require("multer")
const path = require("node:path")
const app = express()
const prot = 3000
let upload_folder = "./uploads/"
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,upload_folder)
    },
    filename : (req,file,cb)=>{
        const filetext = path.extname(file.originalname);
        const filename = file.originalname
        .replace(filetext,"")
        .toLocaleLowerCase()
        .split(" ")
        .join("-") + "-" + Date.now();
        cb(null,filename+filetext)
    }
})

var upload = multer({
    storage : storage,
    limits : {
        fileSize :1000000, // 1MB
    },
    fileFilter : (req,file,cb)=>{
        if(file.fieldname === "avatra"){
            if(file.mimetype==="image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"){
            cb(null,true)
            }else{
                cb(new Error (" .png, .jpg, .jpeg format is not allowed "))
            }
        }else if(file.fieldname === "doc"){
            if(file.mimetype === "application/pdf"){
                cb(null,true)
            }else{
                cb(new Error("only .pdf format is allowed"))
            }
        }else{
            cb(new Error("There was an unknown error"))
        }
    },
        
    },)
app.post("/",upload.fields([
    {name : "avatra" , maxCount : 1 },
    {name : "doc", maxCount : 1}
]),(req,res)=>{
    console.log(req.files);
    res.send("hello world")
})

app.use((err,req,res,next)=>{
   if(err){
    if(err instanceof multer.MulterError){
        res.status(500).send("There was an upload error")
    }else{
        res.status(500).send({
            message : err.message
        })
    }
   }else {
        res.send("successful")
   }
})

app.listen(prot,()=>{
    console.log(`Server run successfully at http://localhost:${prot}`);
})