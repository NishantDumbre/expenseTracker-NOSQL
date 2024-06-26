let name = document.getElementById('name')
let username = document.getElementById('username')
let password = document.getElementById('password')
let email = document.getElementById('email')
let signup = document.getElementById('signup-form')
let login = document.getElementsByClassName('login')[0]


signup.addEventListener('submit', createAccount)


async function createAccount(e) {
    try {
        e.preventDefault()
        if (!name.value || !username.value || !password.value || !email.value) {
            emptyFields()
            return
        }

        let obj = {
            name: name.value,
            username: username.value,
            password: password.value,
            email:email.value
        }

        let results = await axios.get(`http://localhost:8080/signup/${obj.username}`)
        if (results.data == true) {
            alreadyExists()
            return
        }
        else {
            await axios.post('http://localhost:8080/signup', obj)
            console.log('account created successfully')
            window.location.href = './login.html'
        }
    }
    catch (error) {
        console.log(error)
    }
}

function alreadyExists() {
    let error = document.createElement('h3')
    error.style.backgroundColor = 'yellow'
    error.style.color = 'green'
    error.innerHTML = 'Username already registered'
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
        error, remove()
    }, 2000);
}