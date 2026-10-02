/* ========================================
   Application Elements
======================================== */

const app = document.getElementById("app");

const homeButton = document.getElementById("homeButton");


/* ========================================
   Supabase
======================================== */

const SUPABASE_URL =
    "https://zzcszoapcijodnleocql.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_spsorj1_wo9bI1okDLaciA_LyiFarZo";

let supabaseClient = null;

if (
    typeof supabase !== "undefined"
) {

    supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
}


/* ========================================
   Student
======================================== */

let studentName =
    localStorage.getItem(
        "student-name"
    ) || "";


/* ========================================
   Application State
======================================== */

let currentLesson = null;

let currentQuestionIndex = 0;

let score = 0;

let answered = false;


/* ========================================
   Theme
   Dark / Light Mode
======================================== */

function getSavedTheme() {

    const savedTheme =
        localStorage.getItem("quiz-theme");

    if (savedTheme) {
        return savedTheme;
    }

    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {
        return "dark";
    }

    return "light";
}


function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        "quiz-theme",
        theme
    );

    updateThemeButton();
}


function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute(
            "data-theme"
        ) || "light";

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    applyTheme(newTheme);
}


function updateThemeButton() {

    const themeButton =
        document.getElementById(
            "themeToggle"
        );

    if (!themeButton) {
        return;
    }

    const currentTheme =
        document.documentElement.getAttribute(
            "data-theme"
        );

    if (currentTheme === "dark") {

        themeButton.innerHTML = `
            <span class="theme-icon">
                ☀️
            </span>

            <span class="theme-text">
                الوضع الفاتح
            </span>
        `;

        themeButton.setAttribute(
            "aria-label",
            "تفعيل الوضع الفاتح"
        );

    } else {

        themeButton.innerHTML = `
            <span class="theme-icon">
                🌙
            </span>

            <span class="theme-text">
                الوضع الداكن
            </span>
        `;

        themeButton.setAttribute(
            "aria-label",
            "تفعيل الوضع الداكن"
        );
    }
}


/* ========================================
   Create Theme Button
======================================== */

function createThemeButton() {

    if (
        document.getElementById(
            "themeToggle"
        )
    ) {
        return;
    }

    const themeButton =
        document.createElement(
            "button"
        );

    themeButton.id =
        "themeToggle";

    themeButton.className =
        "theme-toggle";

    themeButton.type =
        "button";

    themeButton.addEventListener(
        "click",
        toggleTheme
    );

    document.body.appendChild(
        themeButton
    );

    updateThemeButton();
}


/* ========================================
   Home Button
======================================== */

if (homeButton) {

    homeButton.addEventListener(
        "click",
        showHome
    );
}


/* ========================================
   Page Transition
======================================== */

function renderPage(content) {

    app.classList.remove(
        "page-enter"
    );

    app.innerHTML = content;

    void app.offsetWidth;

    app.classList.add(
        "page-enter"
    );
}


/* ========================================
   Student Name Screen
======================================== */

function showStudentNameScreen() {

    const content = `
        <section class="student-welcome">

            <div class="student-welcome-card">

                <div class="student-welcome-icon">
                    👋
                </div>

                <span class="hero-badge">
                    AI Quiz
                </span>

                <h2>
                    أهلاً يا بطل 🔥
                </h2>

                <p>
                    أتشرف بيك ❤️
                    <br>
                    اسمك إيه علشان نبدأ؟
                </p>

                <form
                    id="studentNameForm"
                    class="student-name-form"
                >

                    <input
                        id="studentNameInput"
                        class="student-name-input"
                        type="text"
                        placeholder="اكتب اسمك هنا..."
                        autocomplete="name"
                        maxlength="60"
                        required
                    >

                    <p
                        id="studentNameError"
                        class="student-name-error"
                        aria-live="polite"
                    ></p>

                    <button
                        id="studentNameButton"
                        class="primary-button"
                        type="submit"
                    >
                        يلا نبدأ 🚀
                    </button>

                </form>

                <small class="student-privacy">
                    هنستخدم اسمك فقط لتسجيل دخولك للمراجعة.
                </small>

            </div>

        </section>
    `;

    renderPage(content);

    const form =
        document.getElementById(
            "studentNameForm"
        );

    const input =
        document.getElementById(
            "studentNameInput"
        );

    if (input) {

        setTimeout(
            function () {
                input.focus();
            },
            150
        );
    }

    if (form) {

        form.addEventListener(
            "submit",
            handleStudentName
        );
    }
}


/* ========================================
   Save Student Name
======================================== */

