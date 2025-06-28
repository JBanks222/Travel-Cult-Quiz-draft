class TravelQuiz {
    constructor() {
        this.quizData = null;
        this.currentQuestion = 0;
        this.answers = [];
        this.totalQuestions = 12;
        
        this.initializeElements();
        this.bindEvents();
        this.loadQuizData();
    }

    initializeElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Navigation elements
        this.startBtn = document.getElementById('start-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.retakeBtn = document.getElementById('retake-btn');
        this.shareBtn = document.getElementById('share-btn');
        
        // Question elements
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.progressFill = document.getElementById('progress-fill');
        
        // Results elements
        this.resultsContent = document.getElementById('results-content');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.retakeBtn.addEventListener('click', () => this.retakeQuiz());
        this.shareBtn.addEventListener('click', () => this.shareResults());
    }

    async loadQuizData() {
        try {
            const response = await fetch('quiz.json');
            this.quizData = await response.json();
            this.totalQuestionsSpan.textContent = this.quizData.questions.length;
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert('Error loading quiz data. Please refresh the page.');
        }
    }

    startQuiz() {
        this.showScreen(this.questionScreen);
        this.displayQuestion();
    }

    showScreen(screen) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        // Show target screen
        screen.classList.add('active');
    }

    displayQuestion() {
        const question = this.quizData.questions[this.currentQuestion];
        this.questionText.textContent = question.question;
        this.currentQuestionSpan.textContent = this.currentQuestion + 1;
        
        // Update progress bar
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Display options
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            
            // Check if this option was previously selected
            if (this.answers[this.currentQuestion] && 
                this.answers[this.currentQuestion].selected_option_text === option.text) {
                optionElement.classList.add('selected');
            }
            
            optionElement.addEventListener('click', () => this.selectOption(option, optionElement));
            this.optionsContainer.appendChild(optionElement);
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    selectOption(option, element) {
        // Remove selection from all options
        this.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select clicked option
        element.classList.add('selected');
        
        // Store answer
        this.answers[this.currentQuestion] = {
            question_id: this.quizData.questions[this.currentQuestion].id,
            selected_option_text: option.text
        };
        
        // Enable next button
        this.nextBtn.disabled = false;
    }

    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentQuestion === 0;
        this.nextBtn.disabled = !this.answers[this.currentQuestion];
        
        if (this.currentQuestion === this.totalQuestions - 1) {
            this.nextBtn.textContent = 'See Results';
        } else {
            this.nextBtn.textContent = 'Next';
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const result = this.analyzeArchetype();
        this.displayResults(result);
        this.showScreen(this.resultsScreen);
    }

    analyzeArchetype() {
        // Archetype descriptions
        const archetypeDescriptions = {
            "Pathfinder": "You seek adventure, discovery, and the road less traveled. You're drawn to exploration and finding hidden gems.",
            "Connector": "You travel to build relationships and bridge cultures. You're a social butterfly who thrives on human connection.",
            "Time Traveler": "You're fascinated by history and culture. You travel to experience the past and understand how it shapes the present.",
            "Hedonist": "You travel for pleasure, comfort, and sensory experiences. You believe in treating yourself and enjoying life's luxuries.",
            "Digital Drifter": "You combine work and wanderlust. You're a modern nomad who can work from anywhere while exploring the world.",
            "Culture Hacker": "You dive deep into local cultures and languages. You want to understand and integrate into the places you visit.",
            "Escape Artist": "You travel to disconnect and find solitude. You seek peace and quiet away from the noise of everyday life.",
            "Luxe Nomad": "You travel in style and comfort. You appreciate the finer things in life and expect quality experiences.",
            "Local Whisperer": "You have an uncanny ability to find authentic local experiences. You know where the locals go and how to blend in.",
            "Chaos Pilot": "You embrace spontaneity and unpredictability. You thrive on the unknown and love the thrill of unplanned adventures.",
            "Spiritual Nomad": "You travel to recharge, reconnect, and rediscover your inner self. You seek meaning and personal growth.",
            "Builder": "You travel to create, contribute, and leave a positive impact. You want to build something meaningful and lasting."
        };

        // Count archetype selections
        const archetypeCounts = {};
        
        this.answers.forEach(answer => {
            const question = this.quizData.questions.find(q => q.id === answer.question_id);
            if (question) {
                const option = question.options.find(opt => opt.text === answer.selected_option_text);
                if (option) {
                    archetypeCounts[option.archetype] = (archetypeCounts[option.archetype] || 0) + 1;
                }
            }
        });

        // Find archetype(s) with highest count
        const maxCount = Math.max(...Object.values(archetypeCounts));
        const primaryArchetypes = Object.keys(archetypeCounts).filter(
            archetype => archetypeCounts[archetype] === maxCount
        );

        return {
            result: primaryArchetypes,
            description: primaryArchetypes.map(archetype => archetypeDescriptions[archetype])
        };
    }

    displayResults(result) {
        this.resultsContent.innerHTML = '';
        
        result.result.forEach((archetype, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = 'archetype-result';
            resultElement.innerHTML = `
                <div class="archetype-name">${archetype}</div>
                <div class="archetype-description">${result.description[index]}</div>
            `;
            this.resultsContent.appendChild(resultElement);
        });
    }

    retakeQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.showScreen(this.startScreen);
    }

    shareResults() {
        const result = this.analyzeArchetype();
        const shareText = `I just discovered I'm a ${result.result.join(' & ')}! Take the Travel Archetype Quiz to find out your travel personality: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Travel Archetype',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard!');
            }).catch(() => {
                // Final fallback: prompt user to copy
                prompt('Copy this text to share your results:', shareText);
            });
        }
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TravelQuiz();
}); 