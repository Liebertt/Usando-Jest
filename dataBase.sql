create database agenda_db;

use agenda_db;

-- Remove os comandos MySQL e use apenas SQLite
CREATE TABLE IF NOT EXISTS Usuario (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Contato (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Id_usuario INTEGER NOT NULL,
  Telefone_celular TEXT NOT NULL,
  Telefone_recado TEXT,
  Email TEXT UNIQUE NOT NULL,
  Endereco TEXT NOT NULL,
  FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id)
);