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

/*var pool = mysql.createPool({
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


    test("get all articles from db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(3);
            expect(data[0].overskrift).toBe("Ny forskring viser at testing er sunt");
            done();
        }

        articleDao.getAll(callback);
    });

    test("get all articles from with importance = 2 db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(1);
            expect(data[0].overskrift).toBe("Ny forskring viser at testing er sunt");
            done();
        }

        articleDao.getNewsfeed(callback);
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

    test("delete article from db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );

            expect(data.affectedRows).toBeGreaterThanOrEqual(1);
            done();
        }

        articleDao.deleteOne(1, callback);
    });

    test("get categories from db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(2);
            expect(data[0].navn).toBe("Kultur");
            done();
        }

        articleDao.getCategories(callback);
    });

    test("get article by category", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(2);
            expect(data[0].overskrift).toBe("Johaug vant");
            done();
        }

        articleDao.getByCategory("Sport", 0, 20, callback);
    });

    test("get important articles", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(3);
            expect(data[0].overskrift).toBe("Forskerne tok feil");
            done();
        }

        articleDao.getImportant(0, 20, callback);
    });

    test("update article", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.affectedRows).toBeGreaterThanOrEqual(1);
            done();
        }
        function callback2(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data[0].overskrift).toBe("Update test");
            done();
        }

        articleDao.updateArticle(
            {overskrift: 'Update test', ingress: 'Enda en forskning', innhold: 'Testing var ikke sunt', kategori: 'Kultur', bilde: 'Bilde', viktighet: 1, forfatter: 'NRK'},
            2, callback
        )

        articleDao.getOne(2, callback2)
    });

    test("Update likes on a article", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.affectedRows).toBeGreaterThanOrEqual(1);
            done();
        }

        articleDao.addLikes(4, 1, callback);
    });

    test("Get likes from db", done => {
        function callback(status, data){
            console.log(
                "Test callback: status = " + status + ", data = " + JSON.stringify(data)
            );
            expect(data.length).toBe(1);
            expect(data[0].antall).toBe(2);
            done();
        }

        articleDao.getLikes(4, callback);
    });
});


