#!/usr/bin/env python3
import controllers.detection as detectionController

route ={
    'MODIFY':{
        'detection': detectionController.changeDetectionState,
        'sensitivity': detectionController.changeSensitivity
    },
    'GET':{
        'detection':detectionController.getDetectionState,
        'sensitivity':detectionController.getSensitivity
    }
}