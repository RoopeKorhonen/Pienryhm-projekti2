from flask import Flask
import mysql.connector
from flask_cors import CORS


def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='SeOnSiina!?',
        autocommit=True
    )


def get_airport(icao):
    sql = f"select ident, name, municipality from airport where ident='{icao}'"
    cursor = connection.cursor()
    cursor.execute(sql)
    result_set = cursor.fetchone()
    if cursor.rowcount > 0:
        return {"ICAO": result_set[0], "name": result_set[1], "municipality": result_set[2]}
    else:
        return {"Error": "No results. (Invalid ICAO code)"}


connection = connect_db()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/fly_to/<icao>')
def fly_to():
    print('haha ebin :DDD')


@app.route('/airport/<icao>')
def airport(icao):
    response = get_airport(icao)
    return response


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)