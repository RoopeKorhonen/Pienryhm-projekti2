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
        password='moodleroope',
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


if __name__ == '__main__':
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(use_reloader=True, host='127.0.0.1', port=5000)