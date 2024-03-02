let filter = document.getElementById('filterBy');
let page;
let imgs;
document.getElementById('type').addEventListener('change', doFilter);
filter.addEventListener('input', doFilter);

async function doFilter() {
  try {
    let type = document.getElementById('type').value;
    const filterValue = filter.value;

    const response = await fetch(`/find?filter=${filterValue}&type=${type}`);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const responseData = await response.json();
    console.log(responseData);

    imgs = responseData;
    page = 0;
    renderPage();
  } catch (error) {
    console.error('Filter failed:', error.message);
  }
}

function init(images) {
    page = 0;
    imgs = images;   
    renderPage();
}

function renderPage() {
  console.log(imgs);
  const results = document.getElementById('results');
  results.innerHTML = `
                      <button onclick="prevPage()"> <<< </button>
                      <button>${page + 1}</button>
                      <button onclick="nextPage()"> >>> </button>
                      <hr>`;
  let index = page * 10;
  for(let i = index; i < imgs.length && i < index + 10; i++) {
      let img = imgs[i];
      results.innerHTML += `<div id=${img['_id']}>
                              <a href="artworks/${img['_id']}">
                                  <h2>${img['title']}</h2>
                              </a>
                              <a href="accounts/${img['artist']}">
                                  Artist: ${img['artist']}
                              </a>
                              <br>
                              <img src=${img['poster']} alt="Cannot load image" class="poster"/>
                              <p class="description">Description: ${img['description']}</p>
                          </div>`;
  }
  results.innerHTML += `<button onclick="prevPage()" id="prevPage"> <<< </button>
                     <button>${page + 1}</button>
                     <button onclick="nextPage()" id="nextPage"> >>> </button>`;
}


function nextPage() {
    if(page === Math.floor(imgs.length / 10)) {
        return;
    }
    page++;
    renderPage();
}

function prevPage() {
    if(page === 0) {
        return;
    }
    page--;    
    renderPage();
}