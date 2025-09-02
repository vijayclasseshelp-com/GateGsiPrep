// Application State
class AppState {
    constructor() {
        this.currentExam = null;
        this.currentSubject = null;
        this.currentTopic = null;
        this.currentQuestion = null;
        this.questionIndex = 0;
        this.sessionQuestions = [];
        this.userAnswers = [];
        this.progress = this.loadProgress();
        this.startTime = null;
    }

    loadProgress() {
        return {
            questionsAttempted: 0,
            correctAnswers: 0,
            topicsCompleted: new Set(),
            totalTimeSpent: 0,
            recentActivity: []
        };
    }

    addActivity(activity) {
        this.progress.recentActivity.unshift({
            ...activity,
            timestamp: new Date()
        });
        if (this.progress.recentActivity.length > 10) {
            this.progress.recentActivity.pop();
        }
    }
}

// Syllabus Data
const syllabusData = {
    "GSI": {
        "general_studies": [
            "Current Events", "History of India", "Geography", "Polity & Governance", 
            "Economic Development", "Environmental Ecology", "General Science"
        ],
        "geology_hydrogeology": [
            "Physical Geology", "Structural Geology", "Mineralogy", "Igneous Petrology",
            "Metamorphic Petrology", "Sedimentology", "Paleontology", "Stratigraphy", 
            "Economic Geology", "Hydrogeology"
        ],
        "geophysics": [
            "Solid Earth Geophysics", "Mathematical Methods in Geophysics"
        ],
        "chemistry": [
            "Atomic Structure", "Thermodynamics", "Solutions", "Electrochemistry",
            "Coordination Chemistry", "Organic Chemistry", "Analytical Chemistry",
            "Environmental Chemistry", "Geochemistry", "Instrumental Methods"
        ]
    },
    "GATE": {
        "common_section": [
            "Earth and Planetary System", "Seismology", "Heat Flow", "Geomagnetism",
            "Plate Tectonics", "Weathering & Landforms", "Basic Structural Geology",
            "Crystallography", "Mineralogy", "Petrology Basics", "Geological Time Scale",
            "Stratigraphy", "Mineral Resources", "Remote Sensing", "Hydrogeology Elements",
            "Geophysical Prospecting"
        ],
        "geology": [
            "Geomorphology", "Structural Geology", "Crystallography & Mineralogy", 
            "Geochemistry", "Igneous Petrology", "Sedimentology", "Metamorphic Petrology",
            "Paleobiology", "Stratigraphy", "Resource Geology", "Global Tectonics",
            "Applied Geology", "Hydrogeology", "Remote Sensing"
        ],
        "geophysics": [
            "Solid-Earth Geophysics", "Geodesy", "Earthquake Seismology", 
            "Potential Fields", "Gravity Methods", "Magnetic Methods", "Electrical Methods",
            "Electromagnetic Methods", "Seismic Methods", "Well Logging", 
            "Radioactive Methods", "Geophysical Inversion"
        ]
    }
};

// Sample question templates for AI generation
const questionTemplates = {
    "Physical Geology": [
        {
            question: "The principle of uniformitarianism states that:",
            options: [
                "Past geological processes were different from present ones",
                "Present geological processes are the key to understanding past geological processes", 
                "All geological processes occur at uniform rates",
                "Geological processes are uniform across all regions"
            ],
            correct: 1,
            explanation: "The principle of uniformitarianism, proposed by James Hutton, states that 'the present is the key to the past.' This means that the same geological processes operating today have operated throughout Earth's history, allowing us to interpret ancient rock formations and geological features by studying modern processes.",
            difficulty: "medium"
        }
    ],
    "Mineralogy": [
        {
            question: "Which of the following minerals belongs to the pyroxene group?",
            options: [
                "Hornblende",
                "Augite", 
                "Muscovite",
                "Quartz"
            ],
            correct: 1,
            explanation: "Augite is a clinopyroxene mineral with the general formula (Ca,Na)(Mg,Fe,Al,Ti)(Si,Al)2O6. Pyroxenes are characterized by single-chain silicate structures. Hornblende is an amphibole, muscovite is a mica, and quartz is a framework silicate.",
            difficulty: "easy"
        }
    ],
    "Seismology": [
        {
            question: "P-waves travel faster than S-waves because:",
            options: [
                "P-waves have higher frequency",
                "P-waves are compressional waves while S-waves are shear waves",
                "P-waves travel through solid media only", 
                "P-waves have lower amplitude"
            ],
            correct: 1,
            explanation: "P-waves (primary waves) are compressional waves that involve particle motion parallel to wave propagation. S-waves (secondary waves) are shear waves with particle motion perpendicular to wave propagation. Compressional waves travel faster because rocks resist compression less than they resist shearing. This is why P-waves arrive first at seismic stations.",
            difficulty: "medium"
        }
    ]
};

