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
        correct_answer: '1kg of co2',
        wrong_answer: '500g of co2'
    },

    {
        question: 'The top speed of Usain Bolt is... ',
        correct_answer: '37.6km / hour',
        wrong_answer: '54.2km / hour'
    },

    {
        question: 'How many passengers can travel with an A380?',
        correct_answer: '853 passengers',
        wrong_answer: '1378 passengers'
    },

    {
        question: 'When was the first flight flown with Airbus-380?',
        correct_answer: 'In the year 2005',
        wrong_answer: 'In the year 2010'
    },

    {
        question: 'The first airplane ever flown in the air happened in year...',
        correct_answer: '1903',
        wrong_answer: '1878'
    },

    {
        question: 'How many airplane crashes happen approximately per year?',
        correct_answer: '80',
        wrong_answer: '200'
    },

    {
        question: 'What is the top speed ( km / h ) of the fastest airplane in the world?',
        correct_answer: '3500km / hour',
        wrong_answer: '2333km / hour'
    },

    {
        question: 'What is the approximate chance of an airplane crash occurring?',
        correct_answer: '1 in 1.2 million',
        wrong_answer: '1 in 500 000'
    },

    {
        question: 'What is the approximate chance of dying in an airplane crash?',
        correct_answer: '1 in 11.7 million',
        wrong_answer: '1 in 255 million'
    },

    {
        question: 'How long does it take to directly fly with a commercial airplane from Helsinki to Australia?',
        correct_answer: '19 hours and 23 minutes',
        wrong_answer: '11 hours and 12 minutes'
    },

];



//Toinen funktio quickTime:n ylle, joka on ajastin kysymyksille.

function timeIsUp(){
    alert("Time is up, penalty has been added to your co2 fuel.")
    //tähän -200 co2 komento, joka päivittää tiedot.
    modal.style.display = "none"
}

//Kun lento tapahtuu, niin tulee kutsu tähän funktioon
function quicktime() {
    if (Math.random() < 1 / 3) {


        const modal = document.getElementById("myModal")
        modal.style.display = "block"
        let right_answer = ''
        let wrong_answer = ''
        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        let correct = ''
        let question_num = Math.floor(Math.random() * questions.length);
        let header = document.querySelector('h1');
        let question_text = questions[question_num].question;
        right_answer = questions[question_num].correct_answer
        wrong_answer = questions[question_num].wrong_answer
        correct = right_answer
        header.innerHTML = question_text

        let time = 5;
        let timerElement = document.getElementById("timer");
        timerElement.innerHTML = "Time remaining: 5 seconds";
        //document.body.appendChild(timerElement);
        let timer = setInterval(function () {
            time = time - 1;
            timerElement.innerHTML = "Time remaining: " + time + " seconds";
            if (time === -1) {
                alert("Time is up, penalty has been added to your co2 fuel.")
                //tähän -200 co2 komento, joka päivittää tiedot.
                modal.style.display = "none"
                clearInterval(timer);
            }}, 1000);



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
            clearInterval(timer);

            if (answer === correct) {
                // lisää 100 co2 budjettiin

                console.log("OIKEIN!!!!!!!!!!!!!!")
                modal.style.display = "none"
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
                modal.style.display = "none"
            }

        })

        button2.addEventListener('click', function () {
            let answer = button2.innerText;
            clearInterval(timer);

            if (answer === correct) {
                // lisää 100 co2 budjettiin

                console.log("OIKEIN!!!!!!!!!!!!!!")
                modal.style.display = "none"
            } else {
                console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
                modal.style.display = "none"
            }

        })

        return question_text


    }

}


quicktime()

//Kaikki toimii
