CREATE DATABASE rey_de_las_ratas;
USE rey_de_las_ratas;

CREATE TABLE room (
	room_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(60) NOT NULL,
    room_code CHAR(6) NOT NULL,
    
    round TINYINT UNSIGNED, -- Empieza en 1
    day_phase TINYINT UNSIGNED, -- 0:Por empezar  /  1:NOCHE(acciones)  2:resultado acciones /  3:DIA(votaciones)  /  4:resultado votaciones
    total_players TINYINT UNSIGNED NOT NULL,
    dead_players TINYINT UNSIGNED, -- Empieza en 0
    players_ready TINYINT UNSIGNED
);

CREATE TABLE user (
	user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nick VARCHAR(30) NOT NULL,
    room_id INT UNSIGNED,
    
    rol VARCHAR(30),
    vote VARCHAR(30),
    action VARCHAR(30),
    is_ready BOOLEAN NOT NULL DEFAULT false,
    is_dead BOOLEAN NOT NULL DEFAULT false
);