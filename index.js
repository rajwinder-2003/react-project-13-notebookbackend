const connectToMongo = require('./db');

connectToMongo();
const express = require('express');
const app = express();
const port = 1000
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Available Routes auth or notes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`iNotebook app is running on port at http://localhost:${port}`)
})