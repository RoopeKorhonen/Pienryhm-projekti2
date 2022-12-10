const questions = [
    {
        question: 'How much is 2+2?',
        correct_answer: '4',
        wrong_answer: '2'
    },

    {
        question: 'How much is 6*5?',
        correct_answer: '30',
        wrong_answer: '36'
    },

    {
        question: 'The biggest passenger-airplane model is...',
        correct_answer: 'Airbus-380',
        wrong_answer: 'Boeing 747'
    },

    {
        question: 'The sum of -5 + 7 is...',
        correct_answer: '2',
        wrong_answer: '-2'
    },

    {
        question: 'The approximate altitude for passenger-airplanes to fly at is...',
        correct_answer: '11km',
        wrong_answer: '10km'
    },

    {
        question: 'The distance of the moon from earth is...',
        correct_answer: '384 400km',
        wrong_answer: '121 200km'
    },

    {
        question: 'How many meters per second does Airbus-380 travel at maximum speed?',
        correct_answer: '329 m/s',
        wrong_answer: '1300 m/s'
    },

    {
        question: 'How many seconds is in one hour?',
        correct_answer: '3600 seconds',
        wrong_answer: '36 000 seconds'
    },

    {
        question: 'The multipliction of 10*11 is...',
        correct_answer: '110',
        wrong_answer: '111'
    },

    {
        question: 'The square of 49 is...',
        correct_answer: '7',
        wrong_answer: '8'
    },

    {
        question: 'The real time amount of airplanes in the air right now is estimated to be around at...',
        correct_answer: '8000',
        wrong_answer: '2000'
    },

    {
        question: 'Flying from Helsinki to Newyork will approximately result co2 fumes per person... ',
        correct_answer: '500g of co2',
        wrong_answer: '1kg of co2'
    },

];


//Kun lento tapahtuu, niin tulee kutsu tähän funktioon

function quicktime() {
    let right_answer = ''
    let wrong_answer = ''
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    let correct = ''
    if (Math.random() < 1 / 3) {
        let question_num = Math.floor(Math.random() * questions.length);
        let header = document.querySelector('h1');
        let question_text = questions[question_num].question;
        right_answer = questions[question_num].correct_answer
        wrong_answer = questions[question_num].wrong_answer
        correct = right_answer
        header.innerHTML = question_text
        let button_rand = Math.floor(Math.random() * 2)
        if (button_rand === 1) {
            button1.innerText = right_answer
            button2.innerText = wrong_answer
        } else {
            button1.innerText = wrong_answer
            button2.innerText = right_answer

        }
        console.log(question_text)
        button1.addEventListener('click', function () {
            let answer = button1.innerText;

            if (answer === correct) {
                // lisää 100 co2 budjettiin

                console.log("OIKEIN!!!!!!!!!!!!!!")
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
            }

        })

        button2.addEventListener('click', function () {
            let answer = button2.innerText;

            if (answer === correct) {
                // lisää 100 co2 budjettiin

                console.log("OIKEIN!!!!!!!!!!!!!!")
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
            }

        })
        return question_text

    }

}


quicktime()


// modal.style.display = "block"; tulee näkyville
// modal.style.display = "none"; poistuu näkyvistä