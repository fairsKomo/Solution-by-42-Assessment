import express, {Request, Response} from "express";
import multer from "multer";
import {processCSV, createTables, insertIntoDB} from "./dataExtraction.ts";
import {Database} from "bun:sqlite";


const app = express();
const port = 3000;

const myFile = Bun.file('./uploadhere.html');
const upload = multer({ dest : 'uploads/'})

app.get('/', async (req:Request, res:Response)=>{
  res.send(await myFile.text());
})

app.post('/process', upload.single('file'), (req:Request, res:Response)=>{
  if(!req.file){
    return res.status(400).send('No file uploaded.');
  }

  const csvFile = req.file;
  const csvFilePath = `./uploads/${csvFile.filename}`;
  processCSV(csvFilePath)
  .then((data) => {
    const db = new Database('myDatabase.sqlite');
    createTables(db);
    // console.log(data.addNewActivityRequest);
    
    insertIntoDB(db, data)
  })
  .catch((error) => {
    console.error('Error processing CSV:', error);
  });
  res.send("File uploaded successfully!");
    
})

app.listen(port, ()=>{
  console.log(`Server listening on port ${port}`);
})