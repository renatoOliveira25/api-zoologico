------------------------------------------------------------------------------------
------------- CRIANDO TABELAS
------------------------------------------------------------------------------------ 
CREATE TABLE IF NOT EXISTS Animal (idAnimal SERIAL NOT NULL PRIMARY KEY,
					nomeAnimal VARCHAR(50) NOT NULL,
					idadeAnimal INT,
					generoAnimal VARCHAR(15) NOT NULL);
					
CREATE TABLE IF NOT EXISTS Ave (idAve INT,
				 envergadura FLOAT NOT NULL,
				 FOREIGN KEY (idAve) REFERENCES Animal(idAnimal));
				 
CREATE TABLE IF NOT EXISTS Mamifero (idMamifero INT,
				 especie VARCHAR(50) NOT NULL,
				 FOREIGN KEY (idMamifero) REFERENCES Animal(idAnimal));
				 
CREATE TABLE IF NOT EXISTS Reptil (idReptil INT,
				 tipoDeEscamas VARCHAR(50) NOT NULL,
				 FOREIGN KEY (idReptil) REFERENCES Animal(idAnimal));
				 
CREATE TABLE IF NOT EXISTS Habitat (idHabitat SERIAL NOT NULL PRIMARY KEY,
					 nomeHabitat VARCHAR(50) NOT NULL);
					 
CREATE TABLE IF NOT EXISTS Atracao (idAtracao SERIAL NOT NULL PRIMARY KEY,
					 nomeAtracao VARCHAR(50) NOT NULL,
					 idHabitat INT,
					 FOREIGN KEY (idHabitat) REFERENCES Habitat(idHabitat));
					 
CREATE TABLE IF NOT EXISTS Animal_Habitat(idAnimalHabitat SERIAL NOT NULL PRIMARY KEY,
						   idAnimal INT,
						   idHabitat INT,
						   FOREIGN KEY (idAnimal) REFERENCES Animal(idAnimal),
						   FOREIGN KEY (idHabitat) REFERENCES Habitat(idHabitat));

------------------------------------------------------------------------------------
------------- POPULANDO TABELAS (INSERT)
------------------------------------------------------------------------------------
INSERT INTO Animal(nomeAnimal, idadeAnimal, generoAnimal)
	VALUES
	('SIMBA', 7, 'MACHO'),			-- id 1
	('PUMBA', 4, 'MACHO'),			-- id 2
	('NALA', 6, 'FEMEA'),			-- id 3
	('ZAZU', 1, 'MACHO'),			-- id 4
	('IAGO', 2, 'MACHO'),			-- id 5
	('SCUTTLE', 4, 'FEMEA'),		-- id 6
	('KAA', 1, 'MACHO'),			-- id 7
	('LOUIS', 5, 'MACHO'),			-- id 8
	('TICK-TOCK', 3, 'FEMEA');		-- id 9
	
INSERT INTO Mamifero(idMamifero, especie)
	VALUES
	(1, 'FELINO'),
	(2, 'JAVALI'),
	(3, 'FELINO');

INSERT INTO Ave(idAve, envergadura)
	VALUES
	(4, 0.55),
	(5, 0.98),
	(6, 0.35);

INSERT INTO Reptil(idReptil, tipoDeEscamas)
	VALUES
	(7, 'ESCUDOS'),
	(8, 'ESCAMAS CEFÁLICAS'),
	(9, 'ESCAMAS TIMPANOAURICULARES');
	
INSERT INTO Habitat(nomeHabitat)
	VALUES
	('PLANÍCIE'),	-- id 1
	('FLORESTA'),	-- id 2
	('PÂNTANO'),	-- id 3
	('MONTANHA'),	-- id 4
	('ILHA');		-- id 5
	
INSERT INTO Animal_Habitat(idAnimal, idHabitat)
	VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 2),
	(6, 2),
	(7, 2),
	(8, 3),
	(9, 3);
	
INSERT INTO Atracao(nomeAtracao, idHabitat)
	VALUES
	('PASSEIO DE JEEP', 1),		-- id 1
	('ALIMENTAR OS LEÕES', 1),	-- id 2
	('PENTEAR MACACO', 2),		-- id 3
	('CORRER DAS COBRAS', 3);	-- id 4