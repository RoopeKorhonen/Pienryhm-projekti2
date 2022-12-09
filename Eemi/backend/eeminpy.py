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
        password='RootWord1Salasana1',
        autocommit=True
    )

connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
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
    score_database = "SELECT screen_name, highscores, difficulty FROM game ORDER BY highscores;"
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

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
