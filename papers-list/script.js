function showJournalArticles(evt) {
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";

    // Clear table
    document.getElementById("main_table").innerHTML = '';

    // Open JSON file
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/astrochristian/reach_papers_list/main/results.json", true);  // last parameter must be true
    
    // Get response
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                // Parse request
                var parsed_json = JSON.parse(request.response);

                // Get list of papers
                var papers = parsed_json.solr.response.docs;

                // Clear table
                var table_html = "";

                // Loop through papers
                for (var i = 0; i < papers.length; i++) {
                    var paper = papers[i];

                    var title = paper.title[0];
                    var authors = paper.author;
                    var date_raw = paper.date;
                    var pub = paper.pub;

                    if ("doi" in paper) {
                        var link = "https://doi.org/" + paper.doi[0];
                        // Add table row
                        table_html += '<tr class="arxiv_row"><td class="arxiv_item_w_link"><a style="color:black" href="'+link+'">';
                    } else {
                        // Add table row
                        table_html += '<tr class="arxiv_row"><td class="arxiv_item">';
                    }
                    
                    // Add title
                    title = title.replace(/(\$)([^\$]+)(\$)/g, "\\($2\\)")
                    
                    var clean_title = title.replace(/<\/?[^>]+(>|$)/g, "");
                    clean_title = clean_title.replace(/Title: /g, "");

                    table_html += '<div class="title">['+(papers.length - i)+'] '+clean_title+'</div>';

                    // Improve formatting of authors
                    var clean_authors = [];

                    for (var j = 0; j < authors.length; j++) {
                        var author_split = authors[j].split(", ");
                        clean_authors.push(author_split[1] + " " + author_split[0])
                    }

                    // Add authors
                    clean_authors = clean_authors.join(', ')
                    table_html += '<div class="author">'+clean_authors+'</div>';

                    // Add publisher
                    table_html += '<div class="pub">'+pub+'</div>';

                    // Add date
                    var date_parsed = new Date(Date.parse(date_raw));
                    console.log(date_raw)
                    console.log(date_parsed)
                    var date = strftime("%B %Y", date_parsed);

                    table_html += '<div class="date">'+date+'</div>';

                    if ("doi" in paper) {
                        // Close column tag
                        table_html += '</a></td></tr>';
                    } else {
                        // Close column tag
                        table_html += '</td></tr>';
                    }
                    
                    // Reload MathJaX
                    reload_mathjax();
                    
                }

                // Write to the table
                document.getElementById("main_table").innerHTML = table_html;
            } else {
                console.error(request.status, request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.status, request.statusText);
    };
    request.send(null);  // not a POST request, so don't send extra data
}

function showConferenceProceedings(evt) {
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";

    // Clear table
    document.getElementById("main_table").innerHTML = '';

    // Open JSON file
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/astrochristian/reach_papers_list/main/reach_conference_proceedings.json", true);  // last parameter must be true
    
    // Get response
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                // Parse request
                var parsed_json = JSON.parse(request.response);

                // Get list of papers
                var papers = parsed_json.proceedings.reverse();

                // Clear table
                var table_html = "";

                // Loop through papers
                for (var i = 0; i < papers.length; i++) {
                    var paper = papers[i];

                    var title = paper.title;
                    var authors = paper.author;
                    //var date_raw = paper.date;
                    var year = paper.year;
                    var pub = paper.pub;

                    if ("doi" in paper) {
                        var link = "https://doi.org/" + paper.doi;
                        // Add table row
                        table_html += '<tr class="arxiv_row"><td class="arxiv_item_w_link"><a style="color:black" href="'+link+'">';
                    } else {
                        // Add table row
                        table_html += '<tr class="arxiv_row"><td class="arxiv_item">';
                    }
                    
                    // Add title
                    title = title.replace(/(\$)([^\$]+)(\$)/g, "\\($2\\)")
                    
                    var clean_title = title.replace(/<\/?[^>]+(>|$)/g, "");
                    clean_title = clean_title.replace(/Title: /g, "");
                    clean_title = clean_title.replace(/[{}]+/g, "");
                    table_html += '<div class="title">['+(papers.length - i)+'] '+clean_title+'</div>';

                    // Improve formatting of authors
                    var clean_authors = [];

                    for (var j = 0; j < authors.length; j++) {
                        authors[j] = authors[j].replace(/[{}]+/g, "");
                        var author_split = authors[j].split(", ");
                        
                        clean_authors.push(author_split[1] + " " + author_split[0])
                    }

                    // Add authors
                    clean_authors = clean_authors.join(', ')
                    table_html += '<div class="author">'+clean_authors+'</div>';

                    // Add publisher
                    clean_pub = pub.replace(/[{}]+/g, "");
                    table_html += '<div class="pub">'+clean_pub+'</div>';

                    // Add date
                    /*var date_parsed = new Date(Date.parse(date_raw));
                    console.log(date_raw)
                    console.log(date_parsed)
                    var date = strftime("%B %Y", date_parsed);
                    

                    table_html += '<div class="date">'+date+'</div>';*/

                    table_html += '<div class="date">'+year+'</div>';

                    if ("doi" in paper) {
                        // Close column tag
                        table_html += '</a></td></tr>';
                    } else {
                        // Close column tag
                        table_html += '</td></tr>';
                    }
                    
                    // Reload MathJaX
                    reload_mathjax();
                    
                }

                // Write to the table
                document.getElementById("main_table").innerHTML = table_html;
            } else {
                console.error(request.status, request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.status, request.statusText);
    };
    request.send(null);  // not a POST request, so don't send extra data
}

function main() {
    document.getElementById("defaultOpen").click();
}

document.addEventListener('DOMContentLoaded', main, false);