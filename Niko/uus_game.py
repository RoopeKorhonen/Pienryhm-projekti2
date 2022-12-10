class Game:
    sql = "INSERT INTO Game VALUES
    cursor = config.conn.cursor()
    cursor.execute(sql)