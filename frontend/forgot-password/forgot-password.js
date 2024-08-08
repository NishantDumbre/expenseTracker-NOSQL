let email = document.getElementById('email')
let signup = document.getElementById('forgot-password-form')


signup.addEventListener('submit', sendEmail)

const URL = `https:/expense-tracker-nosql-e1t1rdlux-nishantdumbres-projects.vercel.app`

async function sendEmail(e) {
    e.preventDefault()

    let obj = {
        email: email.value
    }

    try {
        console.log(true)
        const result = await axios.post(`${URL}/user/forgot-password`, obj)
        console.log(result)
        displayMessage('Email sent. Redirecting to login page')
    } catch (error) {
        displayMessage('Email not found')
    }

}


function displayMessage(text) {
    const message = document.createElement('p')
    message.innerHTML = text
    message.className = 'error'
    signup.appendChild(message)
    setTimeout(() => {
        message.remove()
        if (text !== 'Email not found') {
            window.location.href = '../login/login.html'
        }
    }, 3000)
}