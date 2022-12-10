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
        password='gutpo80',
        autocommit=True
    )


def get_airport():
    sql = f"SELECT name, ident, municipality, latitude_deg, longitude_deg FROM airport order by rand() limit 100"
    cursor = connection.cursor()
    cursor.execute(sql)
    result_set = cursor.fetchall()

    result = list(map(list, zip(*result_set)))
    print(result[0])
    print(result[1])

    if cursor.rowcount > 0:
        return {"name": result[0], "ident": result[1], "municipality": result[2], "latitude_deg": result[3], "longitude_deg": result[4]}
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


@app.route('/fly_to/<icao>')
def fly_to():
    args = request.args
    id = args.get("game")
    dest = args.get("dest")
    consumption = args.get("consumption")
    json_data = fly(id, dest, consumption)
    print("*** Called flyto endpoint ***")
    return json_data

@app.route('/get_airport/')
def airport():
    response = get_airport()
    return response


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
