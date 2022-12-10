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

def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='',
        autocommit=True
    )

class Game:
    class Game:

        def __init__(self, loc, consumption, player=None, ):
            self.status = {}
            self.location = []
            self.status = {
                "high_scores": 0,
                "name": None,
                "difficulty": None,
                "co2": {
                    "consumed": 0,
                    "budget": 50000
                },
                "previous_location": ""

            }
            self.location.append(Airport(loc, True))
            sql = "INSERT INTO Game VALUES ('" + self.status["id"] + "', " + str(self.status["co2"]["consumed"])
            sql += ", " + str(self.status["co2"]["budget"]) + ", '" + loc + "', '" + self.status["name"]
            sql += "', '" + str(self.status["highscores"]) + "', '" + str(self.status["difficulty"]) + "')"
            print(sql)
            cursor = connection.cursor()
            cursor.execute(sql)


connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


app = Flask(__name__)


@app.route('/player_info/<name>/<difficulty>')
def player_info(name, difficulty):
    player_name = name
    difficulty_level = difficulty
    return



if __name__ == '__main__':
    app.run()