// @flow

const Dao = require("./dao.js");

module.exports = class ArticleDao extends Dao{
    getAll(callback: (status: string, data: Object) => mixed){
        super.query("select DATE_FORMAT(tid, '%d. %M  %Y %H:%i') as tid, overskrift, artikkel_id from artikkel ORDER BY tid DESC", [], callback);
    }

    getNewsfeed(callback: (status: string, data: Object) => mixed){
        super.query("SELECT DATE_FORMAT(tid, '%d. %M %Y %H:%i') as tid, overskrift, artikkel_id from artikkel WHERE viktighet=2 ORDER BY tid DESC", [], callback);
    }

    getImportant(start: number, end: number, callback: (status: string, data: Object) => mixed){
        super.query(
            "select artikkel_id, tid, overskrift, ingress, bilde, forfatter, kategori from artikkel where viktighet = 1 ORDER BY tid DESC LIMIT ?,?",
            [start, end],
            callback
        );
    }

    getCountImportant(callback: (status: string, data: Object) => mixed){
        super.query(
            "SELECT COUNT(*) as antall FROM artikkel WHERE viktighet=1",
            [],
            callback
        );
    }

    getCountCategories(category: string, callback: (status: string, data: Object) => mixed){
        super.query(
            "SELECT COUNT(*) as antall FROM artikkel WHERE kategori=?",
            [category],
            callback
        )
    }

    getOne(id: number, callback: (status: string, data: Object) => mixed){
        super.query("select DATE_FORMAT(tid, '%d. %M  %Y %H:%i') as tid, artikkel_id, overskrift, ingress, innhold, kategori, viktighet, bilde, forfatter from artikkel where artikkel_id=?",
            [id],
            callback);
    }


    getCategories(callback: (status: string, data: Object) => mixed){
        super.query(
            "select * from kategori",
            [],
            callback
        );
    }

    getByCategory(category: string, start: number, end: number, callback: (status: string, data: Object) => mixed){
        super.query(
            "SELECT * FROM artikkel WHERE kategori=? ORDER BY tid DESC LIMIT ?,?",
            [category, start, end],
            callback
        );
    }

    createOne(json: Object, callback: (status: string, data: Object) => mixed){ //bruke artikkel i stedet for json
        const val = [json.overskrift, json.ingress, json.innhold, json.kategori, json.bilde, json.viktighet, json.forfatter];

        super.query(
            "insert into artikkel (overskrift, ingress, innhold, kategori, bilde, viktighet, forfatter) values (?,?,?,?,?,?,?)",
            val,
            (status: number, data: Object) => {
               super.query(
                   "INSERT INTO likes (artikkel_id, antall) VALUES (?,?)",
                   [data.insertId, 0],
                   callback);
            }
        );
    }

    deleteOne(id: number, callback: (status: string, data: Object) => mixed){
        super.query(
            "DELETE FROM likes WHERE artikkel_id=?",
            [id],
            () => {
                super.query(
                    "DELETE FROM artikkel WHERE artikkel_id=?",
                    [id],
                    callback
                );
            }
        );
    }

    updateArticle(json: Object, id: number, callback: (status: string, data: Object) => mixed){
        const val = [json.overskrift, json.ingress, json.innhold, json.kategori, json.bilde, json.viktighet, json.forfatter, id];

        super.query(
            "UPDATE artikkel " +
            "SET overskrift=?, ingress=?, innhold=?, kategori=?, bilde=?, viktighet=?, forfatter=?" +
            "WHERE artikkel_id=?",
            val,
            callback
        );
    }

    getLikes(id: number, callback: (status: string, data: Object) => mixed){
        super.query(
            "SELECT antall FROM likes WHERE artikkel_id=?",
            [id],
            callback
        );
    }

    addLikes(id: number, antFraFor: number, callback: (status: string, data: Object) => mixed){
        console.log("INPUT ANTALL: ", antFraFor);
        const antall: number = antFraFor+1;
        super.query(
            "UPDATE likes SET antall=? WHERE artikkel_id=?",
            [antall, id],
            callback
        );
    }
}