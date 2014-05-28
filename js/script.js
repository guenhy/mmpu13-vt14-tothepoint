// Vi behöver skriva så att när man gör en ny sökning så resettar resultat-rutan

$(document).ready(function(){

  $('#term').focus(function(){
    var full = $(".result").has("img").length ? true : false;
    if(full == false){
      $('.result').empty();
    }
  });

  var getMovies = function(){

    var film = $('#term').val();

    if(film == ''){
      // Om en personen inte skrivit något skrivs det här medelandet ut
      $('.result').html('<div class="row"><div class="large-12 columns"><div class="panel wrapper"><div class="row"><h3>Please type something in the searchfield.</h3></div></div></div></div>');

    } else {
      //Använder tmdb sök-api för att hitta filmer vars titel matchar det som eftersöks
    
      $.getJSON("http://api.themoviedb.org/3/search/movie?query=" + film + "&api_key=c9ec56f0f1ccf916a4baa2b711e5ce29", function(json) {

        if (json.total_results != 0 || json.total_pages != 0){

          // Använd idnummer från sök-api:n för att hämta resten av informationen med hjälp av huvud-api:n
          // var resultlist = [];
          // for(var i = 0; i < 5; i++){
          //   var movieid = json.results[i].id;

          var movieid = json.results[0].id;
          // Populera result-rutan (Dear f-ing Bob, the amount of code...)
          $('.result').html('<div class="row"><div class="large-12 columns"><div class="panel wrapper"><div class="row"><div class="large-4 medium-4 columns poster"></div><article class="large-8 medium-8 columns"><h2 class="title"></h2><h3 class="org-title orgTitle"></h3><p class="description"></p><h4>Information</h4><strong>Language:</strong> <div class="info language"></div><strong>Released:</strong> <div class="info release"></div><strong>Runtime:</strong> <div class="info runtime"></div><br><strong>Genre:</strong> <div class="info genre"></div><br><strong>Director:</strong> <div class="info director"></div><br><strong>Writer:</strong> <div class="info writer"></div><br><strong>Starring:</strong> <div class="info starring"></div><div class="buttons-wrapper"><div class="read-more"></div></div></article><!-- .8-columns --></div><!-- .row --><div class="row"><div class="large-12 columns"><table class="responsive table-wrapper"><thead><tr><th class="center strong">Source</th><th class="center"><a href="http://www.themoviedb.org/" target="_blank"><img src="img/tmdb.png" alt="The Movie Database" class="logo"></a></th> <th class="center"><a href="http://www.imdb.com/" target="_blank"><img src="img/imdb.png" alt="IMDb" class="logo"></a></th><th class="center"><a href="http://www.rottentomatoes.com/" target="_blank"><img src="img/rottentomatoes.png" alt="Rotten Tomatoes" class="logo"></a></th></tr></thead><tbody><tr><td class="center strong">Maximum</td><td class="center">10</td><td class="center">10</td><td class="center">100%</td></tr><tr><td class="center strong">Rating</td><td class="rating center tmdb-score"></td><td class="rating center imdb-score"></td><td class="rating center rt-score"></td></tr></tbody></table></div><!-- .row --></div><!-- .large-12 columns --></div><!-- .panel-wrapper --></div><!-- .large-12 columns --></div><!-- .row -->');
 
          // Den här getJSON hämtar basinformation så som titel, synopsis och poster
          $.getJSON("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=c9ec56f0f1ccf916a4baa2b711e5ce29", function(json) {

            // Den här jsonen har imdbs id för filmen, json.imdb_id;

            // Hämtar poster eller movie-placeholder-image
            if (json.poster_path) {
              $('.poster').html('<h2 class="loading"></h2><img id="thePoster" src=http://image.tmdb.org/t/p/w500/' + json.poster_path + ' />');
            } else {
              $('.poster').html('<h2 class="loading"></h2><img id="thePlaceHolderImg" src=img/movie-placeholder.png' + ' />');
            }

            $('.title').html('<h3>' + json.title + '</h3>');

            // Hämtar originaltitel
            if (json.title != json.original_title) {
              $('.orgTitle').html('<h5>' + json.original_title + ' <em>(original title)</em>' + '</h5>');
            }
                                                                                                 
            var words = json.overview;
            words = words.substr(0,370);
            if(words.length == 370){
              words += "...";
            }

            $(".description").html(words);

            $('.read-more').html( ' <a href="https://www.themoviedb.org/movie/' + movieid + '" class="button" target="_blank">Read more &raquo;</a>');

            var languages = [];
            $.each(json.spoken_languages, function( index, value ) {
              languages.push(value.name);
              return languages;
            });
            var languagelist = languages.join(", ");
            $( ".language" ).append( document.createTextNode(languagelist));

            $('.release').html(json.release_date);

            $('.runtime').html(json.runtime + " min");

            var genres = [];
            $.each(json.genres, function( index, value ) {
              genres.push(value.name);
              return genres;
            });
            var genrelist = genres.join(" / ");
            $('.genre').append( document.createTextNode( genrelist ) );

            $('.tmdb-score').html(json.vote_average);

          });
          // Den här getJSON hämtar rollistan, manusförfattare och regisör
          $.getJSON("https://api.themoviedb.org/3/movie/" + movieid + "/casts?api_key=c9ec56f0f1ccf916a4baa2b711e5ce29", function(json) {
            var directors = [];
            var writers =[];

            $.each(json.crew, function( index, value ) {
              if(value.job == "Director"){
                directors.push(value.name);
              }

              if(value.job == "Writer"){
                writers.push(value.name);
              }
              if(writers.length < 2){
                if(value.job == "Author"){
                  writers.push(value.name);
                }
              }
              if(writers.length < 2){
                if(value.job == "Screenplay"){
                  writers.push(value.name);
                }
              }
            });

            var directorlist = directors.join(", ");
            $(".director").append( document.createTextNode(directorlist));

            if(writers.length == 0){
              writers.push("No name found");
            }
            var writerslist = writers.join(", ");
            $( ".writer" ).append( document.createTextNode(writerslist));

            var actornames = [];
            for(var i = 0; i < 5; i++){
              actornames.push(json.cast[i].name);
            }
            var actorlist = actornames.join(", ");
            $('.starring').append( document.createTextNode( actorlist ));
          });
        // }
        } else {
          $('.result').html('<div class="row"><div class="large-12 columns"><div class="panel wrapper"><div class="row"><h3>We are afraid nothing was found for that search.</h3></div></div></div></div>');
        }
      });
    }
  return false;
  };

  $('#search').click(getMovies);
  $('#term').keyup(function(event){
    if(event.keyCode == 13){
      getMovies();
    }
  });

});