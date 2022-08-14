#!/usr/bin/env python3
import json
from models.videoHandler import MotionDetector 
import requests
from os import getenv
import jwt
from threading import Thread

def changeSensitivity(obj: MotionDetector,param,res=None):
    obj.changeSensitivity(eval(param['value']))
    res(json.dumps({'value':True}))

def changeDetectionState(obj: MotionDetector,param, res=None):
    if param['value']:
        obj.launchDetection()
        res(json.dumps({'value':True}))
    else:
        obj.stopDetection()
        res(json.dumps({'value':True}))

def getDetectionState(obj: MotionDetector,param, res=None):
    res(json.dumps({'value':obj.getDetectionState()}))

def getSensitivity(obj: MotionDetector,param,res=None):
    res(json.dumps({'value':obj.getSensitivity()}))


def sendAlarm(id: str):
    token = jwt.encode({'random':'payload'},getenv('JWT_SECRET','secret'),algorithm='HS256')
    head = {'Authorization':'Bearer {}'.format(token)}
    data = {'cameraId':id}
    resp = requests.post('{}/alarm'.format(getenv('WEB_SERVER','http://localhost:5000')),data,headers=head)
    soundAlarm()

def soundAlarm():
    return
