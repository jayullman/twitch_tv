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
var filteredList = []; // filtered down list as user types into textfield
var currentView = 'all'; // setting to determine which view option user selected

// creates DOM elements from global lists of channel objects
function buildResults() {
  // tests there is user input in the filter text box
  // if there is, the list is built with the filteredList array
  clearResults();
  if (document.getElementById('textFilterChannels').value != '') {
    list = filteredList;
  } else {
    list = fullChannelList;
  }

  var resultsContainer = document.getElementById("resultsContainer");
  for (var i = 0; i < list.length; i++) {
    if (currentView == 'all' ||
       (currentView == 'online' && list[i].isPlaying == true) ||
       (currentView == 'offline' && list[i].isPlaying == false)
     ) {
       var channelDiv = document.createElement("div");
       var channelTitle = document.createElement("h1");
       channelTitle.innerHTML = list[i].channelName;
       var channelStatus = document.createElement("p");
       var logo = document.createElement('img');
       var aElem = document.createElement('a');

       if (list[i].url) {
         aElem.setAttribute('href', list[i].url);
       } else {
         aElem.setAttribute('href', 'https://www.twitch.tv/' + list[i].channelName);
       }

       if (list[i].logo) {
          logo.setAttribute('src', list[i].logo);
          logo.setAttribute('alt', 'Channel Logo');
       } else {
         logo.setAttribute('src', 'http://res.cloudinary.com/dzxlm4zmj/image/upload/v1475772939/twitch_deactivated_iaxquh.png')
       }

       // TODO add url to channel page: a tag wrapping channel div

       if (list[i].accountActive == false) {
         channelStatus.innerHTML = "Account Deactivated";
       } else if (list[i].isPlaying == true) {
         channelStatus.innerHTML = "Currently playing " + list[i].game;
       } else {
         channelStatus.innerHTML = "Not currently streaming";
       }

       aElem.appendChild(channelDiv);
       channelDiv.setAttribute("class", "channelDiv");
       channelDiv.appendChild(logo);
       channelDiv.appendChild(channelTitle);
       channelDiv.appendChild(channelStatus);
       resultsContainer.appendChild(aElem);
     }
  }
}

function typeFilter(e) {
  var userInput = e.target.value.toLowerCase();


  filteredList = fullChannelList.filter(function(t) {
    // returns true if userInput is found within the channelName
    return (t.channelName.toLowerCase().indexOf(userInput) > -1);
    });

  buildResults();
}

function clearResults() {
  var resultsContainer = document.getElementById('resultsContainer');

  if (resultsContainer.hasChildNodes()) {
    while (resultsContainer.hasChildNodes()) {
      resultsContainer.removeChild(resultsContainer.firstChild);
    }
  }
}

function updateChannels(e) {

  // following code runs only if updateChannels is called via one
  // of the 3 filtering buttons

  // tests for array - this code runs on initial page loading
  if (e.length) {
    buildResults(fullChannelList);
  } else if (e != undefined) {
    switch (e.target.id) {
      case 'allButton':

        document.getElementById('allButton').setAttribute('class', 'arrow_box active');
        document.getElementById('onlineButton').setAttribute('class', 'arrow_box');
        document.getElementById('offlineButton').setAttribute('class', 'arrow_box');

        currentView = 'all';
        buildResults(fullChannelList);
        break;

      case 'onlineButton':

        document.getElementById('allButton').setAttribute('class', 'arrow_box');
        document.getElementById('onlineButton').setAttribute('class', 'arrow_box active');
        document.getElementById('offlineButton').setAttribute('class', 'arrow_box');

        currentView = 'online';
        buildResults(onlineList);
        break;

      case 'offlineButton':

        document.getElementById('allButton').setAttribute('class', 'arrow_box');
        document.getElementById('onlineButton').setAttribute('class', 'arrow_box');
        document.getElementById('offlineButton').setAttribute('class', 'arrow_box active');

        currentView = 'offline';
        buildResults(offlineList);
        break;
    }
  }

}

// TODO: change name of createFunction()
function createFunction(channelName) {

  function createLists(data) {
    function Channel() {
      this.channelName = channelName;
      this.isPlaying = (data.stream == null) ? false : true;
      this.accountActive = (data.error == 'Not Found') ? false : true;
      if (this.isPlaying == true) {
        this.game = data.stream.game;
      }
      // Make another AJAX call to get channel information if it exists
      if (data._links) {
        this.moreInfo = true;
      }
    }
    var channelObj = new Channel();

    // creates function that can access additional information
    // from links given from first access point
      function getChannelInfoOuter(channelObj) {
        function getAdditionalChannelInfo(data) {
          channelObj.logo = data.logo;
          channelObj.url = data.url;
          buildResults();
        }
        return getAdditionalChannelInfo;
      }
      var additionalChannelInfoCallback = getChannelInfoOuter(channelObj);
      if (channelObj.moreInfo == true) {
        $.getJSON(data._links.channel +
          '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
          additionalChannelInfoCallback)
      }

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
  document.getElementById('textFilterChannels').addEventListener('keyup', typeFilter);


  for (var i = 0; i < channels.length; i++) {
    var createChannelLists = createFunction(channels[i]);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + channels[i] +
     '?client_id=ndpaljo31vlro8fjjdyvfr3o2t130nv&callback=?',
      createChannelLists);
  }
});
