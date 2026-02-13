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

// =======================================================================================
// Perfect. This is exactly how you actually understand Node streams deeply.

// We will build:

// > 🚀 A mini body-parser using raw Node.js streams (no Express, no libraries)

// You’ll:

// * Create a Node project
// * Install nodemon
// * Build an HTTP server
// * Manually read the request body using streams
// * Parse JSON safely
// * Test with Postman

// Step-by-step from zero.

// ---

// # ✅ STEP 1 — Create Project Folder

// Open VS Code.

// Open terminal inside VS Code:

// ```bash
// mkdir mini-body-parser
// cd mini-body-parser
// ```

// Initialize project:

// ```bash
// npm init -y
// ```

// ---

// # ✅ STEP 2 — Install Nodemon

// Install nodemon as dev dependency:

// ```bash
// npm install --save-dev nodemon
// ```

// Add this to your `package.json`:

// ```json
// "scripts": {
//   "dev": "nodemon server.js"
// }
// ```

// Now you can run:

// ```bash
// npm run dev
// ```

// ---

// # ✅ STEP 3 — Create server.js

// Create a file:

// ```
// server.js
// ```

// Now we build everything manually.

// ---

// # ✅ STEP 4 — Basic HTTP Server (No Magic)

// Add this:

// ```js
// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.end("Server Running");
// });

// server.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
// ```

// Run:

// ```bash
// npm run dev
// ```

// Open browser:

// ```
// http://localhost:3000
// ```

// Works? Good.

// ---

// # ✅ STEP 5 — Understand the Core Idea

// Important:

// `req` in Node is a **Readable stream**.

// That means:

// ```js
// req.on('data', chunk => {})
// req.on('end', () => {})
// ```

// We will manually collect chunks.

// ---

// # ✅ STEP 6 — Build Mini Body Parser

// Replace server.js with this:

// ```js
// const http = require('http');

// const server = http.createServer((req, res) => {

//   if (req.method === "POST" && req.url === "/login") {

//     let body = '';

//     // Step 1: Receive data in chunks
//     req.on('data', (chunk) => {
//       body += chunk.toString();
//     });

//     // Step 2: When all data received
//     req.on('end', () => {
//       try {
//         const parsed = JSON.parse(body);

