DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS artikkel;
DROP TABLE IF EXISTS kategori;

CREATE TABLE kategori(
  navn varchar(50) NOT NULL
);
ALTER TABLE kategori
  ADD PRIMARY KEY (navn);

CREATE TABLE artikkel (
  artikkel_id INT(11) NOT NULL AUTO_INCREMENT,
  tid TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  overskrift VARCHAR(100) NOT NULL,
  ingress TEXT NOT NULL,
  innhold TEXT NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  bilde TEXT NOT NULL,
  viktighet INT(11) NOT NULL,
  forfatter VARCHAR(50) NOT NULL
 );

 ALTER TABLE artikkel
   ADD PRIMARY KEY (artikkel_id);



CREATE TABLE likes(
  artikkel_id int(11) NOT NULL,
  antall int(11) DEFAULT '0'
);

ALTER TABLE likes
  ADD PRIMARY KEY (artikkel_id);

ALTER TABLE likes
  ADD CONSTRAINT id_fk FOREIGN KEY (artikkel_id) REFERENCES artikkel (artikkel_id);
