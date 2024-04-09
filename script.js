document.addEventListener('DOMContentLoaded', function () {
    const radio123 = document.querySelectorAll('.game-setting input[type="radio"]');
    const flagImg = document.getElementById('flag-img');
    const guessInput = document.getElementById('guess-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultMsg = document.getElementById('result');
    const resetBtn = document.getElementById('reset-btn');
    const numDisplay = document.getElementById('number-answered');
    const numDisplayScore = document.getElementById('number-score');
    const allFlagsRadio = document.getElementById('all-flags');
    const hundredFlagsRadio = document.getElementById('100-flags');
    const thirtyFlagsRadio = document.getElementById('30-flags');

    let countriesData = [];
    let numberOfFlagsToShow = 0;
    let score = 0;
    let totalFlagsAnswered = 0;

    function fetchAllFlags() {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch flags');
                }
                return response.json();
            })
            .then(data => {
                countriesData = data;
                setNumberOfFlagsToShow();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function setNumberOfFlagsToShow() {
        if (allFlagsRadio.checked) {
            numberOfFlagsToShow = countriesData.length;
            submitBtn.disabled = false;
            disableRAD();
        } else if (hundredFlagsRadio.checked) {
            numberOfFlagsToShow = Math.min(100, countriesData.length);
            submitBtn.disabled = false;
            disableRAD();
        } else if (thirtyFlagsRadio.checked) {
            numberOfFlagsToShow = Math.min(30, countriesData.length);
            submitBtn.disabled = false;
            disableRAD();
        }
        fetchRandomFlag();
    }

    function disableRAD(){
        radio123.forEach(radioButton => {
            radioButton.disabled = true;
        });
    }

    function ableRAD(){
        radio123.forEach(radioButton => {
            radioButton.disabled = false;
        });
    }
    
    function fetchRandomFlag() {
        if (countriesData.length === 0 || totalFlagsAnswered >= numberOfFlagsToShow) {
            submitBtn.disabled = true;
            console.log('Score:', score);
            console.log('Total Flags Answered:', totalFlagsAnswered);
            return;
        }

        const randomIndex = Math.floor(Math.random() * countriesData.length);
        const flagUrl = countriesData[randomIndex].flags.png;
        const countryName = countriesData[randomIndex].name.common;

        flagImg.src = flagUrl;
        flagImg.dataset.country = countryName;
        flagImg.style.width = '300px';
        flagImg.style.height = '180px';

        countriesData.splice(randomIndex, 1);
        totalFlagsAnswered++;
    }

    function checkGuess() {
        const userGuess = guessInput.value.trim().toLowerCase();
        const correctAnswer = flagImg.dataset.country.toLowerCase();

        if (userGuess === correctAnswer) {
            resultMsg.textContent = 'Correct!';
            resultMsg.style.color = 'green';
            score++;
        } else {
            resultMsg.textContent = 'Incorrect. Try again.';
            resultMsg.style.color = 'red';
        }

        guessInput.value = '';

        setTimeout(() => {
            resultMsg.textContent = '';
        }, 2000);

        numDisplay.textContent = `No: ${totalFlagsAnswered}`;
        numDisplayScore.textContent = `Score: ${score}`;
        fetchRandomFlag();
    }

    const radioButtons = document.querySelectorAll('input[name="flag-setting"]');
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', setNumberOfFlagsToShow);
    });

    submitBtn.addEventListener('click', checkGuess);

    resetBtn.addEventListener('click', function () {
        score = 0;
        totalFlagsAnswered = 0;
        resultMsg.textContent = '';
        numDisplay.textContent = 'No: 0';
        numDisplayScore.textContent = 'Score: 0';
        guessInput.value = '';
        allFlagsRadio.checked = false;
        hundredFlagsRadio.checked = false;
        thirtyFlagsRadio.checked = false;
        submitBtn.disabled = true;
        ableRAD();
        setNumberOfFlagsToShow();
    });

    fetchAllFlags();
});