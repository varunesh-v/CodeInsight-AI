import mysql.connector
import time
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():

    for _ in range(10):
        try:
            return mysql.connector.connect(
                host=os.getenv("DB_HOST"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                database=os.getenv("DB_NAME")
            )
        except Exception:
            time.sleep(5)

    raise Exception("Could not connect to MySQL")