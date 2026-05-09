// Навигация по разделам
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.main-nav a');
    const interestCards = document.querySelectorAll('.interest-card');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    // Мобильное меню
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('show');
    });

    // Функция переключения разделов
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Закрываем мобильное меню после выбора
        mainNav.classList.remove('show');
    }

    // Навигация по клику на ссылки меню
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Навигация по карточкам интересов на главной
    interestCards.forEach(card => {
        card.addEventListener('click', () => {
            const sectionId = card.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Игровая логика
    setupGame('choices', 'hintMessage', 'nextBtn', 'storyText', [
        { text: 'are', correct: true },
        { text: 'is', correct: false },
        { text: 'am', correct: false }
    ], 'Ты выбрал правильную форму глагола! Тигр пропускает тебя дальше.', 'are');

    setupGame('choices2', 'hintMessage2', 'nextBtn2', 'storyText2', [
        { text: 'was', correct: false },
        { text: 'were', correct: true },
        { text: 'are', correct: false }
    ], 'Правильно! Шерлок доволен твоим английским.', 'were');

    function setupGame(choicesId, hintId, nextBtnId, storyId, options, successMessage, correctAnswer) {
        const choices = document.getElementById(choicesId);
        const hintMessage = document.getElementById(hintId);
        const nextBtn = document.getElementById(nextBtnId);
        const storyText = document.getElementById(storyId);

        if (!choices) return;

        const buttons = choices.querySelectorAll('.choice-btn');
        
        buttons.forEach((btn, index) => {
            btn.textContent = options[index].text;
            btn.dataset.correct = options[index].correct;
            
            btn.addEventListener('click', function() {
                // Блокируем кнопки после выбора
                buttons.forEach(b => b.disabled = true);
                
                if (this.dataset.correct === 'true') {
                    this.classList.add('correct');
                    hintMessage.style.display = 'block';
                    hintMessage.textContent = successMessage;
                    hintMessage.style.backgroundColor = '#4CAF50';
                    nextBtn.style.display = 'block';
                } else {
                    this.classList.add('wrong');
                    hintMessage.style.display = 'block';
                    hintMessage.textContent = 'Ой! Неправильно. Попробуй еще раз!';
                    hintMessage.style.backgroundColor = '#FF6B6B';
                    
                    // Разблокируем кнопки через 2 секунды
                    setTimeout(() => {
                        buttons.forEach(b => {
                            b.disabled = false;
                            b.classList.remove('wrong', 'correct');
                        });
                        hintMessage.style.display = 'none';
                    }, 2000);
                }
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (storyText) {
                    if (storyId === 'storyText') {
                        storyText.textContent = 'Ты прошел мимо тигра и нашел сокровища! Поздравляю! 🎉';
                    } else {
                        storyText.textContent = 'Шерлок приглашает тебя стать его помощником! 🕵️';
                    }
                }
                nextBtn.style.display = 'none';
                choices.style.display = 'none';
            });
        }
    }

    // Поиск по шпаргалке
    const searchBtn = document.getElementById('searchBtn');
    const topicSearch = document.getElementById('topicSearch');
    const cheatsheetResult = document.getElementById('cheatsheetResult');

    const schemas = {
        'present simple': {
            title: 'Present Simple',
            scheme: '📅 Действия, которые происходят всегда/обычно',
            details: [
                'I/You/We/They + V1',
                'He/She/It + V1 + s/es',
                '❓ Do/Does + подлежащее + V1?',
                '❌ don\'t/doesn\'t + V1'
            ]
        },
        'past simple': {
            title: 'Past Simple',
            scheme: '⌛ Действия, которые произошли в прошлом',
            details: [
                'Правильные глаголы: V + ed',
                'Неправильные глаголы: 2 форма',
                '❓ Did + подлежащее + V1?',
                '❌ didn\'t + V1'
            ]
        },
        'prepositions': {
            title: 'Prepositions of Place',
            scheme: '📍 Предлоги места',
            details: [
                'IN - внутри (in the room)',
                'ON - на поверхности (on the table)',
                'UNDER - под (under the bed)',
                'NEXT TO - рядом (next to the window)'
            ]
        }
    };

    searchBtn.addEventListener('click', () => {
        const query = topicSearch.value.toLowerCase().trim();
        
        if (query === '') {
            alert('Введите тему для поиска!');
            return;
        }

        let found = false;
        for (let key in schemas) {
            if (query.includes(key) || key.includes(query)) {
                showSchema(schemas[key]);
                found = true;
                break;
            }
        }

        if (!found) {
            cheatsheetResult.style.display = 'block';
            cheatsheetResult.innerHTML = `
                <div class="schema-card">
                    <h3 class="schema-title">🤔 Хм... тема не найдена</h3>
                    <p>Попробуй поискать: Present Simple, Past Simple или Prepositions</p>
                </div>
            `;
        }
    });

    topicSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    function showSchema(schema) {
        cheatsheetResult.style.display = 'block';
        
        let detailsHTML = '';
        schema.details.forEach(detail => {
            detailsHTML += `<div class="step">${detail}</div>`;
        });

        cheatsheetResult.innerHTML = `
            <div class="schema-card">
                <h3 class="schema-title">${schema.scheme}</h3>
                <div class="explanation" style="margin: 20px 0;">
                    ${detailsHTML}
                </div>
                <div class="schema-buttons">
                    <button class="schema-btn download" onclick="downloadSchema('${schema.title}')">📥 Скачать</button>
                    <button class="schema-btn share" onclick="shareSchema('${schema.title}')">📤 Отправить</button>
                </div>
            </div>
        `;
    }

    // Помощь с заданием
    const explainBtns = document.querySelectorAll('.explain-btn');
    
    explainBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseId = this.dataset.exercise;
            const explanation = document.getElementById(`explanation${exerciseId}`);
            
            if (explanation.style.display === 'none' || explanation.style.display === '') {
                explanation.style.display = 'block';
                this.textContent = 'Скрыть объяснение';
            } else {
                explanation.style.display = 'none';
                this.textContent = 'Объясни';
            }
        });
    });
});

// Глобальные функции для кнопок шпаргалки
function downloadSchema(title) {
    alert(`Схема "${title}" скачивается... (в реальном проекте здесь был бы PDF)`);
}

function shareSchema(title) {
    alert(`Схема "${title}" отправляется... (в реальном проекте здесь была бы интеграция с соцсетями)`);
}