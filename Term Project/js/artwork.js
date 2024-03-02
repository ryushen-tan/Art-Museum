function like() {
    let itemID = document.querySelector('[item-id]').getAttribute('item-id');
    let data = { itemID: itemID };
    // XML request
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 201) {
                alert("Liked");
                
                window.location.reload();
            } else {
                alert("Error, Like not administered");
            }
        }
    };

    req.open("PUT", `/addlike`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}

function review(){
    let itemID = document.querySelector('[item-id]').getAttribute('item-id');
    let review = document.getElementById('review').value;
    let data = { 
        itemID: itemID,
        review: review
    };
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 201) {
                alert("Reviewed!");
                window.location.reload();
            } else {
                alert("Error, Review not added");
            }
        }
    };

    req.open("PUT", `/addreview`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}