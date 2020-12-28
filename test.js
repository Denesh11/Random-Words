var cheerio = require('cheerio');
var request = require('request');
var nlp = require('compromise');
var nlpPronounce = require('compromise-pronounce');
nlp.extend(nlpPronounce);
const randomUseragent = require('random-useragent');
var rua = randomUseragent.getRandom();
var wordOfDay = [];


request({
    method: 'GET',
    url: 'https://randomword.com/',
    headers: {
        'User-Agent': rua
    }
}, function(err, response, body, callback) {
    if (err) return console.error(err);

    $ = cheerio.load(body);

    if (wordOfDay.length > 0) {
        wordOfDay = [];
    }

    var post = $('.section #shared_section');
    var word = post.find('#random_word').eq(0).text().replace('\r\n\t\t\t\t\t', '').replace('\r\n\t\t\t\t', '').replace('\n\t\t\t\t\t', '').replace('\n\t\t\t\t', '');
    var definition = post.find('#random_word_definition').eq(0).text().replace('\n', '');
    var pronounceword = word;
    var doc = nlp(pronounceword);
    var pronounces = doc.terms().pronounce().map(o => o.pronounce).toString();
    var pronounce = pronounces.replace(",", "");
    wordOfDay.push({
        word: decodeURI(word.charAt(0).toUpperCase() + word.slice(1)),
        definition: decodeURI(definition.charAt(0).toUpperCase() + definition.slice(1)),
        pronunciation: decodeURI(pronounce.charAt(0).toUpperCase() + pronounce.slice(1))
    })
    console.log("User-Agent:", rua);
    console.log(JSON.stringify(wordOfDay, null, 4));
});