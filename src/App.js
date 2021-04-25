import './App.css';
import React from 'react';
import RecordRTC from 'recordrtc';
import 'antd/dist/antd.css';



const App = () => {



    return (
        <div>
            <title>Audio Recording | RecordRTC</title>
            <h1>Simple Audio Recording using RecordRTC</h1>

            <br/>

     {/*       <button id="btn-start-recording" onClick={handleRecording}>Start Recording</button>
            <button id="btn-stop-recording" onClick={handleStopRecording} disabled>Stop Recording</button>
            <button id="btn-release-microphone" onClick={handleReleaseRecording} disabled>Release Microphone</button>
            <button id="btn-download-recording" onClick={handleDownloadRecording} disabled>Download</button>*/}

            <div>
                <audio controls autoPlay playsInline></audio>
            </div>

        </div>
    );

}

export default App;
