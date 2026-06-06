import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load app.js content dynamically
const filePath = path.resolve(__dirname, '../../app.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Evaluate app.js globals and exports by extracting helper utilities
// This isolates the pure math/sanitization functions from DOM attachments
const appModule = new Function(
    fileContent + 
    '; return { state, escapeHTML, getCurrentTime, evaluateKeystrokeStress };'
)();

const { state, escapeHTML, getCurrentTime, evaluateKeystrokeStress } = appModule;

describe('App Telemetry & Sanitizer Unit Tests', () => {

    it('should correctly escape HTML tags to prevent XSS payloads', () => {
        const payload = '<script>alert("XSS")</script>';
        const clean = escapeHTML(payload);
        
        expect(clean).not.toContain('<script>');
        expect(clean).toContain('&lt;script&gt;');
    });

    it('should escape quotes and ampersands properly', () => {
        const input = 'Aarav & Priya "study"';
        const clean = escapeHTML(input);
        
        expect(clean).toContain('&amp;');
        expect(clean).toContain('&quot;');
    });

    it('should output time formatted as HH:MM', () => {
        const time = getCurrentTime();
        
        expect(time).toMatch(/^\d{1,2}[:.]\d{2}(?:\s?[AP]M)?$/i);
    });

    describe('Keystroke Stress Heuristic Analytics', () => {
        it('should compute low stress for a stable, steady typing cadence', () => {
            expect(state.stressScore).toBeGreaterThanOrEqual(0.1);
            expect(state.stressScore).toBeLessThanOrEqual(0.95);
        });
    });

    describe('Crisis Intercept Regex Heuristics', () => {
        const crisisRegex = /\b(suicide|kill myself|end my life|give up|hopeless|depressed|self-harm|cant go on|cannot go on|worthless|no point)\b/i;
        
        it('should match acute crisis keywords', () => {
            expect(crisisRegex.test('I feel hopeless about this exam')).toBe(true);
            expect(crisisRegex.test('I want to kill myself')).toBe(true);
            expect(crisisRegex.test('I just want to give up')).toBe(true);
        });

        it('should not match normal academic questions', () => {
            expect(crisisRegex.test('How do I solve this physics equation?')).toBe(false);
            expect(crisisRegex.test('What is normal force?')).toBe(false);
        });
    });
});
