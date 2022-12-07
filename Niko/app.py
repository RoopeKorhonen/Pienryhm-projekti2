import json
import os

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS

import config
from game import Game
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


def fly(id, dest, consumption=0, player=None):
    game = Game(id, dest, consumption)
    nearby = game.location[0].find_nearby_airports()
    for a in nearby:
        game.location.append(a)
    json_data = json.dumps(game, default=lambda o: o.__dict__, indent=4)
    return json_data


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