// AI Question Generator
class QuestionGenerator {
    static generateQuestion(topic) {
        // Check if we have templates for this topic
        if (questionTemplates[topic] && questionTemplates[topic].length > 0) {
            const templates = questionTemplates[topic];
            const template = templates[Math.floor(Math.random() * templates.length)];
            return { ...template, topic };
        }

        // Generate a generic question for the topic
        return this.generateGenericQuestion(topic);
    }

    static generateGenericQuestion(topic) {
        const difficulties = ['easy', 'medium', 'hard'];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        // Generic question templates based on topic
        const genericQuestions = {
            "Structural Geology": {
                question: `Which of the following is a primary characteristic of ${topic.toLowerCase()}?`,
                options: [
                    "Formation of sedimentary layers",
                    "Deformation of rock masses",
                    "Chemical weathering processes",
                    "Volcanic eruption patterns"
                ],
                correct: 1,
                explanation: `${topic} involves the study of rock deformation and the processes that create geological structures. This includes understanding how forces acting on rocks create folds, faults, joints, and other structural features.`
            },
            "default": {
                question: `What is the most important concept to understand in ${topic}?`,
                options: [
                    "Basic principles and fundamentals",
                    "Advanced mathematical calculations",
                    "Historical development only",
                    "Practical applications only"
                ],
                correct: 0,
                explanation: `Understanding the fundamental principles of ${topic} is crucial for building a strong foundation. This includes grasping the basic concepts, mechanisms, and relationships that govern the subject area.`
            }
        };

        const template = genericQuestions[topic] || genericQuestions["default"];
        return {
            ...template,
            topic,
            difficulty
        };
    }
}

// Application Instance
let app;

