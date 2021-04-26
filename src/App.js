import React, {useState, useEffect} from 'react';
import RecordRTC from 'recordrtc';

import ts from "./core/singleton.js";
import {processAudio} from './core/processAudio'

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowButton from '@material-ui/icons/PlayArrow';


import './App.css';
import {Container, FormControlLabel, Slider, Snackbar, Switch, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";


function App() {
    const [appStatus, setAppStatus] = useState("record");
    const [blocked, setBlocked] = useState(false);
    const [tenet, setTenet] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [props, setProps] = useState({
        audioBitsPerSecond: 32000,
        sampleRate: 44100,
        desiredSampRate: 22050,
        bufferSize: 8,
        numberOfAudioChannels: 1
    });


    const mrConstraints = {
        checkForInactiveTracks: true,
        audioBitsPerSecond: props.audioBitsPerSecond,
        sampleRate: props.sampleRate,
        desiredSampRate: props.desiredSampRate,
        bufferSize: Math.pow(2,props.bufferSize),
        numberOfAudioChannels: props.numberOfAudioChannels,
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

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

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
            <Container>
                <Typography gutterBottom style={{
                    textAlign: "center"
                }}>
                    audioBitsPerSecond
                </Typography>
                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "right"
                }}>
                    {props.audioBitsPerSecond}
                </Typography>
                <Slider
                    style={{
                        textAlign: "left",
                        color: "red"
                    }}
                    value={props.audioBitsPerSecond}
                    min={8000}
                    step={1000}
                    max={640000}
                    marks
                    onChange={(event, newValue) => {
                        setProps({
                            ...props,
                            audioBitsPerSecond: newValue
                        });
                    }}
                    aria-labelledby="non-linear-slider"
                />
                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "center"
                }}>
                    sampleRate
                </Typography>
                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "right"
                }}>
                    {props.sampleRate}
                </Typography>
                <Slider
                    style={{
                        textAlign: "left",
                        color: "orange"
                    }}
                    value={props.sampleRate}
                    min={22050}
                    step={1000}
                    max={96000}
                    marks
                    onChange={(event, newValue) => {
                        setProps({
                            ...props,
                            sampleRate: newValue
                        });
                    }}
                    aria-labelledby="non-linear-slider"
                />

                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "center"
                }}>
                    desiredSampRate
                </Typography>
                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "right"
                }}>
                    {props.desiredSampRate}
                </Typography>
                <Slider
                    style={{
                        textAlign: "left",
                        color: "grey"
                    }}
                    value={props.desiredSampRate}
                    min={22050}
                    step={1000}
                    max={96000}
                    marks
                    onChange={(event, newValue) => {
                        setProps({
                            ...props,
                            desiredSampRate: newValue
                        });
                    }}
                    aria-labelledby="non-linear-slider"
                />

                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "center"
                }}>
                    bufferSize
                </Typography>
                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "right"
                }}>
                    {Math.pow(2, props.bufferSize)}
                </Typography>
                <Slider
                    style={{
                        textAlign: "left",
                        color: "green"
                    }}
                    value={props.bufferSize}
                    min={8}
                    step={1}
                    max={14}
                    marks
                    onChange={(event, newValue) => {
                        setProps({
                            ...props,
                            bufferSize: newValue
                        });
                    }}
                    aria-labelledby="non-linear-slider"
                />

                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "center"
                }}>
                    numberOfAudioChannels
                </Typography>
                <Typography id="non-linear-slider" gutterBottom style={{
                    textAlign: "right"
                }}>
                    {props.numberOfAudioChannels}
                </Typography>
                <Slider
                    style={{
                        textAlign: "left",
                        color: "blue"
                    }}
                    value={props.numberOfAudioChannels}
                    min={1}
                    step={1}
                    max={2}
                    marks
                    onChange={(event, newValue) => {
                        setProps({
                            ...props,
                            numberOfAudioChannels: newValue
                        });
                    }}
                    aria-labelledby="non-linear-slider"
                />
            </Container>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    Please try in a different browser<br/>
                    📲 iOS: Safari, Android: Chrome
                </Alert>
            </Snackbar>

        </div>
    );
}


export default App;