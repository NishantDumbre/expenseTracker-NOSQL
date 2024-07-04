window.addEventListener('DOMContentLoaded', checkPremiumFeatures)


async function checkPremiumFeatures() {
    const result = await axios.get(`${URL}/user/check-premium`, { headers: { 'Authorization': token } })
    console.log(result)
    if (result.data.premium == true) {
        premiumFeatures()
    }
}



async function premiumFeatures() {
    document.getElementById('buy-premium').remove()
    const navbar = document.getElementById('navbar')
    console.log(navbar.firstChild)
    const premiumBanner = document.createElement('h3')
    premiumBanner.innerHTML = 'You are a premium user'
    navbar.appendChild(premiumBanner)

    const leaderboardButton = document.createElement('button')
    leaderboardButton.innerHTML = 'Leaderboard'
    leaderboardButton.className = '.choice-container button'
    leaderboardButton.onclick = enableLeaderBoard
    navbar.appendChild(leaderboardButton)

    const download = document.createElement('button');
    download.type = 'button';
    download.innerHTML = 'Download expenses';
    download.onclick = downloadExpenses
    navbar.appendChild(download)

    const showHistory = document.createElement('button');
    showHistory.type = 'button';
    showHistory.innerHTML = 'Show past downloads';
    showHistory.onclick = downloadExpensesHistory
    navbar.appendChild(showHistory)
}



async function enableLeaderBoard() {
    const removebanner = document.getElementById('leaderboardBanner')
    const removelist = document.getElementById('leaderboardList')
    if (removebanner || removelist) {
        removebanner.remove()
        removelist.remove()
    }
    const downloadHistoryList = document.getElementById('downloadHistoryList')
    if (downloadHistoryList) {
        downloadHistoryList.remove()
    }

    const leaderboardBanner = document.createElement('h4')
    leaderboardBanner.id = 'leaderboardBanner'
    navbar.appendChild(leaderboardBanner)
    leaderboardBanner.innerHTML = 'Leaderboard'

    const leaderboardList = document.createElement('ul')
    leaderboardList.id = 'leaderboardList'
    navbar.appendChild(leaderboardList)
    const totalExpenses = await axios.get(`${URL}/premium/leaderboard`, { headers: { 'Authorization': token } })
    console.log(totalExpenses.data)
    for (data of totalExpenses.data) {
        loadLeaderBoard(data.username, data.total_expense, leaderboardList)
    }
}



function loadLeaderBoard(user, expense, leaderboard) {
    const li = document.createElement('li')
    li.innerHTML = `Name: ${user} &nbsp;&nbsp;&nbsp; Total Expense: ${expense}`
    console.log(li.innerHTML)
    li.style.listStyle = 'none'
    leaderboard.appendChild(li)
    console.log(li)
}



async function downloadExpenses() {
    try {
        const response = await axios.get(`${URL}/premium/downloadExpenseList`, {
            headers: { 'Authorization': token },
        });
        if (response.status == 200) {
            const a = document.createElement('a');
            a.href = response.data;
            a.download = 'myexpense.txt';
            a.click();
            console.log('File downloaded successfully');
        }
        else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};



async function downloadExpensesHistory() {
    try {
        const removebanner = document.getElementById('leaderboardBanner')
        const removelist = document.getElementById('leaderboardList')
        if (removebanner || removelist) {
            removebanner.remove()
            removelist.remove()
        }
        const downloadHistoryList = document.getElementById('downloadHistoryList')
        if (downloadHistoryList) {
            downloadHistoryList.remove()
        }
        
        const urls = await axios.get(`${URL}/premium/downloadUrlList`, { headers: { 'Authorization': token } })
        const urlData = urls.data.data
        console.log(urlData)
        const list = document.createElement('ul')
        list.id = 'downloadHistoryList'
        list.style.listStyle = 'none'
        navbar.appendChild(list)
        for (data of urlData) {
            loadExpenseHistory(data, list)
        }
    }
    catch (error) {
        console.log(error)
    }
}


function loadExpenseHistory(urlData, list) {
    const element = document.createElement('li')
    element.innerHTML = `${urlData.date}`
    const download = document.createElement('button');
    download.type = 'button';
    download.innerHTML = 'Download expenses';
    download.onclick = function () {
        const a = document.createElement('a');
        a.href = urlData.url;
        a.download = `expense ${urlData.date}.txt`;
        a.click();
    }
    element.appendChild(download)
    list.appendChild(element)
}