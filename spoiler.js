var spoilerList;

// Look in storage sync for an object called 'spoilerItem'
chrome.storage.sync.get("spoilerItem", function (results) {
    spoilerList = results;
    if (spoilerList['spoilerItem'] == null) {
        spoilerList = {
            'spoilerItem': []
        };
        saveSpoilerList();
    }
});



// Listeners to listen when the page loads
$(function () {
    updateListView();
    searchForSpoilers();

    // Submit Button onclick adds item in input to list
    $('#submit-button').click(function (evt) {
        itemToAdd = $('#block-item').val().toLowerCase();
        spoilerList['spoilerItem'].push(itemToAdd);
        saveSpoilerList();
        $('#block-item').val('');
        updateListView();
        searchForSpoilers();
    });

    // Clear Button onclick removes all spoilers from list
    $('#clear-button').click(function (evt) {
        spoilerList = {
            'spoilerItem': []
        };
        saveSpoilerList();
        $('#block-item').val('');
        updateListView();
        searchForSpoilers();
    });

    // When a spoilerListItem gets clicked, remove it from the list
    $(document).on('click', '.spoilerListItem', function (item) {
        $('p:contains(' + item.currentTarget.innerHTML + ')').parents('.userContentWrapper').css('-webkit-filter', '');
        spoilerList["spoilerItem"].splice($.inArray(item.currentTarget.innerHTML, spoilerList["spoilerItem"]), 1);
        saveSpoilerList();
        updateListView();
        searchForSpoilers();
    });

    // New up an observer, and tell it what to do when it successfully observes.
    // Necessary for Facebooks "neverending" scrolling
    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs
        searchForSpoilers();
    });

    // This part establishes what needs to be watched, and starts the watching
    observer.observe($('[id^=topnews_main_stream_]').get(0), {
        subtree: true, // watches target and it's descendants
        attributes: true // watches targets attributes
    });
});



// Handles showing the list of terms in the extention popup
function updateListView() {
    if (spoilerList["spoilerItem"] != null) {
        $('#listView').empty();
        var html = '<ul>';
        for (var i = 0; i < spoilerList['spoilerItem'].length; i++) {
            html += '<li><a class="spoilerListItem" href="#">' + spoilerList['spoilerItem'][i] + '</a></li>';
        }
        html += '</ul>';
        $('#listView').append(html);
    }
}

// Handles searching for spoilers
function searchForSpoilers() {
    if (spoilerList["spoilerItem"] != null) {
        var searchString = '';
        spoilerList["spoilerItem"].forEach(function (item) {
            searchString = searchString + "p:contains('" + item + "'), ";
        });
        searchString = searchString.substring(0, searchString.length - 2);
        $(searchString).parents('.userContentWrapper').css('-webkit-filter', 'blur(5px)');
    }
}

// Sets spoilerList to chrome sync storage
function saveSpoilerList() {
    chrome.storage.sync.set({
        'spoilerItem': spoilerList["spoilerItem"]
    }, function (result) {
        if (chrome.runtime.error) {
            console.log(chrome.runtime.error);
        }
    });
}