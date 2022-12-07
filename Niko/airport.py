import mysql
from geopy.distance import geodesic


def cursor_func(sql_komento):
    connection = mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password="",
        autocommit=True
    )
    cursor = connection.cursor()
    cursor.execute(sql_komento)
    result = cursor.fetchall()
    return result

def player_creation():

   player = input("Please input your name: ")

   return player


