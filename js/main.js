(function (window) {

    var isRecording = false;
    var btnRecord;

    // AUDIO FUNCTIONS
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var audioContext = new window.AudioContext();

    var audioInput = null,
        realAudioInput = null,
        inputPoint = null,
        audioRecorder = null;
    var analyserContext = null;

    function submit(blob){
        console.log('blob:');
        console.log(blob);

        var fd = new FormData();
        fd.append('fname', 'test.wav');
        fd.append('data', blob);
        ///TODO
    }

    function gotBuffers(buffers) {
        audioRecorder.exportWAV(doneEncoding);
    }

    function doneEncoding(blob) {
        submit(blob);
    }

    window.btnRecordDown = function (e) {
        $('#btnRecord').removeClass('btnup').addClass('btndown');
        $('#spinIntent').css('visibility', 'hidden');
        $('#spinPhrase').css('visibility', 'hidden');
        $("#txtPhrase").val("");
        $("#txtIntent").val("");

        // START CLIENT SIDE AUDIO RECORDING PROCESS
        if (!audioRecorder) return;
        audioRecorder.clear();
        audioRecorder.record();

        isRecording = true;
    };

    window.btnRecordOut = function (e) {
        if (isRecording)
            btnRecordUp(e);
    }

    window.btnRecordUp = function (e) {
        alert("btnRecordUp");
        
        isRecording = false;
        $('#btnRecord').removeClass('btndown').addClass('btnup');

        $('#spinPhrase').css('visibility', 'visible');
        audioRecorder.stop();
        audioRecorder.getBuffers(gotBuffers);

        // EVENTUALY, WE WILL DO THIS AT THE END:
        // updateGrid();
    };

    function callbackReceivedAudioStream(stream) {

        inputPoint = audioContext.createGain();

        realAudioInput = audioContext.createMediaStreamSource(stream);
        audioInput = realAudioInput;
        audioInput.connect(inputPoint);

        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        inputPoint.connect( analyserNode );

        audioRecorder = new Recorder( inputPoint );

        zeroGain = audioContext.createGain();
        zeroGain.gain.value = 0.0;
        inputPoint.connect( zeroGain );
        zeroGain.connect( audioContext.destination );
    };

    function initAudio() {

        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

        navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, callbackReceivedAudioStream, function (e) {
                alert('Error getting audio');
                console.log(e);
            });
    };


    function main() {
        initAudio();
    };

    window.addEventListener('load', main);

})(this);