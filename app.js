var express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cons = require("consolidate"),
  dust = require("dustjs-helpers"),
  pg = require("pg"),
  app = express();
const { Pool, Client } = require("pg");

//DB connString
var connectionString = "postgres://dbuser:password@localhost:5432/mydb";
//https://node-postgres.com/features/connecting

const pool = new Pool({
  connectionString: connectionString
});

app.engine("dust", cons.dust);

app.set("view engine", "dust");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  //console.log('test');
  //res.render('index');

  //PG Connect
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error("istemciyi havuzdan alma hatası", err);
    }
    client.query("SELECT * FROM books", function(err, result) {
      if (err) {
        console.error("sorgu çalıştırma hatası", err);
      }
      res.render("index", { books: result.rows });
      done();
    });
  });
});

//post method
app.post("/add", function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error("istemciyi havuzdan alma hatası", err);
    }
    client.query("INSERT INTO books(name,author,summary) VALUES($1,$2,$3)", [
      req.body.name,
      req.body.author,
      req.body.summary
    ]);
    done();
    res.redirect("/");
  });
});

//delete
app.delete("/delete/:id", function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error("istemciyi havuzdan alma hatası", err);
    }
    client.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    done();
    res.send(200);
  });
});

//edit
app.post('/edit', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error("istemciyi havuzdan alma hatası", err);
    }
    client.query("UPDATE books SET name=$1, author=$2, summary=$3 WHERE id=$4",
      [ req.body.name, 
        req.body.author, 
        req.body.summary, 
        req.body.id
    ]);
    done();
    res.redirect("/");
  });
});

//server
app.listen(3000, function() {
  console.log("server started on port 3000");
});
