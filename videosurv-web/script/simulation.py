import time
import sys
import random
from crate import client
from datetime import datetime

SALLES = {
    "B215":[57.45375899782175,-20.244057573751704],
    "D25":[57.453671791904185,-20.24437056046702],
    "Labo":[57.45318631305574,-20.244229636079382]
    }
URL = "192.168.43.205:4200"

random.seed(datetime.now())

def getRandomPosition(lat_min,lat_max,lng_min,lng_max):
    #position au hasard autour de l'université

    #lat_min = -20.2440
    #lat_max = -20.2446

    #lng_min = 57.4531
    #lng_max = 57.4539

    return f'POINT ({random.uniform(lng_min,lng_max)} {random.uniform(lat_min, lat_max)})'

def randomSalle(salles):
    noms = list(salles.keys())
    return noms[random.randint(0,2)]

def insert(id,position,salle,connection):
    
    cursor = connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO equipement_historique (id,position,salle) VALUES (?,?,?)", [id,position,salle]
        )
        print("INSERT OK")
    except Exception as err:
        print("INSERT ERROR: %s" % err)
        return True


if __name__ == "__main__":
    try:
        connection = client.connect(URL)
        print("CONNECT OK")
    except Exception as err:
        print("CONNECT ERROR: %s" % err)
        exit()

    while True:
        pause = 0.5

        salle = randomSalle(SALLES)

        lat_min = SALLES[salle][1]
        lat_max = SALLES[salle][1] + 0.00003

        lng_min = SALLES[salle][0]
        lng_max = SALLES[salle][0] + 0.00003

        for _ in range(10):
            position = getRandomPosition(lat_min,lat_max,lng_min,lng_max)
            print(sys.argv[1],position,salle,sep=" ")
            if(insert(sys.argv[1],position,salle,connection)):
                pause = 10 #en cas d'erreur d'insertion
            time.sleep(pause)
