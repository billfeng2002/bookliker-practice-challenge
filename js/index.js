function applyToBooks(func){
    fetch("http://localhost:3000/books").then(r=>r.json()).then(j=>func(j))
}

function applyToUsers(func){
    fetch("http://localhost:3000/users").then(r=>r.json()).then(j=>func(j))
}

function listBooks(books){
    let list=document.querySelector("ul#list")
    for (const book of books){
        let item=document.createElement("li")
        console.log(book)
        item.dataset.id=book.id
        item.textContent=book.title
        item.addEventListener("click", ()=>showBook(book))
        list.append(item) 
    }
}

function updateUsersList(data){
    let item
    if((item=document.querySelector(`li[data-id="1"].user`))!=null){
        item.remove()
    }else{
        let usersList=document.querySelector("#show-panel ul")
        let userItem=document.createElement("li")
        userItem.dataset.id=1
        userItem.classList.add("user")
        userItem.textContent="pouros"
        usersList.append(userItem)
    }
}

function showBook(book){
    let showPanel=document.querySelector("div#show-panel")
    showPanel.innerHTML=`<img src="${book["img_url"]}"> </img>
    <h2>${book.title}</h2>
    <h2>${book.subtitle}</h2>
    <h2>${book.author}</h2>
    <p>${book.description}</p>
    `
    let users=book.users
    let usersList=document.createElement("ul")
    usersList.classList.id="users-list"
    for (const user of users){
        let userItem=document.createElement("li")
        userItem.dataset.id=user.id
        userItem.classList.add("user")
        userItem.textContent=user.username
        usersList.append(userItem)
    }
    showPanel.append(usersList)
    //debugger
    let likeButton=document.createElement("button")
    if(users.find((elt)=>elt.id==1)){
        likeButton.textContent="Unlike"
    }else{
        likeButton.textContent="Like"
    }
    showPanel.append(likeButton)
    likeButton.addEventListener("click", ()=>{
        let reqSettings={
            method: "PATCH",
            headers: {'Content-Type': 'application/json'}
        }
        //debugger
        let currentUsers=[...usersList.querySelectorAll("li")].map((elt)=>{
            return {"id":elt.dataset.id, "username":elt.textContent}
        })
        if(likeButton.textContent=="Like"){
            currentUsers.push({"id":1, "username":"pouros"})
            likeButton.textContent="Unlike"
        }else{
            currentUsers=currentUsers.filter((elt)=>elt.id!=1)
            likeButton.textContent="Like"
        }
        reqSettings.body=JSON.stringify({"users":currentUsers})
        fetch(`http://localhost:3000/books/${book.id}`, reqSettings)
            .then(r=>r.json).then(j=>updateUsersList(j))
    })
}

document.addEventListener("DOMContentLoaded", function() {
    applyToBooks(listBooks)

});
