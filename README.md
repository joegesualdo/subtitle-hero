## Subtitle Hero
> Read and manipulate subtitles

## Install
```
$ npm install --save subtitle-hero
```

## Usage
```javascript
var https = require('https')
var UriHero = require("uri-hero")
var SubtitleHero = require("subtitle-hero");

// Add values to these variables
youtubeXmlUrl = ""
videoId = ""
videoTitle = ""

var req = https.get(youtubeXmlUrl, function(res) {
  var youtubeXml = '';
  res.on('data', function(chunk) {
    youtubeXml += chunk;
  });

  res.on('end', function() {
    SubtitleHero.convertXml("youtube", videoTitle, videoId, youtubeXml, function(err, result){
      console.log(result)
    }) 
  });
});
```

## Data Structures
### Subtitle
```javascript
{ 
  title: String,  // "Donald Trump Interview"
  source: String, // "youtube"
  id: String,     // "tOAY8waCglg"
  parts: [Part]
}
```
### Part 
```javascript
{ 
  text: String,      // "considered competitive in the the election"
  start: Number,     // 19.89
  duration: Number   // 5.69
}
```
