#!/usr/bin/env python3


import rospy
from video_pkg.srv import videosrv, videosrvResponse
import json
from os import getenv





# def callback(req):
#     try:
#         request = json.loads(req.request)
#         parameters = json.loads(req.parameters)
#     except Exception as e:
#         return videosrvResponse(json.dumps({'error':str(e)}))
    

    
#     return videosrvResponse(json.dumps({'success':200}))


def videoService(callback):
    srv = rospy.Service('video_service{}'.format(getenv('CAMERA_ID','')),videosrv,callback)
    rospy.spin()




if __name__ == "__main__":
    videoService()