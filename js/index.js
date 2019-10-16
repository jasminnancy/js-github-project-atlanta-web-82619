const form = document.querySelector('#github-form')
const container = document.querySelector('#github-container')
const userList = document.querySelector('#user-list')
const repoList = document.querySelector('#repos-list')

//starts the event listener upon DOM load
searchGitHub()

function searchGitHub() {
    //adds event listener for form submit
    form.addEventListener("submit", function(e){
        e.preventDefault()
        clearNode(userList)
        clearNode(repoList)

        //selects form input (if not blank) and passes the value to the fetch request
        const input = document.querySelector('#search')
        if (input.value !== "") {
            gitHubFetch(input.value)
        } else {
            alert("Search field can't be blank!")
        }
    })
}

//performs the users fetch request
function gitHubFetch(input) {
    fetch(`https://api.github.com/search/users?q=${input}`, {
        Header: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => displayUsers(data.items))
}

//appends all users to the user container
function displayUsers(users) {
    users.forEach(user => {
        createUserDiv(user)  
    })
}

//creates and appends all information for one user
function createUserDiv(user) {
    //border box
    const div = document.createElement('div')
    div.style = "text-align: center; width: 98%; border: solid; border-width: 1px; padding: 10px; margin-bottom: 15px;"

    //username with link
    const h3 = document.createElement('h3')
    h3.style = "color: black;"
    h3.innerText = user.login

    const a = document.createElement('a')
    a.href = user.html_url
    a.appendChild(h3)

    //profile picture
    const img = document.createElement('img')
    img.src = user.avatar_url
    img.style = "max-height: 150px;"

    //user repos + event listener
    const p = document.createElement('p')
    p.innerHTML = `<u>Display Repos by ${user.login}</u>`
    p.addEventListener("click", () => userRepoFetch(user.login))

    //appending everything to the div box
    div.appendChild(a)
    div.appendChild(img)
    div.appendChild(p)

    //appending div to user list
    userList.appendChild(div)
}

//performs repo fetch request
function userRepoFetch(user) {
    fetch(`https://api.github.com/users/${user}/repos`, {
        Header: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => userRepoDisplay(data))
}

//appends all repo information to the repo container
function userRepoDisplay(repos) {
    repos.forEach(repo => {
        createRepoDiv(repo)
    })
}

//creates and appends all repo information for one user
function createRepoDiv(repo) {
    //border box
    const div = document.createElement('div')
    div.style = "text-align: center; width: 98%; border: solid; border-width: 1px; padding: 10px; margin-bottom: 15px;"

    //repo title with link
    const h3 = document.createElement('h3')
    h3.innerText = repo.name

    const a = document.createElement('a')
    a.href = repo.html_url
    a.appendChild(h3)

    //repo created at
    const h4 = document.createElement('h4')
    h4.innerText = `Created: ${formatDate(repo.created_at)}`

    //repo last update on
    const p = document.createElement('p')
    p.innerText = `Last updated on: ${formatDate(repo.updated_at)}`

    //appends everything to div box
    div.appendChild(a)
    div.appendChild(h4)
    div.appendChild(p)

    //appends div to repo container
    repoList.appendChild(div)
}

//formats date for repo
function formatDate(date) {
    const splitDate = date.split("")
    const year = splitDate.slice(0, 4).join("")
    const month = splitDate.slice(5, 7).join("")
    const day = splitDate.slice(8, 10).join("")
    return `${month}/${day}/${year}`
}

//clears all results from memory
function clearNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

