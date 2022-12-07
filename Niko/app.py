import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
import string, random
from airport import Airport
import config
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
    result_set = cursor.fetchall()
    if cursor.rowcount > 0:
        return {"latitude_deg": result_set[0], "longitude_deg": result_set[1]}
    else:
        return {"Error": "No results. (Invalid name code)"}


connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/fly_to/<chosen_name>')
def fly_to():
    print('haha ebin :DDD')


@app.route('/airport/<icao>')
def airport(chosen_name):
    response = get_airport(chosen_name)
    return response


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)