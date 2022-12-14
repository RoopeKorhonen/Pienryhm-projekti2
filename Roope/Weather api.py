import requests
from flask import Flask
import mysql.connector
from flask_cors import CORS
import json


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
