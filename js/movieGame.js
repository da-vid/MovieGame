var quicklist = angular.module('movieGame', ['ui.sortable']);

quicklist.controller('gameController', function($scope, $http){
    $scope.actorList = ["Brad Pitt", "Julia Roberts", "Tom Hanks", "Harrison Ford", "Samuel Jackson", 
        "George Clooney", "Jack Nicholson", "Bruce Willis", "Sean Connery", 
        "Robin Williams", "Morgan Freeman", "Denzel Washington", 
        "Tom Cruise", "Mel Gibson", "Russell Crowe", "Nicole Kidman", "Cate Blanchett", "Meryl Streep", 
        "Kate Winslet", "Reese Witherspoon", "Scarlett Johannson", "Julianne Moore", "Helen Mirren"];
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


    $scope.initializeGame = function() {
        //Pick a random actor
        $scope.actor = $scope.actorList[Math.floor(Math.random() * $scope.actorList.length)];
        $scope.instruction = "Test your recollection of " + $scope.actor + "'s career!";
        //Get the actor's credits
        getMovieCredits($scope.actor);
    };

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
        if(valString.length < 2)
        {
            return "0" + valString;
        }
        else
        {
            return valString;
        }
    }

    $scope.startGame = function() {
        loadMovies(movieArraySize);
        generateAnswers();        
        timerInterval = setInterval(setTimer, 1000);
        $scope.newGame = false;
        $scope.gameOn = true;
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

        if(movie.character.toUpperCase() === "HIMSELF" || 
           movie.character.toUpperCase() === "HERSELF" ||
           movie.character.toUpperCase() === "NARRATOR" ||
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

    $scope.checkAnswers = function() {
        $scope.numCorrect = 0;
        for (var i=0; i<$scope.movies.length; i++) {
            if ($scope.movies[i].id == $scope.movieAnswers[i].id) {
                $scope.numCorrect++;
            }
        }

        if ($scope.numCorrect == 6) {
            $scope.instruction = "You got them all correct!"
            endGame();
        }
        else {
            jQuery(".checkAnswersSpacer").hide();        
            jQuery(".checkAnswersDisplay").fadeIn("slow", function() {
                jQuery(".checkAnswersDisplay").fadeOut("slow", function() {
                    jQuery(".checkAnswersSpacer").show();   
                }); 
            });
        }
    };

    function endGame() {
        stopTimer();
        gameOn = false;
    }

    function compareMoviesByDate(a,b) {
        if (a.releaseDate < b.releaseDate)
            return -1;
        if (a.releaseDate > b.releaseDate)
            return 1;
        return 0;
    }


    $scope.sortableOptions = {
        update: function(e, ui) {
            $scope.nothing = 1;
        }
    };

    getMovieCredits($scope.actorList[0]);
    // // Game configuration
    // $scope.maxRounds = 5;    
    // numOptions = 3;    
  
    // $scope.startGame = function() {
    //     $scope.round = 0;
    //     $scope.score = 0;
    //     shownCities.length = 0;
    //     $scope.beginRound();
    // };

    function getMovieCredits (actor){
        $scope.ajaxLoading = true;
        apiKey = "9978f0a8e6ec85a080f9a841e3bbf7e3";
        $http({method: 'GET', 
            url: "https://api.themoviedb.org/3/search/person?api_key=" + apiKey + "&query=" + encodeURIComponent(actor), 
            headers: {
                "Accept":"application/json"
            }
        })
        .success(function(data, status, headers, config) {
            actorID = data.results[0].id;
            $http({method: 'GET', 
                url: "https://api.themoviedb.org/3/person/" + actorID +"/movie_credits?api_key=" + apiKey, 
                headers: {
                    "Accept":"application/json"
                }
            })
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
});