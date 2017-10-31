
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
const BASE_EIN_SEARCH = URL + 'organizations/';

// EIN search:
// https://projects.propublica.org/nonprofits/api/v2/organizations/142007220.json

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
    'Contra Costa' : ['94565', '94509', '94806', '94513', '94553', '94521', '94531', '94804',
                      '94582', '94520', '94561', '94583', '94523', '94526', '94801', '94549',
                      '94518', '94598', '94803', '94547', '94530', '94506', '94597', '94596', 
                      '94519', '94564', '94563', '94595', '94556', '94507', '94805', '94517',
                      '94572', '94525', '94511', '94575', '94528', '94548', '94516', '94569',
                      '94522', '94524', '94527', '94529', '94570', '94802', '94807', '94808', 
                      '94820', '94850'],
    'Alameda' : ['94505', '94601', '94597', '94604', '94605', '94502', '94602', '94503', '94603',
                 '94589', '94587', '94588', '95628', '94514', '94618', '94403', '94621', '95035',
                 '94619', '94609', '94501', '94608', '94607', '94606', '94613', '94612', '93292',
                 '94611', '94610', '94661', '94702', '94703', '94704', '94705', '94660', '95666',
                 '94806', '94707', '94706', '94709', '94708', '94062', '94710', '94720', '94577',
                 '94580', '94578', '95129', '95128', '94579', '94586', '94582', '94557', '94555',
                 '94560', '94558', '94565', '94568', '94566', '94537', '94538', '94539', '94541',
                 '94542', '94544', '94545', '95391', '94546', '95603', '94550', '94551', '94552',
                 '95377', '95376', '94536'],
    'Napa' : ['94599', '94573', '94508', '94576', '94574', '94503', '94590', '95442', '95476',
              '94515', '94591', '94559', '95687', '94558', '94562', '94533', '94567', '95461'],
    'Sonoma' : ['95430', '95433', '95436', '95439', '95441', '95442', '94515', '95444', '95445',
                '95446', '95409', '95412', '95416', '95419', '95421', '95422', '95425', '94611',
                '94109', '95465', '95471', '95472', '95480', '95473', '95476', '95486', '95450',
                '95448', '95452', '95462', '94926', '94922', '94923', '94574', '95497', '13329',
                '94558', '95492', '94565', '94931', '95330', '94928', '95407', '95406', '94972',
                '95405', '95404', '95403', '95402', '95401', '94954', '94951', '94952', '94158'],
    'Solano' : ['94510', '94571', '94503', '95625', '94589', '94590', '94585', '95694', '94512',
                '94591', '94592', '95690', '95616', '95618', '94553', '94561', '95620', '94559',
                '95688', '94558', '95687', '94565', '93501', '95918', '94534', '94533', '94535'],
    'San Joaquin' : ['94505', '95361', '95252', '95254', '95253', '95236', '95234', '95240',
                     '95237', '95242', '95126', '95351', '95632', '95690', '93660', '95227',
                     '95825', '95686', '95230', '95231', '95215', '95219', '95336', '95220', 
                     '95337', '95330', '95320', '95391', '95385', '95202', '95203', '95204',
                     '95304', '95205', '95377', '95376', '95258', '95210', '95212', '95297', 
                     '95206', '95207', '95648', '95366', '95208', '95296', '95367', '95209'],
    'Santa Cruz' : ['95010', '95051', '95060', '95020', '95019', '95062', '95018', '95065',
                    '95017', '95064', '95067', '95066', '95073', '95005', '95033', '95076',
                    '95030', '95007', '95006', '95003', '95041', '94060'],
    'San Benito' : ['95075', '95004', '95020', '93210', '95043', '95024', '95023', '93930', 
                    '95045']
  };


var responseText = '';
var totalResults;
var orgs = [];
var sfBayOrgs = [];




var handlers = {

  getCAData : function() {
  	model.getCAData();
  },

  showOrgs : function() {
  	view.showOrgs();
  },

  getSFData : function() {
  	model.makeNineCountiesArray(); 
  },

  showBayAreaOrgs : function() {
  	view.showBayAreaOrgs();
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
  },


  showBayAreaOrgs : function() {
    var stringBayAreaOrgs = JSON.stringify(sfBayOrgs);

    console.log('\n\n\n===SF Bay orgs in our counties are=== ' + stringBayAreaOrgs);
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
	  
	  //for(var i = 0; i < orgs.length; i++) {
	  for(var i = 0; i <= 20; i++) {
	  	var ein = orgs[i].ein;
	  	var einUrl = BASE_EIN_SEARCH + ein + '.json';
	  	// send off for each ein data - but need to make this synchronous, or do we?
	  	console.log('making newUrl req for EIN: ' + einUrl);
	  	makeCorsRequest(einUrl, model.receiveNineCountiesData);
	  }

	},

	receiveNineCountiesData : function() {

		var parsedOrg = JSON.parse(responseText);
		//var orgBlob = [];
		var orgMetaObj = {};
		var county = getCountyFromZip(parsedOrg.organization.zipcode);

		console.log('received EIN result with county: ' + county);
		//console.log('it is: ' + responseText);

		if(county !== 'unknown') {
	      console.log('\ncounty IS in our area: ' + county);
	      orgMetaObj.ein = parsedOrg.organization.ein;
	      orgMetaObj.zip = parsedOrg.organization.zipcode;
	      orgMetaObj.county = county;
	      orgMetaObj.organization = parsedOrg.organization;
	      //orgBlob.push(orgMetaObj.);
	      sfBayOrgs.push(orgMetaObj);
		} else {
		  console.log('\ncounty is not in our area: ' + county);
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



///////////////////////////////////////////////////////////////////////////
// Helper - getCountyFromZip
function getCountyFromZip(zipString) {

	var zip = zipString.slice(0, 5);

	for(var key in BAY_AREA_ZIPS) {
		if(BAY_AREA_ZIPS[key].includes(zip)) {
			return key;
		}
	}
	return 'unknown';
}
///////////////////////////////////////////////////////////////////////////

