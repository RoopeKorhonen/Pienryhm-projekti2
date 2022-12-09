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


def get_airport():
    sql = f"SELECT ident, name, latitude_deg, longitude_deg FROM airport where type like '%airport' ORDER BY RAND() LIMIT 100"
    cursor = connection.cursor()
    cursor.execute(sql)
    result_set = cursor.fetchall()

    result = list(map(list, zip(*result_set)))

    if cursor.rowcount > 0:
        return {"ident": result[0], "name": result[1], "latitude_deg": result[2], "longitude_deg": result[3]}
    else:
        return {"Error": "No results. (Invalid ICAO code)"}


connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/fly_to/<icao>')
def fly_to():
    print('haha ebin :DDD')


@app.route('/get_airport/')
def airport():
    response = get_airport()
    return response


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)