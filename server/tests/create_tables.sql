DROP TABLE IF EXISTS person;

CREATE TABLE artikkel (
  artikkel_id int(11) NOT NULL AUTO_INCREMENT,
  tid timestamp CURRENT_TIMESTAMP,
  overskrift varchar(100) NOT NULL,
  ingress text NOT NULL,
  innhold text NOT NULL,
  kategori int(11) NOT NULL,
  bilde text NOT NULL,
  viktighet int(11) NOT NULL,
  forfatter varchar(50) NOT NULL,
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