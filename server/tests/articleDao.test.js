var mysql = require("mysql");

const ArticleDao = require("../src/articledao.js");
const runsqlfile = require("./runsqlfile.js");

//GitLab CI Pool
var pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "1234abcd",
    database: "School",
    debug: false,
    multipleStatements: true
});
/*
var pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "sarahjel",
    password: "BxKW93o3",
    database: "sarahjel",
    debug: false,
    multipleStatements: true
});*/

let articleDao = new ArticleDao(pool);

describe('Testing Articledao.js', () => {
    beforeAll(done => {
        runsqlfile("tests/create_tables.sql", pool, () =>{
            runsqlfile("tests/create_testdata.sql", pool, done);
        });
    });

    afterAll(() => {
        pool.end();
    });

    test("get one article from db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(1);
            expect(data[0].overskrift).toBe("Ny forskring viser at testing er sunt");
            done();
        }

        articleDao.getOne(1, callback);
    });

    test("add article to db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );

            expect(data.affectedRows).toBeGreaterThanOrEqual(1);
            done();
        }

        articleDao.createOne(
            {overskrift: 'overskrift', ingress: 'ingress', innhold: 'innhold', kategori: 'Sport', bilde: 'bilde', viktighet: 1, forfatter: 'forfatter'},
            callback
        );
    });
});


