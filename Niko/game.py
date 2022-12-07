import string, random
from airport import Airport
import config
import mysql.connector


def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='',
        autocommit=True
    )

class Game:

    def __init__(self, id, loc, consumption, player=None, ):
        self.status = {}
        self.location = []
        letters = string.ascii_lowercase + string.ascii_uppercase + string.digits
        self.status = {
            "id": ''.join(random.choice(letters) for i in range(20)),
            "high_scores": 0,
            "screen_name": player,
            "difficulty": 1,
            "co2": {
                "consumed": config.co2_initial,
                "budget": config.co2_budget
            },
            "previous_location": ""

        }
        self.location.append(Airport(loc, True))
        sql = "INSERT INTO Game VALUES ('" + self.status["id"] + "', " + str(self.status["co2"]["consumed"])
        sql += ", " + str(self.status["co2"]["budget"]) + ", '" + loc + "', '" + self.status["screen_name"]
        sql += "', '" + str(self.status["highscores"]) + "', '" + str(self.status["difficulty"]) + "')"
        print(sql)
        cursor = config.conn.cursor()
        cursor.execute(sql)



    def set_location(self, location):
        sql = "UPDATE Game SET location='" + location.ident + "' WHERE id='" + self.status["id"] + "'"
        print(sql)
        return