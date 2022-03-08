CREATE TABLE equipement (
    id VARCHAR(50) PRIMARY KEY,
    position GEO_POINT,
    salle VARCHAR(50),
    timestamp TIMESTAMP GENERATED ALWAYS AS CURRENT_TIMESTAMP
);
INSERT INTO equipement (id,position,salle) values ('test1','POINT (0 0)','inconnu');

SELECT *
FROM (
    SELECT *, ROW_NUMBER() OVER(PARTITION BY id ORDER BY timestamp DESC) Corr
    FROM equipement_historique
) AS CTE
WHERE Corr = 1 limit 100;



CREATE DATABASE IF NOT EXISTS tracking;
USE tracking;

CREATE TABLE categorie (
  id_categorie int(11) NOT NULL,
  libelle varchar(50) NOT NULL
);

CREATE TABLE equipement (
  id_equipement varchar(50) NOT NULL,
  id_categorie int(11) NOT NULL,
  libelle varchar(50) NOT NULL,
  chemin_photo varchar(100) DEFAULT NULL
);

CREATE TABLE users (
  id int(11) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(50) DEFAULT NULL,
  lname varchar(50) DEFAULT NULL,
  fname varchar(50) DEFAULT NULL
);


ALTER TABLE categorie
  ADD PRIMARY KEY (id_categorie);

ALTER TABLE equipement
  ADD PRIMARY KEY (id_equipement),
  ADD KEY fk_idCateEquip (id_categorie);

ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY username (username);


ALTER TABLE categorie
  MODIFY id_categorie int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE equipement
  ADD CONSTRAINT fk_idCateEquip FOREIGN KEY (id_categorie) REFERENCES categorie (id_categorie);

