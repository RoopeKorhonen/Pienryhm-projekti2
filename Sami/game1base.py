global salasana
salasana = input("Salasana: ")
from geopy.distance import geodesic

import mysql.connector
connection = mysql.connector.connect(
         host='127.0.0.1',
         port= 3306,
         database='flight_game',
         user='root',
         password=salasana,
         autocommit=True
         )

def co2_budgetgiver():
    co2_budget = 5000
    return co2_budget


def co2_tracker(value):
    global co2_budget
    co2_budget = co2_budget - value
    if co2_budget > 1000:
        print(f"You have {co2_budget:0.2f} of Co2 left")
        return
    else:
        game_over()

def update_location(location):
    global current_location
    current_location = location
    airport_list.append(current_location)
    print(f"Your location is: {current_location}")
    chooseCountry()



def emission_calculator(chosen):
    #print(f"pituus asemien välillä on {geodesic(km_calculator(chosen), km_calculator(current_location)).km} km")
    co2_used = geodesic(km_calculator(chosen), km_calculator(current_location)).km / (1.69 * multiplier)
    co2_tracker(co2_used)
    print(f"You consumed {co2_used:0.2f} of CO2")
    update_location(chosen)

def choose_airport(choices):
    list = choices
    if not list:
        print("That's not a country. Try again.")
        chooseCountry()
    choice = input("Choose an airport / press 1 to choose a different country: ")
    while choice not in list:
        if choice == "1":
            chooseCountry()
        else:
            print("Error: Invalid Airport name (Typo?)")
            choice = input("Choose an airport / press 1 to choose a different country: ")
    emission_calculator(choice)
    return


def km_calculator(airport):
    sql = "SELECT latitude_deg, longitude_deg FROM airport Where name = %s"
    ap_2_list = [airport]
    kursori = connection.cursor()
    kursori.execute(sql, ap_2_list)
    tulos = kursori.fetchall()
    return tulos[0]

def searchAirports(chosen_name):
    sql = "SELECT name FROM airport Where iso_country in (select iso_country from country where name = '" + chosen_name + "') ORDER BY RAND() limit 5"
    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    return result

def chooseCountry():
    country = input("Select a country to fly to: ")    #JOS KÄYTTÄJÄ VALITSEE VÄÄRÄN MAAN / TYPO, NIIN OHJELMA SOFTLOCKKAANTUU. TÄHÄN VALINTA, JOKA PALAA KYSYNTÄÄN.
    airports = searchAirports(country)
    list = []
    for rivi in airports:
        rivi = ''.join(rivi)
        dist = geodesic(km_calculator(rivi), km_calculator(current_location)).km
        print(f"{rivi} {dist:0.2f} km")
        list.append(rivi)
    choose_airport(list)


def game_over():
    global username
    highScore_str = str(high_score_calculator())
    name_and_scoreADD = "INSERT INTO game (screen_name, highscores) values ('" + username + "', '" + highScore_str + "');"
    cursor_func(name_and_scoreADD)
    print(f"Game over, you have ran out of Co2 to consume. Your total highscore is {highScore_str}.")
    choice = input("Main menu\n1.Play\n2.Scores\n3.Quit\n: ")
    choice = choice.lower()

    while choice != "1" or "2" or "3":
        if choice == "1":
            global airport_list
            airport_list = visited_airport_list()
            username = username_input()
            global co2_budget
            co2_budget = co2_budgetgiver()
            global multiplier
            multiplier = Difficulty()
            spawn_point()
        elif choice == "2":
            highscore_menu()
        elif choice == "3":
            print("You have quit the game. Farewell!")
            exit()
        else:
            print("Invalid input")
        choice = input("Main menu\n1.Play\n2.Scores\n3.Quit\n: ")
        choice = choice.lower()


def spawn_point():
    spawn_point_code = "SELECT name from airport order by RAND() limit 1"
    spawn_point_cursor = connection.cursor()
    spawn_point_cursor.execute(spawn_point_code)
    result = spawn_point_cursor.fetchall()
    for line in result:
        current_airport = ''.join(line)
        ''.join(current_airport[0])
        print(f"You're currently at: {current_airport}\n")
        global current_location
        current_location = current_airport
    chooseCountry()

def Difficulty():
    diff_level = input("Please choose a difficulty level: \nThe Difficulty levels are Easy, Normal and Hard\n:")
    diff_level = diff_level.lower()
    global multiplier
    while diff_level != "easy" or "normal" or "hard":
        if diff_level == "easy":
            print("Chose eazy mode, you lazy pleb\nLet's play")
            diff = 0.75
            return diff
        elif diff_level == "normal":
            print("You chose normal, kinda sus tbh\nLet's play")
            diff = 1.25
            return diff
        elif diff_level == "hard":
            print("You chose crazy mega hard mode you absolute unit!\nLet's play")
            diff = 1.75
            return diff
        else:
            print("ohh you're a funny guy haaa.")
        diff_level = input("Please choose a difficulty level: \nThe Difficulty levels are \nEasy\nNormal\nHard\n:")
def username_input():
    user = input("Hello user please stage your gamertag: ")
    print(f"Hello {user}, welcome to the world of flying games.\nI am your game engine Flying Ultimatum")
    print("Fly to as many places as you can while keeping your emission levels as low as possible")
    return user

def cursor_func(sql_komento):                      #SQL PISTEYTYKSEN KOMENTO.
    yhteys = mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password=salasana,
        autocommit=True
    )
    cursor = yhteys.cursor()

    cursor.execute(sql_komento)

    result = cursor.fetchall()

    return result
#def high_score_add_to_database(name):
   # name_and_scoreADD: str = "INSERT INTO game (screen_name, highscores) values ('" + name + "', '" + high_score_calculator(name) + "');"
   # cursor_func(name_and_scoreADD)


def high_score_calculator():
    highscore = len(airport_list)*30000
    return highscore

def visited_airport_list():
    visited_airports = []
    return visited_airports

def highscore_menu():
    print("Highscores menu.")
    score_database = "SELECT screen_name, highscores FROM game ORDER BY highscores DESC LIMIT 5;"
    cursor = connection.cursor()
    cursor.execute(score_database)
    result = cursor.fetchall()
    for x in result:
        print(x[0], x[1])

main_menu_int = input("Main menu\n1.Play\n2.Scores\n3.Quit\n: ")
while main_menu_int != "1" or "2" or "3":
    if main_menu_int == "1":
        global airport_list
        airport_list = visited_airport_list()
        global username
        username = username_input()
        co2_budget = co2_budgetgiver()
        multiplier = Difficulty()
        spawn_point()
    elif main_menu_int == "2":
            print("Highscores menu.")
            score_database = "SELECT screen_name, highscores FROM game ORDER BY highscores DESC LIMIT 5;"
            cursor = connection.cursor()
            cursor.execute(score_database)
            result = cursor.fetchall()
            for x in result:
                print(x[0], x[1])
    elif main_menu_int == "3":
        print("You have quit the game. Farewell!")
        exit()
    else:
        main_menu_int = input("Main menu\n1.Play\n2.Scores\n3.Quit\n: ")