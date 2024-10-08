import * as main from "/scripts/show.js";



var isMobile = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}();

if (isMobile) {
    console.log('mobile')
    var element = document.getElementById("not-mobile");
    console.log(element)
    if (element && element.parentNode) {
        element.parentNode.removeChild(element); // This removes the element from the DOM
        //document.getElementById('search_image_2').parentNode.removeChild(document.getElementById('search_image_2'))
    }
}

var advancedMode = false;
export function expandContract() {

    let el = document.getElementById("simple-search")
    el.classList.toggle('expanded')
    el.classList.toggle('collapsed')

    let el2 = document.getElementById("advanced-search")
    el2.classList.toggle('expanded')
    el2.classList.toggle('collapsed')

    advancedMode = el.classList.contains('collapsed')
    console.log(advancedMode)
    if (advancedMode) {
        document.getElementById("expand-contract-button").innerHTML = "Simple mode";
    }
    else {
        document.getElementById("expand-contract-button").innerHTML = "Advanced mode";
    }
}

var params = new URLSearchParams(window.location.search);
var searchBox = params.get('search');

async function loadall() {
    await simpleSearchFunction();
}

function simpleSearchFunction() {
    let time1 = Date.now()

    main.deleteAllTiles();

    var searchBoxValue = searchBox.toLowerCase();
    var searchForPhrases = [];

    //complecated regex to split string into string array based on spaces outside of quotes.
    searchBoxValue.match(/(".*?"|[^" \s]+)(?=\s* |\s*$)/g).
        forEach(
            function (val, index) {
                searchForPhrases[index] = val.replaceAll("\"", "")
            }
        );
    for (var i = 0; i < searchForPhrases.length; i++) {
        searchForPhrases[i] = searchForPhrases[i].trim();
    }

    main.getServiceData().sort(function (a, b) {
        var aVal = getSimpleSearchRating(a, searchForPhrases);
        var bVal = getSimpleSearchRating(b, searchForPhrases);
        return -(aVal - bVal);
    });

    var numberOfTiles = 0;
    let addresses = []

    for (let i = 0; i < main.getServiceData().length; i++) {

        if (main.getServiceData()[i].searchRating > 0) {
            if (addresses.length < 25) {
                addresses.push(main.getServiceData()[i].address)
            }
            main.renderOneTile(main.getServiceData()[i], searchForPhrases);
            numberOfTiles++;
        }

    }
    if (numberOfTiles < 1) {
        main.renderNothingFoundCard();
    }
    let time2 = Date.now()
    document.getElementById('results_number').innerHTML =
        (numberOfTiles > 9 ?
            ("About " + (Math.round(numberOfTiles / 10) * 10).toString() + " results")
            : numberOfTiles.toString() + (numberOfTiles == 1 ? " result" : " results"))
        + " (" + ((time2 - time1) / 1000).toString() + " seconds)"
if(!isMobile) {
    var map = L.map('map').setView([47.6062, -122.3321], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    var geocoder = L.Control.Geocoder.nominatim(); // Using Nominatim geocoder

    addresses.forEach(function (place, index) {
        geocoder.geocode(place, function (results) {
            if (results.length > 0) {
                var latlng = results[0].center;
                L.marker(latlng).addTo(map)
                    .bindPopup(place)
            }


        });
    });
}
}


//retune function
function getSimpleSearchRating(opportunity, search) {
    var value = 0;

    //TODO: retune this
    for (var i = 0; i < search.length; i++) {
        value += 5 * countInstances(opportunity.description.toLowerCase(), search[i]);
        value += 20 * countInstances(opportunity.title.toLowerCase(), search[i])
        value += 6 * countInstances(opportunity.address.toLowerCase(), search[i])
        value += 10 * countInstances(opportunity.website.toLowerCase(), search[i])
        value += 30 * countInstances(opportunity.zipcode.toLowerCase(), search[i])
    }
    opportunity.searchRating = value;
    return value;
}

function countInstances(string, word) {
    return string.split(word).length - 1;
}

loadall()
