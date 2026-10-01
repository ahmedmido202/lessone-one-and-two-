/* ========================================
   Application Elements
======================================== */

const app =
    document.getElementById("app");

const homeButton =
    document.getElementById("homeButton");


/* ========================================
   Application State
======================================== */

let currentLesson = null;

let currentQuestionIndex = 0;

let score = 0;

let answered = false;


/* ========================================
   Home Button
======================================== */

homeButton.addEventListener(
    "click",
    showHome
);


/* ========================================
   Home Page
======================================== */

function showHome() {

    currentLesson = null;

    app.innerHTML = `
        <section class="hero">

            <div class="hero-content">

                <span class="hero-badge">
                    ✨ مراجعة الفصل الأول
                </span>

                <h2>
                    أهلاً بيك 👋
                    <br>

                    أنا
                    <span>أحمد خالد</span>
                </h2>

                <p class="hero-description">
                    معاك هنا علشان نحل أكبر قدر من الأسئلة،
                    وتكون ضامن بإذن الله الفصل الأول كاملًا.
                    هنحل اختيار من متعدد، صح وغلط،
                    وأسئلة مقالية بطريقة بسيطة ومنظمة.
                </p>

                <div class="hero-actions">

                    <button
                        class="primary-button"
                        onclick="showLessons()"
                    >
                        ابدأ الحل 🚀
                    </button>

                </div>

                <div class="stats">

                    <div class="stat">
                        <strong>2</strong>
                        <span>دروس</span>
                    </div>

                    <div class="stat">
                        <strong>MCQ</strong>
                        <span>اختيار من متعدد</span>
                    </div>

                    <div class="stat">
                        <strong>✓ / ✕</strong>
                        <span>تصحيح فوري</span>
                    </div>

                </div>

            </div>


            <div class="instructor-card">

                <img
                    src="ahmed.jpg"
                    alt="أحمد خالد"
                >

                <div class="instructor-label">

                    <strong>
                        أحمد خالد
                    </strong>

                    <span>
                        معاك لحد ما تقفل الفصل 💪
                    </span>

                </div>

            </div>

        </section>
    `;
}


/* ========================================
   Lessons Page
======================================== */

function showLessons() {

    let cards = "";


    LESSONS.forEach(
        function (lesson) {

            cards += `
                <article
                    class="lesson-card"
                    onclick="startLesson(${lesson.id})"
                >

                    <div class="lesson-number">
                        ${lesson.id}
                    </div>

                    <h3>
                        ${lesson.title}
                    </h3>

                    <p>
                        ${lesson.description}
                    </p>

                </article>
            `;
        }
    );


    app.innerHTML = `
        <section class="lessons-section">

            <div class="section-title">

                <h2>
                    اختار الدرس 🎯
                </h2>

                <p>
                    اختار الدرس وابدأ التدريب.
                    الإجابة بتظهر صح أو غلط فورًا.
                </p>

            </div>

            <div class="lesson-grid">
                ${cards}
            </div>

        </section>
    `;
}


/* ========================================
   Start Lesson
======================================== */

function startLesson(lessonId) {

    currentLesson =
        LESSONS.find(
            function (lesson) {
                return lesson.id === lessonId;
            }
        );


    currentQuestionIndex = 0;

    score = 0;

    answered = false;


    showQuestion();
}


/* ========================================
   Show Question
======================================== */

function showQuestion() {

    const question =
        currentLesson.questions[
            currentQuestionIndex
        ];


    const totalQuestions =
        currentLesson.questions.length;


    const progress =
        (
            (currentQuestionIndex + 1)
            /
            totalQuestions
        ) * 100;


    let typeText =
        "اختيار من متعدد";


    if (question.type === "trueFalse") {

        typeText =
            "صح أم خطأ";
    }


    if (question.type === "essay") {

        typeText =
            "سؤال مقالي";
    }


    app.innerHTML = `
        <section class="quiz-container">

            <div class="quiz-top">

                <strong>
                    ${currentLesson.title}
                </strong>

                <span class="progress-text">
                    سؤال
                    ${currentQuestionIndex + 1}
                    من
                    ${totalQuestions}
                </span>

            </div>


            <div class="progress-track">

                <div
                    class="progress-bar"
                    style="width: ${progress}%"
                >
                </div>

            </div>


            <article class="question-card">

                <span class="question-type">
                    ${typeText}
                </span>

                <h2 class="question-title">
                    ${question.question}
                </h2>

                <div
                    id="answerArea"
                    class="answers"
                >
                </div>

                <div id="feedbackArea">
                </div>

                <div id="navigationArea">
                </div>

            </article>

        </section>
    `;


    if (question.type === "essay") {

        showEssayQuestion(question);

    } else {

        showAnswerButtons(question);
    }
}


