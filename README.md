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
var SubtitleHero = require("./index.js");

youtubeXmlUrl = ""
videoId = ""
videoTitle

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
