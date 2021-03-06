## Subtitle Hero
> Read and manipulate subtitles

## Install
```
$ npm install --save subtitle-hero
```

## API

### `convertSRT(srtFilePaths, stepCallback, finishedCallback)`

| Name | Type | Description |
|------|------|-------------|
| srtFilePaths | `Array` | A collection of srt files paths to evaluate |

Returns: `Array`, of subtitle Objects.

```javascript
var SubtitleHero = require("subtitle-hero");

SubtitleHero.convertSRT(srtFilePaths, function(subtitle){
  console.log(subtitle)
}, function(){
  console.log("finished")
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
- `buffer` - (Number) number that represents the seconds before and after context 

```javascript
var SubtitleHero = require("subtitle-hero");

SubtitleHero.getWordContexts({subtitles: subtitles, excludeCommonWords: true, requestedWords: []}, function(err, contexts){
  console.log(contexts)
})
```

### `getQuoteContexts(options, callback)`

| Name | Type | Description |
|------|------|-------------|
| options | `Object` | Object that can include the options below |

The available options are:

- `subtitles` - (subtitle) subtitle objects
- `quotes` - (Array) An array of the quotes you want to search for 
- `buffer` - (Number) number that represents the seconds before and after context 

```javascript
var SubtitleHero = require("subtitle-hero");

SubtitleHero.getQuoteContexts({subtitles: subtitles, quotes: ["canary in a coal mine"]}, function(err, contexts){
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
