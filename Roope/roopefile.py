from flask import Flask
import mysql.connector
from flask_cors import CORS


def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='gutpo80',
        autocommit=True
    )





connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/get_highscores')
def get_highscores():
    score_database = "SELECT screen_name, highscores FROM game ORDER BY highscores DESC LIMIT 5;"
    cursor = connection.cursor()
    cursor.execute(score_database)
    result_set = cursor.fetchone()
    if cursor.rowcount > 0:
        return {"name": result_set[0], "highscore": result_set[1]}
    else:
        return {"Error": "No results. (Invalid sql code)"}

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
