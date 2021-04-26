import React, {useState, useEffect} from 'react';
import RecordRTC from 'recordrtc';

import ts from "./core/singleton.js";
import {processAudio} from './core/processAudio'

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowButton from '@material-ui/icons/PlayArrow';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import './App.css';
import {FormControlLabel, Switch} from "@material-ui/core";

function App() {
    const [appStatus, setAppStatus] = useState("record");
    const [blocked, setBlocked] = useState(false);
    const [tenet, setTenet] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const mrConstraints = {
        checkForInactiveTracks: true,
        numberOfAudioChannels: 1,
        audioBitsPerSecond: 320000,
        recorderType: RecordRTC.StereoAudioRecorder,
        type: 'audio',
    }
    const umConstraints = {audio: true};

    useEffect(() => {
        if (!navigator.mediaDevices) {
            setSnackbarOpen(true);
        }
    }, [])

    async function initMediaRecorder() {
        ts.userMedia = await navigator.mediaDevices.getUserMedia(umConstraints)
        ts.mediaRecorder = RecordRTC(ts.userMedia, mrConstraints);
    }

    function record() {
        initMediaRecorder().then(() => {
            setBlocked(true);
            ts.mediaRecorder.startRecording();
            setTimeout(() => {
                ts.mediaRecorder.stopRecording(() => {
                    ts.source = processAudio(ts.mediaRecorder.getBlob(), tenet);
                    ts.mediaRecorder.reset();
                    setAppStatus("play");
                    setBlocked(false);
                    ts.userMedia.getTracks()[0].stop();
                });
            }, 3000);

        }).catch(function (e) {
            if (!ts.mediaRecorder) {
                setSnackbarOpen(true);
            } else {
                alert("an error occurred.")
            }
        });
    }

    function play() {
        setBlocked(true);
        ts.source.start(0);
        setTimeout(() => {
            setAppStatus("record");
            setBlocked(false);
        }, 3500);
    }

    return (
        <div className="App">
            <div className={appStatus + "-" + blocked}>

                {appStatus === "record" ? <FormControlLabel
                    value="TENET"
                    control={<Switch
                        checked={tenet}
                        onChange={(event) => {
                            setTenet(event.target.checked)
                        }}
                        color="primary"/>}
                    label="TENET"
                    labelPlacement="top"
                /> : null}
                <IconButton
                    disableFocusRipple={true}
                    disableRipple={true}
                    style={tenet ?
                        {
                            backgroundColor: 'transparent',
                            height: '50vh',
                            transform: "scale(-1, 1)"

                        } : {
                            backgroundColor: 'transparent',
                            height: '50vh',
                        }
                    }
                    disabled={blocked}
                    onClick={
                        appStatus === "record" ?
                            record : play
                    }
                >
                    {appStatus === "record" ?
                        <MicIcon
                            style={{fontSize: 200}}
                        /> :
                        <PlayArrowButton
                            style={{fontSize: 200}}
                        />
                    }
                </IconButton>
            </div>
        </div>
    );
}


export default App;