// Navigation
function showSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Map section IDs to nav data attributes
    const sectionNavMap = {
        'examSelection': 'practice',
        'subjectSelection': 'practice',
        'topicSelection': 'practice',
        'practiceSession': 'practice',
        'progressSection': 'progress',
        'aboutSection': 'about'
    };
    
    const navSection = sectionNavMap[sectionId];
    if (navSection) {
        const navBtn = document.querySelector(`[data-section="${navSection}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    app = new AppState();
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupExamSelection();
    setupBackButtons();
    setupPracticeSession();
    updateProgressDisplay();
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            if (section === 'practice') {
                showSection('examSelection');
            } else if (section === 'progress') {
                showSection('progressSection');
            } else if (section === 'about') {
                showSection('aboutSection');
            }
        });
    });
}

function setupExamSelection() {
    const examCards = document.querySelectorAll('.exam-card');
    examCards.forEach(card => {
        const button = card.querySelector('.btn--primary');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const exam = card.dataset.exam;
                if (exam) {
                    app.currentExam = exam;
                    const examInfo = document.getElementById('currentExam');
                    if (examInfo) {
                        examInfo.textContent = exam;
                    }
                    showSubjectSelection(exam);
                }
            });
        }
    });
}

function setupBackButtons() {
    const backToExam = document.getElementById('backToExam');
    if (backToExam) {
        backToExam.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('examSelection');
            app.currentExam = null;
            const examInfo = document.getElementById('currentExam');
            if (examInfo) {
                examInfo.textContent = 'Select Exam Type';
            }
        });
    }

    const backToSubject = document.getElementById('backToSubject');
    if (backToSubject) {
        backToSubject.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('subjectSelection');
            app.currentSubject = null;
        });
    }

    const backToTopics = document.getElementById('backToTopics');
    if (backToTopics) {
        backToTopics.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('topicSelection');
            app.currentTopic = null;
        });
    }
}

function showSubjectSelection(exam) {
    showSection('subjectSelection');
    
    const subjectTitle = document.getElementById('subjectTitle');
    if (subjectTitle) {
        subjectTitle.textContent = `Select ${exam} Subject`;
    }
    
    const subjectGrid = document.getElementById('subjectGrid');
    if (subjectGrid) {
        subjectGrid.innerHTML = '';
        
        const subjects = getSubjectsForExam(exam);
        subjects.forEach(subject => {
            const card = createSubjectCard(subject);
            subjectGrid.appendChild(card);
        });
    }
}

function getSubjectsForExam(exam) {
    const subjectMap = {
        'GATE': [
            { key: 'common_section', name: 'Common Section', description: 'Fundamental topics common to all GATE disciplines' },
            { key: 'geology', name: 'Geology', description: 'Comprehensive geological sciences' },
            { key: 'geophysics', name: 'Geophysics', description: 'Physics applied to Earth sciences' }
        ],
        'GSI': [
            { key: 'general_studies', name: 'General Studies', description: 'Current affairs, history, geography, and general knowledge' },
            { key: 'geology_hydrogeology', name: 'Geology/Hydrogeology', description: 'Geological sciences and groundwater studies' },
            { key: 'geophysics', name: 'Geophysics', description: 'Applied geophysics and Earth physics' },
            { key: 'chemistry', name: 'Chemistry', description: 'General and analytical chemistry' }
        ]
    };
    
    return subjectMap[exam] || [];
}

function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
        <h3>${subject.name}</h3>
        <p>${subject.description}</p>
    `;
    
    card.addEventListener('click', function() {
        app.currentSubject = subject.key;
        showTopicSelection(subject);
    });
    
    return card;
}

function showTopicSelection(subject) {
    showSection('topicSelection');
    
    const topicTitle = document.getElementById('topicTitle');
    if (topicTitle) {
        topicTitle.textContent = `${subject.name} Topics`;
    }
    
    const topicGrid = document.getElementById('topicGrid');
    if (topicGrid) {
        topicGrid.innerHTML = '';
        
        const topics = syllabusData[app.currentExam][subject.key] || [];
        topics.forEach(topic => {
            const card = createTopicCard(topic);
            topicGrid.appendChild(card);
        });
    }
    
    // Setup search functionality
    const searchInput = document.getElementById('topicSearch');
    if (searchInput) {
        searchInput.value = '';
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const topicCards = document.querySelectorAll('.topic-card');
            
            topicCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = title.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

function createTopicCard(topic) {
    const card = document.createElement('div');
    card.className = 'topic-card';
    const progress = Math.floor(Math.random() * 100);
    
    card.innerHTML = `
        <h3>${topic}</h3>
        <p>Practice questions related to ${topic.toLowerCase()}</p>
        <div class="topic-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span>${progress}%</span>
        </div>
    `;
    
    card.addEventListener('click', function() {
        app.currentTopic = topic;
        startPracticeSession(topic);
    });
    
    return card;
}

function startPracticeSession(topic) {
    app.sessionQuestions = [];
    app.userAnswers = [];
    app.questionIndex = 0;
    app.startTime = Date.now();
    
    // Generate 10 questions for the session
    for (let i = 0; i < 10; i++) {
        app.sessionQuestions.push(QuestionGenerator.generateQuestion(topic));
    }
    
    showSection('practiceSession');
    
    const currentTopic = document.getElementById('currentTopic');
    if (currentTopic) {
        currentTopic.textContent = topic;
    }
    
    displayQuestion();
}

function setupPracticeSession() {
    const submitBtn = document.getElementById('submitAnswer');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitAnswer();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextQuestion();
        });
    }
}

function displayQuestion() {
    if (!app.currentQuestion || !app.sessionQuestions[app.questionIndex]) {
        return;
    }
    
    const question = app.sessionQuestions[app.questionIndex];
    app.currentQuestion = question;
    
    const questionCounter = document.getElementById('questionCounter');
    if (questionCounter) {
        questionCounter.textContent = `Question ${app.questionIndex + 1} of ${app.sessionQuestions.length}`;
    }
    
    const questionText = document.getElementById('questionText');
    if (questionText) {
        questionText.textContent = question.question;
    }
    
    const difficulty = document.getElementById('difficulty');
    if (difficulty) {
        difficulty.textContent = question.difficulty;
        difficulty.className = `status status--${question.difficulty === 'easy' ? 'success' : question.difficulty === 'hard' ? 'error' : 'info'}`;
    }
    
    const optionsContainer = document.getElementById('optionsContainer');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            button.dataset.index = index;
            
            button.addEventListener('click', function() {
                document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                const submitAnswer = document.getElementById('submitAnswer');
                if (submitAnswer) {
                    submitAnswer.disabled = false;
                }
            });
            
            optionsContainer.appendChild(button);
        });
    }
    
    const submitAnswer = document.getElementById('submitAnswer');
    const nextQuestion = document.getElementById('nextQuestion');
    const feedbackPanel = document.getElementById('feedbackPanel');
    
    if (submitAnswer) {
        submitAnswer.disabled = true;
        submitAnswer.classList.remove('hidden');
    }
    if (nextQuestion) {
        nextQuestion.classList.add('hidden');
    }
    if (feedbackPanel) {
        feedbackPanel.classList.add('hidden');
    }
}

function submitAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) return;
    
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const question = app.currentQuestion;
    const isCorrect = selectedIndex === question.correct;
    
    app.userAnswers.push({
        questionIndex: app.questionIndex,
        selectedAnswer: selectedIndex,
        correct: isCorrect,
        timeSpent: Date.now() - app.startTime
    });
    
    app.progress.questionsAttempted++;
    if (isCorrect) {
        app.progress.correctAnswers++;
    }
    
    // Update option styles
    document.querySelectorAll('.option').forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    showFeedback(isCorrect, question);
    
    const submitBtn = document.getElementById('submitAnswer');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (submitBtn) {
        submitBtn.classList.add('hidden');
    }
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
    }
}

function showFeedback(isCorrect, question) {
    const feedbackPanel = document.getElementById('feedbackPanel');
    const feedbackResult = document.getElementById('feedbackResult');
    const feedbackExplanation = document.getElementById('feedbackExplanation');
    
    if (feedbackResult) {
        feedbackResult.textContent = isCorrect ? 'Correct!' : 'Incorrect';
        feedbackResult.className = `feedback-result ${isCorrect ? 'correct' : 'incorrect'}`;
    }
    
    if (feedbackExplanation) {
        let explanationHTML = `<h4>Explanation:</h4><p>${question.explanation}</p>`;
        
        if (!isCorrect) {
            explanationHTML += `
                <h4>Key Points:</h4>
                <ul>
                    <li>The correct answer is: ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}</li>
                    <li>Topic: ${question.topic}</li>
                    <li>Difficulty: ${question.difficulty}</li>
                </ul>
            `;
        }
        
        feedbackExplanation.innerHTML = explanationHTML;
    }
    
    if (feedbackPanel) {
        feedbackPanel.classList.remove('hidden');
    }
}

function nextQuestion() {
    app.questionIndex++;
    
    if (app.questionIndex < app.sessionQuestions.length) {
        displayQuestion();
    } else {
        endPracticeSession();
    }
}

function endPracticeSession() {
    const sessionTime = Math.floor((Date.now() - app.startTime) / 60000);
    app.progress.totalTimeSpent += sessionTime;
    app.progress.topicsCompleted.add(app.currentTopic);
    
    app.addActivity({
        action: 'Completed practice session',
        topic: app.currentTopic,
        questions: app.sessionQuestions.length,
        correct: app.userAnswers.filter(a => a.correct).length,
        timeSpent: sessionTime
    });
    
    const correctAnswers = app.userAnswers.filter(a => a.correct).length;
    alert(`Practice session completed! You answered ${correctAnswers} out of ${app.sessionQuestions.length} questions correctly.`);
    
    showSection('topicSelection');
    updateProgressDisplay();
}

function updateProgressDisplay() {
    const questionsAttempted = document.getElementById('questionsAttempted');
    const accuracyRate = document.getElementById('accuracyRate');
    const topicsCompleted = document.getElementById('topicsCompleted');
    const timeSpent = document.getElementById('timeSpent');
    const activityLog = document.getElementById('activityLog');
    
    if (questionsAttempted) {
        questionsAttempted.textContent = app.progress.questionsAttempted;
    }
    
    if (accuracyRate) {
        const rate = app.progress.questionsAttempted > 0 
            ? Math.round((app.progress.correctAnswers / app.progress.questionsAttempted) * 100)
            : 0;
        accuracyRate.textContent = rate + '%';
    }
    
    if (topicsCompleted) {
        topicsCompleted.textContent = app.progress.topicsCompleted.size;
    }
    
    if (timeSpent) {
        const hours = Math.floor(app.progress.totalTimeSpent / 60);
        const minutes = app.progress.totalTimeSpent % 60;
        timeSpent.textContent = `${hours}h ${minutes}m`;
    }
    
    if (activityLog) {
        if (app.progress.recentActivity.length === 0) {
            activityLog.innerHTML = '<p>No activity yet. Start practicing to see your progress!</p>';
        } else {
            activityLog.innerHTML = app.progress.recentActivity.map(activity => `
                <div class="activity-item">
                    <div>
                        <strong>${activity.action}</strong><br>
                        <small>${activity.topic} - ${activity.correct}/${activity.questions} correct</small>
                    </div>
                    <div>
                        <small>${activity.timestamp.toLocaleDateString()}</small>
                    </div>
                </div>
            `).join('');
        }
    }
}