/* ========================================
   Answer Buttons
======================================== */

function showAnswerButtons(question) {

    const answerArea =
        document.getElementById(
            "answerArea"
        );


    question.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    selectAnswer(
                        index,
                        button
                    );
                }
            );


            answerArea.appendChild(
                button
            );
        }
    );
}


/* ========================================
   Select Answer
======================================== */

function selectAnswer(
    selectedIndex,
    selectedButton
) {

    if (answered) {

        return;
    }


    answered = true;


    const question =
        currentLesson.questions[
            currentQuestionIndex
        ];


    const buttons =
        document.querySelectorAll(
            ".answer"
        );


    const correctIndex =
        question.answer;


    buttons.forEach(
        function (button) {

            button.disabled = true;
        }
    );


    buttons[
        correctIndex
    ].classList.add(
        "correct"
    );


    const feedbackArea =
        document.getElementById(
            "feedbackArea"
        );


    if (
        selectedIndex ===
        correctIndex
    ) {

        score++;


        feedbackArea.innerHTML = `
            <div class="feedback correct">
                ✅ إجابة صحيحة.. عاش!
            </div>
        `;

    } else {

        selectedButton.classList.add(
            "wrong"
        );


        feedbackArea.innerHTML = `
            <div class="feedback wrong">
                ❌ الإجابة غلط.
                الإجابة الصحيحة موضحة باللون الأخضر.
            </div>
        `;
    }


    showNextButton();
}


/* ========================================
   Next Button
======================================== */

function showNextButton() {

    const navigationArea =
        document.getElementById(
            "navigationArea"
        );


    const isLastQuestion =
        currentQuestionIndex ===
        currentLesson.questions.length - 1;


    navigationArea.innerHTML = `
        <div class="quiz-navigation">

            <button
                class="primary-button"
                onclick="nextQuestion()"
            >

                ${
                    isLastQuestion
                        ? "عرض النتيجة 🏆"
                        : "السؤال التالي ←"
                }

            </button>

        </div>
    `;
}


/* ========================================
   Next Question
======================================== */

function nextQuestion() {

    const isLastQuestion =
        currentQuestionIndex ===
        currentLesson.questions.length - 1;


    if (isLastQuestion) {

        showResult();

        return;
    }


    currentQuestionIndex++;

    answered = false;

    showQuestion();
}


/* ========================================
   Essay Question
======================================== */

function showEssayQuestion(question) {

    const answerArea =
        document.getElementById(
            "answerArea"
        );


    answerArea.innerHTML = `
        <button
            class="secondary-button"
            onclick="showModelAnswer()"
        >
            إظهار الإجابة النموذجية 👀
        </button>
    `;
}


/* ========================================
   Model Answer
   المقالي يتحسب صح تلقائيًا
======================================== */

function showModelAnswer() {

    if (answered) {

        return;
    }


    answered = true;


    /* ========================================
       احتساب السؤال المقالي كإجابة صحيحة
    ======================================== */

    score++;


    const question =
        currentLesson.questions[
            currentQuestionIndex
        ];


    const feedbackArea =
        document.getElementById(
            "feedbackArea"
        );


    feedbackArea.innerHTML = `
        <div class="feedback correct">
            ✅ تم احتساب السؤال المقالي كإجابة صحيحة
        </div>

        <div class="model-answer">

            <strong>
                الإجابة النموذجية:
            </strong>

            <br><br>

            ${question.modelAnswer}

        </div>
    `;


    showNextButton();
}


/* ========================================
   Result
======================================== */

function showResult() {

    const total =
        currentLesson.questions.length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    let message =
        "كمل تدريب، وهتتحسن بسرعة 💪";


    let icon =
        "📚";


    if (percentage >= 80) {

        message =
            "ممتاز جدًا! أنت ماسك الدرس كويس 🔥";

        icon =
            "🏆";

    } else if (percentage >= 60) {

        message =
            "شغل حلو جدًا، راجع الغلطات وجرب تاني 👏";

        icon =
            "⭐";
    }


    app.innerHTML = `
        <section class="result-card">

            <div class="result-icon">
                ${icon}
            </div>

            <h2>
                خلصنا ${currentLesson.title}!
            </h2>

            <p>
                ${message}
            </p>

            <div class="score">
                ${score} / ${total}
            </div>

            <p>
                النسبة:
                ${percentage}%
            </p>

            <div class="hero-actions">

                <button
                    class="primary-button"
                    onclick="startLesson(${currentLesson.id})"
                >
                    حل الدرس تاني 🔄
                </button>

                <button
                    class="secondary-button"
                    onclick="showLessons()"
                >
                    اختار درس تاني
                </button>

            </div>

        </section>
    `;
}


/* ========================================
   Start Website
======================================== */

showHome();
