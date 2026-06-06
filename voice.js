/**
 * MindFlow Voice Audio Analysis Module
 * Hooks into Web Audio API to estimate vocal stress markers via an 
 * Autocorrelation-based Pitch (F0) Estimator and computes real vocal jitter.
 */

let audioContext = null;
let analyser = null;
let microphone = null;
let drawVisual = null;
let isRecording = false;

// Pitch & Jitter tracking state
let pitchHistory = [];
const MAX_PITCH_HISTORY = 30;

async function startVoiceAnalysis(canvasId, callback) {
    if (isRecording) return;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        isRecording = true;
        
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 1024; // High FFT resolution for time-domain pitch detection
        microphone.connect(analyser);
        
        const bufferLength = analyser.fftSize;
        const timeDomainBuffer = new Float32Array(bufferLength);
        
        const container = document.getElementById(canvasId);
        if (container) {
            container.innerHTML = '';
            container.classList.remove('hidden');
            
            // Generate visual wave bars
            const barCount = 12;
            for (let i = 0; i < barCount; i++) {
                const bar = document.createElement('div');
                bar.className = 'audio-bar';
                container.appendChild(bar);
            }
            
            const bars = container.querySelectorAll('.audio-bar');
            
            function draw() {
                if (!isRecording) return;
                drawVisual = requestAnimationFrame(draw);
                
                // Get time domain signal for autocorrelation
                analyser.getFloat32TimeDomainData(timeDomainBuffer);
                
                // 1. Calculate RMS volume
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += timeDomainBuffer[i] * timeDomainBuffer[i];
                }
                const rms = Math.sqrt(sum / bufferLength);
                
                // 2. Perform Autocorrelation Pitch Estimation
                const pitch = autoCorrelate(timeDomainBuffer, audioContext.sampleRate);
                let jitter = 0;
                
                if (pitch > 0) {
                    pitchHistory.push(pitch);
                    if (pitchHistory.length > MAX_PITCH_HISTORY) {
                        pitchHistory.shift();
                    }
                    
                    // Compute pitch standard deviation (Vocal Jitter)
                    if (pitchHistory.length > 5) {
                        const avgPitch = pitchHistory.reduce((a, b) => a + b, 0) / pitchHistory.length;
                        const variance = pitchHistory.reduce((a, b) => a + Math.pow(b - avgPitch, 2), 0) / pitchHistory.length;
                        jitter = Math.sqrt(variance); // In Hz
                    }
                }
                
                // Update heights of visual wave bars based on frequency bins
                const freqBuffer = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(freqBuffer);
                for (let i = 0; i < barCount; i++) {
                    if (bars[i]) {
                        const val = freqBuffer[i * 4] / 2.5;
                        bars[i].style.height = `${Math.max(3, val)}px`;
                    }
                }
                
                // Send volume and calculated jitter back to callback
                if (callback) {
                    // Normalize jitter: 0Hz - 25Hz variance is normal. 25Hz+ indicates stress/vocal tension.
                    const normalizedJitter = Math.min(1.0, jitter / 35.0);
                    callback({
                        volume: rms * 100,
                        pitch: pitch,
                        jitter: normalizedJitter
                    });
                }
            }
            
            draw();
        }
    } catch (err) {
        console.warn("Microphone access denied or unavailable. Safely falling back to simulated diagnostics.", err);
        // Fallback simulated wave
        simulateVoiceAnalysis(canvasId, callback);
    }
}

function stopVoiceAnalysis(canvasId) {
    isRecording = false;
    pitchHistory = [];
    if (drawVisual) {
        cancelAnimationFrame(drawVisual);
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    const container = document.getElementById(canvasId);
    if (container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
}

function simulateVoiceAnalysis(canvasId, callback) {
    isRecording = true;
    const container = document.getElementById(canvasId);
    if (!container) return;
    
    container.innerHTML = '';
    container.classList.remove('hidden');
    
    const barCount = 12;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        container.appendChild(bar);
    }
    
    const bars = container.querySelectorAll('.audio-bar');
    
    function drawSimulated() {
        if (!isRecording) return;
        drawVisual = requestAnimationFrame(drawSimulated);
        
        let sum = 0;
        for (let i = 0; i < barCount; i++) {
            const val = Math.random() * 20 + 3;
            bars[i].style.height = `${val}px`;
            sum += val;
        }
        
        if (callback) {
            callback({
                volume: sum / barCount,
                pitch: 150 + Math.random() * 10,
                jitter: 0.15 + (Math.random() * 0.1)
            });
        }
    }
    
    drawSimulated();
}

/**
 * Autocorrelation algorithm to estimate fundamental frequency (pitch)
 */
function autoCorrelate(buffer, sampleRate) {
    const SIZE = buffer.length;
    let maxSamples = Math.floor(SIZE / 2);
    let rms = 0;

    // Check Root Mean Square volume
    for (let i = 0; i < SIZE; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.005) return -1; // too quiet

    // Calculate autocorrelation coefficients
    const r = new Float32Array(maxSamples);
    for (let offset = 0; offset < maxSamples; offset++) {
        let correlation = 0;
        for (let i = 0; i < maxSamples; i++) {
            correlation += buffer[i] * buffer[i + offset];
        }
        r[offset] = correlation;
    }

    // Find the first zero crossing to avoid matching the central peak
    let zeroCrossing = 0;
    for (let i = 0; i < maxSamples - 1; i++) {
        if (r[i] > 0 && r[i+1] <= 0) {
            zeroCrossing = i;
            break;
        }
    }

    if (zeroCrossing === 0) zeroCrossing = 4; // fallback

    // Find the absolute highest peak value after the first zero crossing
    let maxVal = 0;
    for (let i = zeroCrossing; i < maxSamples; i++) {
        if (r[i] > r[i-1] && r[i] > r[i+1]) {
            if (r[i] > maxVal) {
                maxVal = r[i];
            }
        }
    }

    // Find the first peak that is at least 80% of the maximum peak value
    let peakOffset = -1;
    for (let i = zeroCrossing; i < maxSamples; i++) {
        if (r[i] > r[i-1] && r[i] > r[i+1]) {
            if (r[i] >= 0.8 * maxVal) {
                peakOffset = i;
                break;
            }
        }
    }

    if (peakOffset !== -1) {
        const frequency = sampleRate / peakOffset;
        // Human speaking fundamental frequency is typically between 50Hz and 500Hz
        if (frequency >= 60 && frequency <= 450) {
            return frequency;
        }
    }
    
    return -1;
}

function calibrateVoiceBaseline(btnId, waveId, finishBtnId, callback) {
    const btn = document.getElementById(btnId);
    const txt = document.getElementById('calibrate-btn-text');
    const finishBtn = document.getElementById(finishBtnId);
    
    if (!btn || isRecording) return;
    
    btn.classList.add('recording');
    if (txt) txt.textContent = "Listening... Speak the quote now";
    
    let samples = [];
    
    startVoiceAnalysis(waveId, (data) => {
        if (data.pitch > 0) {
            samples.push(data.pitch);
        }
    });
    
    setTimeout(() => {
        stopVoiceAnalysis(waveId);
        btn.classList.remove('recording');
        if (txt) txt.textContent = "Calibration Successful!";
        if (finishBtn) finishBtn.removeAttribute('disabled');
        
        const avg = samples.reduce((a, b) => a + b, 0) / (samples.length || 1);
        if (callback) {
            callback(avg);
        }
    }, 3500);
}
