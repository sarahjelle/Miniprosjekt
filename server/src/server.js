// @flow

var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();
var apiRoutes = express.Router();
app.use(bodyParser.json()); // for å tolke JSON
const ArticleDao = require("./articledao.js");
import path from 'path';

const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));

type Request = express$Request;
type Response = express$Response;

var pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "sarahjel",
    password: "BxKW93o3",
    database: "sarahjel",
    debug: false,
    multipleStatements: true
});


let articleDao = new ArticleDao(pool);
const SAK_LIMIT = 20;

app.get("/newsfeed", (req: Request, res: Response) =>{
  console.log("/artikkel: fikk request fra klient");
  articleDao.getNewsfeed((status, data) => {
    res.status(status);
    res.json(data);
  });
});

app.get("/nyheter", (req: Request, res: Response) => {
    const page: number = Number(req.query.page) || 0;
    articleDao.getImportant(page*SAK_LIMIT, SAK_LIMIT,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/nyheter/:kategori", (req: Request, res: Response) => {
    const page: number = Number(req.query.page) || 0;
    articleDao.getByCategory(req.params.kategori, page*SAK_LIMIT, SAK_LIMIT, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/kategorier", (req: Request, res: Response) => {
    articleDao.getCategories((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/nyheter/:kategori/:artikkel_id", (req: Request, res: Response) =>{
    articleDao.getOne(req.params.artikkel_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/nyheter/:kategori/:artikkel_id/likes", (req: Request, res: Response) => {
    articleDao.getLikes(req.params.artikkel_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.put("/nyheter/:kategori/:artikkel_id/likes", (req: Request, res: Response) => {
    // $FlowFixMe
    articleDao.addLikes(req.params.artikkel_id, req.body.likes, (status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.post("/newarticle", (req: Request, res: Response) => {
    console.log("POST-request fra klient");
    articleDao.createOne(req.body, (status, data) => {
        res.status(status); 
        res.json(data);
    })
});

app.put("/nyheter/:kategori/:artikkel_id", (req: Request, res: Response) => {
    articleDao.updateArticle(req.body, req.params.artikkel_id, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

app.delete("/nyheter/:kategori/:artikkel_id", (req: Request, res: Response) => {
   console.log("Delete-request fra klient");
   articleDao.deleteOne(req.params.artikkel_id, (status, data) => {
       res.status(status);
       res.json(data);
    })
});


// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started');
    resolve();
  });
});
