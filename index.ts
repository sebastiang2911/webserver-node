import express from "express";
import hbs from "hbs";
import path from "node:path";

const app = express();
const port = process.env.PORT;

// Handlebar
app.set("view engine", "hbs");
hbs.registerPartials(path.join(import.meta.dirname, "views", "partials"));

// Serve static content
app.use(express.static("public"));

app.get(["/", "/home", "/home.html", "/index.html"], (_req, res) => {
  res.render("home", {
    name: "Sebastian",
    title: "Node course",
  });
});

app.get(["/generic", "/generic.html"], (_req, res) => {
  //   res.sendFile("generic.html", { root: "public" });
  res.render("generic", {
    title: "Generic",
    name: "Sebastian",
  });
});

app.get(["/elements", "/elements.html"], (_req, res) => {
  //   res.sendFile("generic.html", { root: "public" });
  res.render("elements", {
    title: "Element",
    name: "Sebastian",
  });
});

app.get("/hello-world", (req, res) => {
  res.send("hello-world");
});

app.get("/{*splat}", (req, res) => {
  res.status(404).render("404", {
    title: "Page not found",
    name: "Sebastian",
    requestedUrl: req.originalUrl,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
