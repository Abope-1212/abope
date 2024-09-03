const http = require('http');




const server = http.createServer((req, res) => {
    const url = req.url;
   
    if (url === '/') {
        res.write ('<html>');
        res.write('<head><title>ENTER MESSAGE</title><head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="name"><br>     <input type="number" name="age"min="0" max="30"><br><button type="submit">Send</button></form></body>');
        res.write('</html>');
        res.end();
    }
    if (url==='/user'){
    res.write ('<html>');
    res.write('<head><title>assigement </title><head>');
    res.write('<body><ul><li>user 1</li><li>user 2</li></ul></body>')
    res.write('</html>');
    return res.end();
    };
    if (url=== '/create-user'){
    const body =[];
    req.on ('data', chunk =>{
        body.push(chunk);
    })
    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody)//.split('=') [1]);
        });
        
        res.statusCode= 302;
        res.setHeader('location', '/');
        res.end('');
    }
    
    });

server.listen(3200);