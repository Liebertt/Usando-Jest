create database agenda_db;

use agenda_db;

CREATE TABLE User (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Nome TEXT NOT NULL,
  Email TEXT UNIQUE NOT NULL
);