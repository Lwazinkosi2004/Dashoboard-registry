import pymysql

db = pymysql.connect(
    host="localhost",
    user="root",
    password="Lwami200409",
    database="dashboard_registry",
    cursorclass=pymysql.cursors.DictCursor
)

cursor = db.cursor()

print("MYSQL CONNECTED SUCCESSFULLY")
