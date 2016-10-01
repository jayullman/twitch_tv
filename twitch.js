/*
Notes:
- convert the channel divs into objects and store in an array
- create function that builds list of results with the objects
- add setInerval to refresh channel lists every so often
- add 'Last Updated: <time>'
*/

var channels = ["ESL_SC2", "OgamingSC2", "cretetion",
"freecodecamp", "storbeck", "habathcx", "RobotCaleb",
"noobs2ninjas", "comster404"];
var fullChannelList = [];
var onlineList = [];
var offlineList = [];
var filteredList = [] // filtered down list as user types into textfield

function updateChannels(e) {
  var resultsContainer = document.getElementById('resultsContainer');

  function clearResults() {
    if (resultsContainer.hasChildNodes()) {
      while (resultsContainer.hasChildNodes()) {
        resultsContainer.removeChild(resultsContainer.firstChild);
      }
    }
  }

  function buildResults(list) {
    var resultsContainer = document.getElementById("resultsContainer");
    for (var i = 0; i < list.length; i++) {
      var channelDiv = document.createElement("div");
      var channelTitle = document.createElement("h1");
      channelTitle.innerHTML = list[i].channelName;
      var channelStatus = document.createElement("p");

      console.log(list[i]);
      if (list[i].accountActive == false) {
        channelStatus.innerHTML = "Account Deactivated";
      } else if (list[i].isPlaying == true) {
        channelStatus.innerHTML = "Currently playing " + list[i].game;
      } else {
        channelStatus.innerHTML = "Not currently streaming";
      }

      channelDiv.setAttribute("class", "channelDiv");
      channelDiv.appendChild(channelTitle);
      channelDiv.appendChild(channelStatus);
      resultsContainer.appendChild(channelDiv);
    }
    }

  // following code runs only if updateChannels is called via one
  // of the 3 filtering buttons


  // tests for array - this code runs on initial page loading
  if (e.length) {
    buildResults(fullChannelList);
  } else if (e != undefined) {
    switch (e.target.id) {
      case 'allButton':
      clearResults();
      buildResults(fullChannelList);
      break;

      case 'onlineButton':
      clearResults();
      buildResults(onlineList);
      break;

      case 'offlineButton':
      clearResults();
      buildResults(offlineList);
      break;
    }
  }

}

// TODO: change name of createFunction()
function createFunction(channelName) {

  function createLists(data) {
    function Channel() {
      console.log(data);
      this.channelName = channelName;
      this.isPlaying = (data.stream == null) ? false : true;
      this.accountActive = (data.error == 'Not Found') ? false : true;
      this.URLToAccountPage = 'url';

      if (this.isPlaying == true) {
        this.game = data.stream.game;
      }
    }

    var channelObj = new Channel();
    fullChannelList.push(channelObj);
    if (channelObj.isPlaying) {
      onlineList.push(channelObj);
    } else {
      offlineList.push(channelObj);
    }

    updateChannels(fullChannelList);
  }
  return createLists;
}

$(document).ready(function() {
  // adds event listeners to 'all', 'online', 'offline' buttons

  document.getElementById('allButton').addEventListener('click', updateChannels);
  document.getElementById('onlineButton').addEventListener('click', updateChannels);
  document.getElementById('offlineButton').addEventListener('click', updateChannels);

  for (var i = 0; i < channels.length; i++) {
    var createChannelLists = createFunction(channels[i]);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + channels[i] +
     '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
      createChannelLists);
  }
});
