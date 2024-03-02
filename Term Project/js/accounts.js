async function followBTN(username){
  alert("Following");
    try{
      console.log("this is the username", username);
      const response = await fetch("/follow", {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
      const responseData = await response.json();
      alert('Followed!');
      window.location.href = `/account`;
      console.log('Update successful:', responseData);
    } catch (error) {
      alert("ERROR");
      console.error('Update failed:', error.message);
    }
}

async function enroll(username){
  try{
    const response = await fetch("/enroll", {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username }),

    });
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
      const responseData = await response.json();
      alert('Enrolled!');
      window.location.href = `/account`;
      console.log('Update successful:', responseData);
    } catch (error) {
      alert("ERROR");
      console.error('Update failed:', error.message);
    }
    
  }