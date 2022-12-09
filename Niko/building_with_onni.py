import json
import os
from geopy import distance
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
import string, random
from airport import Airport
import config


load_dotenv()



def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='',
        autocommit=True
    )


def get_airport(chosen_name):
    sql = f"SELECT latitude_deg, longitude_deg FROM airport Where iso_country in (select iso_country from country where name = '" + chosen_name + "')"
    cursor = connection.cursor()
    cursor.execute(sql)
    result_set = cursor.fetchone()
    if cursor.rowcount > 0:
        return {"latitude_deg": result_set[0], "longitude_deg": result_set[1]}
    else:
        return {"Error": "No results. (Invalid ICAO code)"}


connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def fly(id, dest, consumption=0):
    game = Game(id, dest, consumption)
    nearby = game.location[0].find_nearby_airports()
    for a in nearby:
        game.location.append(a)
    json_data = json.dumps(game, default=lambda o: o.__dict__, indent=4)
    return json_data



class Game:

    def __init__(self, id, loc, consumption, player=None, ):
        self.status = {}
        self.location = []
        letters = string.ascii_lowercase + string.ascii_uppercase + string.digits
        self.status = {
            "id": ''.join(random.choice(letters) for i in range(20)),
            "high_scores": 0,
            "screen_name": player,
            "difficulty": 1,
            "co2": {
                "consumed": config.co2_initial,
                "budget": config.co2_budget
            },
            "previous_location": ""

        }
        self.location.append(Airport(loc, True))
        sql = "INSERT INTO Game VALUES ('" + self.status["id"] + "', " + str(self.status["co2"]["consumed"])
        sql += ", " + str(self.status["co2"]["budget"]) + ", '" + loc + "', '" + self.status["screen_name"]
        sql += "', '" + str(self.status["highscores"]) + "', '" + str(self.status["difficulty"]) + "')"
        print(sql)
        cursor = config.conn.cursor()
        cursor.execute(sql)



    def set_location(self, location):
        sql = "UPDATE Game SET location='" + location.ident + "' WHERE id='" + self.status["id"] + "'"
        print(sql)
        return



class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.active = active
        self.name = data['name']
        self.latitude = float(data['latitude'])
        self.longitude = float(data['longitude'])
        sql = "SELECT  latitude_deg, longitude_deg FROM Airport WHERE ident='" + ident + "'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()

        # vältetään kauhiaa määrää hakuja
        if data is None:
            # find airport from DB
            sql = "SELECT  latitude_deg, longitude_deg FROM Airport WHERE ident='" + ident + "'"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.ident = res[0][0]
                self.name = res[0][1]
                self.latitude = float(res[0][2])
                self.longitude = float(res[0][3])
        else:
            self.name = data['name']
            self.latitude = float(data['latitude'])
            self.longitude = float(data['longitude'])


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
        consumption = self.co2_consumption(dist)
        return int(consumption)

    def co2_consumption(self, km):
        consumption = km / (1.69 * 3)
        return consumption

@app.route('/fly_to/<icao>')
def fly_to():
    args = request.args
    id = args.get("game")
    dest = args.get("dest")
    consumption = args.get("consumption")
    json_data = fly(id, dest, consumption)
    print("*** Called flyto endpoint ***")
    return json_data

@app.route('/airport/<icao>')
def airport(icao):
    response = get_airport(icao)
    return response







if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
