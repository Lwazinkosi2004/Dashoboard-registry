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

|Coloumn|Type|
