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
        question: 'The biggest passenger-airplane model is...?',
        correct_answer: 'Airbus-380',
        wrong_answer: 'Boeing 747'
    },

];


let right_answer = ''
let wrong_answer = ''
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
let correct = ''

//Kun lento tapahtuu, niin tulee kutsu tähän funktioon

function quicktime() {
    let question_num = Math.floor(Math.random() * questions.length);
    let header = document.querySelector('h1');
    let question_text = questions[question_num].question;
    right_answer = questions[question_num].correct_answer
    wrong_answer = questions[question_num].wrong_answer
    correct = right_answer
    header.innerHTML = question_text
    let button_rand = Math.floor(Math.random() * 2)
    if (button_rand === 1){
        button1.innerText = right_answer
        button2.innerText = wrong_answer
    }else{
        button1.innerText = wrong_answer
        button2.innerText = right_answer

    }
    console.log(question_text)
    return question_text
}

button1.addEventListener('click', function (){
    let answer = button1.innerText;

    if (answer === correct){
        // lisää 100 co2 budjettiin

        console.log("OIKEIN!!!!!!!!!!!!!!")
    } else {
        console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
    }

})

button2.addEventListener('click', function (){
    let answer = button2.innerText;

    if (answer === correct){
        // lisää 100 co2 budjettiin

        console.log("OIKEIN!!!!!!!!!!!!!!")
    } else {
        console.log("VÄÄRIN!!!!!!!!!!!!!!!!!!!!!!")
    }

})

/* function checkAnswer(){
    if (button1.innerText === right_answer){
        console.log("CORRECT1!!!!!!!!!!!!!!!!!!!!!!!!!!")
    } else {
        console.log("WRONG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    }

} */


quicktime()


// modal.style.display = "block"; tulee näkyville
// modal.style.display = "none"; poistuu näkyvistä