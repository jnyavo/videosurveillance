#!/usr/bin/env python3


from sendToRTMP import RTMP_sender
from videoHandler import videoListener


RTMP_URL = "rtmp://localhost/live/test"

def main():
    serv = RTMP_sender(RTMP_URL)
    cameras = videoListener()

    cameras.process_frames('camera1', lambda frame: serv.send_frame(frame))



if __name__ == "__main__":
    main()
