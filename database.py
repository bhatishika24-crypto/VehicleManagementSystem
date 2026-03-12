import mysql.connector

connection = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="root",
    database="truck_management",
    auth_plugin="mysql_native_password"
)

cursor = connection.cursor(dictionary=True)