import json
from geopy import distance
import mysql.connector
from flask import Flask, request
from flask_cors import CORS
import string, random
from airport import Airport
import config

def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='',
        autocommit=True
    )
class Player:
    def __init__(self, name, difficulty,):
        self.name = name
        self.difficulty = difficulty
        self.co2_budget = 50000
        self.highscores = 0
        self.location = "EFHK"



connection = connect_db()
app = Flask(__name__)
cors = CORS(app)


@app.route('/player_info/<name>/<difficulty>/')
def player_info(name, difficulty):
    player = Player(name, difficulty)
    player_info_list = []
    result = {
        "Name": player.name,
        "Difficulty": player.difficulty,
    }
    print(result)
    player_info_list.append(result)
    return result


class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, longitude, latitude, name, municipality):
        self.ident = ident
        self.name = name
        self.latitude = float(latitude)
        self.longitude = float(longitude)
        self.municipality = municipality


    def get_airport(self):
        sql = f"SELECT name, ident, municipality, latitude_deg, longitude_deg FROM airport order by rand() limit 100"
        cursor = connection.cursor()
        cursor.execute(sql)
        result_set = cursor.fetchall()

        result = list(map(list, zip(*result_set)))

        if cursor.rowcount > 0:
            return {"name": result[0], "ident": result[1], "municipality": result[2], "latitude_deg": result[3],
                    "longitude_deg": result[4]}
        else:
            return {"Error": "No results. (Invalid ICAO code)"}

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
    response = Airport.get_airport(icao)
    return response


if __name__ == '__main__':
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(use_reloader=True, host='127.0.0.1', port=5000)