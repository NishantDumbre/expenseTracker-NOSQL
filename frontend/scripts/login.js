let username = document.getElementById('username')
let password = document.getElementById('password')
let login = document.getElementById('login-form')
let signup = document.getElementById('signup-button')

signup.addEventListener('click', goToLogin)
login.addEventListener('submit', loginAccount)


function goToLogin(e) {
    e.preventDefault()
    window.location.href = '../views/signup.html'
}


async function loginAccount(e) {
    try {
        e.preventDefault()
        if (!username.value || !password.value) {
            emptyFields()
            return
        }
        let obj = {
            username: username.value,
            password: password.value
        }

        let result = await axios.post('http://localhost:8080/user/login', obj)
        console.log(result)
        localStorage.setItem('token', result.data.token)
        window.location.href = '../views/dashboard.html';
    }
    catch (err) {
        let error = err.response.data.error
        console.log(error)
        errorMessage(error)
    }
}


function errorMessage(x) {
    let message
    if (x == 'userNotFound') {
        message = 'User does not exist'
    }
    else if (x == 'passwordWrong') {
        message = 'User not authorized. Incorrect Password'
    }
    let error = document.createElement('h3')
    error.style.backgroundColor = 'yellow'
    error.style.color = 'green'
    error.innerHTML = message
    login.appendChild(error)
    setTimeout(() => {
        error.remove()
    }, 2000)
}


function emptyFields() {
    let error = document.createElement('h3')
    error.style.backgroundColor = 'yellow'
    error.style.color = 'green'
    error.innerHTML = 'Please fill all fields'
    login.appendChild(error)
    setTimeout(() => {
        error.remove()
    }, 2000);
}