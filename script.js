document.addEventListener("DOMContentLoaded", function() {
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

        // Perform initial API request to get the total number of results
        let apiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=2cd8af7&plot=short&r=json&type=${type}&y=${year}&page=1`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Error) {
                    resultsDiv.innerHTML = data.Error;
                } else if (data.Search) {
                    const totalCount = data.totalResults || 0;
                    const totalPages = Math.ceil(totalCount / 10); // Assuming each page has 10 results
                    
                    resultsDiv.innerHTML = `Total results found: ${totalCount}<br><br>`;

                    // Fetch additional pages of results (up to 20 movies)
                    const promises = [];
                    for (let page = 1; page <= Math.min(totalPages, 2); page++) { // Fetch up to 2 pages (20 results)
                        promises.push(fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=2cd8af7&plot=short&r=json&type=${type}&y=${year}&page=${page}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.Search) {
                                    data.Search.forEach(movie => {
                                        resultsDiv.innerHTML += `<strong>${movie.Title}</strong> (${movie.Year}) - Type: ${movie.Type}<br>`;
                                    });
                                }
                            })
                            .catch(error => console.error("Error:", error)));
                    }

                    // Resolve all promises and then display the results
                    Promise.all(promises)
                        .then(() => {
                            // All pages have been fetched, do additional processing if needed
                        })
                        .catch(error => console.error("Error:", error));
                } else {
                    resultsDiv.innerHTML = "No results found.";
                }
            })
            .catch(error => {
                resultsDiv.innerHTML = "An error occurred while fetching data from the API.";
                console.error("Error:", error);
            });
    });
});