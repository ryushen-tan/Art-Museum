async function swapBTN(){
    try{
        const response = await fetch("/swap", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
  
        const data = await response.json();
        alert("Swap Success");
        location.reload();
        console.log('Update successful: ' + data);
    } catch (error){
        alert("Can't swap back");
        console.error('Update failed:', error.message);
    }
}

async function logoutBTN(){
    try{
        const response = await fetch("/logout", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        const data = await response.json();
        alert("Logout Succesful");
        window.location.href = "/register";
        console.log('Update successful: ' + data);
    } catch (error){
        alert("Can't swap back");
        console.error('Update failed:', error.message);
    }
}

async function unFollowBTN(follower) {
    alert("Unfollowing");
  
    try {
      console.log("this is the follower", follower);
  
      const response = await fetch("/unfollow", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to unfollow (${response.status}): ${response.statusText}`);
      }
  
      alert('Unfollowed!');
      location.reload();
      console.log('Unfollow successful');
  
    } catch (error) {
      alert(`ERROR: ${error.message}`);
      console.error('Unfollow failed:', error.message);
    }
  }

async function unLikeBTN(artwork){
    alert("Unliking");
    try {
        console.log("Unliking: ", artwork);
        const response = await fetch("/unlike", {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artwork }),
        });
        if (!response.ok) {
            throw new Error(`Failed to unfollow (${response.status}): ${response.statusText}`);
          }

          alert('Unliked!');
          location.reload();
          console.log('Unliked successfuly');
      
        } catch (error) {
          alert(`ERROR: ${error.message}`);
          console.error('Unfollow failed:', error.message);
        }
}

async function unReviewBTN(review){
    alert("UnReviewing");
    console.log("UnReviewing: ", review);
    try {
        
        const response = await fetch("/unreview", {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ review }),
        });
        if (!response.ok) {
            throw new Error(`Failed to remove review (${response.status}): ${response.statusText}`);
          }
          alert('Review Removed!');
          location.reload();
          console.log('Review Removed successful');
      
        } catch (error) {
          alert(`ERROR: ${error.message}`);
          console.error('Failed:', error.message);
        }
}