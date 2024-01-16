import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/bigio_db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

export default db;