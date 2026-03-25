
const API_KEY = "efb112024b66ce0358bede0b0dec7776";
const BASE_URL = "https://api.themoviedb.org/3"

const movieContainer = document.getElementById("movieContainer");

let currentPage = 1;
let movies =[];
// for favorites
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
// for watchlist
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const watchlistItems = document.getElementById("watchlistItems");


// adding to watchlist and displaying it function
function renderWatchlist(){
  watchlistItems.innerHTML ="";

  watchlist.forEach(movie=>{
    const li = document.createElement("li");
    // li.textContent = movie.title;
    li.innerHTML =`
    ${movie.title}
    <button class="remove-btn" data-id="${movie.id}">✖</button>
    `;

    watchlistItems.appendChild(li);
  })
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  addRemoveListerners()
}

// creating a fucntion for removing from watchlist

function addRemoveListerners(){
  const removeBtns = document.querySelectorAll(".remove-btn");

  removeBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id = Number(btn.dataset.id);

      watchlist = watchlist.filter(movie => movie.id !== id);

      renderWatchlist();
    })
  })
}

document.getElementById("clearWatchlist")
.addEventListener("click",()=>{
  watchlist =[];
  renderWatchlist();
})

async function getMovies(page = 1) {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  const data = await response.json();

  movies = [...movies, ...data.results]
  displayMovies(movies);
  // displayMovies(data.results);
}


function displayMovies(movies){
  movieContainer.innerHTML="";

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
    <div class="movie-poster">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <span class="heart" data-id="${movie.id}">♡</span>
    </div>

    <div class="movie-info">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
      <button class="watchlist-btn" data-id="${movie.id}" data-title="${movie.title}">
        Add to Watchlist
      </button>
    </div>
      `;
    
    movieContainer.appendChild(movieCard)



    // adding "favorite" heart
    const heart = movieCard.querySelector(".heart");

    if (favorites.includes(movie.id)){
      heart.classList.add("active");
    }

    heart.addEventListener("click", ()=>{
      heart.classList.toggle("active");

      if (favorites.includes(movie.id)){
        favorites = favorites.filter(id => id !== movie.id);
      } else {
        favorites.push(movie.id)
      }

      localStorage.setItem("favorites",JSON.stringify(favorites));
    })

    const watchBtn = movieCard.querySelector(".watchlist-btn");

    watchBtn.addEventListener("click",()=>{
      const movieData = {
        id: movie.id,
        title: movie.title
      };

      const exists = watchlist.some(item=>item.id === movie.id);

      if (!exists){
        watchlist.push(movieData);
        renderWatchlist();
      }
    });

  });
}



// calling above functions to display movies
getMovies(currentPage)

const loadMoreBtn = document.getElementById("loadMore");

loadMoreBtn.addEventListener("click", ()=>{
  currentPage++;
  getMovies(currentPage)
})

// getMovies(1)
// getMovies(2)
// getMovies(3)

//calling watchlist display fucntion
renderWatchlist();

