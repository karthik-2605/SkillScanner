-- SkillScanner database schema
CREATE DATABASE IF NOT EXISTS skillScanner;
USE skillScanner;

CREATE TABLE IF NOT EXISTS jobs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  job_title  VARCHAR(255) NOT NULL,
  company    VARCHAR(255) NOT NULL,
  category   VARCHAR(100) NOT NULL,
  location   VARCHAR(255) NOT NULL,
  job_info   TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
