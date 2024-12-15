# project/static/database/db_connection.py
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='pizzadelivery_db'  # Replace with your actual database name
        )
        if connection.is_connected():
            return connection
    except Error as err:
        print(f"Error: {err}")
        return None
