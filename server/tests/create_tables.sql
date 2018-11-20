DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS artikkel;
DROP TABLE IF EXISTS kategori;

CREATE TABLE kategori(
  navn varchar(50) NOT NULL,
  PRIMARY KEY (navn)
);

CREATE TABLE artikkel (
  artikkel_id INT(11) NOT NULL AUTO_INCREMENT,
  tid TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  overskrift VARCHAR(100) NOT NULL,
  ingress TEXT NOT NULL,
  innhold TEXT NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  bilde TEXT NOT NULL,
  viktighet INT(11) NOT NULL,
  forfatter VARCHAR(50) NOT NULL,
  PRIMARY KEY (artikkel_id),
  KEY cat_fk (kategori),
      CONSTRAINT cat_fk FOREIGN KEY (kategori) REFERENCES kategori (navn)
);

CREATE TABLE likes(
    artikkel_id INT(11) NOT NULL,
    antall INT DEFAULT 0,
    PRIMARY KEY(artikkel_id),
    KEY id_fk (artikkel_id),
    CONSTRAINT id_fk FOREIGN KEY (artikkel_id) REFERENCES artikkel (artikkel_id)
);
