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


def get_airport(chosen_name):
    sql = f"SELECT name, latitude_deg, longitude_deg FROM airport Where iso_country in (select iso_country from country where name = '" + chosen_name + "')"
    cursor = connection.cursor()
    cursor.execute(sql)
    result_set = cursor.fetchall()

    result = list(map(list, zip(*result_set)))

    if cursor.rowcount > 0:
        return {"name": result[0], "latitude_deg": result[1], "longitude_deg": result[2]}
    else:
        return {"Error": "No results. (Invalid ICAO code)"}


connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/fly_to/<icao>')
def fly_to():
    print('haha ebin :DDD')


@app.route('/get_airport/<chosen_name>')
def airport(chosen_name):
    response = get_airport(chosen_name)
    return response


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)