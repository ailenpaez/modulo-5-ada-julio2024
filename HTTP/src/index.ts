import http from "node:http";
import db from "../src/database/db.json";
import fs from "fs";
const PORT = 3443;

const server = http.createServer((request, response) => {
  const { url, method } = request;

  // METODOS:

  // GET -> Lectura
  // POST -> Escritura
  // DELETE -> Eliminación
  // PATCH -> Modificación (SOLAMENTE MODIFICA si el recurso EXISTE, sino no hace nada)
  // PUT -> Modificación (si no existe lo que quiero modificar CREA)

  if (method == "GET") {
    switch (url) {
      case "/api":
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        response.end(JSON.stringify(db.description));
        break;

      case "/api/students":
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        response.end(JSON.stringify(db.students));
        break;

      case "/api/teachers":
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        response.end(JSON.stringify(db.teachers));
        break;

      default:
        response.statusCode = 400;
        response.end("Invalid URL");

        break;
    }
  } else if (method == "POST") {
    let body = "";

    switch (url) {
      case "/api/students":
        request.on("data", (datagrama) => {
          // o chunk en ingles
          body += datagrama.toString();
        });

        request.on("end", () => {
          const data = JSON.parse(body);
          db.students.push(data);

          fs.writeFileSync("./HTTP/src/database/db.json", JSON.stringify(db));

          response.statusCode = 201;
          response.end("Resource created: " + body);
        });
        break;

      default:
        response.statusCode = 404;
        response.end("Resource not found!");

        break;
    }
  }
});

// fetch("",{
//   method: "POST",
//   body: JSON.stringify({name: "Walter", age: 33})
// })

server.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
