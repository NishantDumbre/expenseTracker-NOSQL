let recordExpenseButton = document.getElementById('record-expense')
let recordIncomeButton = document.getElementById('record-income')
let money = document.getElementById('money')
let description = document.getElementById('description')
let category = document.getElementById('category')
let expenseForm = document.getElementById('expense-form')
let incomeForm = document.getElementById('income-form')
let list = document.getElementById('list')
let buyPremiumButton = document.getElementById('buy-premium')
let resultsNo = document.getElementById('resultsNo')

expenseForm.addEventListener('submit', addExpense)
incomeForm.addEventListener('submit', addIncome)
list.addEventListener('click', deleteExpense)
recordExpenseButton.addEventListener('click', recordExpense)
recordIncomeButton.addEventListener('click', recordIncome)
resultsNo.addEventListener('change', changePageResults)
window.addEventListener('DOMContentLoaded', populateExpenses)
window.addEventListener('DOMContentLoaded', recordExpense)


const backendAPI = `http://localhost:8080`
const token = localStorage.getItem('token')

// Enables expense form and disables income form
function recordExpense() {
    let expenseContainer = document.querySelector('.expense-container')
    let incomeContainer = document.querySelector('.income-container')
    incomeContainer.style.display = 'none'
    expenseContainer.style.display = 'block'
}



// Enables income form and disables expense form
function recordIncome() {
    let expenseContainer = document.querySelector('.expense-container')
    let incomeContainer = document.querySelector('.income-container')
    expenseContainer.style.display = 'none'
    incomeContainer.style.display = 'block'
}



// Adding expense
async function addExpense(e) {
    e.preventDefault()
    try {
        let obj = {
            money: money.value,
            description: description.value,
            category: category.value,
            userId: localStorage.getItem('token'),
            type: 'expense'
        }
        let result = await axios.post(`${backendAPI}/expense/add-expense`, obj, { headers: { 'Authorization': token } })
        console.log('Added an expense')
        money.value = ''
        description.value = ''
        showExpenses(result.data)
    }
    catch (error) {
        console.log(error)
    }
}



// Adding income 
async function addIncome(e) {
    e.preventDefault()
    try {
        let obj = {
            money: money.value,
            description: description.value,
            category: category.value,
            userId: localStorage.getItem('token'),
            type: 'income'
        }
        let result = await axios.post(`${backendAPI}/expense/add-income`, obj, { headers: { 'Authorization': token } })
        console.log('Added an income')
        money.value = ''
        description.value = ''
        showExpenses(result.data)
    }
    catch (error) {
        console.log(error)
    }
}



// creates the expenses to be displayed. Passed into other functions
function showExpenses(obj) {
    let li = document.createElement('li')
    li.innerHTML = `${obj.type} ${obj.money}  ${obj.description}  ${obj.category}   <button class="delete">Delete</button>`
    li.id = obj.id
    list.appendChild(li)
}



// changes the number of expenses displayed
function changePageResults() {
    let list = document.getElementById('list');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    let number = parseInt(resultsNo.value)
    if (isNaN(number)) {
        number = 3
    }
    localStorage.setItem('savedPageResultsSetting', number)

    populateExpenses()
}



// generates all expenses on loading the page
async function populateExpenses(pages) {
    let page = 1
    if (pages) {
        page = pages
    }
    let number = parseInt(resultsNo.value)
    if (isNaN(number)) {
        number = 3
    }
    const savedPageResultsSetting = localStorage.getItem('savedPageResultsSetting')
    if (savedPageResultsSetting > 0) {
        number = savedPageResultsSetting
    }
    let result = await axios.get(`${backendAPI}/expense/get-expense?page=${page}&results=${number}`, { headers: { 'Authorization': token } })
    for (let data of result.data.expenses) {
        showExpenses(data)

    }
    showPagination(result.data)
}



// divide pages and create buttons
async function showPagination({
    currentPage,
    hasPreviousPage,
    previousPage,
    hasNextPage,
    nextPage,
    lastPage
}) {
    let container = document.querySelector('.pagination-container');

    if (hasPreviousPage) {
        let removeOldButton = document.getElementById('buttonPrevious');
        if (removeOldButton) {
            removeOldButton.remove();
        }
        const buttonPrevious = document.createElement('button');
        buttonPrevious.innerHTML = 'Previous';
        buttonPrevious.id = 'buttonPrevious';
        buttonPrevious.addEventListener('click', () => {
            let list = document.getElementById('list');
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            populateExpenses(previousPage);
        });
        container.appendChild(buttonPrevious);
    }

    if (hasNextPage) {
        let removeOldButton = document.getElementById('buttonNext');
        if (removeOldButton) {
            removeOldButton.remove();
        }
        const buttonNext = document.createElement('button');
        buttonNext.innerHTML = 'Next';
        buttonNext.id = 'buttonNext';
        buttonNext.addEventListener('click', () => {
            let list = document.getElementById('list');
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            populateExpenses(nextPage);
        });
        container.appendChild(buttonNext);
    }
}




// deletes a selected expense
async function deleteExpense(e) {
    if (e.target.classList.contains('delete')) {
        let target = e.target.parentElement
        await axios.delete(`${backendAPI}/expense/delete-expense/${target.id}`, { headers: { 'Authorization': token } })
        target.remove()
    }
}





// Razorpay code
buyPremiumButton.onclick = async function (e) {
    let response = await axios.get(`${backendAPI}/order/buy-premium`, { headers: { 'Authorization': token } })
    let options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,
        "handler": async function (response) {
            console.log('Handler executed')
            await axios.post(`${backendAPI}/order/update-transaction-status`, {
                orderId: options.order_id,
                paymentId: response.razorpay_payment_id,
                success: true
            }, {
                headers: { 'Authorization': token }
            })
            alert('Payment successful')
            window.location.href = window.location.href
        }
    };
    let rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response) {
        console.log('Failed executed')
        await axios.post(`${backendAPI}/order/update-transaction-status`, {
            orderId: options.order_id,
            paymentId: response.razorpay_payment_id,
            success: false
        }, {
            headers: { 'Authorization': token }
        })
        alert('Something went wrong')
    })
}