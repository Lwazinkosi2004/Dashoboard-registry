# Dashoboard-registry
A full-stack web application that acts as a central catalogue for company dashboards and their linked data sources 


# Project Overview 
- The dashboard registry help teams:
- Store dashboard information
- search dashboards quickly
- view dashboard owners and categories 
- open dashboard URLs
- link dashboards to data sources 
- manage all dashboard metadata in one place 

the system does not host real dashboards. It only stores information about them.

# Technologies used 
## Frontend 
- HTML
- CSS
- JavaScript
## Backend 
- Python
- Flask-CORS
## Database 
- MySQl
## Tools
- VS Code
- Live Server
- MySQL Workbench

# Features 
## Dashboards
User can:
- Add dashboards
- View dashoards
- Edit dashboards
- Delete dashboards
- Search dashboards
- Filter dashboards
- Open dashboards URLs
- Link dashboards to data sources 
## Dashboard fields 
- Name
- Description
- URL
- Category
- Owner name
- Status

# Data Sources 
Users can:
- Add data sources
- View data sources
- Edit data sources
- Delete data sources

# Data Source Fields
- Name
- Type
- Description

## Dashboard - Data Source Linking 
- One dashboard can use many data sources
- one data source can be linked to many dashboards
This implemented using a many-to-many relationship table


## Database design 
# Tables
# Dashboard 


| Coloumn | Type |
|:---|---:|
| Id | Int |
| Name | VARCHAR |
| Description | TEXT |
| URL | VARCHAR |
| Category | VARCHAR |
| Owner Name | VARCHAR |
| Status | ENUM |
| Created_at | TIMESTAP |
| Updated_at | TIMESTAP |

# Dashboard_data_source
| Column | Type |
|:---|---:|
| Dashboard_ID | INT |
| Data_source_ID | INT |


## API Endpoints
# Dashboards 

| Method | Endpoint |
|:---|---:|
| GET | /api/dashboards |
| POST | /api/dashboards |
| PUT | /api/dashboards/:id |
| DELETE | /api/dashboard/:id |

# Data sources 
| Method | Endpoint |
|:---|---:|
| GET | /api/data-sources |
| POST | /api/data-sources |
| PUT | /api/data-sources/:id |
| DELETE | /api/data-sources/:id |


## Project Stucture
- api.py
- db.py
- seed.py
- requirements.txt
- routes/
  - dashboards.py
  - data_sources.py
 
- frontend/
  - index.html
  - style.css
  - script.js

- README.md


## Installation Guide
# 1. Clone project 
- git clone <repository-url>

# 2. Setup backend
- Open terminal inside backend folder:

  pip install -r requirements.txt

# 3. Create MySQL Database
  - Run the following SQL:

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

    FOREIGN KEY (dashboard_id)
    REFERENCES dashboards(id)
    ON DELETE CASCADE,

    FOREIGN KEY (data_source_id)
    REFERENCES data_sources(id)
    ON DELETE CASCADE
);

# 4. Configure Database Connection
- Update db.py

  import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="YOUR_PASSWORD",
    database="dashboard_registry"
)

cursor = db.cursor(dictionary=True)
 Replace 
 Your_Password
 with your MySQL password

# 5. Run Backend
- python app.py

   Backend runs on:
   http://127.0.0.1:5000

# 6. Run Frontend
- Install VS Code Live Server extension

  Right click:
   Index.html

  Select:
   Open with live server

  Frontend runs on:
   http://127.0.0.1:5500

# Seed Data
   To insert sample data:
   Python seed.py

# validation Rules
The application validates:
- Required Fields
- Unique names
- Valid URLS
- Daashboard status values
- Data source types

## Design Decisions 
# Why HTML/CSS/JavaScript?
Chosen for simplicity and ease of development

# Why Flask?
Flask is lightweight and beginner-Friendly for REST API Development 

# Why MySQL?
MySQL provides reliable relational database support and handles many-to-many relationships well.

# Delete Strategy 
Linked dashboard-data-source records are automatically removed using:
ON DELETE CASCADE


## Future improvements 
Possible future enhancements:
- Authentication systems
- Dashboard favourites
- Better UI styling
- Pagination
- Advanced filtering
- Deployment to cloud hosting

## Author 
# Lwazi Nkosi 


## Project Status 
# Completed 
   
