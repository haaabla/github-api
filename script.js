// 5) Clicking user profile create another function commitRequest(){}

$(document).ready(function(){
//TO MAKE HANDLEBARS WORK
Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('template');

    Array.prototype.slice.call(templates).forEach(function(tmpl) {
        Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
    });

var username;
var password;
var user;
var $showresults = $('#showresults');

//LOGIN BUTTON
$('.enter-user-page').hide();

$('.button').on('click', function () {
    username = $('.username').val();
    password = $('.password').val();
    $('.login-form').fadeOut(1000);
    $('.enter-user-page').fadeIn(800);
});

//SEARCH
$('.button-search').on('click', function(){
    user = $('.input-search').val();

    $.ajax({
        url: 'https://api.github.com/users/' + user + '/repos',
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password)
        },
        success: function(data){
            console.log(data);
            var items = data.map(function(item) {
                return {
                    fullName: item.full_name,
                    image: item.owner.avatar_url,
                };
            });
            $showresults.html(Handlebars.templates.results({
                items: items
            }));
        }
    });
});

var $owner;

$(document).on('click', 'h2', function(e){
    $owner = $(e.target);
    $.ajax({
        url: 'https://api.github.com/repos/' + $owner.text() + '/commits',
        method: 'GET',
        data: {
            limit: 10
        },
        success: function(data){
            var commit = data.map(function(item) {
                return {
                    message: item.commit.message,
                    author: item.author.login
                };
            });
            $owner.closest('.each-result').find('.showMessageHTML').html(Handlebars.templates.showMessage({ //goes up to find parent -> then finds the class within
                commit: commit
            })); //targets siblings
        }
    });
});

});
