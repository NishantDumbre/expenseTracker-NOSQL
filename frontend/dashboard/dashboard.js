let recordExpenseButton = document.getElementById('record-expense')
let recordIncomeButton = document.getElementById('record-income')
let expenseForm = document.getElementById('expense-form')
let incomeForm = document.getElementById('income-form')
let list = document.getElementById('list')
let buyPremiumButton = document.getElementById('buy-premium')
let resultsNo = document.getElementById('resultsNo')

expenseForm.addEventListener('submit', addRecord)
incomeForm.addEventListener('submit', addRecord)
list.addEventListener('click', deleteExpense)
recordExpenseButton.addEventListener('click', recordExpense)
recordIncomeButton.addEventListener('click', recordIncome)
resultsNo.addEventListener('change', changePageResults)
window.addEventListener('DOMContentLoaded', recordExpense)
window.addEventListener('DOMContentLoaded', changePageResults)


const URL = `https://expense-tracker-nosql-e1t1rdlux-nishantdumbres-projects.vercel.app`
const token = localStorage.getItem('token')

// Enables expense form and disables income form
function recordExpense() {
    const expenseContainer = document.querySelector('.expense-container')
    const incomeContainer = document.querySelector('.income-container')
    incomeContainer.style.display = 'none'
    expenseContainer.style.display = 'block'
}



// Enables income form and disables expense form
function recordIncome() {
    const expenseContainer = document.querySelector('.expense-container')
    const incomeContainer = document.querySelector('.income-container')
    expenseContainer.style.display = 'none'
    incomeContainer.style.display = 'block'
}



// Adding expense and income
async function addRecord(e) {
    e.preventDefault()
    const incomeContainer = document.querySelector('.income-container')

    let money, description, category, type
    if (incomeContainer.style.display !== 'none') {
        money = document.getElementById('income-form').money
        description = document.getElementById('income-form').description
        category = document.getElementById('income-form').category
        type = 'INCOME'
    } else {
        money = document.getElementById('money')
        description = document.getElementById('description')
        category = document.getElementById('category')
        type = 'EXPENSE'
    }

    if (!money.value || !description.value || !category.value) {
        alert('Please fill all fields')
        return
    }
    const obj = {
        money: money.value,
        description: description.value,
        category: category.value,
        type: type
    }

    try {
        const result = await axios.post(`${URL}/expense/add-record`, obj, { headers: { 'Authorization': token } })
        console.log('Added an expense')
        money.value = ''
        description.value = ''
        showExpenses(result.data)
    } catch (error) {
        console.log(error)

    }
}




// creates the expenses to be displayed. Passed into other functions
function showExpenses(obj) {
    let li = document.createElement('li')
    li.innerHTML = `${obj.type} ${obj.money}  ${obj.description}  ${obj.category}   <button class="delete">Delete</button>`
    li.id = obj._id.toString()
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
    console.log(true)
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
    let result = await axios.get(`${URL}/expense/get-record?page=${page}&results=${number}`, { headers: { 'Authorization': token } })
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
        console.log(false)
        const target = e.target.parentElement
        console.log(target.id)
        await axios.delete(`${URL}/expense/delete-record/${target.id}`, { headers: { 'Authorization': token } })
        target.remove()
    }
}





// Razorpay code
buyPremiumButton.onclick = async function (e) {
    const response = await axios.get(`${URL}/order/buy-premium`, { headers: { 'Authorization': token } })
    console.log(response)
    const options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,
        "handler": async function (response) {
            console.log('Handler executed')
            console.log(response)
            console.log(options)
            await axios.post(`${URL}/order/update-transaction-status`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                success: true
            }, {
                headers: { 'Authorization': token }
            })
            alert('Payment successful')
            window.location.reload();
        }
    };
    let rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response) {
        console.log('Failed executed')
        await axios.post(`${URL}/order/update-transaction-status`, {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
            success: false
        }, {
            headers: { 'Authorization': token }
        })
        alert('Something went wrong')
    })
}