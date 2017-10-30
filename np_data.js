
///////////////////////////////////////////////////////////////////////////
// cors-anywhere
// https://github.com/Rob--W/cors-anywhere/#documentation
// If you want to automatically enable cross-domain 
// requests when needed, use the following snippet:
(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();
///////////////////////////////////////////////////////////////////////////



const URL = 'https://projects.propublica.org/nonprofits/api/v2/';
const BASE_SEARCH = URL + 'search.json?';
const CA_SEARCH = BASE_SEARCH + 'state%5Bid%5D=CA';
const TEST_URL = 'https://httpbin.org/';
const BASE_CA_SEARCH = 'https://projects.propublica.org/nonprofits/api/v2/search.json?state%5Bid%5D=CA&page=';



// https://projects.propublica.org/nonprofits/api/v2/search.json?page=1%2Bstate%5Bid%5D=CA
// https://projects.propublica.org/nonprofits/api/v2/search.json?state%5Bid%5D=CA <-- this works
// https://projects.propublica.org/nonprofits/api/v2/search.json?page=1 <-- this works
// https://projects.propublica.org/nonprofits/api/v2/search.json?page=1&state%5Bid%5D=CA <-- this works
// https://projects.propublica.org/nonprofits/api/v2/search.json?state%5Bid%5D=CA&page=0


var responseText = '';
//var isReady = false;

var totalResults;
var orgs = [];
var metadata = {};




var handlers = {

  getCAData : function() {
  	model.getCAData();
  }

  showOrgs : function() {
  	view.showOrgs();
  }

}


var view = {

  showOrgs : function() {
    console.log(JSON.stringify(orgs));
  }

  

  }


}


var model = {

	getCAData : function() {

	  var url = BASE_CA_SEARCH + '0';
  	  //var url = TEST_URL;
      makeCorsRequest(url, model.processCAData);
      console.log('cors req has been sent');
	},

	processCAData : function() {
	  console.log('callback to model was called. Text is: ' + responseText);

	  // decide which page we're on and get subs pages if need be

	  // get metadata
	  var parsedText = JSON.parse(responseText);
	  var cur_page = parsedText.cur_page;
	  var num_pages = parsedText.num_pages;
	  
	  totalResults = parsedText.total_results;
	  console.log('totalResults is: ' + totalResults + '\n' + 'cur_page is: ' + cur_page);

	  orgs = orgs.concat(parsedText.organizations);

      /*
	  while(cur_page < num_pages) {

	  }
      */
	  if(cur_page < 2) {
	  	var pageNumString = (cur_page + 1).toString();
	  	var newUrl = BASE_CA_SEARCH + pageNumString;
	  	console.log('making newUrl req with pageNumString: ' + pageNumString);
	  	makeCorsRequest(newUrl, model.processCAData);
	  }
	}

}




  

  /*
  setupEventListeners: function() {
    
    //var todosUl = document.querySelector("ul");

    todosUl.addEventListener('click', function(event) { 
      console.log(event.target.parentNode.id);
      // get the element that was clicked on
      var elementClicked = event.target;
    });
    
  }
  */


//view.setupEventListeneres();



/**
took this all out as I'm pretty sure Pro Publica doesn't support CORS
**/

// https://www.html5rocks.com/en/tutorials/cors/
// Create the XHR object.
function createCORSRequest(method, url) {

  var xhr = new XMLHttpRequest();
  
  if("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if(typeof XDomainRequest !== "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}


// Make the actual CORS request.
function makeCorsRequest(url, cb) {
  // This is a sample server that supports CORS.
  //var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    //var title = getTitle(text); // not given with API data
    console.log('Response from CORS request to ' + url + '\n');
    
    // inform the callback
    responseText = text;
    cb();
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}


