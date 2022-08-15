#!/usr/bin/env python3



from random import randint
from models.sendToRTMP import RTMP_sender
from models.videoHandler import MotionDetector
import cv2
import rospy
from servicesLauncher.videoService import videoService
import json
from controllers.detection import sendAlarm
from video_pkg.srv import videosrv, videosrvResponse
import route
from threading import Thread
import jwt
from os import getenv
from std_msgs.msg import String
from cv_bridge import CvBridge, CvBridgeError
import RPi.GPIO as GPIO
import time

RTMP_URL = "rtmp://{}/live/{}".format(getenv('SERVER_IP','localhost'),getenv('CAMERA_LIVE_URL','camera'))
JWT_SECRET = getenv('JWT_SECRET','secret')
BUZZERPIN = 13


"""
    Traitement des requetes 
"""
def callback(obj: MotionDetector,req):
    try:
        srvresp = ['']
        request = json.loads(req.request)
        parameters = json.loads(req.parameters)
        def setRes(res,srvresp):
            srvresp[0] = res

        #Verify authentication
        user = jwt.decode(request['Authorization'],JWT_SECRET,algorithms=["HS256"])
        

        route.route[request['METHOD']][request['query']](obj,parameters,lambda res:setRes(res,srvresp))
        return srvresp[0]
    except KeyError:
        return videosrvResponse(json.dumps({'error':'unknown request'}))
    except jwt.exceptions.DecodeError:
        return videosrvResponse(json.dumps({'error':'Authentication failed'}))
    except Exception as e:
        print(req, type(e))
        return videosrvResponse(json.dumps({'error':str(e)}))
    
    

def setup():
    print('setting up...')
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BUZZERPIN,GPIO.OUT)


def runBuzzer():
    p = GPIO.PWM(BUZZERPIN,440)
    p.start(10)
    time.sleep(1)
  


def destroy():
    GPIO.output(BUZZERPIN,GPIO.HIGH)
    GPIO.cleanup()



def showVideo(obj: MotionDetector,frame: cv2.Mat):
    cv2.imshow('video',frame)


    #Fonction de test



    key = cv2.waitKey(5) & 0xFF 
    if key == ord('p'):
        obj.changeSensitivity(obj.sensitivity+20)
    elif key == ord('m'):
        obj.changeSensitivity(obj.sensitivity-20)
    elif key == ord('d'):
        print('detection...')
        obj.launchDetection()
    elif key == ord('s'):
        obj.stopDetection()
        print('detection stopped...')
    elif key == ord('q'):
        cv2.destroyAllWindows()
        exit()
    
def onMotionCallback():
    sendAlarm(getenv('CAMERA_ID','camera'))
    runBuzzer()

def main():
    print('launching main...')
    serv = RTMP_sender(RTMP_URL)

    # open camera
    cap = cv2.VideoCapture(0,cv2.CAP_V4L)

    # set dimensions
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 800)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 600)

    #lire la camera et mise en place du callback en detection de mouvement
    video = MotionDetector(cap,motionCallback=onMotionCallback)

    
    cb = lambda req: callback(video,req) 

    #Demarrer le service dans un thread séparé
    serviceThread = Thread(target=videoService,kwargs={'callback':cb})
    serviceThread.start()

    def sendToRtmp(obj: MotionDetector,frame: cv2.Mat):
        #showVideo(obj,frame)
        serv.send_frame(frame)

    
    video.processVideo(sendToRtmp)
    


if __name__ == "__main__":
    rospy.init_node(getenv('CAMERA_ID','camera'))
    setup()
    try:
        main()
    finally:
        GPIO.cleanup()
        destroy()

