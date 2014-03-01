var movieGame = angular.module('movieGame', ['ui.sortable']);

movieGame.controller('gameController', function($scope, movieDB){
    $scope.actorList = ["Brad Pitt", "Julia Roberts", "Tom Hanks", "Harrison Ford", "Samuel Jackson", 
        "George Clooney", "Jack Nicholson", "Bruce Willis", "Sean Connery", "John Cusack", "Billy Bob Thornton",
        "Robin Williams", "Morgan Freeman", "Denzel Washington", "Ben Affleck", "Matt Damon",
        "Tom Cruise", "Mel Gibson", "Russell Crowe", "Nicole Kidman", "Cate Blanchett", "Meryl Streep", 
        "Kate Winslet", "Reese Witherspoon", "Julianne Moore", "Helen Mirren", "Jessica Alba", "Adam Sandler",
        "Steve Martin", "John Goodman", "Bill Murray"];

    $scope.movies = [];
    $scope.actor = "";
    $scope.movieAJAXList = {};
    $scope.movieAnswers = [];
    $scope.guesses = 0;
    $scope.numCorrect = 0;
    $scope.ajaxLoading = true;
    $scope.newGame = true;
    $scope.gameOn = false;
    $scope.timerMins = "0";
    $scope.timerSecs = "00";
    timerTotalSecs = 0;    
    movieArraySize = 6;
    $scope.instruction = "";
    jQuery(".checkAnswersDisplay").hide();
    var timerInterval;

    $scope.sortableOptions = {
        update: function(e, ui) {
            $scope.nothing = 1;
        }
    };

    $scope.initializeGame = function() {
        //Pick a random actor
        $scope.actor = $scope.actorList[Math.floor(Math.random() * $scope.actorList.length)];
        $scope.instruction = "Think you know " + $scope.actor + "'s movies?";
        //Get the actor's credits
        getMovieCredits($scope.actor);
    };

    $scope.startGame = function() {
        loadMovies(movieArraySize);
        generateAnswers();  
        loadDateLine();      
        timerInterval = setInterval(setTimer, 1000);
        $scope.newGame = false;
        $scope.gameOn = true;
        $scope.instruction = "Click and drag to place these " + $scope.actor + " movies in order by release date.";
    };

    $scope.checkAnswers = function() {
        $scope.numCorrect = 0;
        for (var i=0; i<$scope.movies.length; i++) {
            if ($scope.movies[i].id == $scope.movieAnswers[i].id) {
                $scope.numCorrect++;
            }
        }

        if ($scope.numCorrect == 6) {
            $scope.instruction = "You got them all correct!";
            endGame();
        }
        else {
            jQuery(".checkAnswersDisplay").fadeIn(200).delay(1300).fadeOut(100);
        }
    };

    $scope.giveUp = function() {
        jQuery(".checkAnswersDisplay").hide();
        $scope.instruction = "You gave up!";
        endGame();
    };

    $scope.playAgain = function () {
        location.reload();
    };

    function loadMovies () {
        while ($scope.movies.length < movieArraySize) {
            addMovie();
        }
    }

    function addMovie() {
        var movieIdx = Math.floor(Math.random() * $scope.movieAJAXList.length);
        var thisMovie = $scope.movieAJAXList[movieIdx];

        if (movieValidAndNotInList(thisMovie))
        {
            $scope.movies.push({
                id: thisMovie.id,
                title: thisMovie.title,
                character: thisMovie.character,
                posterPath: generatePosterPath(thisMovie.poster_path),
                releaseDate: convertDate(thisMovie.release_date),
                displayDate: formatDate(convertDate(thisMovie.release_date))
            });
        }
    }

    function formatDate(obj) {
        var months = ['January','February','March','April','May','June',
            'July','August','September','October','November','December'];    
        return months[obj.getMonth()] + ' ' + obj.getFullYear();
    }

    function generatePosterPath(ajaxPath) {
        return "http://image.tmdb.org/t/p/w154" + ajaxPath;
    }

    function convertDate(ajaxDate) {
        var dateParts = ajaxDate.split("-");
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
    }

    function movieValidAndNotInList(movie) {
        var retVal = true;
        if(!movie.title || !movie.character || !movie.poster_path || !movie.release_date) {
            retVal = false;
        }

        if(movie.character.toUpperCase().indexOf("SELF") > -1 ||
           movie.character.toUpperCase().indexOf("NARRAT") > -1 ||
           movie.character.toUpperCase().indexOf("UNCREDITED") > -1 ||
           movie.character.toUpperCase().indexOf("VOICE") > -1 ||
           movie.character.toUpperCase().indexOf("ARCHIVE") > -1) {
            retVal = false;
        }

        for (var i=0; i<$scope.movies.length; i++) {
            if ($scope.movies[i].id == movie.id) {
                retVal = false;
            }
        }
        return retVal;
    }

    function generateAnswers() {
        $scope.movieAnswers = $scope.movies.slice();
        $scope.movieAnswers.sort(compareMoviesByDate);
    }

    function loadDateLine() {
        $scope.firstYear = $scope.movieAnswers[0].releaseDate.getFullYear();
        $scope.lastYear = $scope.movieAnswers[movieArraySize-1].releaseDate.getFullYear();
    }



    function endGame() {
        stopTimer();
        $scope.gameOn = false;
    }

    function compareMoviesByDate(a,b) {
        if (a.releaseDate < b.releaseDate)
            return -1;
        if (a.releaseDate > b.releaseDate)
            return 1;
        return 0;
    }

    function getMovieCredits (actor){
        $scope.ajaxLoading = true;
        movieDB.getActorID(actor)
        .success(function(data, status, headers, config) {
            actorID = data.results[0].id;
            movieDB.getActorCredits(actorID)
            .success(function(data, status, headers, config) {
                $scope.movieAJAXList = data.cast;
                $scope.ajaxLoading = false;
            })
            .error(function(data, status, headers, config) {
                $scope.status=status;
                //TODO more intelligent error handling
            });   
        })
        .error(function(data, status, headers, config) {
            $scope.status=status;
            //TODO more intelligent error handling
        });
    }


    function setTimer() {
        ++timerTotalSecs;
        $scope.timerSecs = timePad(timerTotalSecs%60);
        $scope.timerMins = parseInt(timerTotalSecs/60);
        $scope.$apply();
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function timePad(val)
    {
        var valString = val + "";
        if(valString.length < 2) {
            return "0" + valString;
        }
        else {
            return valString;
        }
    }
});

movieGame.service('movieDB', function($http) {    
    apiKey = "9978f0a8e6ec85a080f9a841e3bbf7e3";     
    this.getActorID = function(actor) {               
        return $http({method: 'GET', 
            url: "https://api.themoviedb.org/3/search/person?api_key=" + apiKey + "&query=" + encodeURIComponent(actor), 
            headers: {
                "Accept":"application/json"
            }
        });
    };
    this.getActorCredits = function(actorID) {
        return $http({method: 'GET', 
            url: "https://api.themoviedb.org/3/person/" + actorID +"/movie_credits?api_key=" + apiKey, 
            headers: {
                "Accept":"application/json"
            }
        });
    };
});









