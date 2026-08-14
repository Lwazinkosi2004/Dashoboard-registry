from db import db, cursor

#dara sources
cursor.execute("""
INSERT INTO data_sources
(name, type, description)
               
VALUES
('Sales DB', 'Database', 'Sales database'),
('HR Export', 'File", 'Monthly HR file'),
('Finance API', 'API', 'Finance API')
""")

#dashboards
cursor.execute("""
INSERT INTO dashboards
(name, description, url, category, owner_name, status)
VALUES
('Sales Dashboard', 'Sales performance dashboard', 'http://example.com/sales', 'Sales', 'John Doe', 'Active'),
('HR Dashboard', 'HR metrics dashboard', 'http://example.com/hr', 'HR', 'Jane Smith', 'Active')

VALUES
('sales dashboard',
'Track sales',
'https://google.com',
'Finance team',
'Up'
)
""")

db.commit()

print("Seed data inserted successfully.")