//         console.log("Parsed Body:", parsed);

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({
//           message: "Login data received",
//           data: parsed
//         }));

//       } catch (error) {
//         res.writeHead(400, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({
//           error: "Invalid JSON"
//         }));
//       }
//     });

//   } else {
//     res.writeHead(404);
//     res.end("Route not found");
//   }
// });

// server.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
// ```

// ---

// # ✅ STEP 7 — Test Using Postman

// Open Postman.

// ### Create request:

// * Method: POST
// * URL: `http://localhost:3000/login`
// * Go to **Body**
// * Select **raw**
// * Choose **JSON**
// * Add:

// ```json
// {
//   "email": "test@example.com",
//   "password": "123456"
// }
// ```

// Click **Send**

// You should see:

// ```json
// {
//   "message": "Login data received",
//   "data": {
//     "email": "test@example.com",
//     "password": "123456"
//   }
// }
// ```

// And in terminal:

// ```
// Parsed Body: { email: 'test@example.com', password: '123456' }
// ```

// 🔥 You just built body-parser manually.

// ---

// # ✅ STEP 8 — Make It More “Full-Fledged”

// Now we improve it like a real body-parser.

// Add:

// * Content-Type check
// * Body size limit
// * Proper error handling

// Here is upgraded version:

// ```js
// const http = require('http');

// const MAX_SIZE = 1e6; // 1MB

// const server = http.createServer((req, res) => {

//   if (req.method === "POST" && req.url === "/login") {

//     if (req.headers['content-type'] !== 'application/json') {
//       res.writeHead(415, { "Content-Type": "application/json" });
//       return res.end(JSON.stringify({ error: "Only JSON allowed" }));
//     }

//     let body = '';

//     req.on('data', (chunk) => {
//       body += chunk;

//       // Prevent large payload attack
//       if (body.length > MAX_SIZE) {
//         req.socket.destroy();
//       }
//     });

//     req.on('end', () => {
//       try {
//         const parsed = JSON.parse(body);

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({
//           success: true,
//           data: parsed
//         }));

//       } catch (err) {
//         res.writeHead(400, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ error: "Invalid JSON" }));
//       }
//     });

//   } else {
//     res.writeHead(404);
//     res.end("Not Found");
//   }
// });

// server.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
// ```

// ---

// # 🧠 What You Just Built (Internally)

// You used:

// * `req` → Readable stream
// * `data` event → receives chunks
// * `end` event → stream finished
// * Manual buffer accumulation
// * `JSON.parse`
// * Backpressure safe destruction
// * Headers validation

// This is exactly what Express's `express.json()` does internally.

// ---

// # 🔥 What’s Happening Under The Hood

// 1. Client sends HTTP request
// 2. Data arrives in chunks
// 3. Node buffers chunks
// 4. You manually assemble them
// 5. Parse into object
// 6. Respond

// No magic.

// Just streams.

// ---

// # 🎯 Next Level (Optional Upgrades)

// If you want to go deeper, next we can:

// * Convert body parser into reusable function
// * Build middleware system like Express
// * Support urlencoded forms
// * Handle streaming large JSON
// * Add async validation
// * Add router system

// ---

// If you're serious about backend fundamentals, this exercise is gold.

// Next question:
// Do you want to now turn this into a reusable `miniJsonParser(req)` function like real middleware?

// =======================================================================================










// ===================================================================================
// Excellent. Now you're thinking like a framework designer.

// We’ll build:

// ```
// mini-body-parser/
// │
// ├── server.js
// └── middleware/
//     └── jsonParser.js
// ```

// Goal:

// * Move body parsing logic into `middleware/jsonParser.js`
// * Import it in `server.js`
// * Use it cleanly like middleware
// * No Express. Pure Node + streams.

// ---

// # ✅ STEP 1 — Create Folder Structure

// Inside your project:

// ```bash
// mkdir middleware
// touch middleware/jsonParser.js
// ```

// Your structure should now be:

// ```
// mini-body-parser
//   ├── server.js
//   └── middleware
//       └── jsonParser.js
// ```

// ---

// # ✅ STEP 2 — Write the Middleware (jsonParser.js)

// Open:

// ```
// middleware/jsonParser.js
// ```

// Add this:

// ```js
// const MAX_SIZE = 1e6; // 1MB

// function jsonParser(req) {
//   return new Promise((resolve, reject) => {

//     // Only parse JSON requests
//     if (req.headers['content-type'] !== 'application/json') {
//       return reject(new Error('Only application/json supported'));
//     }

//     let body = '';

//     req.on('data', (chunk) => {
//       body += chunk;

//       // Protect against large payloads
//       if (body.length > MAX_SIZE) {
//         req.socket.destroy();
//         reject(new Error('Payload too large'));
//       }
//     });

//     req.on('end', () => {
//       try {
//         const parsed = JSON.parse(body);
//         resolve(parsed);
//       } catch (err) {
//         reject(new Error('Invalid JSON'));
//       }
//     });

//     req.on('error', (err) => {
//       reject(err);
//     });

//   });
// }

// module.exports = jsonParser;
// ```

// ---

// # 🔥 What This Does

// * Returns a Promise
// * Collects stream chunks
// * Parses JSON
// * Resolves parsed object
// * Rejects errors properly

// This is cleaner than putting everything in `server.js`.

// ---

// # ✅ STEP 3 — Use It in server.js

// Now modify `server.js`:

// ```js
// const http = require('http');
// const jsonParser = require('./middleware/jsonParser');

// const server = http.createServer(async (req, res) => {

//   if (req.method === "POST" && req.url === "/login") {

//     try {
//       const body = await jsonParser(req);

//       console.log("Parsed Body:", body);

//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({
//         success: true,
//         data: body
//       }));

//     } catch (error) {

//       res.writeHead(400, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({
//         error: error.message
//       }));
//     }

//   } else {
//     res.writeHead(404);
//     res.end("Route not found");
//   }

// });

// server.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
// ```

// ---

// # ✅ STEP 4 — Test With Postman

// POST → `http://localhost:3000/login`

// Body → raw → JSON:

// ```json
// {
//   "email": "hello@test.com",
//   "password": "123"
// }
// ```

// You should get:

// ```json
// {
//   "success": true,
//   "data": {
//     "email": "hello@test.com",
//     "password": "123"
//   }
// }
// ```

// ---

// # 🧠 What You Just Built

// You now have:

// * Modular middleware
// * Promise-based parsing
// * Async/await usage
// * Clean separation of concerns

// This is exactly how frameworks like Express are structured internally.

// ---

// # 🚀 If You Want It Even More “Framework-like”

// We can next:

// * Attach parsed body to `req.body`
// * Build a mini `next()` middleware system
// * Create multiple middleware chain support
// * Add URL-encoded parser
// * Add global middleware support

// You are now building a micro-framework.

// ---

// Next question:

// Do you want to:

// 1. Attach parsed data to `req.body` like Express?
// 2. Or build a real middleware chain system with `next()`?
