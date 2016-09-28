$(document).ready(function() {
  var channel = "beyondthesummit";
  $.getJSON('https://api.twitch.tv/kraken/streams/' + channel +
   '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
    function(data) {
    console.log(data);
  });

});
