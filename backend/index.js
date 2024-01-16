import express from "express";
import db from "./config/config.js";
import cors from "cors";
import UserRoute from "./routes/Route.js";
 
const app = express();
app.use(express.static('public'));

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));
 
app.use(cors());
app.use(express.json());
app.use(UserRoute);
 
app.listen(5000, ()=> console.log('Server up and running on port 5000...'));