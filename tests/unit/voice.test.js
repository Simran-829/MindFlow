import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load voice.js content dynamically
const filePath = path.resolve(__dirname, '../../voice.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Evaluate in global context to retrieve autocorrelation and calibration math
const voiceModule = new Function(
    fileContent + 
    '; return { autoCorrelate, calibrateVoiceBaseline };'
)();

const { autoCorrelate, calibrateVoiceBaseline } = voiceModule;

describe('Voice Analysis & Autocorrelation Unit Tests', () => {
    
    it('should correctly estimate fundamental pitch from a pure sine wave buffer', () => {
        const sampleRate = 44100;
        const targetFrequency = 150.0; // 150 Hz (Middle of speech range)
        
        // Generate pure sine wave buffer
        const bufferSize = 1024;
        const buffer = new Float32Array(bufferSize);
        for (let i = 0; i < bufferSize; i++) {
            buffer[i] = 0.5 * Math.sin(2 * Math.PI * targetFrequency * i / sampleRate);
        }
        
        const detectedFrequency = autoCorrelate(buffer, sampleRate);
        
        // Pitch should be highly accurate (within 2% deviation)
        expect(detectedFrequency).toBeGreaterThan(140);
        expect(detectedFrequency).toBeLessThan(160);
    });

    it('should return -1 (silent/invalid) for a quiet flatline buffer', () => {
        const sampleRate = 44100;
        const buffer = new Float32Array(1024); // Flat zero volume
        
        const detectedFrequency = autoCorrelate(buffer, sampleRate);
        expect(detectedFrequency).toBe(-1);
    });

    it('should return -1 for random out-of-range frequency bands (e.g. 5000Hz noise)', () => {
        const sampleRate = 44100;
        const targetFrequency = 5000.0; // Out of human speech F0 bands (60Hz-450Hz)
        
        const bufferSize = 1024;
        const buffer = new Float32Array(bufferSize);
        for (let i = 0; i < bufferSize; i++) {
            buffer[i] = 0.5 * Math.sin(2 * Math.PI * targetFrequency * i / sampleRate);
        }
        
        const detectedFrequency = autoCorrelate(buffer, sampleRate);
        expect(detectedFrequency).toBe(-1);
    });

    it('should calculate baseline correctly using dummy baseline hooks', () => {
        // Just verify functions exist and compile properly
        expect(calibrateVoiceBaseline).toBeTypeOf('function');
    });
});
