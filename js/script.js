$(document).ready(function(){

   $('#term').focus(function(){
      var full = $("#poster").has("img").length ? true : false;
      if(full == false){
         $('#poster').empty();
      }
   });

   var getPoster = function(){

        var film = $('#term').val();

         if(film == ''){

            $('#poster').html("<h2 class='loading'>Please type something in the searchfield.</h2>");

         } else {

            $.getJSON("http://api.themoviedb.org/3/search/movie?query=" + film + "&api_key=c9ec56f0f1ccf916a4baa2b711e5ce29", function(json) {
              console.log(json);
              

               if (json != "Not Found"){
                // Använd id från den första queryin för att hämta resten av informationen, se nedan
                // "http://private-1487-themoviedb.apiary-proxy.com/3/movie/" + json.results[0].id + "?api_key=c9ec56f0f1ccf916a4baa2b711e5ce29"
                // 
                     $('#poster').html('<h2 class="loading"></h2><img id="thePoster" src=http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + ' />');
                     $('#title').html('<h3>' + json.results[0].title + '</h3>');
                     $('#release').html(json.results[0].release_date);
                     $('#score').html(json.results[0].vote_average);
                  } else {
                     $.getJSON("http://api.themoviedb.org/3/search/movie?query=" + film + "&api_key=c9ec56f0f1ccf916a4baa2b711e5ce29", function(json) {
                        console.log(json);
                        $('#poster').html('<h2 class="loading">We are afraid nothing was found for that search.</h2>');
                     });
                  }
             });

          }

        return false;
   }

   $('#search').click(getPoster);
   $('#term').keyup(function(event){
       if(event.keyCode == 13){
           getPoster();
       }
   });

});