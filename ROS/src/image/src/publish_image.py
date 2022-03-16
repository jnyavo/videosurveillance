#!/usr/bin/python3

import rospy
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
import cv2


# open camera
cap = cv2.VideoCapture(0,cv2.CAP_V4L)

# set dimensions
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 800)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 600)

if not cap.isOpened():
    print("Camera not opened")
    exit()
bridge = CvBridge()

def talker():
    pub = rospy.Publisher('/camera1',Image,queue_size = 1)
    rospy.init_node('image', anonymous=False)
    while not rospy.is_shutdown():
        ret, frame = cap.read()
        if not ret:
            break
        msg = bridge.cv2_to_imgmsg(frame,encoding='rgb8')
        pub.publish(msg)

    else:
	    cap.release()

            
if __name__ == '__main__':
    try:
        talker()
    except rospy.ROSInterruptException:
        pass
