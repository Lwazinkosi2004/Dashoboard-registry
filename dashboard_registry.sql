CREATE DATABASE dashboard_registry;

USE dashboard_registry;

CREATE TABLE dashboards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    status ENUM('Up', 'Down', 'Unknown') DEFAULT 'Unknown',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    type ENUM('Database', 'File', 'API') NOT NULL,
    description TEXT
);

CREATE TABLE dashboard_data_sources (
    dashboard_id INT,
    data_source_id INT,
    PRIMARY KEY (dashboard_id, data_source_id),
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE,
    FOREIGN KEY (data_source_id) REFERENCES data_sources(id) ON DELETE CASCADE
);

INSERT INTO dashboards
(name, description, url, category, owner_name, status)

VALUES
(
'Test Dashboard',
'Testing dashboard',
'https://google.com',
'Finance',
'Lwazi',
'Up'
);