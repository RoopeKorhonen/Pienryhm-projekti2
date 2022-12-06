from geopy.distance import geodesic
import random
import config
from geopy import distance
import mysql.connector
connection = mysql.connector.connect(
         host='127.0.0.1',
         port= 3306,
         database='flight_game',
         user='root',
         password='',
         autocommit=True
         )

class Airport :

    def __init__(self, ident, name, longitude, latitude):
        self.ident = ident
        self.name = name
        self.longitude = longitude
        self.latitude = latitude
        sql = "SELECT ident, name, latitude_deg, longitude_deg FROM Airport WHERE ident='" + ident + "'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        return result

    def airport_search(self):

        sql = "SELECT ident, name, latitude_deg, longitude_deg FROM Airport WHERE latitude_deg BETWEEN "
        sql += str(self.latitude - config.max_lat_dist) + " AND " + str(self.latitude + config.max_lat_dist)
        sql += " AND longitude_deg BETWEEN "
        sql += str(self.longitude - config.max_lon_dist) + " AND " + str(self.longitude + config.max_lon_dist)
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
