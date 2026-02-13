const http = require('http');

const server = http.createServer( (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end("This is HomePage, go to Login page")
    } else if (req.method === 'POST' && req.url === '/login') {
        
        let body = '';
        // step 1: recieve data in chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // step 2: when all data recieved
        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                console.log("Parsed Body: ", parsedBody);

                res.writeHead(200, { "Content-Type": "application/json" } );
                res.end(JSON.stringify({
                    message: 'Login data recieved',
                    data: parsedBody
                }));
            } catch (error) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    error: "Invalid JSON"
                }));
            }
        });
    } else {
        res.writeHead(404);
        res.end("Route not found");
    }
});

server.listen(3000, () => {
    console.log("Server running at port 3000");
});

