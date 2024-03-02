async function submit() {
    try {
        const response = await fetch("/workshops", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: document.getElementById("name").value}),
        });
        if (!response.ok) {
            throw new Error(`Failed to add Workshop(${response.status}): ${response.statusText}`);
          }
          alert('Workshop Added!');
          location.reload();
          console.log('Workshop initiation successful');
      
        } catch (error) {
          alert(`ERROR: ${error.message}`);
          console.error('Failed:', error.message);
        }
}
