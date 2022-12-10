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
app.config['CORS_HEADERS'] = 'Content-Type'


app = Flask(__name__)


@app.route('/player_info/<name>/<difficulty>')
def player_info(name, difficulty):
    player = Player(name, difficulty,)
    return player


if __name__ == '__main__':
    app.run()