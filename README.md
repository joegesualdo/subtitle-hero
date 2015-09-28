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
      SubtitleHero.getWordContexts({subtitles: [result], excludeCommonWords: true, requestedWords: []}, function(err, contexts){
        console.log(contexts)
      })
    }) 
  });
});
```

## API

### `convertSRT(srtFilePaths, callback)`

| Name | Type | Description |
|------|------|-------------|
| srtFilePaths | `Array` | A collection of srt files paths to evaluate |

Returns: `Array`, of subtitle Objects.

```javascript
var SubtitleHero = require("subtitle-hero");

SubtitleHero.convertSRT(srtFilePaths, function(err, result){
  console.log(result)
}) 
```

### `convertXml(source, videoTitle, videoId, xml, callback)`

| Name | Type | Description |
|------|------|-------------|
| source | `String` | A string representing the source (or formatting type) of the XML |

Returns: `Object`, subtitle Object.

```javascript
var SubtitleHero = require("subtitle-hero");

SubtitleHero.convertXml("youtube", videoTitle, videoId, xml, function(err, result){
  console.log(result)
}) 
```

### `getWordContexts(options, callback)`

| Name | Type | Description |
|------|------|-------------|
| options | `Object` | Object that can include the options below |

The available options are:

- `subtitles` - (subtitle) subtitle objects
- `excludeCommonWords` - (boolean) true if you don't want to include common english words
- `requestedWords` - (array) an array of words you want the context for

```javascript
var SubtitleHero = require("subtitle-hero");

SubtitleHero.getWordContexts({subtitles: subtitles, excludeCommonWords: true, requestedWords: []}, function(err, contexts){
  console.log(contexts)
})
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
### Context 
```javascript
{ 
  word: String,      // "ambiguous"
  source: Number,    // "youtube" 
  mediaId: Number,   // "DH5Dgc" 
  start: Number,    // 345
  duration: Number  // 8
}
```
