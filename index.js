const express = require('express');
const nodemon = require('nodemon');


let movies = [
    {
        "id" : 1,
        "title" : 'movie1',
        "descritpion" : "test decription 1",
        "rel_year" : 2024,
        "genre" : "crime",
        "director" : "test1"
    },
    {
        "id" : 2,
        "title" : 'movie2',
        "descritpion" : "test decription 2",
        "rel_year" : 2022,
        "genre" : "crime/Action",
        "director" : "test2"
    },
    {
        "id" : 3,
        "title" : 'movie3',
        "descritpion" : "test decription 3",
        "rel_year" : 2020,
        "genre" : "action",
        "director" : "test3"
    },

]

let watchList = [
    {
        "id" : 3,
        "title" : 'movie3',
        "descritpion" : "test decription 3",
        "rel_year" : 2020,
        "genre" : "action",
        "director" : "test3"
    }
]
const PORT = 3000;

const app = express();

app.use(express.json())
// title, description, release year, genre(s), and director.
app.post('/movie', (req, res) => {
    const movie_details= req.body;
    movies.push(movie_details)
    res.status(201).json(movies)
})

//get all movies
app.get('/', (req,res) => {
    console.log(movies);
    res.status(201).json(movies)
})

//get a movie by id
app.get('/:id', (req, res) => {
    const id = req.params.id;
    const movie = movies.find(movie => movie.id == id)
    if (movie){
        res.status(201).json(movie)
    } else {
        res.send("Movie is not found")
    }
})

//Update a movie by name
app.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newTitle = req.body.title;

    const movie = movies.find(movie => movie.id === id);
    if (movie) {
        movie.title = newTitle;
        res.json(movie);
    } else {
        res.status(404).send("Movie not found");
    }
});

// Delete a movie
app.delete('/:id', (req, res) => {
    const id = req.params.id;

    const movieIndex = movies.findIndex(movie => movie.id === id);
    if (movieIndex !== -1) {
        movies.splice(movieIndex, 1);
        res.status(201).send();  
    } else {
        res.status(404).send("Movie not found");
    }
});

//WatchList

// Get the user's watchlist
app.get('/watchlist/:id', (req, res) => {
    const userId = req.params.userId;
    const userWatchlist = watchList[userId] || [];
    const userMovies = userWatchlist.map(movieId => movies.find(movie => movie.id === movieId));
    res.json(userMovies);
});

// Add a movie to the watchlist
app.post('/watchlist/:userId', (req, res) => {
    const userId = req.params.userId;
    const movieId = req.body.movieId;
    const movie = movies.find(movie => movie.id == movieId);

    if (!movie) {
        return res.status(404).send("Movie not found");
    }

    if (!watchList[userId]) {
        watchList[userId] = [];
    }

    if (!watchList[userId].includes(movieId)) {
        watchList[userId].push(movieId);
    }

    res.status(201).json(watchList[userId]);
});

// Remove a movie from the watchlist
app.delete('/watchlist/:userId/:movieId', (req, res) => {
    const userId = req.params.userId;
    const movieId = parseInt(req.params.movieId);

    if (!watchList[userId]) {
        return res.status(404).send("Watchlist not found");
    }

    watchList[userId] = watchList[userId].filter(id => id !== movieId);

    res.status(204).send();
});


app.listen(PORT, () => {
    console.log("Server is runnig");
})