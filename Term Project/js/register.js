let userId;


async function registerBTN() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
    username,
    password,
  };
  if (!password || !username){
    alert("Please fill out all fields")
    return;
  }
  try {
    const response = await fetch("/registers", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const responseData = await response.json();

    alert('Registered!');
    window.location.href = `/account`;
    console.log('Update successful:', responseData);
  } catch (error) {
    alert("Username already exists");
    console.error('Update failed:', error.message);
  }
}


async function loginBTN() {
  alert("processing")
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
      username,
      password
  }

  try {
      const response = await fetch("/logged", {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error(`error (${response.status})`);
      }
      const responseData = await response.json();
      userId = responseData.userID;
      alert("Login Successful");
      console.log(userId)
      window.location.href = `/account`;
      console.log('Update successful', responseData);
  } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error('Update failed:', error.message);
  }
}