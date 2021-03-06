function buildAudioGraph() {
    var mediaElement = player;
    var sourceNode = audioContext.createMediaElementSource(mediaElement);

    // Create an analyser node
    analyser = audioContext.createAnalyser();

    // Try changing for lower values: 512, 256, 128, 64...
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
}

function drawVolumeMeter() {
    ctx.save();

    // set the fill style to a nice gradient
    ctx.fillStyle = "white";

    analyser.getByteFrequencyData(dataArray);
    var average = getAverageVolume(dataArray);
    ctx.beginPath();
    // draw the center circle meter
    ctx.arc(canvas.width*3 / 4, canvas.height / 4, 8 + (average / 4), 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
}


function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}

function visualize() {
    // Get the analyser data
    analyser.getByteTimeDomainData(dataArray);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'pink';

    // all the waveform is in one single path, first let's
    // clear any previous path that could be in the buffer
    ctx.beginPath();

    var centerX = canvas.width*3 / 4;
    var centerY = canvas.height / 4;
    var angleWidth = Math.PI / bufferLength;

    for (var i = 0; i < bufferLength; i++) {
        var angle = i * angleWidth;
        var v = (256+dataArray[i])/4;
        // We draw from y=0 to height
        var x = Math.sin(angle) * v;
        var y = Math.cos(angle) * v;

        if (i === 0) {
        } else {
            ctx.lineTo(centerX + x, centerY + y);
        }
    }

    // draw the path at once
    ctx.stroke();

    ctx.strokeStyle = 'lightblue';
    ctx.beginPath();

    for (var i = 0; i < bufferLength; i++) {
        var angle = (i * angleWidth) + Math.PI;
        var v = (256+dataArray[i])/4;
        // We draw from y=0 to height
        var x =  Math.sin(angle) * v;
        var y = Math.cos(angle) * v;

        if (i === 0) {
        } else {
            ctx.lineTo(centerX + x, centerY + y);
        }
    }
    // draw the path at once
    ctx.stroke();

    // call again the visualize function at 60 frames/s

}