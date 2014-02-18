var quicklist=angular.module("movieGame",["ui.sortable"]);quicklist.controller("gameController",function(e,t){function r(){while(e.movies.length<movieArraySize)i()}function i(){var t=Math.floor(Math.random()*e.movieAJAXList.length),n=e.movieAJAXList[t];a(n)&&e.movies.push({id:n.id,title:n.title,character:n.character,posterPath:o(n.poster_path),releaseDate:u(n.release_date),displayDate:s(u(n.release_date))})}function s(e){var t=["January","February","March","April","May","June","July","August","September","October","November","December"];return t[e.getMonth()]+" "+e.getFullYear()}function o(e){return"http://image.tmdb.org/t/p/w154"+e}function u(e){var t=e.split("-");return new Date(t[0],t[1]-1,t[2].substr(0,2))}function a(t){var n=!0;if(!t.title||!t.character||!t.poster_path||!t.release_date)n=!1;if(t.character.toUpperCase().indexOf("SELF")>-1||t.character.toUpperCase().indexOf("NARRAT")>-1||t.character.toUpperCase().indexOf("UNCREDITED")>-1||t.character.toUpperCase().indexOf("VOICE")>-1||t.character.toUpperCase().indexOf("ARCHIVE")>-1)n=!1;for(var r=0;r<e.movies.length;r++)e.movies[r].id==t.id&&(n=!1);return n}function f(){e.movieAnswers=e.movies.slice();e.movieAnswers.sort(h)}function l(){e.firstYear=e.movieAnswers[0].releaseDate.getFullYear();e.lastYear=e.movieAnswers[movieArraySize-1].releaseDate.getFullYear()}function c(){v();e.gameOn=!1}function h(e,t){return e.releaseDate<t.releaseDate?-1:e.releaseDate>t.releaseDate?1:0}function p(n){e.ajaxLoading=!0;apiKey="9978f0a8e6ec85a080f9a841e3bbf7e3";t({method:"GET",url:"https://api.themoviedb.org/3/search/person?api_key="+apiKey+"&query="+encodeURIComponent(n),headers:{Accept:"application/json"}}).success(function(n,r,i,s){actorID=n.results[0].id;t({method:"GET",url:"https://api.themoviedb.org/3/person/"+actorID+"/movie_credits?api_key="+apiKey,headers:{Accept:"application/json"}}).success(function(t,n,r,i){e.movieAJAXList=t.cast;e.ajaxLoading=!1}).error(function(t,n,r,i){e.status=n})}).error(function(t,n,r,i){e.status=n})}function d(){++timerTotalSecs;e.timerSecs=m(timerTotalSecs%60);e.timerMins=parseInt(timerTotalSecs/60);e.$apply()}function v(){clearInterval(n)}function m(e){var t=e+"";return t.length<2?"0"+t:t}e.actorList=["Brad Pitt","Julia Roberts","Tom Hanks","Harrison Ford","Samuel Jackson","George Clooney","Jack Nicholson","Bruce Willis","Sean Connery","John Cusack","Billy Bob Thornton","Robin Williams","Morgan Freeman","Denzel Washington","Tom Cruise","Mel Gibson","Russell Crowe","Nicole Kidman","Cate Blanchett","Meryl Streep","Kate Winslet","Reese Witherspoon","Julianne Moore","Helen Mirren"];e.movies=[];e.actor="";e.movieAJAXList={};e.movieAnswers=[];e.guesses=0;e.numCorrect=0;e.ajaxLoading=!0;e.newGame=!0;e.gameOn=!1;e.timerMins="0";e.timerSecs="00";timerTotalSecs=0;movieArraySize=6;e.instruction="";jQuery(".checkAnswersDisplay").hide();var n;e.sortableOptions={update:function(t,n){e.nothing=1}};e.initializeGame=function(){e.actor=e.actorList[Math.floor(Math.random()*e.actorList.length)];e.instruction="Test your recollection of "+e.actor+"'s career!";p(e.actor)};e.startGame=function(){r(movieArraySize);f();l();n=setInterval(d,1e3);e.newGame=!1;e.gameOn=!0;e.instruction="Click and drag to place these "+e.actor+" movies in order by release date."};e.checkAnswers=function(){e.numCorrect=0;for(var t=0;t<e.movies.length;t++)e.movies[t].id==e.movieAnswers[t].id&&e.numCorrect++;if(e.numCorrect==6){e.instruction="You got them all correct!";c()}else jQuery(".checkAnswersDisplay").fadeIn(200).delay(1300).fadeOut(100)};e.giveUp=function(){jQuery(".checkAnswersDisplay").hide();e.instruction="You gave up!";c()};e.playAgain=function(){location.reload()}});