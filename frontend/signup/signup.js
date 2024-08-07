let name = document.getElementById('name')
let username = document.getElementById('username')
let password = document.getElementById('password')
let email = document.getElementById('email')
let signup = document.getElementById('signup-form')
let login = document.getElementsByClassName('login')[0]

signup.addEventListener('submit', createAccount)

const URL = `https://expense-tracker-nosql-e1t1rdlux-nishantdumbres-projects.vercel.app`


async function createAccount(e) {
    e.preventDefault()
    if (!name.value || !username.value || !password.value || !email.value) {
        await displayMessage('Please fill all fields')
        return
    }

    let obj = {
        username: username.value,
        email: email.value
    }

    try {
        const result = await axios.post(`${URL}/user/check-signup-creds`, obj)
        if (result.data.success === false) {
            await displayMessage(result.data.message)
            return
        }
    } 
    catch (error) {
        console.error('Error checking credentials:', error)
    }

    obj = {
        ...obj,
        password: password.value,
        name: name.value
    }
    console.log(true)
    try {
        await axios.post(`${URL}/user/signup`, obj)
        console.log('Account created successfully')
        await displayMessage('Account created successfully')
        window.location.href = '../login/login.html'
    } 
    catch (error) {
        await displayMessage('Error creating account')
        console.error('Error creating account:', error)
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