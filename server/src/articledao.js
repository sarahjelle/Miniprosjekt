// @flow

const Dao = require("./dao.js");

module.exports = class ArticleDao extends Dao{
    getAll(callback: (status: string, data: string) => mixed){
        super.query("select DATE_FORMAT(tid, '%H:%i') as tid, overskrift, artikkel_id from artikkel", [], callback);
    }

    getImportant(callback: (status: string, data: string) => mixed){
        super.query(
            "select artikkel_id, tid, overskrift, ingress, bilde, forfatter, kategori from artikkel where viktighet = 1",
            [],
            callback
        );
    }

    getOne(id: number, callback: (status: string, data: string) => mixed){
        super.query("select DATE_FORMAT(tid, '%d. %M  %Y %H:%i') as tid, artikkel_id, overskrift, ingress, innhold, kategori, viktighet, bilde, forfatter from artikkel where artikkel_id=?",
            [id],
            callback);
    }

    getCategories(callback: (status: string, data: string) => mixed){
        super.query(
            "select * from kategori",
            [],
            callback
        );
    }

    getByCategory(category: string, callback: (status: string, data: string) => mixed){
        super.query(
            "SELECT * FROM artikkel WHERE kategori=?",
            [category],
            callback
        );
    }

    createOne(json: Object, callback: (status: string, data: string) => mixed){ //bruke artikkel i stedet for json
        const val = [json.overskrift, json.ingress, json.innhold, json.kategori, json.bilde, json.viktighet, json.forfatter];

        super.query(
            "insert into artikkel (overskrift, ingress, innhold, kategori, bilde, viktighet, forfatter) values (?,?,?,?,?,?,?)",
            val,
            callback
        );
    }

    deleteOne(id: number, callback: (status: string, data: string) => mixed){
        super.query(
            "DELETE FROM artikkel WHERE artikkel_id=?",
            [id],
            callback
        );
    }

    updateArticle(json: Object, id: number, callback: (status: string, data: string) => mixed){
        const val = [json.overskrift, json.ingress, json.innhold, json.kategori, json.bilde, json.viktighet, json.forfatter, id];

        super.query(
            "UPDATE artikkel " +
            "SET overskrift=?, ingress=?, innhold=?, kategori=?, bilde=?, viktighet=?, forfatter=?, tid=NOW()" +
            "WHERE artikkel_id=?",
            val,
            callback
        );
    }
}