import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load the file content dynamically and execute it in JSDOM or mock-load it
// Since socraticEngine.js is a plain script, we can mock import it or read it.
// To make it easy and reliable in Vitest (ESM), we will load it directly.
const filePath = path.resolve(__dirname, '../../socraticEngine.js');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Evaluate socraticEngine.js in global context for testing
const socraticModule = new Function(
    fileContent + 
    '; return { socraticTrees, cbtReframingPrompts, getSocraticResponse, getRandomReframing };'
)();

const { socraticTrees, cbtReframingPrompts, getSocraticResponse, getRandomReframing } = socraticModule;

describe('Socratic Dialogue Engine Unit Tests', () => {
    let mockState;

    beforeEach(() => {
        mockState = {
            userProfile: {
                name: 'Aarav',
                targetExam: 'jee'
            },
            socraticStep: 0
        };
    });

    it('should load preset trees for JEE, NEET, and UPSC', () => {
        expect(socraticTrees).toHaveProperty('jee');
        expect(socraticTrees).toHaveProperty('neet');
        expect(socraticTrees).toHaveProperty('upsc');
        
        expect(socraticTrees.jee.subject).toBe('Physics');
        expect(socraticTrees.neet.subject).toBe('Biology');
        expect(socraticTrees.upsc.subject).toBe('History');
    });

    it('should initialize Socratic step 1 on first message', () => {
        const response = getSocraticResponse(mockState, 'I need help with this question');
        
        expect(mockState.socraticStep).toBe(1);
        expect(response.text).toContain(socraticTrees.jee.doubt);
        expect(response.text).toContain(socraticTrees.jee.steps[0].prompt);
        expect(response.options.length).toBe(3);
        expect(response.stepId).toBe(1);
    });

    it('should transition to correct next step on option match', () => {
        // Init step 1
        getSocraticResponse(mockState, 'Help');
        
        // Match option
        const choice = socraticTrees.jee.steps[0].options[0].text;
        const response = getSocraticResponse(mockState, choice);
        
        expect(mockState.socraticStep).toBe(2);
        expect(response.text).toContain(socraticTrees.jee.steps[0].options[0].positiveFeedback);
        expect(response.text).toContain(socraticTrees.jee.steps[1].prompt);
    });

    it('should fall back to first option if input does not match', () => {
        // Init step 1
        getSocraticResponse(mockState, 'Help');
        
        // Random non-matching text
        const response = getSocraticResponse(mockState, 'some gibberish input text');
        
        // Should fall back to matching the first option
        expect(mockState.socraticStep).toBe(2); 
        expect(response.text).toContain(socraticTrees.jee.steps[1].prompt);
    });

    it('should complete Socratic tree and reset state on final step', () => {
        mockState.socraticStep = 4; // Set to pre-final step
        
        const choice = socraticTrees.jee.steps[3].options[0].text;
        const response = getSocraticResponse(mockState, choice);
        
        expect(mockState.socraticStep).toBe(0); // Reset
        expect(response.isFinished).toBe(true);
        expect(response.text).toContain(socraticTrees.jee.steps[4].prompt);
    });

    it('should retrieve a valid CBT reframing statement', () => {
        const statement = getRandomReframing();
        expect(cbtReframingPrompts).toContain(statement);
        expect(typeof statement).toBe('string');
        expect(statement.length).toBeGreaterThan(10);
    });
});
