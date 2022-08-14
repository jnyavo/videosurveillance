
import rospy
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
import cv2

class videoListener:
    def __init__(self):
        self.frame = 0
        rospy.init_node('videoListener')
        
    def get_frame(self,topic):
        self.listener(topic)
        return self.frame
   
    def callback(self,data):
        bridge = CvBridge()
        self.frame = bridge.imgmsg_to_cv2(data, "passthrough")

        
    def process_frames(self,topic,callback):

        while not rospy.is_shutdown():
            current_frame = self.get_frame(topic)
            if(type(current_frame) != int):
                callback(current_frame)
            rospy.Rate(34).sleep()
            
    def listener(self,topic):	
	    rospy.Subscriber(topic,Image,self.callback)
    
    
