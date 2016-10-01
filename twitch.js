/*
Notes:
- convert the channel divs into objects and store in an array
- create function that builds list of results with the objects
*/

var channels = ["ESL_SC2", "OgamingSC2", "cretetion",
"freecodecamp", "storbeck", "habathcx", "RobotCaleb",
"noobs2ninjas", "comster404"];

function updateChannels(e) {

  var fullChannelList =  [];
  var resultsContainer = document.getElementById('resultsContainer');

  var filteredChannelList = []; // collect divs that meet search criteria

  function clearResults() {
    if (resultsContainer.hasChildNodes()) {
      while (resultsContainer.hasChildNodes()) {
        resultsContainer.removeChild(resultsContainer.firstChild)
      }

    }
  }

  function buildResults(list) {
    for (var i = 0; i < list.length; i++) {
      resultsContainer.appendChild(list[i]);
      console.log('yo');
    }
  }

  fullChannelList = resultsContainer.getElementsByTagName('div');
  console.log(fullChannelList);

  // following code runs only if updateChannels is called via one
  // of the 3 filtering buttons
  if (e != undefined) {
    switch (e.target.id) {
      case 'allButton':
      clearResults();
      buildResults(fullChannelList);
      console.log(fullChannelList);

      break;

      case 'onlineButton':
      // insert code
      break;

      case 'offlineButton':
      // insert code
      break;
    }

  }

}





function createFunction(channelName) {
  function createChannelDiv(data) {
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
    updateChannels(); // remove: test

  }

  return createChannelDiv;
}

$(document).ready(function() {
  // adds event listeners to 'all', 'online', 'offline' buttons

  document.getElementById('allButton').addEventListener('click', updateChannels);
  document.getElementById('onlineButton').addEventListener('click', updateChannels);
  document.getElementById('offlineButton').addEventListener('click', updateChannels);

  for (var i = 0; i < channels.length; i++) {
    var displayData = createFunction(channels[i]);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + channels[i] +
     '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
      displayData);
  }
});
