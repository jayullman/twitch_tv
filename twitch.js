var channels = ["ESL_SC2", "OgamingSC2", "cretetion",
"freecodecamp", "storbeck", "habathcx", "RobotCaleb",
"noobs2ninjas"];

function outer(channelName) {
  function createChannelDiv(data) {
    var resultsContainer = document.getElementById("resultsContainer");

    var channelDiv = document.createElement("div");
    var channelTitle = document.createElement("h1");
    channelTitle.innerHTML = channelName;

    var channelStatus = document.createElement("p");

    channelDiv.setAttribute("class", "channelDiv");
    channelDiv.appendChild(channelTitle);
    channelDiv.appendChild(channelStatus);

    resultsContainer.appendChild(channelDiv);
  }
  return createChannelDiv;
}

$(document).ready(function() {
// TODO: need a closure here to send channelname to callback

  for (var i = 0; i < channels.length; i++) {
    var closureCall = outer(channels[i]);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + channels[i] +
     '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
      closureCall
      // console.log(data);


    );
  }



});
