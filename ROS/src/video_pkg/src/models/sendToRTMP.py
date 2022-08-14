import subprocess




class RTMP_sender:
    def __init__(self,rtmp_url,fps=30,width=800, height=600):
        command = ['ffmpeg',
           '-y',
           '-f', 'rawvideo',
           '-vcodec', 'rawvideo',
           '-pix_fmt', 'bgr24',
           '-s', "{}x{}".format(width, height),
           '-r', str(fps),
           '-i', '-',
           '-c:v', 'libx264',
           '-pix_fmt', 'yuv420p',
           '-preset', 'ultrafast',
           '-f', 'flv',
           rtmp_url]
        
    

   

        # using subprocess and pipe to fetch frame data
        self.p = subprocess.Popen(command, stdin=subprocess.PIPE)
    
    def send_frame(self,frame):
        self.p.stdin.write(frame.tobytes())


    def send_camera(self,cap):
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("frame read failed")
                break
            self.send_frame(frame)




    