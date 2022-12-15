import mysql.connector
import json
import os
from dotenv import load_dotenv
import requests
from geopy import distance
from flask import Flask, request
from flask_cors import CORS

load_dotenv()

def connect_db():
    return mysql.connector.connect(
        host=os.environ.get('HOST'),
        port=3306,
        database=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASS'),
        autocommit=True
    )


class Player:
    def __init__(self, name, difficulty,):
        self.name = name
        self.difficulty = difficulty

        if self.difficulty == "Easy":
            self.co2_budget = 50000
        elif self.difficulty == "Medium":
            self.co2_budget = 25000
        else:
            self.co2_budget = 10000

        self.highscores = 0
        self.location = ""

    def name_difficulty(self):
        sql = "INSERT INTO Game VALUES name, difficulty, highscores"
        return sql

class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, longitude, latitude, name, municipality):
        self.ident = ident
        self.name = name
        self.latitude = float(latitude)
        self.longitude = float(longitude)
        self.municipality = municipality


    def get_airport(self):
        sql = f"SELECT name, ident, municipality, latitude_deg, longitude_deg FROM airport WHERE name like '%airport%' order by rand() limit 100"
        cursor = connection.cursor()
        cursor.execute(sql)
        result_set = cursor.fetchall()

        result = list(map(list, zip(*result_set)))

        if cursor.rowcount > 0:
            return {"name": result[0], "ident": result[1], "municipality": result[2], "latitude_deg": result[3],
                    "longitude_deg": result[4]}
            get_question()
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

connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
@app.route('/airport/<icao>')
def airport(icao):
    response = Airport.get_airport(icao)
    return response

@app.route('/player_info/<name>/<difficulty>/')
def player_info(name, difficulty):
    player = Player(name, difficulty)
    player_info_list = []
    result = {
        "name": player.name,
        "difficulty": player.difficulty,
        "co2_budjet": player.co2_budget,
        "points": player.highscores,
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

@app.route('/get_weather/<lat>/<long>')
def get_weather(lat, long):
    lat = lat
    lon = long
    API_key = ("14112fd30bc018d0c6c3c1a190ffbb3f")
    address = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_key}&units=metric"
    answer = requests.get(address).json()
    desc = answer["weather"]
    weather = desc[0]["description"]
    wind_speed = answer["wind"]["speed"]
    temperature = answer["main"]["temp"]
    weather_info = {
        'temperature': temperature,
        'windspeed': wind_speed,
        'description': weather,
    }
    return weather_info

@app.route('/get_question/')
def get_question():
    sql = f"SELECT question, right_answer, wrong_answer FROM questions order by rand() limit 1;"
    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchone()
    print(result)

    if cursor.rowcount > 0:
        return {"question": result[0], "right_answer": result[1], "wrong_answer": result[2]}
    else:
        return {"Error": "No results."}

@app.route('/distance_calculation/<target>/<target2>/<current>/<current2>')
def distance_calculation(target, target2, current, current2):
    target_coords = (target, target2)
    current_coords = (current, current2)
    dist = distance.distance(target_coords, current_coords).km.__floor__()
    print(dist)
    return {"Distance": dist}


@app.route('/calculate_co2_budget/<player_budget>/<dist>')
def calculate_co2_budget(player_budget, dist):
    dist = dist
    new_budget = int(player_budget) - int(dist) / (1.69 * 3)
    new_budget = new_budget.__floor__()
    print(f"new budget", new_budget)
    return {"budget": new_budget}


@app.route('/game_over/<name>/<score>/<diff>')
def game_over(name, score, diff):
    print(name, score, diff)
    sql = "INSERT INTO game (screen_name, highscores, difficulty) " \
          "values ('" + name + "', '" + score + "', '" + diff + "');"
    cursor = connection.cursor()
    cursor.execute(sql)

@app.route('/get_player_results/')
def get_player_results():
    sql = "SELECT screen_name, highscores, difficulty FROM game ORDER BY id DESC LIMIT 1;"
    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    return result

if __name__ == '__main__':
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(use_reloader=True, host='127.0.0.1', port=5000)