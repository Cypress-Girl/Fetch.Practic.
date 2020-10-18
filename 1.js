let posts = new Array();

window.alert = function (mess, title) {

    let blindWindow = document.createElement("div");
    blindWindow.className = "blind-window";
    document.body.append(blindWindow);

    let windowAlert = document.createElement("div");
    windowAlert.className = "alert-window";
    blindWindow.append(windowAlert);

    let titleElem = document.createElement("div");
    titleElem.className = "title-alert-window";
    titleElem.innerText = title;
    windowAlert.append(titleElem);

    let messElem = document.createElement("div");
    messElem.className = "mess-alert-window";
    messElem.innerText = mess;
    windowAlert.append(messElem);

    let buttonOk = document.createElement("button");
    buttonOk.innerText = "OK";
    buttonOk.className = "buttonOk";
    buttonOk.addEventListener('click', () => {
        blindWindow.remove();
        document.body.style.overflow = 'auto';
    })
    windowAlert.append(buttonOk);

    document.body.style.overflow = 'hidden';
}

fetch('https://jsonplaceholder.typicode.com/posts', {
    method: "GET"
})
    .then(response => {
        if (response.statusText === "OK")
            return response.json()
        else
            throw Error(response.statusText)
    })
    .then(json => {
        if (json) {
            viewPosts(json);
        }
    })
    .catch(err => {
        alert(err, "Ошибка загрузки данных")
    })

function reColor(indexInData) {
    if (indexInData == posts.length - 1) return;

    let postDiv;
    let idDiv;
    for (let i = indexInData + 1; i < posts.length; i++) {
        postDiv = document.getElementById(posts[i].id);
        idDiv = postDiv.firstChild;

        if (idDiv.classList.contains("background-bisque"))
            idDiv.classList.remove("background-bisque");
        else
            idDiv.classList.add("background-bisque");
    }
}

function deletePost(post, indexInData) {
    let postDiv = document.getElementById(post.id);

    if (postDiv) {
        postDiv.remove();
        posts.splice(indexInData, 1);
    } else {
        alert(`Post with ID = ${post.id} not found.`);
    }
}

function requestDelete(event, postID) {
    event.target.disabled = true;

    // if (postID < 100) postID = 101;

    fetch(`https://jsonplaceholder.typicode.com/posts/${postID}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.status === 200) {
                let postIndexInData = posts.findIndex(post => post.id == postID);
                reColor(postIndexInData);
                deletePost(posts[postIndexInData], postIndexInData);
            } else {
                throw Error(response.statusText);
            }
        })
        .catch(err => {
            alert(err, "Ошибка удаления поста");
            event.target.disabled = false;
        })

}

function viewPosts(postsFromJSON) {

    if (Array.isArray(postsFromJSON) === true) {
        posts = postsFromJSON;
    } else {
        posts.push(postsFromJSON);
    }

    let mainDiv = document.getElementById("main-container");
    if (!mainDiv) return;

    posts.map((post, index) => {
        let div = document.createElement("div");
        div.className = "post-div";
        div.id = post.id;

        let id = document.createElement("p");
        id.className = "post-id";
        id.innerText = post.id;
        if (index % 2 == 0)
            id.classList.add("background-bisque");

        let title = document.createElement("p");
        title.className = "post-title";
        title.innerText = post.title;

        let description = document.createElement("p");
        description.className = "post-description";
        description.innerText = post.body;

        let buttonDel = document.createElement("button");
        buttonDel.className = "post-buttonDel";
        buttonDel.innerText = "Delete"
        buttonDel.addEventListener('click', () => requestDelete(event, post.id));

        div.append(id);
        div.append(title);
        div.append(description);
        div.append(buttonDel);

        mainDiv.append(div);
    });
}