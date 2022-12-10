import mysql.connector
from dotenv import load_dotenv
import config
from geopy import distance
load_dotenv()



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

class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.name = data['name']
        self.latitude = float(data['latitude'])
        self.longitude = float(data['longitude'])
        sql = "SELECT  latitude_deg, longitude_deg FROM Airport WHERE ident='" + ident + "'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()



    def find_nearby_airports(self):
        lista = []
        # haetaan kaikki tiedot kerralla
        sql = "SELECT ident, name, latitude_deg, longitude_deg FROM Airport WHERE latitude_deg BETWEEN "
        sql += str(self.latitude - config.max_lat_dist) + " AND " + str(self.latitude + config.max_lat_dist)
        sql += " AND longitude_deg BETWEEN "
        sql += str(self.longitude - config.max_lon_dist) + " AND " + str(self.longitude + config.max_lon_dist)
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()
        for r in res:
            if r[0] != self.ident:
                # lisätty data, jottei jokaista kenttää tartte hakea
                # uudestaan konstruktorissa
                data = {'name': r[1], 'latitude': r[2], 'longitude': r[3]}
                print(data)
                nearby_apt = Airport(r[0], False, data)
                nearby_apt.distance = self.distanceTo(nearby_apt)
                if nearby_apt.distance <= config.max_distance:
                    lista.append(nearby_apt)
                    nearby_apt.co2_consumption = self.co2_consumption(nearby_apt.distance)
        return lista

    def distanceTo(self, target):
        coords_1 = (self.latitude, self.longitude)
        coords_2 = (target.latitude, target.longitude)
        dist = distance.distance(coords_1, coords_2).km
        return int(dist)

    def co2_consumption(self, km):
        consumption = config.co2_per_flight + km * config.co2_per_km
        return consumption


