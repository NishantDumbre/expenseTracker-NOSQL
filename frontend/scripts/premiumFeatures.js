// window.addEventListener('DOMContentLoaded', checkPremiumFeatures)



// async function checkPremiumFeatures() {
//     let token = localStorage.getItem('token')
//     let result = await axios.get('http://localhost:8080/user/check-premium', { headers: { 'Authorization': token } })
//     if (result.data.isPremium == true) {
//         premiumFeatures()
//     }
// }



// async function premiumFeatures() {
//     document.getElementById('buy-premium').remove()
//     let navbar = document.getElementById('navbar')
//     console.log(navbar.firstChild)
//     let premiumBanner = document.createElement('h3')
//     premiumBanner.innerHTML = 'You are a premium user'
//     navbar.appendChild(premiumBanner)

//     let leaderboardButton = document.createElement('button')
//     leaderboardButton.innerHTML = 'Leaderboard'
//     leaderboardButton.className = '.choice-container button'
//     leaderboardButton.onclick = enableLeaderBoard
//     navbar.appendChild(leaderboardButton)

//     let download = document.createElement('button');
//     download.type = 'button';
//     download.innerHTML = 'Download expenses';
//     download.onclick = downloadExpenses
//     navbar.appendChild(download)

//     let showHistory = document.createElement('button');
//     showHistory.type = 'button';
//     showHistory.innerHTML = 'Show past downloads';
//     showHistory.onclick = downloadExpensesHistory
//     navbar.appendChild(showHistory)
// }



// async function enableLeaderBoard() {
//     let removebanner = document.getElementById('leaderboardBanner')
//     let removelist = document.getElementById('leaderboardList')
//     if (removebanner || removelist) {
//         removebanner.remove()
//         removelist.remove()
//     }
//     let downloadHistoryList = document.getElementById('downloadHistoryList')
//     if (downloadHistoryList) {
//         downloadHistoryList.remove()
//     }

//     let leaderboardBanner = document.createElement('h4')
//     leaderboardBanner.id = 'leaderboardBanner'
//     navbar.appendChild(leaderboardBanner)
//     leaderboardBanner.innerHTML = 'Leaderboard'

//     let leaderboardList = document.createElement('ul')
//     leaderboardList.id = 'leaderboardList'
//     navbar.appendChild(leaderboardList)
//     let token = localStorage.getItem('token')
//     let totalExpenses = await axios.get('http://localhost:8080/premium/leaderboard', { headers: { 'Authorization': token } })
//     console.log(totalExpenses.data)
//     for (data of totalExpenses.data) {
//         loadLeaderBoard(data.username, data.totalExpense, leaderboardList)
//     }
// }



// function loadLeaderBoard(user, expense, leaderboard) {
//     let li = document.createElement('li')
//     li.innerHTML = `Name = ${user}  Total Expense = ${expense}`
//     leaderboard.appendChild(li)
//     console.log(li)
// }



// async function downloadExpenses() {
//     try {
//         let token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:8080/premium/downloadExpenseList', {
//             headers: { 'Authorization': token },
//         });
//         if (response.status == 200) {
//             const a = document.createElement('a');
//             a.href = response.data;
//             a.download = 'myexpense.txt';
//             a.click();
//             console.log('File downloaded successfully');
//         }
//         else {
//             throw new Error(response.data.message)
//         }
//     } catch (error) {
//         console.error('Error downloading file:', error);
//     }
// };



// async function downloadExpensesHistory() {
//     try {
//         let removebanner = document.getElementById('leaderboardBanner')
//         let removelist = document.getElementById('leaderboardList')
//         if (removebanner || removelist) {
//             removebanner.remove()
//             removelist.remove()
//         }
//         let downloadHistoryList = document.getElementById('downloadHistoryList')
//         if (downloadHistoryList) {
//             downloadHistoryList.remove()
//         }
//         const token = localStorage.getItem('token')
//         const urls = await axios.get('http://localhost:8080/premium/downloadUrlList', { headers: { 'Authorization': token } })
//         const urlData = urls.data.data
//         console.log(urlData)
//         let list = document.createElement('ul')
//         list.id = 'downloadHistoryList'
//         list.style.listStyle = 'none'
//         navbar.appendChild(list)
//         for (data of urlData) {
//             loadExpenseHistory(data, list)
//         }
//     }
//     catch (error) {
//         console.log(error)
//     }
// }


// function loadExpenseHistory(urlData, list) {
//     let element = document.createElement('li')
//     element.innerHTML = `${urlData.date}`
//     let download = document.createElement('button');
//     download.type = 'button';
//     download.innerHTML = 'Download expenses';
//     download.onclick = function () {
//         const a = document.createElement('a');
//         a.href = urlData.url;
//         a.download = `expense ${urlData.date}.txt`;
//         a.click();
//     }
//     element.appendChild(download)
//     list.appendChild(element)
// }