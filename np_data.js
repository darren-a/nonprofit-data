
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

// https://projects.propublica.org/nonprofits/api/v2/search.json?state%5Bid%5D=CA <-- this works
// https://projects.propublica.org/nonprofits/api/v2/search.json?page=1 <-- this works
// https://projects.propublica.org/nonprofits/api/v2/search.json?page=1&state%5Bid%5D=CA <-- this works
// https://projects.propublica.org/nonprofits/api/v2/search.json?state%5Bid%5D=CA&page=0

const BAY_AREA_ZIPS = 
  { 'SF' : ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111', 
            '94112', '94114', '94115', '94116', '94117', '94118', '94121', '94122', '94123',
            '94124', '94127', '94129', '94130', '94131', '94132', '94133', '94134', '94158'],
    'Marin' : ['94924', '94925', '94920', '94913', '94904', '94901', '94903', '94949', '94948', 
                '94947', '94946', '94945', '94037', '94941', '94558', '94940', '94939', '94938',
                '94563', '94937', '94933', '94930', '94929', '94928', '94970', '94971', '94972', 
                '95471', '94960', '94963', '94703', '94105', '94964', '94965', '94705', '94956', 
                '95476', '94957', '94950', '94952', '94953', '90266', '94973', '95650'],
    'San Mateo' : ['94602', '95012', '94134', '95023', '94403', '94402', '94401', '94404', 
                   '94112', '94107', '94102', '94303', '94301', '94089', '89431', '94074', 
                   '94080', '94066', '94070', '94062', '94063', '94065', '94014', '94013', 
                   '94015', '94018', '94020', '94019', '94920', '94021', '94024', '94025', 
                   '94028', '94027', '94030', '94553', '94037', '94038', '94044', '94060', 
                   '94061', '94541', '97701', '46123', '21401', '94002', '94011', '94005', 
                   '94010'],
    'Santa Clara' : ['95002', '95008', '95013', '95014', '95020', '94022', '94024', '95030',
                     '95032', '95035', '95037', '95140', '94040', '94041', '94043', '94301',
                     '94304', '94306', '95117', '95118', '95119', '95120', '95121', '95122', 
                     '95123', '95124', '95125', '95148', '95126', '95127', '95128', '95129',
                     '95130', '95131', '95132', '95133', '95110', '95111', '95134', '95135', 
                     '95136', '95112', '95113', '95116', '95138', '95139', '95046', '95050', 
                     '95051', '95053', '95054', '95070', '94305', '94085', '94086', '94087', 
                     '94089'],
    



  };



var responseText = '';
var totalResults;
var orgs = [];
var metadata = {};




var handlers = {

  getCAData : function() {
  	model.getCAData();
  },

  showOrgs : function() {
  	view.showOrgs();
  }

}


var view = {

  showOrgs : function() {

  	var einCount = 0;
    console.log(JSON.stringify(orgs));

    // count the number of EINs in the object
    einCount = orgs.reduce(function(total, item) {
    	if(item.ein !== undefined) {
    	  return total + 1;
    	}
    }, 0);

    console.log('ein count is: ' + einCount);
    document.getElementById("orgs").innerHTML += einCount;
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
	  if(cur_page < 1) {
	  	var pageNumString = (cur_page + 1).toString();
	  	var newUrl = BASE_CA_SEARCH + pageNumString;
	  	console.log('making newUrl req with pageNumString: ' + pageNumString);
	  	makeCorsRequest(newUrl, model.processCAData);
	  } 
	},

	makeNineCountiesArray : function() {
		// go through all CA EINs and put all those in the 9 counties
		// into a separate array of EIN objects.



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


