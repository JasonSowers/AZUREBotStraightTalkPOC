/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('Greeting', (session, args) => {
    session.send('Welcome to Straight Talk! What can we help you with today?');
})
.matches('ReasonForContact', (session, args) => {
    session.send('Congratulations! Here are some next steps you might want to consider. build a nest egg, save for retirement, save for college, plan for unexpected events. What are you interested in?');
})

.matches('PermanentLifeInsurance', (session, args) => {
    session.send('There are three basic types of permanent life insurance. Whole, Universal and Variable.  Which one would you like to hear more about?');
})
.matches('LifeChange', (session, args) => {
    session.send('Congratulations! Here are some next steps you might want to consider. build a nest egg, save for retirement, save for college, plan for unexpected events. What are you interested in?');
})

.matches('LifeInsurance', (session, args) => {
    session.send('Great! There many different types of life insurance, each with a different purpose. Term life is used to provide protection for a set amount of time. Permanent Life provides protection for your entire lifetime. Which interests you more?');
})

.matches('UnexpectedEvents', (session, args) => {
    session.send('This is a very important part of planning for a family. There are a lot of unexpected events that can happen, from a water pipe breaking to the death of a loved one. Here are some ways that you can pay for the unexpected: out of your emergency fund, disability insurance, life insurance. Which option would you like to hear more about?');
})

.matches('UniversalLife', (session, args) => {
    session.send('Universal life insurance may be a good choice for those with lifetime financial responsibilities or those who wish to transfer wealth, and for people who would like flexibility built into their policy.');
})

.matches('None', (session, args) => {
    session.send('Im sorry I didnt Understand.');
})

.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});
bot.dialog('/', intents);    

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

