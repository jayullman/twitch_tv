var channels = ["ESL_SC2", "OgamingSC2", "cretetion",
"freecodecamp", "storbeck", "habathcx", "RobotCaleb",
"noobs2ninjas", "comster404"];

function createFunction(channelName) {
  function createChannelDiv(data) {
    console.log(data);
    var resultsContainer = document.getElementById("resultsContainer");

    var channelDiv = document.createElement("div");
    var channelTitle = document.createElement("h1");
    channelTitle.innerHTML = channelName;

    var channelStatus = document.createElement("p");
    if (data.hasOwnProperty("error")) {
      channelStatus.innerHTML = "Account deactivated";
    } else if (data.stream == null) {
      channelStatus.innerHTML = "Not currently streaming";
    } else {
      channelStatus.innerHTML = "Currently playing " + data.stream.game;
    }


    channelDiv.setAttribute("class", "channelDiv");
    channelDiv.appendChild(channelTitle);
    channelDiv.appendChild(channelStatus);

    resultsContainer.appendChild(channelDiv);
  }
  return createChannelDiv;
}

$(document).ready(function() {
  for (var i = 0; i < channels.length; i++) {
    var displayData = createFunction(channels[i]);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + channels[i] +
     '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
      displayData);
  }
});

// TODO: rename closures and functions
