/**
 * MindFlow Socratic Doubt-Solving Engine
 * Simulates Socratic tutoring coupled with CBT emotional check-ins.
 */

const socraticTrees = {
    jee: {
        title: "Rotational Dynamics — Rolling Cylinder",
        subject: "Physics",
        doubt: "A solid cylinder of mass M and radius R rolls without slipping down an incline of angle θ. What is its acceleration?",
        steps: [
            {
                id: 1,
                prompt: "Let's tackle this methodically. First, what forces are acting on the cylinder parallel to the inclined plane?",
                options: [
                    { text: "Gravity component (Mg sin θ) and Static Friction", nextId: 2, points: 10, positiveFeedback: "Spot on! Static friction is crucial because it prevents slipping." },
                    { text: "Only gravity (Mg sin θ)", nextId: 2, points: 5, negativeFeedback: "Close! Gravity pulls it down, but if there was no other force, it would slide rather than roll. Think about static friction." },
                    { text: "Gravity, Normal force, and Kinetic Friction", nextId: 2, points: 3, negativeFeedback: "Remember, the prompt specifies 'without slipping'. That means static friction is active, not kinetic friction." }
                ]
            },
            {
                id: 2,
                prompt: "Great. Now, let's look at the equations. The linear equation is: Mg sin θ - f = M a. The torque equation is: f R = I α. Since it rolls without slipping, how are linear acceleration (a) and angular acceleration (α) related?",
                options: [
                    { text: "a = α * R", nextId: 3, points: 10, positiveFeedback: "Correct! That is the fundamental constraint for rolling without slipping." },
                    { text: "a = α / R", nextId: 3, points: 3, negativeFeedback: "Not quite. Remember, linear velocity v = ωR, so differentiating gives a = αR. Let's use that." },
                    { text: "a = α * R^2", nextId: 3, points: 2, negativeFeedback: "Check the units. Linear acceleration is in m/s², while α is in rad/s². The correct relation is a = αR." }
                ]
            },
            {
                id: 3,
                prompt: "Perfect. Now let's substitute. The moment of inertia of a solid cylinder is I = (1/2) M R². Torque equation: f R = (1/2 M R²) * (a/R). If you solve for friction (f), what do you get?",
                options: [
                    { text: "f = 1/2 M a", nextId: 4, points: 10, positiveFeedback: "Excellent! The R cancels out, leaving f = 1/2 M a." },
                    { text: "f = M a", nextId: 4, points: 4, negativeFeedback: "Check the algebra. I = 1/2 M R², so torque is 1/2 M R² * (a/R). When we cancel R, we have 1/2 M a. Let's use this." },
                    { text: "f = 3/2 M a", nextId: 4, points: 2, negativeFeedback: "Make sure you include the 1/2 factor from the cylinder's moment of inertia. You get f = 1/2 M a." }
                ]
            },
            {
                id: 4,
                prompt: "Almost there! Substitute f = 1/2 M a back into the linear force equation: Mg sin θ - 1/2 M a = M a. Solve this for acceleration (a). What is your final answer?",
                options: [
                    { text: "a = 2/3 g sin θ", nextId: 5, points: 10, positiveFeedback: "Superb! You solved it. 2/3 g sin θ is the correct acceleration." },
                    { text: "a = 1/2 g sin θ", nextId: 5, points: 3, negativeFeedback: "Check the algebra: Mg sin θ = 3/2 M a. The masses cancel, giving g sin θ = 1.5 a. Thus, a = 2/3 g sin θ." },
                    { text: "a = g sin θ", nextId: 5, points: 2, negativeFeedback: "Recall that friction opposes the motion, slowing linear acceleration down from the standard sliding value of g sin θ. The final result is 2/3 g sin θ." }
                ]
            },
            {
                id: 5,
                prompt: "Fantastic job! You've solved the problem Socratic style. You did the math, you structured the forces, and you finished it. How do you feel about this concept now?",
                isFinal: true
            }
        ]
    },
    neet: {
        title: "DNA Replication Fork Dynamics",
        subject: "Biology",
        doubt: "Why is one strand synthesized continuously while the other is synthesized in fragments during DNA replication?",
        steps: [
            {
                id: 1,
                prompt: "Let's review the enzyme characteristics. DNA polymerase can only add nucleotides in which direction?",
                options: [
                    { text: "5' to 3' direction", nextId: 2, points: 10, positiveFeedback: "Exactly! The free 3'-OH group is required to form the phosphodiester bond." },
                    { text: "3' to 5' direction", nextId: 2, points: 3, negativeFeedback: "Actually, DNA polymerase can only synthesis in the 5' to 3' direction because it needs the 3'-OH end to attach new nucleotides. Keep this in mind." }
                ]
            },
            {
                id: 2,
                prompt: "Perfect. Now, the replication fork is opening in one direction. How does this affect synthesis on the template strand that runs in the 3' to 5' direction (relative to fork opening)?",
                options: [
                    { text: "It is synthesized continuously (Leading strand)", nextId: 3, points: 10, positiveFeedback: "Correct! The new strand grows 5' to 3' in the same direction as the fork opens." },
                    { text: "It is synthesized in fragments", nextId: 3, points: 4, negativeFeedback: "Since the replication fork is opening in the same direction as the polymerisation (5' to 3'), this template strand can be replicated continuously. Let's look at the other strand next." }
                ]
            },
            {
                id: 3,
                prompt: "Now, what about the other template strand that runs 5' to 3' relative to the fork? The polymerase must synthesize *away* from the opening fork, running out of space, and repeating the process. What are these fragments called?",
                options: [
                    { text: "Okazaki fragments", nextId: 4, points: 10, positiveFeedback: "Spot on! Named after Reiji and Tsuneko Okazaki." },
                    { text: "Transcription units", nextId: 4, points: 3, negativeFeedback: "Transcription units belong to RNA synthesis. During DNA replication, these short lagging-strand fragments are called Okazaki fragments." }
                ]
            },
            {
                id: 4,
                prompt: "Awesome. These Okazaki fragments are separate. Which enzyme joins them together into a continuous double helix?",
                options: [
                    { text: "DNA Ligase", nextId: 5, points: 10, positiveFeedback: "Bingo! DNA Ligase acts like molecular glue, forming the covalent phosphodiester bonds." },
                    { text: "DNA Helicase", nextId: 5, points: 4, negativeFeedback: "Helicase unwinds the double helix at the start. The enzyme that joins the rewards is DNA Ligase." },
                    { text: "RNA Primase", nextId: 5, points: 2, negativeFeedback: "Primase synthesizes short RNA primers to start the synthesis. The joining enzyme is DNA Ligase." }
                ]
            },
            {
                id: 5,
                prompt: "Perfect! You now understand the molecular mechanics of DNA replication forks. Socratic level unlocked. Feel ready for the next test question?",
                isFinal: true
            }
        ]
    },
    upsc: {
        title: "Mughal Land Revenue Systems",
        subject: "History",
        doubt: "Explain the features and significance of the Dahsala system introduced by Akbar.",
        steps: [
            {
                id: 1,
                prompt: "Let's dive into Akbar's administrative reforms. Which famous revenue minister was responsible for designing this system?",
                options: [
                    { text: "Raja Todar Mal", nextId: 2, points: 10, positiveFeedback: "Correct! Todar Mal was a brilliant administrator who refined land measurement and classification systems." },
                    { text: "Abul Fazl", nextId: 2, points: 4, negativeFeedback: "Abul Fazl was Akbar's court historian (author of Akbarnama). Akbar's finance minister who designed the revenue system was Raja Todar Mal." }
                ]
            },
            {
                id: 2,
                prompt: "Right! Under the Dahsala system, how many years of average crop yield and prices were analyzed to calculate the tax rate?",
                options: [
                    { text: "10 years", nextId: 3, points: 10, positiveFeedback: "Yes! 'Dah' is the Persian word for ten, denoting a 10-year assessment period." },
                    { text: "5 years", nextId: 3, points: 4, negativeFeedback: "To average out seasonal agricultural fluctuations (like droughts), the system took a 10-year period (Dah = ten). Let's proceed." }
                ]
            },
            {
                id: 3,
                prompt: "Excellent. Land was divided into four categories based on cultivation frequency. What was the name of the highest quality land, cultivated annually and never left fallow?",
                options: [
                    { text: "Polaj", nextId: 4, points: 10, positiveFeedback: "Exactly! Polaj land was continuously cropped, yielding maximum tax revenues." },
                    { text: "Parauti", nextId: 4, points: 5, negativeFeedback: "Parauti land was left fallow for a year or two to recover its fertility. The land that was never left fallow was Polaj." },
                    { text: "Chachar", nextId: 4, points: 3, negativeFeedback: "Chachar land lay fallow for three to four years. Annual cultivation was conducted on Polaj land." }
                ]
            },
            {
                id: 4,
                prompt: "Correct. Now, let's analyze the economic significance. What major benefit did Dahsala bring to both the Mughal treasury and the farming community?",
                options: [
                    { text: "Tax rates became stable, predictable, and payable in cash", nextId: 5, points: 10, positiveFeedback: "Perfect! It reduced arbitrary tax demands, allowed peasants to plan, and secured state treasury revenue." },
                    { text: "It abolished taxes completely for poor peasants", nextId: 5, points: 3, negativeFeedback: "Taxes were not abolished. Instead, they were calculated systematically to prevent exploitation and stabilize state income. The core benefit was predictability." }
                ]
            },
            {
                id: 5,
                prompt: "Wonderful historical analysis! You have mapped out the fiscal structures of the Mughal Empire. Ready to tackle the next syllabus section?",
                isFinal: true
            }
        ]
    }
};

