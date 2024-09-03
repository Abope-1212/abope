const express = require('express');

const app = express();

app.use('/user',(req, res, next) =>{
console.log("the first");
res.send('<p><em><i><b>WE ARE HERE</b></i></em></P>')
});

app.use('/',(req, res, next) =>{
console.log("the first stie");
res.send('<p><em><i><b>WE ARE HERe FOR HER<b><i><em><P>')
});



    


app.listen(4000);

