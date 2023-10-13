const form = document.getElementById("search-form");
const resultsDiv = document.getElementById("results");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const year = document.getElementById("year").value;

    if (title.length < 3) {
        resultsDiv.innerHTML = "Please enter at least 3 characters in the search field.";
        return;
    }

    let apiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=2cd8af7&plot=full&r=json&page=1`;

    if (type) {
        apiUrl += `&type=${type}`;
    }

    if (year) {
        apiUrl += `&y=${year}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Error) {
                resultsDiv.innerHTML = data.Error;
            } else if (data.Search) {
                const totalCount = data.totalResults || 0;
                resultsDiv.innerHTML = `Total results found: ${totalCount}<br><br>`;

                data.Search.forEach(movie => {
                    // Display each movie with a data-imdbid attribute for identification
                    resultsDiv.innerHTML += `<div data-imdbid="${movie.imdbID}" class="movie-item">
                                                <img src="${movie.Poster}" alt="${movie.Title} Poster" class="poster">
                                                <div class="movie-details">
                                                    <strong>${movie.Title}</strong> (${movie.Year}) - Type: ${movie.Type}<br>
                                                    Plot: ${movie.Plot}<br><br>
                                                </div>
                                             </div>`;
                });
            } else {
                resultsDiv.innerHTML = "No results found.";
            }
        })
        .catch(error => {
            resultsDiv.innerHTML = "An error occurred while fetching data from the API.";
            console.error("Error:", error);
        });
});

// Event listener for movie selection
resultsDiv.addEventListener("click", function(event) {
    const target = event.target;
    if (target && target.closest(".movie-item") && target.closest(".movie-item").dataset.imdbid) {
        const imdbID = target.closest(".movie-item").dataset.imdbid;
        fetchMovieDetails(imdbID);
    }
});

function fetchMovieDetails(imdbID) {
    const apiUrl = `http://www.omdbapi.com/?i=${imdbID}&apikey=2cd8af7&plot=full&r=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(movieDetails => {
            // Display all the details of the selected movie
            resultsDiv.innerHTML = `
                <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster" class="poster">
                <h2>${movieDetails.Title}</h2>
                <p><strong>Year:</strong> ${movieDetails.Year}</p>
                <p><strong>Type:</strong> ${movieDetails.Type}</p>
                <p><strong>Plot:</strong> ${movieDetails.Plot}</p>
                <!-- Add more details as needed -->
            `;
        })
        .catch(error => {
            resultsDiv.innerHTML = "An error occurred while fetching movie details.";
            console.error("Error:", error);
        });
}
