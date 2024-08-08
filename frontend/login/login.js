let username = document.getElementById('username')
let password = document.getElementById('password')
let login = document.getElementById('login-form')
let signup = document.getElementById('signup-button')

signup.addEventListener('click', goToLogin)
login.addEventListener('submit', loginAccount)

const URL = `https://expense-tracker-nosql-phi.vercel.app`


function goToLogin(e) {
    e.preventDefault()
    window.location.href = '../signup/signup.html'
}


async function loginAccount(e) {
    e.preventDefault()
    if (!username.value || !password.value) {
        displayMessage('Please fill all fields')
        return
    }

    const obj = {
        username: username.value,
        password: password.value
    }

    try {
        const result = await axios.post(`${URL}/user/login`, obj)
        localStorage.setItem('token', result.data.token)
        window.location.href = '../dashboard/dashboard.html';

    } 
    catch (error) {
        const err = error.response.data.message
        console.error(err)
        displayMessage(err)
    }
}


function displayMessage(x) {
    return new Promise((resolve, reject) => {
        const error = document.createElement('p')
        error.className = 'error'
        error.innerHTML = x
        login.appendChild(error)
        setTimeout(() => {
            error.remove()
            resolve()
        }, 2000)
    })
}
