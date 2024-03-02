function submit() {
    let art = {
        title: document.getElementById("name").value,
        year: document.getElementById("year").value,
        category: document.getElementById("category").value,
        medium: document.getElementById("medium").value,
        description: document.getElementById("description").value,
        poster: document.getElementById("poster").value
    };

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 201) {
                const data = JSON.parse(this.responseText);
                alert("Artwork added");
                window.location.href = `/account`;
            } else {
                alert(JSON.stringify(req.response));
            }
        }
    };

    req.open("POST", `/artworks`);
        req.setRequestHeader("Content-Type", "application/json");

    req.send(JSON.stringify(art));
}

function cancel(){
    window.location.href = "/account";
}