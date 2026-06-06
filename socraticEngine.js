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

function extractTopic(query) {
    if (!query) return "General Concept";
    // Clean common starters
    let topic = query.toLowerCase().trim();
    // remove trailing question marks
    topic = topic.replace(/[?.]+$/, "").trim();
    
    const starters = [
        "how do i solve the", "how do i solve", "can you explain the", "can you explain",
        "why is one", "why is", "what is the", "what is", "tell me about the", "tell me about",
        "what are the", "what are", "how does the", "how does", "why does the", "why does",
        "explain the features and significance of the", "explain the features and significance of",
        "explain the", "explain", "describe the", "describe", "how to solve", "how to", "why"
    ];
    
    for (const starter of starters) {
        if (topic.startsWith(starter)) {
            topic = topic.substring(starter.length).trim();
            break;
        }
    }
    
    if (topic.length < 3) {
        return "Custom Doubt";
    }
    
    // Capitalize first letter of words
    return topic.split(" ").map(word => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
}

function classifySubject(query, targetExam) {
    const text = query.toLowerCase();
    
    // Physics keywords
    if (/\b(force|forces|acceleration|gravity|velocity|mass|friction|torque|cylinder|incline|motion|energy|work|momentum|speed|rotation|wave|optics|light|electricity|charge|magnet|gravitational|newton|dynamics|kinematics)\b/.test(text)) {
        return "Physics";
    }
    // Biology keywords
    if (/\b(dna|rna|cell|cells|replication|gene|genes|photosynthesis|protein|proteins|enzyme|enzymes|mitochondria|nucleus|organism|plant|animal|evolution|respiration|heart|blood|chromosome|chromosomes|mitosis|meiosis|nucleotide|ribosome|bacteria|virus|genetic)\b/.test(text)) {
        return "Biology";
    }
    // History/Polity keywords
    if (/\b(constitution|parliament|dahsala|mughal|akbar|history|india|revenue|tax|government|president|court|law|laws|british|revolution|emperor|ruler|treaty|dynasty|empire|democracy|legislative|judicial|sovereign)\b/.test(text)) {
        return "Polity/History";
    }
    // Chemistry keywords
    if (/\b(atom|atoms|molecule|molecules|reaction|reactions|acid|acids|base|bases|chemical|bond|bonds|electron|electrons|gas|gases|solution|metal|metals|periodic|organic|covalent|ionic|stoichiometry|equilibrium)\b/.test(text)) {
        return "Chemistry";
    }
    // Math keywords
    if (/\b(derivative|derivatives|integral|integrals|equation|equations|matrix|vector|vectors|geometry|triangle|limit|limits|function|functions|algebra|probability|calculus|theorem|solve|matrix|algebraic)\b/.test(text)) {
        return "Math";
    }
    
    // Fallback based on targetExam
    const exam = (targetExam || "").toLowerCase();
    if (exam === "jee") return "Physics/Math";
    if (exam === "neet") return "Biology/Chemistry";
    if (exam === "upsc") return "History/Polity";
    if (exam === "cat") return "Quantitative Aptitude";
    if (exam === "gate") return "Engineering Sciences";
    if (exam === "cuet") return "General Studies";
    
    return "General Studies";
}

function generateDynamicSocraticTree(query, targetExam) {
    const topic = extractTopic(query);
    const subject = classifySubject(query, targetExam);
    
    let steps = [];
    
    if (subject === "Physics" || subject === "Physics/Math") {
        steps = [
            {
                id: 1,
                prompt: `To master "${topic}", let's start with the basics. What is the fundamental conservation law or force balance that governs "${topic}"?`,
                options: [
                    { 
                        text: "Conservation of energy/momentum or net force/torque equations.", 
                        nextId: 2, 
                        points: 10, 
                        positiveFeedback: "Spot on! Establishing the correct force or energy balance is the first rule of solving any physics problem." 
                    },
                    { 
                        text: "Looking only at the final velocity or acceleration directly.", 
                        nextId: 2, 
                        points: 4, 
                        negativeFeedback: "Close, but that skips the cause. In physics, we must first establish the active forces or conservation equations." 
                    },
                    { 
                        text: "Ignoring external work and friction completely.", 
                        nextId: 2, 
                        points: 2, 
                        negativeFeedback: "Be careful. Ignoring boundary constraints like friction or gravity components can lead to incorrect equations." 
                    }
                ]
            },
            {
                id: 2,
                prompt: `Great. Now, how do the linear/angular variables or parameters of "${topic}" relate to each other under constraints?`,
                options: [
                    { 
                        text: "They are coupled directly by system constraints (like a = αR or F = ma).", 
                        nextId: 3, 
                        points: 10, 
                        positiveFeedback: "Correct! Coupling variables through constraint equations allows us to reduce the number of unknowns." 
                    },
                    { 
                        text: "They are completely independent of each other.", 
                        nextId: 3, 
                        points: 3, 
                        negativeFeedback: "Not quite. If the system is constrained (like rolling without slipping), the variables are strictly coupled." 
                    }
                ]
            },
            {
                id: 3,
                prompt: `Perfect. If we solve the coupled equations for "${topic}" by substituting the parameters, what is the resulting acceleration or force expression?`,
                options: [
                    { 
                        text: "A fraction of the unconstrained value (e.g., 2/3 g sin θ or reduced force).", 
                        nextId: 4, 
                        points: 10, 
                        positiveFeedback: "Excellent! The friction or constraints reduce the acceleration or transfer energy to other degrees of freedom." 
                    },
                    { 
                        text: "The full unconstrained value (e.g., acceleration = g).", 
                        nextId: 4, 
                        points: 3, 
                        negativeFeedback: "Check the algebra. The constraint force reduces the linear acceleration. Try including the constraint factor." 
                    }
                ]
            },
            {
                id: 4,
                prompt: `Almost there! How can we sanity-check our derived formula for "${topic}"?`,
                options: [
                    { 
                        text: "Verify the units match and check boundary limits (like angle θ = 0 or 90 degrees).", 
                        nextId: 5, 
                        points: 10, 
                        positiveFeedback: "Superb! Testing boundary conditions (like θ=0 giving zero acceleration) is the hallmark of a great physicist." 
                    },
                    { 
                        text: "Assume the math is perfect and proceed to the next question.", 
                        nextId: 5, 
                        points: 3, 
                        negativeFeedback: "Always test boundaries! If our formula doesn't work at limits (like gravity going to zero), the derivation is incorrect." 
                    }
                ]
            },
            {
                id: 5,
                prompt: `Fantastic work! You've analyzed "${topic}" Socratic style: formulated the forces, linked the constraints, calculated the result, and verified limits. How confident do you feel about this now?`,
                isFinal: true
            }
        ];
    } else if (subject === "Biology" || subject === "Biology/Chemistry") {
        steps = [
            {
                id: 1,
                prompt: `Let's unpack "${topic}" systematically. What is the primary molecular component or cellular structure initiating the process of "${topic}"?`,
                options: [
                    { 
                        text: "Enzymatic activation or specific receptor-ligand/nucleotide binding.", 
                        nextId: 2, 
                        points: 10, 
                        positiveFeedback: "Spot on! Cellular processes are strictly regulated by enzyme activation or binding specificity." 
                    },
                    { 
                        text: "Spontaneous biochemical synthesis without catalytic action.", 
                        nextId: 2, 
                        points: 3, 
                        negativeFeedback: "Spontaneous reactions are too slow for biological systems. We need catalyst enzymes or primers to initiate the process." 
                    }
                ]
            },
            {
                id: 2,
                prompt: `Perfect. How do the key molecules/structures interact to propagate or regulate "${topic}"?`,
                options: [
                    { 
                        text: "Through highly directional pathways or complementary base pairing.", 
                        nextId: 3, 
                        points: 10, 
                        positiveFeedback: "Exactly! Directionality (like 5' to 3' synthesis) and structural complementarity ensure precision." 
                    },
                    { 
                        text: "Random collision of substrates without orientation or direction.", 
                        nextId: 3, 
                        points: 3, 
                        negativeFeedback: "Biological replication and synthesis are highly ordered and template-driven. Random collision is highly inefficient." 
                    }
                ]
            },
            {
                id: 3,
                prompt: `Now, consider the consequence of this directionality. How does the system resolve the opposite orientation or regulation during "${topic}"?`,
                options: [
                    { 
                        text: "By utilizing discontinuous synthesis (like Okazaki fragments) or feedback loops.", 
                        nextId: 4, 
                        points: 10, 
                        positiveFeedback: "Excellent! This clever molecular workaround resolves the structural constraints of the cell." 
                    },
                    { 
                        text: "By changing the chemical properties of the enzymes to synthesize in both directions.", 
                        nextId: 4, 
                        points: 4, 
                        negativeFeedback: "Remember, enzyme active sites are structurally rigid. DNA/RNA polymerases cannot change their synthesis direction." 
                    }
                ]
            },
            {
                id: 4,
                prompt: `Almost there! How does the cell or researcher verify the fidelity/correctness of "${topic}"?`,
                options: [
                    { 
                        text: "Through proofreading exonucleases or control assays.", 
                        nextId: 5, 
                        points: 10, 
                        positiveFeedback: "Superb! Proofreading activities reduce mutation rates from 1 in 10^5 to 1 in 10^9." 
                    },
                    { 
                        text: "By ignoring errors and relying on post-replication repair only.", 
                        nextId: 5, 
                        points: 3, 
                        negativeFeedback: "Proofreading is active during the process. Post-replication repair is the backup. Both are needed for fidelity." 
                    }
                ]
            },
            {
                id: 5,
                prompt: `Fantastic! You've successfully mapped "${topic}" Socratic style: identified the enzymes, explained the directionality constraints, resolved the lagging synthesis, and checked the proofreading. Ready for the next topic?`,
                isFinal: true
            }
        ];
    } else if (subject === "Chemistry") {
        steps = [
            {
                id: 1,
                prompt: `Let's explore "${topic}". What is the core atomic or molecular property that governs the behavior of "${topic}"?`,
                options: [
                    { 
                        text: "Electronegativity, valence electron configuration, or chemical bonding type.", 
                        nextId: 2, 
                        points: 10, 
                        positiveFeedback: "Exactly! Chemical properties are fundamentally determined by the behavior of valence electrons." 
                    },
                    { 
                        text: "The color and physical state of the compound only.", 
                        nextId: 2, 
                        points: 3, 
                        negativeFeedback: "Physical state is a macroscopic property. The microscopic behavior is driven by electron configurations." 
                    }
                ]
            },
            {
                id: 2,
                prompt: `Excellent. How do these molecular properties influence the interactions or equilibrium in "${topic}"?`,
                options: [
                    { 
                        text: "By determining the thermodynamic stability and rate of reaction.", 
                        nextId: 3, 
                        points: 10, 
                        positiveFeedback: "Correct! Kinetics and thermodynamics govern how fast and how far a reaction goes." 
                    },
                    { 
                        text: "They have no effect; all reactions occur at identical speeds.", 
                        nextId: 3, 
                        points: 3, 
                        negativeFeedback: "Reactions have widely varying rates and energy requirements based on activation energy and molecular orientation." 
                    }
                ]
            },
            {
                id: 3,
                prompt: `Perfect. If we apply the stoichiometry or equilibrium constants to "${topic}", what is the key relationship?`,
                options: [
                    { 
                        text: "The ratio of products to reactants is proportional to the equilibrium constant.", 
                        nextId: 4, 
                        points: 10, 
                        positiveFeedback: "Spot on! Le Chatelier's principle predicts how a system responds to changes in temperature, pressure, or concentration." 
                    },
                    { 
                        text: "The concentration of products always equals the concentration of reactants.", 
                        nextId: 4, 
                        points: 3, 
                        negativeFeedback: "Equilibrium means rates are equal, not concentrations. The ratio depends on the equilibrium constant." 
                    }
                ]
            },
            {
                id: 4,
                prompt: `Almost there! How can we experimentally verify the results of "${topic}"?`,
                options: [
                    { 
                        text: "Using spectroscopy, titration, or pH measurement to monitor concentrations.", 
                        nextId: 5, 
                        points: 10, 
                        positiveFeedback: "Superb! Analytical methods allow us to quantitatively verify reaction outcomes." 
                    },
                    { 
                        text: "By testing physical touch or visual colors only without tools.", 
                        nextId: 5, 
                        points: 3, 
                        negativeFeedback: "Safety first! Visual checks are not quantitative. Use analytical tools." 
                    }
                ]
            },
            {
                id: 5,
                prompt: `Fantastic! You've analyzed "${topic}" Socratic style: recalled electron behavior, mapped reaction rates, calculated equilibrium shifts, and verified analytically. Ready to proceed?`,
                isFinal: true
            }
        ];
    } else if (subject === "Math") {
        steps = [
            {
                id: 1,
                prompt: `Let's break down "${topic}". What is the foundational definition or axiom that defines "${topic}"?`,
                options: [
                    { 
                        text: "The limit definition, algebraic identity, or vector space axioms.", 
                        nextId: 2, 
                        points: 10, 
                        positiveFeedback: "Precisely! All mathematical derivations build strictly upon initial definitions and axioms." 
                    },
                    { 
                        text: "An approximate numerical guess that works most of the time.", 
                        nextId: 2, 
                        points: 3, 
                        negativeFeedback: "Approximations are useful for computation, but mathematics requires exact axiomatic definitions." 
                    }
                ]
            },
            {
                id: 2,
                prompt: `Correct. How are the operations or variables in "${topic}" mapped to each other?`,
                options: [
                    { 
                        text: "Through linear transformations, functions, or differential relationships.", 
                        nextId: 3, 
                        points: 10, 
                        positiveFeedback: "Exactly! Mapping inputs to outputs preserves key structural properties." 
                    },
                    { 
                        text: "By assigning random values without a defined function mapping.", 
                        nextId: 3, 
                        points: 3, 
                        negativeFeedback: "Mathematics is the study of patterns and relations. We require strict functional or relational mapping." 
                    }
                ]
            },
            {
                id: 3,
                prompt: `Now, let's carry out the derivation. What is the algebraic or calculus result when we apply this mapping to "${topic}"?`,
                options: [
                    { 
                        text: "Solving the system yields a closed-form solution or convergent series.", 
                        nextId: 4, 
                        points: 10, 
                        positiveFeedback: "Spot on! Finding a closed-form solution or proving convergence is the goal of the derivation." 
                    },
                    { 
                        text: "We get an undefined expression that changes value randomly.", 
                        nextId: 4, 
                        points: 3, 
                        negativeFeedback: "If the expression is undefined or divergent, we need to check boundary domains or limit constraints." 
                    }
                ]
            },
            {
                id: 4,
                prompt: `Almost there! How do we verify the mathematical validity of our solution for "${topic}"?`,
                options: [
                    { 
                        text: "Check edge cases, test with simple integers, or plug the solution back into the original equation.", 
                        nextId: 5, 
                        points: 10, 
                        positiveFeedback: "Superb! Plugging values back in or checking boundary conditions is the ultimate test of mathematical correctness." 
                    },
                    { 
                        text: "Assert it is correct because it matches the template without verification.", 
                        nextId: 5, 
                        points: 3, 
                        negativeFeedback: "Even templates can fail if the problem domain has exceptions (like division by zero). Always verify edge cases." 
                    }
                ]
            },
            {
                id: 5,
                prompt: `Excellent proof! You have solved "${topic}" Socratic style: established the definitions, mapped variables, computed the closed-form, and verified the boundaries. Ready for the next challenge?`,
                isFinal: true
            }
        ];
    } else { // Polity/History / General Studies / Fallback
        steps = [
            {
                id: 1,
                prompt: `Let's analyze "${topic}". What was the main historical catalyst or legislative objective behind the introduction of "${topic}"?`,
                options: [
                    { 
                        text: "To standardize administration, raise predictable revenue, or secure civil rights.", 
                        nextId: 2, 
                        points: 10, 
                        positiveFeedback: "Correct! Historical reforms almost always seek state stability, fiscal predictability, or societal order." 
                    },
                    { 
                        text: "A sudden arbitrary decision without economic or social pressures.", 
                        nextId: 2, 
                        points: 4, 
                        negativeFeedback: "Policy decisions are rarely made in a vacuum. They are driven by systemic financial, administrative, or social needs." 
                    }
                ]
            },
            {
                id: 2,
                prompt: `Right. How did this system classify or structure its subjects/territories to implement "${topic}"?`,
                options: [
                    { 
                        text: "By categorizing them based on productivity, performance, or constitutional status.", 
                        nextId: 3, 
                        points: 10, 
                        positiveFeedback: "Exactly! Effective administration requires clear classifications (like land grading or federal division)." 
                    },
                    { 
                        text: "By treating all diverse entities with a single uniform rule without analysis.", 
                        nextId: 3, 
                        points: 3, 
                        negativeFeedback: "A uniform rule without local adjustments is bound to fail in a diverse empire/state. Classification is key." 
                    }
                ]
            },
            {
                id: 3,
                prompt: `Excellent. What was the direct administrative or economic impact of "${topic}" on the state and its citizens?`,
                options: [
                    { 
                        text: "It stabilized revenues and reduced arbitrary exploitation through clear guidelines.", 
                        nextId: 4, 
                        points: 10, 
                        positiveFeedback: "Spot on! Predictable guidelines benefit both the state treasury and the populace by reducing corruption." 
                    },
                    { 
                        text: "It caused immediate collapse of the entire economy due to high taxes.", 
                        nextId: 4, 
                        points: 3, 
                        negativeFeedback: "While tax burden was a factor, successful systems (like Dahsala) stabilized the economy for decades. Look for predictability." 
                    }
                ]
            },
            {
                id: 4,
                prompt: `Almost there! How do modern historians or legal scholars evaluate the long-term legacy of "${topic}"?`,
                options: [
                    { 
                        text: "By comparing it with contemporary records and assessing administrative durability.", 
                        nextId: 5, 
                        points: 10, 
                        positiveFeedback: "Superb! Analyzing primary sources and durability gives us objective historical insights." 
                    },
                    { 
                        text: "By accepting imperial or government decrees as absolute truth.", 
                        nextId: 5, 
                        points: 3, 
                        negativeFeedback: "Critical analysis is essential. Official decrees often mask administrative failures or local resistance." 
                    }
                ]
            },
            {
                id: 5,
                prompt: `Wonderful historical analysis! You have mapped "${topic}" Socratic style: evaluated the motivation, analyzed the structural classifications, traced the socioeconomic impact, and verified historical sources. Ready for the next section?`,
                isFinal: true
            }
        ];
    }
    
    return {
        title: `${topic} Breakdown`,
        subject: subject,
        doubt: query,
        steps: steps
    };
}

function isCustomQuery(query) {
    if (!query) return false;
    const text = query.toLowerCase().trim();
    if (text.length < 5) return false;
    
    // List of generic phrases to ignore (default to presets)
    const genericPhrases = [
        "help",
        "i need help",
        "i need help with this question",
        "some gibberish input text",
        "hello",
        "hi",
        "start",
        "testing",
        "run tests"
    ];
    
    if (genericPhrases.some(phrase => text === phrase || text.startsWith(phrase))) {
        return false;
    }
    
    // Check if it has subject keywords or question markers
    const hasKeywords = /\b(force|forces|acceleration|gravity|velocity|mass|friction|torque|cylinder|incline|motion|energy|work|momentum|speed|rotation|wave|optics|light|electricity|charge|magnet|gravitational|newton|dynamics|kinematics|dna|rna|cell|cells|replication|gene|genes|photosynthesis|protein|proteins|enzyme|enzymes|mitochondria|nucleus|organism|plant|animal|evolution|respiration|heart|blood|chromosome|chromosomes|mitosis|meiosis|nucleotide|ribosome|bacteria|virus|genetic|constitution|parliament|dahsala|mughal|akbar|history|india|revenue|tax|government|president|court|law|laws|british|revolution|emperor|ruler|treaty|dynasty|empire|democracy|legislative|judicial|sovereign|atom|atoms|molecule|molecules|reaction|reactions|acid|acids|base|bases|chemical|bond|bonds|electron|electrons|gas|gases|solution|metal|metals|periodic|organic|covalent|ionic|stoichiometry|equilibrium|derivative|derivatives|integral|integrals|equation|equations|matrix|vector|vectors|geometry|triangle|limit|limits|function|functions|algebra|probability|calculus|theorem|solve|algebraic|science|study|concept|theory)\b/i.test(text);
    
    const isQuestion = /\b(why|how|what|explain|describe|who|where|when|can you|could you)\b/i.test(text);
    
    return hasKeywords || isQuestion;
}

function getSocraticResponse(state, userMessage) {
    const exam = state.userProfile.targetExam || 'jee';
    
    // Check if we have an active dynamic tree in progress
    let tree = state.currentDynamicTree;
    
    if (state.socraticStep === 0) {
        // We are initiating a new Socratic query.
        // First determine if we should match a preset or generate dynamically.
        const queryText = userMessage.toLowerCase();
        
        let matchedPresetKey = null;
        if (queryText.includes("rolling cylinder") || queryText.includes("incline θ") || queryText.includes("solid cylinder") || queryText.includes("slipping down")) {
            matchedPresetKey = "jee";
        } else if (queryText.includes("replication") || queryText.includes("semi-discontinuous") || queryText.includes("lagging strand") || queryText.includes("replication fork")) {
            matchedPresetKey = "neet";
        } else if (queryText.includes("dahsala") || queryText.includes("todar mal") || queryText.includes("akbar") || queryText.includes("revenue system")) {
            matchedPresetKey = "upsc";
        }
        
        if (matchedPresetKey) {
            tree = socraticTrees[matchedPresetKey];
            state.currentDynamicTree = null; // reset to use presets
        } else if (isCustomQuery(userMessage)) {
            // Generate custom dynamic Socratic tree
            tree = generateDynamicSocraticTree(userMessage, exam);
            state.currentDynamicTree = tree;
        } else {
            // Fall back to preset based on targetExam
            tree = socraticTrees[exam] || socraticTrees.jee;
            state.currentDynamicTree = null;
        }
        
        state.socraticStep = 1;
        return {
            text: `Let's work on this together. The problem you uploaded is: "${tree.doubt}".\n\n${tree.steps[0].prompt}`,
            options: tree.steps[0].options,
            stepId: 1
        };
    }
    
    // If we have an active dynamic tree, use it. Otherwise fall back to the preset based on profile target exam.
    if (!tree) {
        tree = socraticTrees[exam] || socraticTrees.jee;
    }
    
    const currentStepIndex = state.socraticStep - 1;
    const currentStep = tree.steps[currentStepIndex];
    
    if (!currentStep) {
        state.currentDynamicTree = null;
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
            state.currentDynamicTree = null; // clear cached tree
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
    state.currentDynamicTree = null;
    return {
        text: "I see. Let's reset this concept. Ask another doubt!",
        options: []
    };
}

function getRandomReframing() {
    const idx = Math.floor(Math.random() * cbtReframingPrompts.length);
    return cbtReframingPrompts[idx];
}
