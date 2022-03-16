#!/usr/bin/env python3

import rospy
from sensor_msgs import Image
from cv_bridge import CvBridge, CvBridgeError

def callback(data):
	rospy.loginfo(rospy.get_caller_id() + "I heard %s", data.data)

def listener():
	rospy.init_node('listener', anonymous=True)
	rospy.Subscriber("chatter",  Image, callback)
	rospy.spin()

if __name__ == '__main__':
	listener()

