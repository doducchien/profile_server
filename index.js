const express = require('express')
const app = express();
app.use(express.json())

const profileRouter = require('./src/route/profile-route')


app.use('/profiles', profileRouter)
 

app.listen(2024, function(){
    console.log("Server is running on port 2024")
})