async function handleStudentName(event) {

    event.preventDefault();

    const input =
        document.getElementById(
            "studentNameInput"
        );

    const button =
        document.getElementById(
            "studentNameButton"
        );

    const errorArea =
        document.getElementById(
            "studentNameError"
        );

    if (!input) {
        return;
    }

    const name =
        input.value.trim();

    if (
        name.length < 2
    ) {

        if (errorArea) {

            errorArea.textContent =
                "اكتب اسمك الأول يا بطل 👀";
        }

        input.focus();

        return;
    }

    if (
        name.length > 60
    ) {

        if (errorArea) {

            errorArea.textContent =
                "الاسم طويل جدًا.";
        }

        return;
    }

    if (errorArea) {

        errorArea.textContent = "";
    }

    if (button) {

        button.disabled = true;

        button.textContent =
            "ثواني يا بطل... ⏳";
    }

    try {

        if (!supabaseClient) {

            throw new Error(
                "Supabase is not available"
            );
        }

        const {
            error
        } =
            await supabaseClient
                .from("students")
                .insert([
                    {
                        name: name
                    }
                ]);

        if (error) {

            throw error;
        }

        studentName = name;

        localStorage.setItem(
            "student-name",
            studentName
        );

        showHome();

    } catch (error) {

        console.error(
            "Student registration error:",
            error
        );

        if (errorArea) {

            errorArea.textContent =
                "حصلت مشكلة بسيطة في تسجيل الاسم. جرّب تاني.";
        }

        if (button) {

            button.disabled = false;

            button.textContent =
                "حاول تاني 🔄";
        }
    }
}


/* ========================================
   Home Page
======================================== */

function showHome() {

    currentLesson = null;

    const welcomeText =
        studentName
            ? `أهلاً يا ${escapeHTML(studentName)} 👋`
            : "أهلاً بيك 👋";

    const content = `
        <section class="hero">

            <div class="hero-content">

                <span class="hero-badge">
                    ✨ مراجعة الفصل الأول
                </span>

                <h2>
                    ${welcomeText}
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
                        <strong>
                            ${LESSONS.length}
                        </strong>

                        <span>
                            دروس
                        </span>
                    </div>

                    <div class="stat">
                        <strong>
                            MCQ
                        </strong>

                        <span>
                            اختيار من متعدد
                        </span>
                    </div>

                    <div class="stat">
                        <strong>
                            ✓ / ✕
                        </strong>

                        <span>
                            تصحيح فوري
                        </span>
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

    renderPage(content);
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

                    <div class="lesson-action">
                        ابدأ التدريب
                        <span>←</span>
                    </div>

                </article>
            `;
        }
    );

    const content = `
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

    renderPage(content);
}


/* ========================================
   Start Lesson
======================================== */

function startLesson(lessonId) {

    currentLesson =
        LESSONS.find(
            function (lesson) {

                return (
                    lesson.id ===
                    lessonId
                );
            }
        );

    if (!currentLesson) {
        return;
    }

    currentQuestionIndex = 0;

    score = 0;

    answered = false;

    showQuestion();
}


/* ========================================
   Show Question
======================================== */

function showQuestion() {

    if (!currentLesson) {
        return;
    }

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

    if (
        question.type ===
        "trueFalse"
    ) {

        typeText =
            "صح أم خطأ";
    }

    if (
        question.type ===
        "essay"
    ) {

        typeText =
            "سؤال مقالي";
    }

    const content = `
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


            <div
                class="progress-track"
                aria-label="نسبة التقدم"
            >

                <div
                    class="progress-bar"
                    style="width: ${progress}%"
                >
                </div>

            </div>


            <article
                class="question-card question-enter"
            >

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

                <div
                    id="feedbackArea"
                    aria-live="polite"
                >
                </div>

                <div
                    id="navigationArea"
                >
                </div>

            </article>

        </section>
    `;

    renderPage(content);

    if (
        question.type ===
        "essay"
    ) {

        showEssayQuestion(
            question
        );

    } else {

        showAnswerButtons(
            question
        );
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

    if (!answerArea) {
        return;
    }

    question.options.forEach(
        function (
            option,
            index
        ) {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "answer";

            button.type =
                "button";

            button.textContent =
                option;

            button.style.setProperty(
                "--answer-delay",
                `${index * 60}ms`
            );

            button.classList.add(
                "answer-enter"
            );

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

            button.disabled =
                true;
        }
    );

    const correctButton =
        buttons[
            correctIndex
        ];

    if (correctButton) {

        correctButton.classList.add(
            "correct",
            "correct-pop"
        );
    }

    const feedbackArea =
        document.getElementById(
            "feedbackArea"
        );

    if (
        selectedIndex ===
        correctIndex
    ) {

        score++;

        if (selectedButton) {

            selectedButton.classList.add(
                "answer-success"
            );
        }

        feedbackArea.innerHTML = `
            <div
                class="
                    feedback
                    correct
                    feedback-enter
                "
            >
                <span class="feedback-icon">
                    ✓
                </span>

                <span>
                    إجابة صحيحة.. عاش! 🔥
                </span>
            </div>
        `;

    } else {

        if (selectedButton) {

            selectedButton.classList.add(
                "wrong",
                "wrong-shake"
            );
        }

        feedbackArea.innerHTML = `
            <div
                class="
                    feedback
                    wrong
                    feedback-enter
                "
            >
                <span class="feedback-icon">
                    ✕
                </span>

                <span>
                    الإجابة غلط.
                    الإجابة الصحيحة موضحة
                    باللون الأخضر.
                </span>
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

    if (!navigationArea) {
        return;
    }

    const isLastQuestion =
        currentQuestionIndex ===
        currentLesson.questions.length - 1;

    navigationArea.innerHTML = `
        <div
            class="
                quiz-navigation
                navigation-enter
            "
        >

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

    const questionCard =
        document.querySelector(
            ".question-card"
        );

    if (questionCard) {

        questionCard.classList.add(
            "question-exit"
        );

        setTimeout(
            function () {

                currentQuestionIndex++;

                answered = false;

                showQuestion();
            },
            180
        );

    } else {

        currentQuestionIndex++;

        answered = false;

        showQuestion();
    }
}


/* ========================================
   Essay Question
======================================== */

function showEssayQuestion(
    question
) {

    const answerArea =
        document.getElementById(
            "answerArea"
        );

    if (!answerArea) {
        return;
    }

    answerArea.innerHTML = `
        <button
            class="
                secondary-button
                answer-enter
            "
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

    score++;

    const question =
        currentLesson.questions[
            currentQuestionIndex
        ];

    const feedbackArea =
        document.getElementById(
            "feedbackArea"
        );

    if (!feedbackArea) {
        return;
    }

    feedbackArea.innerHTML = `
        <div
            class="
                feedback
                correct
                feedback-enter
            "
        >
            <span class="feedback-icon">
                ✓
            </span>

            <span>
                تم احتساب السؤال المقالي
                كإجابة صحيحة
            </span>
        </div>

        <div
            class="
                model-answer
                model-answer-enter
            "
        >

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

    if (
        percentage >= 80
    ) {

        message =
            "ممتاز جدًا! أنت ماسك الدرس كويس 🔥";

        icon =
            "🏆";

    } else if (
        percentage >= 60
    ) {

        message =
            "شغل حلو جدًا، راجع الغلطات وجرب تاني 👏";

        icon =
            "⭐";
    }

    const safeStudentName =
        escapeHTML(studentName);

    const content = `
        <section
            class="
                result-card
                result-enter
            "
        >

            <div class="result-icon">
                ${icon}
            </div>

            <h2>
                عاش ${safeStudentName || "يا بطل"}! 🔥
                <br>
                خلصنا
                ${currentLesson.title}!
            </h2>

            <p>
                ${message}
            </p>

            <div class="score">
                ${score} / ${total}
            </div>

            <p class="result-percentage">
                النسبة:
                <strong>
                    ${percentage}%
                </strong>
            </p>

            <div class="hero-actions">

                <button
                    class="primary-button"
                    onclick="
                        startLesson(
                            ${currentLesson.id}
                        )
                    "
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

    renderPage(content);

    if (
        percentage >= 80
    ) {

        setTimeout(
            launchCelebration,
            250
        );
    }
}


