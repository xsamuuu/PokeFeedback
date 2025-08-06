CREATE DATABASE IF NOT EXISTS poke_users;
USE poke_users;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_entrenador VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_pokemon INT NOT NULL,
    comentario TEXT,
    reaccion TINYINT(1) NOT NULL DEFAULT 0, -- 1=like, 2=dislike, 0=nada
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);