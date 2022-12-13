from flask import Flask
import mysql.connector
from flask_cors import CORS
import json
import requests


def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='moodleroope',
        autocommit=True
    )

connection = connect_db()
app = Flask(__name__)
cors = CORS(app)

class Player:
    def __init__(self, name, difficulty,):
        self.name = name
        self.difficulty = difficulty
        self.co2_budget = 50000
        self.highscores = 0
        self.location = "EFHK"

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

@app.route('/get_highscores/')
def get_highscores():
    score_database = "SELECT screen_name, highscores, difficulty FROM game ORDER BY highscores DESC LIMIT 5;"
    cursor = connection.cursor()
    cursor.execute(score_database)
    result_set = cursor.fetchall()
    if cursor.rowcount > 0:
        score_list = []
        print(result_set)
        amount = len(result_set)
        for i in range (amount):
            name = result_set[i][0]
            score = result_set[i][1]
            difficulty = result_set[i][2]
            player_info = {
                'screen_name': name,
                'highscores': score,
                'difficulty': difficulty,
            }
            score_list.append(player_info)
        return score_list
    else:
        return {"Error": "No results. (Invalid sql code)"}
@app.route('/get_full_highscores/')
def get_full_highscores():
    score_database = "SELECT screen_name, highscores, difficulty FROM game ORDER BY highscores DESC;"
    cursor = connection.cursor()
    cursor.execute(score_database)
    result_set = cursor.fetchall()
    if cursor.rowcount > 0:
        score_list = []
        print(result_set)
        amount = len(result_set)
        for i in range (amount):
            name = result_set[i][0]
            score = result_set[i][1]
            difficulty = result_set[i][2]
            player_info = {
                'screen_name': name,
                'highscores': score,
                'difficulty': difficulty,
            }
            score_list.append(player_info)
        return score_list
    else:
        return {"Error": "No results. (Invalid sql code)"}

@app.route('/get_weather/')
def get_weather():
    lat = 60.2941
    lon = 25.0410
    API_key = ("14112fd30bc018d0c6c3c1a190ffbb3f")
    address = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_key}&units=metric"
    answer = requests.get(address).json()
    desc = answer["weather"]
    weather = desc[0]["description"]
    wind_speed = answer["wind"]["speed"]
    temperature = answer["main"]["temp"]
    weather_list = []
    weather_info = {
        'temperature': temperature,
        'windspeed': wind_speed,
        'description': weather,
    }
    weather_list.append(weather_info)
    print(weather)
    print(answer["main"]["temp"])
    print(wind_speed)

    return weather_list

if __name__ == '__main__':
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
