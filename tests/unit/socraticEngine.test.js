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
    '; return { socraticTrees, cbtReframingPrompts, getSocraticResponse, getRandomReframing, extractTopic, classifySubject, generateDynamicSocraticTree };'
)();

const { socraticTrees, cbtReframingPrompts, getSocraticResponse, getRandomReframing, extractTopic, classifySubject, generateDynamicSocraticTree } = socraticModule;

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

    describe('Dynamic Socratic Dialogue Engine Extensions', () => {
        it('should extract the core topic from queries, stripping starters and capitalizing words', () => {
            expect(extractTopic('how do i solve the force of gravity?')).toBe('Force Of Gravity');
            expect(extractTopic('Explain the features and significance of the Mughal land revenue')).toBe('Mughal Land Revenue');
            expect(extractTopic('Why is photosynthesis important?')).toBe('Photosynthesis Important');
            expect(extractTopic('what is DNA?')).toBe('Dna');
            expect(extractTopic('a')).toBe('Custom Doubt'); // Short query fallback
        });

        it('should classify the query subject based on keywords and fallback to targetExam', () => {
            expect(classifySubject('Why is gravity acceleration 9.8?', 'jee')).toBe('Physics');
            expect(classifySubject('What are eukaryotic cells made of?', 'neet')).toBe('Biology');
            expect(classifySubject('Mughal tax policies', 'upsc')).toBe('Polity/History');
            expect(classifySubject('equilibrium of covalent bond reactions', 'neet')).toBe('Chemistry');
            expect(classifySubject('calculus integrals and derivatives', 'jee')).toBe('Math');
            // Fallback checking
            expect(classifySubject('some general question', 'jee')).toBe('Physics/Math');
            expect(classifySubject('some general question', 'neet')).toBe('Biology/Chemistry');
            expect(classifySubject('some general question', 'upsc')).toBe('History/Polity');
        });

        it('should generate a 5-step custom Socratic tree structure for a custom query', () => {
            const tree = generateDynamicSocraticTree('Explain the force of gravity', 'jee');
            expect(tree.title).toBe('Force Of Gravity Breakdown');
            expect(tree.subject).toBe('Physics');
            expect(tree.doubt).toBe('Explain the force of gravity');
            expect(tree.steps.length).toBe(5);
            expect(tree.steps[0].prompt).toContain('To master "Force Of Gravity"');
            expect(tree.steps[4].isFinal).toBe(true);
        });

        it('should dynamically generate a custom Socratic tree and handle step transitions for custom queries', () => {
            // First message for a custom query
            const response = getSocraticResponse(mockState, 'Explain the force of gravity');
            
            expect(mockState.currentDynamicTree).not.toBeNull();
            expect(mockState.currentDynamicTree.subject).toBe('Physics');
            expect(mockState.socraticStep).toBe(1);
            expect(response.text).toContain('Explain the force of gravity');
            expect(response.text).toContain('To master "Force Of Gravity"');
            
            // Choose the correct option in step 1
            const choice = mockState.currentDynamicTree.steps[0].options[0].text;
            const step2Response = getSocraticResponse(mockState, choice);
            
            expect(mockState.socraticStep).toBe(2);
            expect(step2Response.text).toContain('Spot on!');
            expect(step2Response.text).toContain('linear/angular variables or parameters');
            expect(step2Response.options[0].text).toContain('coupled directly by system constraints');
            
            // Trigger pre-final step transition to final step
            mockState.socraticStep = 4;
            const finalChoice = mockState.currentDynamicTree.steps[3].options[0].text;
            const finalResponse = getSocraticResponse(mockState, finalChoice);
            
            expect(mockState.socraticStep).toBe(0);
            expect(mockState.currentDynamicTree).toBeNull();
            expect(finalResponse.isFinished).toBe(true);
            expect(finalResponse.text).toContain('Fantastic work!');
        });
    });
});
