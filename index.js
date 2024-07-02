const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

// **********************************************

// Start
// **********************************************

// const fs = require("fs");
// const hello = "hello node";

//read
// const inputIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(inputIn);

// **********************************************
// File
// **********************************************

//create
// Blocking synchronous way
// const textOutput = `This is what we know about the avocado: ${inputIn}.\n${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("File written..!");

//  Non-blocking asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR1! 💥");
//   console.log(`------------------------${data1}`);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     if (err) return console.log(`ERROR2! 💥---- ${err}`);

//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       if (err) return console.log(`ERROR3! 💥-- ${err}`);

//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😁");
//       });
//     });
//   });
// });
// console.log("Will read file!");

// **********************************************
// Server
// ***********************************************

// const server = http.createServer((req, res) => {
//   const pathname = req.url;
//   if (pathname === "/" || pathname === "/overview") {
//     res.end("This is overview");
//   } else if (pathname === "/product") {
//     res.end("This is product");
//   } else {
//     res.writeHead(404, {
//       "content-type": "text/html",
//       "my-own-header": "hello-node"
//     });
//     res.end("<h1>Page not found</h1>");
//   }
// });
// server.listen(8000, "127.0.0.1", () => {
//   console.log("Server listening on port 8000");
// });
// **********************************************
// Api
// ***********************************************
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    if (product) {
      res.writeHead(200, { "Content-type": "text/html" });
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<h1>Product not found!</h1>");
    }

    // API endpoint
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-node"
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server listening on port 8000");
});
