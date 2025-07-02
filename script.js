class TravelQuiz {
    constructor() {
        this.allQuizData = null;
        this.quizData = null;
        this.currentQuestion = 0;
        this.answers = [];
        this.totalQuestions = 5;
        this.selectedQuiz = 'quiz1';
        
        this.initializeElements();
        this.bindEvents();
        this.loadQuizData();
    }

    initializeElements() {
        // Screens
        this.quizSelectionScreen = document.getElementById('quiz-selection-screen');
        this.startScreen = document.getElementById('start-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Navigation elements
        this.startBtn = document.getElementById('start-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.retakeBtn = document.getElementById('retake-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.backToSelectionBtn = document.getElementById('back-to-selection');
        this.newQuizBtn = document.getElementById('new-quiz-btn');
        
        // Question elements
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.progressFill = document.getElementById('progress-fill');
        
        // Results elements
        this.resultsContent = document.getElementById('results-content');
        
        // Quiz selection elements
        this.quizDescription = document.getElementById('quiz-description');
        this.personalityList = document.getElementById('personality-list');
    }

    bindEvents() {
        // Quiz selection events
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => this.selectQuiz(option.dataset.quiz));
        });
        
        // Navigation events
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.retakeBtn.addEventListener('click', () => this.retakeQuiz());
        this.shareBtn.addEventListener('click', () => this.shareResults());
        this.backToSelectionBtn.addEventListener('click', () => this.backToSelection());
        this.newQuizBtn.addEventListener('click', () => this.backToSelection());
    }

    async loadQuizData() {
        try {
            const response = await fetch('quiz.json');
            this.allQuizData = await response.json();
            this.quizData = this.allQuizData.quizzes.quiz1;
            this.totalQuestions = this.quizData.questions.length;
            this.totalQuestionsSpan.textContent = this.totalQuestions;
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert('Error loading quiz data. Please refresh the page.');
        }
    }

    selectQuiz(quizId) {
        this.selectedQuiz = quizId;
        this.quizData = this.allQuizData.quizzes[quizId];
        this.totalQuestions = this.quizData.questions.length;
        this.totalQuestionsSpan.textContent = this.totalQuestions;
        
        // Update start screen content
        this.quizDescription.textContent = this.quizData.description;
        
        // Update personality list
        this.personalityList.innerHTML = '';
        this.quizData.personalities.forEach(personality => {
            const li = document.createElement('li');
            li.textContent = personality;
            this.personalityList.appendChild(li);
        });
        
        // Show start screen
        this.showScreen(this.startScreen);
    }

    backToSelection() {
        this.currentQuestion = 0;
        this.answers = [];
        this.showScreen(this.quizSelectionScreen);
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
        const result = this.analyzePersonality();
        this.displayResults(result);
        this.showScreen(this.resultsScreen);
    }

    analyzePersonality() {
        // Personality descriptions and benefits for all quizzes
        const personalityData = {
            // Quiz 1: What Kind of Traveler Are You?
            "The Planner Pro": {
                description: "You love organized, structured travel with detailed itineraries and well-researched destinations.",
                benefits: [
                    "🎯 Maximizes your time and experiences",
                    "💰 Saves money through strategic planning",
                    "😌 Reduces travel stress and anxiety",
                    "📸 Ensures you don't miss must-see spots"
                ]
            },
            "The Social Butterfly": {
                description: "You thrive on connection, meeting new people, and creating memorable experiences through social interactions.",
                benefits: [
                    "🤝 Builds meaningful connections worldwide",
                    "🌍 Gets authentic local experiences",
                    "💬 Learns languages and cultures naturally",
                    "🎉 Creates unforgettable memories with others"
                ]
            },
            "The Explorer": {
                description: "You seek adventure, discovery, and the thrill of the unknown. You're always ready for new challenges.",
                benefits: [
                    "🗺️ Discovers hidden gems and secret spots",
                    "💪 Builds confidence and resilience",
                    "🌿 Connects with nature and outdoor adventures",
                    "📚 Learns through hands-on experiences"
                ]
            },
            "The Chiller": {
                description: "You travel to relax, unwind, and find joy in simple pleasures. You prioritize comfort and peace.",
                benefits: [
                    "🧘 Reduces stress and promotes wellness",
                    "☀️ Recharges your mind and body",
                    "🍹 Enjoys life's simple pleasures",
                    "😊 Returns home refreshed and happy"
                ]
            },
            // Quiz 2: Who's Your Travel Soulmate?
            "The Wildcard": {
                description: "You're electric. You make every trip feel legendary. You need a chill travel soulmate who grounds you but never bores you.",
                benefits: [
                    "⚡ Brings energy and excitement to every trip",
                    "🎭 Creates unforgettable moments and stories",
                    "🔥 Inspires others to step out of their comfort zone",
                    "💫 Makes every destination feel magical"
                ]
            },
            "The Anchor": {
                description: "Steady, prepared, and emotionally intelligent—you're the rock. You work best with a vibe-curator or adventurer who helps you loosen up.",
                benefits: [
                    "🪨 Provides stability and reliability",
                    "🧠 Keeps everyone organized and on track",
                    "💪 Handles challenges with grace and calm",
                    "🤝 Creates a safe space for others to thrive"
                ]
            },
            "The Spark": {
                description: "You bring beauty and fun. People want to sit near you. You thrive with someone emotionally open and down for romance or real talk.",
                benefits: [
                    "✨ Adds beauty and romance to every experience",
                    "📸 Captures perfect moments and memories",
                    "💕 Creates meaningful connections and bonds",
                    "🎨 Sees the artistic beauty in every destination"
                ]
            },
            "The Connector": {
                description: "You're the social glue—group photos, birthday surprises, dance nights. You match well with thoughtful, calm, and curious travelers.",
                benefits: [
                    "🔗 Brings people together and creates community",
                    "🎉 Organizes fun group activities and celebrations",
                    "💬 Facilitates meaningful conversations",
                    "🤗 Makes everyone feel included and valued"
                ]
            },
            // Quiz 3: Which Travel Group Is Your Vibe?
            "The Adventure Collective": {
                description: "Hikes, waterfalls, dirt roads, and GoPros—this is your lane. Think Costa Rica, Peru, Bali.",
                benefits: [
                    "🏔️ Explores challenging and exciting destinations",
                    "📹 Captures epic adventure content",
                    "💪 Builds physical and mental strength",
                    "🌿 Connects deeply with nature and outdoor experiences"
                ]
            },
            "The Vibe Seekers": {
                description: "You're here for stories, flavors, and shared playlists. You thrive in Lisbon, New Orleans, CDMX.",
                benefits: [
                    "🎵 Creates the perfect travel soundtrack",
                    "🍽️ Discovers amazing food and cultural experiences",
                    "📖 Collects stories and memories to share",
                    "🎭 Immerses in local culture and nightlife"
                ]
            },
            "The Glow-Up Gang": {
                description: "You want a luxury reset—Tulum villas, Italy sunsets, spa days. Treat yourself, always.",
                benefits: [
                    "✨ Enjoys premium travel experiences",
                    "🧖‍♀️ Prioritizes wellness and self-care",
                    "🏖️ Relaxes in beautiful, luxurious settings",
                    "💎 Creates Instagram-worthy moments"
                ]
            },
            "The Culture Crew": {
                description: "Museums, temples, street eats, and quiet appreciation. You're introspective and inspired by history.",
                benefits: [
                    "🏛️ Gains deep cultural knowledge and understanding",
                    "📚 Learns about history and traditions",
                    "🍜 Explores authentic local cuisine",
                    "🧘 Finds meaning and inspiration in travel"
                ]
            },
            "The Real Ones": {
                description: "You love people, podcasts, playlists, and van rides. You want real talk, late nights, and new friends.",
                benefits: [
                    "💬 Has deep, meaningful conversations",
                    "🎧 Enjoys shared entertainment and learning",
                    "🚐 Loves road trips and group travel",
                    "🤝 Builds genuine friendships and connections"
                ]
            }
        };

        // Count personality selections
        const personalityCounts = {};
        
        this.answers.forEach(answer => {
            const question = this.quizData.questions.find(q => q.id === answer.question_id);
            if (question) {
                const option = question.options.find(opt => opt.text === answer.selected_option_text);
                if (option) {
                    personalityCounts[option.personality] = (personalityCounts[option.personality] || 0) + 1;
                }
            }
        });

        // Find personality with highest count (3+ matching answers)
        const maxCount = Math.max(...Object.values(personalityCounts));
        let primaryPersonality = null;

        if (maxCount >= 3) {
            // Get all personalities with max count
            const topPersonalities = Object.keys(personalityCounts).filter(
                personality => personalityCounts[personality] === maxCount
            );
            
            if (topPersonalities.length === 1) {
                primaryPersonality = topPersonalities[0];
            } else {
                // Tiebreaker logic based on specific questions
                primaryPersonality = this.resolveTiebreaker(topPersonalities);
            }
        } else {
            // Default to most common if no personality has 3+ answers
            const maxCount = Math.max(...Object.values(personalityCounts));
            const topPersonalities = Object.keys(personalityCounts).filter(
                personality => personalityCounts[personality] === maxCount
            );
            primaryPersonality = topPersonalities[0];
        }

        return {
            result: primaryPersonality,
            description: personalityData[primaryPersonality].description,
            benefits: personalityData[primaryPersonality].benefits
        };
    }

    resolveTiebreaker(personalities) {
        // Check question 1 (planning preference) for tiebreaker
        const planningAnswer = this.answers.find(answer => 
            this.quizData.questions.find(q => q.id === answer.question_id)?.question.includes("planning")
        );
        
        if (planningAnswer) {
            const question = this.quizData.questions.find(q => q.id === planningAnswer.question_id);
            const option = question.options.find(opt => opt.text === planningAnswer.selected_option_text);
            
            if (option.personality && personalities.includes(option.personality)) {
                return option.personality;
            }
        }
        
        // If no clear tiebreaker, return first personality
        return personalities[0];
    }

    displayResults(result) {
        this.resultsContent.innerHTML = `
            <div class="personality-result">
                <div class="personality-name">${result.result}</div>
                <div class="personality-description">${result.description}</div>
                <div class="personality-benefits">
                    <h4>Why This Works For You:</h4>
                    <ul>
                        ${result.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    retakeQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.showScreen(this.startScreen);
    }

    shareResults() {
        const result = this.analyzePersonality();
        const quizTitle = this.quizData.title;
        const shareText = `I just discovered I'm ${result.result} in the "${quizTitle}" quiz! Take the Travel Personality Quiz to find out your travel style: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Travel Personality',
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