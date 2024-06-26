let email = document.getElementById('email')
let signup = document.getElementById('forgot-password-form')

console.log(email)
console.log(signup)

signup.addEventListener('submit', sendEmail)

async function sendEmail(e){
    e.preventDefault()
console.log(true)
    let obj = {
        email:email.value
    }

    await axios.post('http://localhost:8080/password/forgot-password', obj)
    let message = document.createElement('h3')
    message.innerHTML = 'Sent email, redirecting to login page'
    message.style.color = 'green'
    message.style.backgroundColor = 'yellow'
    signup.appendChild(message)
    setTimeout(()=>[
        message.remove(),
        window.location.href = './login.html'
    ], 3000)

}