/* ========================================
   Celebration
======================================== */

function launchCelebration() {

    const celebration =
        document.createElement(
            "div"
        );

    celebration.className =
        "celebration";

    celebration.setAttribute(
        "aria-hidden",
        "true"
    );

    const symbols = [
        "✨",
        "🎉",
        "⭐",
        "🔥",
        "🏆"
    ];

    for (
        let i = 0;
        i < 22;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.className =
            "celebration-particle";

        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.setProperty(
            "--fall-delay",
            `${Math.random() * 0.7}s`
        );

        particle.style.setProperty(
            "--fall-duration",
            `${
                1.8 +
                Math.random() * 1.2
            }s`
        );

        particle.style.setProperty(
            "--particle-size",
            `${
                16 +
                Math.random() * 14
            }px`
        );

        celebration.appendChild(
            particle
        );
    }

    document.body.appendChild(
        celebration
    );

    setTimeout(
        function () {

            celebration.remove();
        },
        4000
    );
}


/* ========================================
   Escape HTML
   حماية الاسم قبل عرضه داخل الصفحة
======================================== */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        value || "";

    return element.innerHTML;
}


/* ========================================
   Keyboard Support
======================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            answered &&
            currentLesson
        ) {

            const nextButton =
                document.querySelector(
                    "#navigationArea .primary-button"
                );

            if (nextButton) {

                nextButton.click();
            }
        }
    }
);


/* ========================================
   Reduced Motion
======================================== */

function userPrefersReducedMotion() {

    return (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    );
}


/* ========================================
   Start Website
======================================== */

applyTheme(
    getSavedTheme()
);

createThemeButton();

/*
   أول مرة على الجهاز:
   نسأل الطالب عن اسمه.

   لو الاسم محفوظ بالفعل:
   يدخل الموقع مباشرة.
*/

if (studentName) {

    showHome();

} else {

    showStudentNameScreen();
}