const cbtReframingPrompts = [
    "Getting stuck on a hard problem is not a sign of failure. It is the exact boundary of my current knowledge expanding.",
    "A mock test score is a diagnostic data point, not an evaluation of my self-worth.",
    "My worth as a person is independent of an exam rank. I am learning and growing every day.",
    "I do not have to know everything today. Breaking down this backlog one topic at a time is enough.",
    "Stress is my body's way of mobilizing energy. I can channel this energy to focus, then breathe to recover.",
    "My parents want me to succeed because they care. I can accept their love while letting go of the burden of their expectations."
];

function getSocraticResponse(state, userMessage) {
    const exam = state.userProfile.targetExam || 'jee';
    const tree = socraticTrees[exam] || socraticTrees.jee;
    
    if (state.socraticStep === 0) {
        state.socraticStep = 1;
        return {
            text: `Let's work on this together. The problem you uploaded is: "${tree.doubt}".\n\n${tree.steps[0].prompt}`,
            options: tree.steps[0].options,
            stepId: 1
        };
    }
    
    const currentStepIndex = state.socraticStep - 1;
    const currentStep = tree.steps[currentStepIndex];
    
    if (!currentStep) {
        return {
            text: "You have completed this doubt! What topic would you like to review next?",
            options: [],
            isFinished: true
        };
    }
    
    if (currentStep.options) {
        const matchingOption = currentStep.options.find(opt => 
            userMessage.toLowerCase().includes(opt.text.toLowerCase()) || 
            opt.text.toLowerCase().includes(userMessage.toLowerCase())
        ) || currentStep.options[0];
        
        const nextStepId = matchingOption.nextId;
        state.socraticStep = nextStepId;
        
        const nextStep = tree.steps[nextStepId - 1];
        
        if (nextStep.isFinal) {
            state.socraticStep = 0; 
            return {
                text: `${matchingOption.positiveFeedback || matchingOption.negativeFeedback || ""}\n\n${nextStep.prompt}`,
                options: [],
                isFinished: true
            };
        }
        
        return {
            text: `${matchingOption.positiveFeedback || matchingOption.negativeFeedback || ""}\n\n${nextStep.prompt}`,
            options: nextStep.options,
            stepId: nextStepId
        };
    }
    
    state.socraticStep = 0;
    return {
        text: "I see. Let's reset this concept. Ask another doubt!",
        options: []
    };
}

function getRandomReframing() {
    const idx = Math.floor(Math.random() * cbtReframingPrompts.length);
    return cbtReframingPrompts[idx];
}
