const questions = [
  {
    question: 'How much is 2+2?',
    correct_answer: '4',
    wrong_answer: 'x'
  },

  {
    question: 'How much is 6*5?',
    correct_answer: '30',
    wrong_answer: 'x'
  },

];

let question_text = questions[Math.floor(Math.random() * questions.length)].question
console.log(question_text)

