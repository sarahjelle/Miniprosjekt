DROP TABLE IF EXISTS person;

CREATE TABLE artikkel (
  artikkel_id INT(11) NOT NULL AUTO_INCREMENT,
  tid TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  overskrift VARCHAR(100) NOT NULL,
  ingress TEXT NOT NULL,
  innhold TEXT NOT NULL,
  kategori INT(11) NOT NULL,
  bilde TEXT NOT NULL,
  viktighet INT(11) NOT NULL,
  forfatter VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
)

CREATE TABLE kategori(
  navn varchar(50) NOT NULL,
  PRIMARY KEY (navn)
)

ALTER TABLE artikkel
ADD CONSTRAINT kategori_fk
FOREIGN KEY kategori
REFERENCES navn;