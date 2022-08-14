
from symtable import Function
import rospy
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
import cv2


class VideoListener:
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
    
def _defaultMiddleware(lastframe: cv2.Mat,frame: cv2.Mat,next: Function):
    next(frame)




class VideoReader:
    def __init__(self,cap: cv2.VideoCapture):
        self.cap = cap
        self.lastFrame = []
        self.run = False
        if cap.isOpened():
            ret, frame = self.cap.read()
            if ret:
                self.lastFrame = frame 
    
    def stopProcess(self):
        self.run = False

    def processVideo(self,callback,middleware=[_defaultMiddleware]):
        self.run = True
        while not rospy.is_shutdown() and self.cap.isOpened() and self.run:
            ret, frame = self.cap.read()
            if not ret:
                break
            middleware[0](self.lastFrame,frame,callback)
            self.lastFrame = frame
            
    
    def release(self):
        self.cap.release()








class IncorrectDetectionMethod(Exception):
    pass




class MotionDetector(VideoReader):

    
    def __init__(self, cap: cv2.VideoCapture,sensitivity=50,method='imdiff',motionCallback=lambda: None):
        super().__init__(cap)
        self.sensitivity=sensitivity
        self.method = method
        self.motionCallback = motionCallback

        #Les fonctions de detection doivent être placées ici
        self.MOTION_DETECTION_METHODS = {
        'imdiff': self.detectMotion
        } 
        self.used_func = [_defaultMiddleware]

    def processVideo(self, callback):
        super().processVideo(lambda frame: callback(self,frame),self.used_func)


    def launchDetection(self,sensitivity=None,method=None):
        if sensitivity:
            self.sensitivity = sensitivity
        if method:
            self.method = method
        try:
            detection_func = self.MOTION_DETECTION_METHODS[self.method]
        except KeyError:
            raise IncorrectDetectionMethod
        
        #self.processVideo(lambda frame: callback(self,frame),detection_func)
        self.used_func[0] = detection_func
    
    def changeSensitivity(self,sensitivity):
        
        self.sensitivity = sensitivity if((10000 -(sensitivity*100)) > 0) else 100
    
    def stopDetection(self):
        self.used_func[0] = _defaultMiddleware

    def getDetectionState(self)->bool:
        return not self.used_func[0] == _defaultMiddleware
    
    def getSensitivity(self):
        return self.sensitivity

    
    def detectMotion(self,lastframe: cv2.Mat,frame: cv2.Mat,next: Function):
        diff = cv2.absdiff(lastframe,frame)
        gray = cv2.cvtColor(diff,cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray,(5,5),0)
        _, thresh = cv2.threshold(blur,20,255,cv2.THRESH_BINARY)
        dilated = cv2.dilate(thresh,None,iterations=3)
        contours,_ = cv2.findContours(dilated,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

        for c in contours:
            x,y,w,h = cv2.boundingRect(c)
            if cv2.contourArea(c) > (10000 -(self.sensitivity*100)): #mouvement detecté
                self.motionCallback()
                cv2.rectangle(lastframe,(x,y),(x+w,y+h),(255,0,0),2)
                cv2.putText(lastframe,'Status: {}'.format('Movement'),(10,20),cv2.FONT_HERSHEY_SIMPLEX,1,(255,0,0),3)
        #cv2.drawContours(lastframe,contours,-1,(255,0,0),2)
        next(lastframe)
    
    
            
        
    
