console.log("Hello Bot");

var Twit = require('twit');
var $ = require('jquery');
var _ = require('lodash');
var greetings = require('./greetings.json');
var inspire = require('./inspire.json');
// Node Module: fs, filesystem, allows you to read and write files from local hard-drive  
var fs = require('fs');

var config = require('./config');
var T = new Twit(config);

var userIdList = [];
var usersInfoList = [];
var user = { screenName: 'RedPanda_Labs', ID: 3180043436 };
var pastUsers = [];

function getUsers(getUsersInfo, userId) {

    var params = {
        user_id: userId,
        count: 50
    };

    var promise1 = T.get('friends/ids', params);
    var promise2 = T.get('followers/ids', params);

    Promise.all([promise1, promise2]).then(values => {
        Array.prototype.push.apply(userIdList, values[0].data.ids);
        Array.prototype.push.apply(userIdList, values[1].data.ids);
        getUsersInfo(randomUser, userIdList);
    });


}

function getUsersInfo(randomUser, users) {
    var params = {
        user_id: users
    };

    var promise = T.get('users/lookup', params);

    Promise.all([promise]).then(values => {
        for (var i = 0; i < values[0].data.length; i++) {
            var object = {
                screenName: values[0].data[i].screen_name,
                ID: values[0].data[i].id
            }
            usersInfoList.push(object);
        }
        randomUser(tweetIt, usersInfoList);
    });
}

function checksUser(pastUsers, currentUser) {
    var checkUserOutput = pastUsers.indexOf(currentUser);
    return checkUserOutput;
}

function randomUser(tweetIt, usersInfoList) {
    var rand = _.random(usersInfoList.length - 1);
    var checksUserOutput = checksUser(pastUsers, usersInfoList[rand].ID);

    if (checksUserOutput === -1) {
        user.screenName = usersInfoList[rand].screenName;
        user.ID = usersInfoList[rand].ID;
        pastUsers.push(usersInfoList[rand].ID);

        appendArray(pastUsers);

        tweetIt(usersInfoList[rand]);

    } else {
        randomUser(tweetIt, usersInfoList);
    }
}

function appendArray(array) {
    var pastUsersFile = fs.readFileSync('./pastUsers.json');
    var pastUsers = JSON.parse(pastUsersFile);
    pastUsers.push(array);
    var flatten = [].concat.apply([], pastUsers);
    var pastUsersJSON = JSON.stringify(flatten);
    fs.writeFileSync('./pastUsers.json', pastUsersJSON)
}


function tweetIt(user) {
    var randGreeting = _.random(greetings.compliments.length - 1);

    var tweet = {
        status: greetings.compliments[randGreeting] + ' @' + user.screenName
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log('Something went wrong! Error: ' + err.statusCode);
        } else {
            console.log('TWEETED @ RANDOM USER!')
        }
    }
}

// A BOT that REPLIES ======================================================
// When user tweets @GavinTheBot;Gavin tweets back w/ inspirational message
// Setting up a user stream. Also setting user stream for follow bot. 
var stream = T.stream('user');

// Anytime someone tweets
stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
    // If we wanted to write a file out to look more closely at the data
    // Node Module: fs, filesystem, allows you to read and write files from local hard-drive  
    //var fs = require('fs');
    //var json = JSON.stringify(eventMsg,null,2);
    //fs.writeFile("tweet.json", json);

    var replyto = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var from = eventMsg.user.screen_name;
    var rand = _.random(inspire.inspirationalQuotes.length - 1);

    if (replyto === 'GavinTheBot') {
        var newtweet = '@' + from + " " + inspire.inspirationalQuotes[rand];
        tweetBack(newtweet);
    }
}

function tweetBack(text, replyId) {
    var tweet = {
        status: text
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log('Something went wrong w/ replying @user! Error: ' + err.statusCode);
        } else {
            console.log('REPLIED w/ TWEET!')
        }
    }
}

// FOLLOW BOT: =========================================================
// When user follows @GavinTheBot tweets @user w/ inspirational message
// Anytime someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    var rand = _.random(inspire.inspirationalQuotes.length - 1);
    tweetFollow('@' + screenName + ' ' + inspire.inspirationalQuotes[rand]);
}

function tweetFollow(text) {
    var tweet = {
        status: text
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log('Something went wrong w/ tweeting at follower! Error: ' + err.statusCode);
        } else {
            console.log('TWEETED at recent FOLLOWER!')
        }
    }
}

// RETWEET BOT =====================================
// find latest tweet according the query 'q' in params
function retweet() {

    var hashtags = ['#javascript', '#nodejs', '#Nodejs', '#TwitterBot', '#Webdesign', '#WebDev', '#bot', '#computerscience', '#tech', '#technology', '#ai', '#makeatwitterbot', '#learntocode', '#science'];
    var randHashtags = _.random(hashtags.length - 1);

    var params = {
            q: hashtags[randHashtags], // REQUIRED
            result_type: 'recent',
            lang: 'en'
        }
        // for more parametes, see: https://dev.twitter.com/rest/reference/get/search/tweets

    T.get('search/tweets', params, retweetIt);

    function retweetIt(err, data) {

        // if there no errors
        if (!err) {

            // generate a random tweet
            var rand = _.random(data.statuses.length - 1);
            // grab ID of tweet to retweet
            var retweetId = data.statuses[rand].id_str;

            var retweet = {
                    id: retweetId
                }
                // Tell TWITTER to retweet
            T.post('statuses/retweet/:id', retweet, tweeted);

            function tweeted(err, data, response) {
                if (response) {
                    console.log('RETWEETED!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING.');
                }
            };
        }
        // if unable to Search a tweet
        else {
            console.log('Something went wrong while SEARCHING..');
        }
    };
}

// FAVORITE BOT==========================
// find a random tweet and 'favorite' it
function favoriteTweet() {

    var hashtags = ['#javascript', '#nodejs', '#Nodejs', '#TwitterBot', '#Webdesign', '#WebDev', '#bot', '#computerscience', '#tech', '#technology', '#ai', '#makeatwitterbot', '#learntocode', '#science'];
    var randHashtags = _.random(hashtags.length - 1);

    var params = {
            q: hashtags[randHashtags], // REQUIRED
            result_type: 'recent',
            lang: 'en'
        }
        // for more parametes, see: https://dev.twitter.com/rest/reference

    // find the tweet
    T.get('search/tweets', params, favoriteIt);

    function favoriteIt(err, data) {
        // find tweets
        var tweet = data.statuses;

        // pick a random tweet
        var rand = _.random(tweet.length - 1);
        var randomTweet = tweet[rand];

        // if random tweet exists
        if (typeof randomTweet != 'undefined') {

            var favoriteTweet = {
                    id: randomTweet.id_str
                }
                // Tell TWITTER to 'favorite'
            T.post('favorites/create', favoriteTweet, tweeted);

            function tweeted(err, response) {
                // if there was an error while 'favorite'
                if (err) {
                    console.log('CANNOT BE FAVORITE... Error');
                } else {
                    console.log('FAVORITED!!!');
                }
            };
        }
    };
}

// grab & 'favorite' as soon as program is running...
favoriteTweet();
// 'favorite' a tweet every 5 minutes
setInterval(favoriteTweet, 1000 * 60 * 5);
// grab & 'retweet' as soon as program is running...
retweet();
setInterval(retweet, 1000 * 60 * 5); // Retweet every 5 min

getUsers(getUsersInfo, user.ID);
setInterval(function() { getUsers(getUsersInfo, user.ID); }, 1000 * 60 * 5);
