import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fireEvent, getByText, getByLabelText, queryByText } from '@testing-library/dom';
import { JSDOM } from 'jsdom';

// Load files
const htmlPath = path.resolve(__dirname, '../../index.html');
const socraticPath = path.resolve(__dirname, '../../socraticEngine.js');
const voicePath = path.resolve(__dirname, '../../voice.js');
const dashboardPath = path.resolve(__dirname, '../../dashboard.js');
const appPath = path.resolve(__dirname, '../../app.js');

const html = fs.readFileSync(htmlPath, 'utf-8');
const socraticContent = fs.readFileSync(socraticPath, 'utf-8');
const voiceContent = fs.readFileSync(voicePath, 'utf-8');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
const appContent = fs.readFileSync(appPath, 'utf-8');

describe('MindFlow DOM Flow Integration Tests', () => {

    beforeEach(() => {
        const dom = new JSDOM(html, {
            runScripts: "dangerously",
            url: "http://localhost"
        });

        // Set global variables for testing-library
        global.window = dom.window;
        global.document = dom.window.document;
        global.navigator = dom.window.navigator;
        global.localStorage = dom.window.localStorage;

        global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
        global.cancelAnimationFrame = (id) => clearTimeout(id);
        dom.window.requestAnimationFrame = global.requestAnimationFrame;
        dom.window.cancelAnimationFrame = global.cancelAnimationFrame;

        // Mock Canvas context to prevent JSDOM errors
        dom.window.HTMLCanvasElement.prototype.getContext = () => ({
            clearRect: () => {},
            fillRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            closePath: () => {},
            roundRect: () => {},
            scale: () => {},
            arc: () => {},
            fill: () => {},
            quadraticCurveTo: () => {},
            fillText: () => {},
            measureText: () => ({ width: 0 })
        });

        // Mock Web Audio and getUserMedia
        dom.window.AudioContext = vi.fn().mockImplementation(() => ({
            createAnalyser: () => ({ fftSize: 1024, frequencyBinCount: 512, getByteFrequencyData: () => {}, getFloat32TimeDomainData: () => {} }),
            createMediaStreamSource: () => ({ connect: () => {} }),
            close: () => Promise.resolve()
        }));
        
        dom.window.navigator.mediaDevices = {
            getUserMedia: vi.fn().mockResolvedValue({})
        };

        // Reset LocalStorage
        dom.window.localStorage.clear();

        // Execute JS scripts in JSDOM window context
        const runScript = (code) => {
            const script = dom.window.document.createElement('script');
            script.textContent = code;
            dom.window.document.body.appendChild(script);
        };

        runScript(socraticContent);
        runScript(voiceContent);
        runScript(dashboardContent);
        runScript(appContent);

        // Dispatch DOMContentLoaded manually to initialize app.js handlers
        const event = new dom.window.Event('DOMContentLoaded');
        dom.window.document.dispatchEvent(event);
    });

    it('should complete onboarding flow and transition views', async () => {
        const onboardModal = document.getElementById('onboarding-modal');
        expect(onboardModal.classList.contains('hidden')).toBe(false); // Should start visible

        // 1. Enter name and proceed
        const nameInput = document.getElementById('onboard-name');
        nameInput.value = 'Rohan';
        
        const next1 = document.getElementById('onboard-next-1');
        fireEvent.click(next1);

        // Step 1 should hide, Step 2 show
        expect(document.getElementById('onboard-step-1').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('onboard-step-2').classList.contains('hidden')).toBe(false);

        // 2. Calibrate Voice (simulate timing and baseline setup)
        const calibrateBtn = document.getElementById('voice-calibrate-btn');
        fireEvent.click(calibrateBtn);

        // Wait out the mock calibration timer (simulated via Vitest timers)
        await new Promise((resolve) => setTimeout(resolve, 3600));

        const finishBtn = document.getElementById('onboard-next-2');
        expect(finishBtn.disabled).toBe(false); // Finish button should unlock
        fireEvent.click(finishBtn);

        // Onboarding should disappear
        expect(onboardModal.classList.contains('hidden')).toBe(true);
    });

    it('should navigate tabs and return home via the logo button', () => {
        // Complete onboarding by setting profile key directly in LocalStorage to bypass overlay
        localStorage.setItem('mindflow_user_profile', JSON.stringify({ name: 'Rohan', targetExam: 'jee' }));
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        const studyTab = document.querySelector('.tab-btn[data-view="study"]');
        const dashTab = document.querySelector('.tab-btn[data-view="dashboard"]');
        const viewStudy = document.getElementById('view-study');
        const viewDash = document.getElementById('view-dashboard');

        // Switch to Dashboard
        fireEvent.click(dashTab);
        expect(viewStudy.classList.contains('hidden')).toBe(true);
        expect(viewDash.classList.contains('hidden')).toBe(false);

        // Click logo to return study workspace home
        const logoBtn = document.getElementById('logo-btn');
        fireEvent.click(logoBtn);

        expect(viewStudy.classList.contains('hidden')).toBe(false);
        expect(viewDash.classList.contains('hidden')).toBe(true);
    });

    it('should edit user details and save settings', () => {
        localStorage.setItem('mindflow_user_profile', JSON.stringify({ name: 'Rohan', targetExam: 'jee' }));
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        const settingsBtn = document.getElementById('settings-btn');
        fireEvent.click(settingsBtn);

        const settingsModal = document.getElementById('settings-modal');
        expect(settingsModal.classList.contains('hidden')).toBe(false);

        // Change username details
        const nameInput = document.getElementById('settings-name');
        nameInput.value = 'Rohan Modified';

        const saveBtn = document.getElementById('settings-save-btn');
        fireEvent.click(saveBtn);

        expect(settingsModal.classList.contains('hidden')).toBe(true);
        
        // Verify changes persistent in LocalStorage
        const profile = JSON.parse(localStorage.getItem('mindflow_user_profile'));
        expect(profile.name).toBe('Rohan Modified');
    });
});
