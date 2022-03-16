#!/usr/bin/env bash

source ./devel/setup.bash

export ROS_HOSTNAME=192.168.100.209
export ROS_MASTER_URI=http://192.168.100.209:11311
roslaunch image pubimg.launch
