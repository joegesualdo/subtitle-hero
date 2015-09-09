var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var SubtitleHero = {
  convertXml: convertXml,
  getYoutubeUrlOfPart: getYoutubeUrlOfPart,
  getWordContexts: getWordContexts
}

function getWordContexts(subtitleObj, callback){
  wordsObj = {}
  var parts = subtitleObj.parts
  for(var i = 0; i < parts.length;i++){
    stringPart = stripSpecialCharacters(parts[i].text)

    arr = stringPart.split(" ")
    for(var x = 0; x < arr.length; x++){
      var startIndex;
      var endIndex;
      var duration;
      var dur;
      var start;
      if(i == 0){
        startIndex = i
      } else {
        startIndex = i - 1
      }
      if(i == (parts.length - 1)){
        endIndex = i
      } else {
        endIndex = i + 1
      }
      if(startIndex == (i - 1) && endIndex == (i + 1)){
        duration = parseInt(parts[startIndex].duration) + parseInt(parts[endIndex].duration) + parseInt(parts[i].duration)
      } else{
        duration = parseInt(parts[startIndex].duration) + parseInt(parts[endIndex].duration)
      }
      var startTime = parseInt(parts[startIndex].start)

      var wordContext = {
        word: arr[x],
        source: subtitleObj.source,
        mediaId: subtitleObj.id,
        start: startTime,
        duration: duration
      };

      if(wordsObj[arr[x].toLowerCase()]){
        wordsObj[arr[x].toLowerCase()]["contexts"].push(wordContext)
      } else {
        wordsObj[arr[x].toLowerCase()] = {"contexts": []}
        wordsObj[arr[x].toLowerCase()]["contexts"].push(wordContext)
      }
    }
  };
  callback(null,wordsObj)
}

function convertXml(source, title, id, xml, callback){
  if(source != "youtube"){
    err = new Error("We don't support the source: " + source)
    callback(err, null)
  }
  convertYoutubeXmlToJSON(title, id, xml, function(err, subtitlesJSON){
    if(err){
      callback(err, null)
    }
    callback(null, subtitlesJSON)
  })
}

function convertYoutubeXmlToJSON(title, id, xml, callback){
  subtitlesJSON = {
    title: title,
    source: "youtube",
    id: id,
    parts: []
  }
  parser.parseString(xml, function (err, result) {
    if(err){
      callback(err, null)
    }
    // new version
    if(result.timedtext){
      transcript = result.timedtext
      newVersion = true;
      startKey = "t";
      durationKey = "d";
    // old version 
    } else {
      transcript = result.transcript
      newVersion = false;
      startKey = "start";
      durationKey = "dur";
    }
    for(var i = 0; i < transcript.text.length; i++){
      textObj = result.timedtext.text[i]
      startTime = textObj.$[startKey]
      duration = textObj.$[durationKey]
      if(newVersion){
        startTime = startTime/1000
        duration = duration/1000
      }
      part = {
        text:textObj._,
        start: startTime, 
        duration: duration
      }
      subtitlesJSON.parts.push(part);
    }
    callback(null, subtitlesJSON);
  })
}

function getYoutubeUrlOfPart(id, part){
  return "https://www.youtube.com/v/"+ id + "?start="+part["start"]+"&end="+(part["start"]+part["duration"]) +"&version=3"
}

function stripSpecialCharacters(string){
  stringPart = string.replace( /([^\x00-\xFF]|\s)*$/g, '' )
  stringPart = stringPart.replace(/&.*;/, '')
  stringPart = stringPart.replace(/\\"/g, '"')
  // Remove newlines (\n)
  stringPart = stringPart.replace(/\r?\n|\r/g, " ")
  // Remove commas
  stringPart = stringPart.replace(/,/g, '')
  // Remove periods 
  stringPart = stringPart.replace(/\./g, '')
  // Remove colons 
  stringPart = stringPart.replace(/:/g, '')
  // Remove semi-colons 
  stringPart = stringPart.replace(/;/g, '')
  // Remove weird double quotes 
  stringPart = stringPart.replace(/“/g,'')
  stringPart = stringPart.replace(/”/g,'')
  // Remove double quotes 
  stringPart = stringPart.replace(/"/g,'')
  // Remove single quotes 
  stringPart = stringPart.replace(/'/g,'')
  // Remove apostrophe 
  stringPart = stringPart.replace(/’/g,'')
  // Remove question mark 
  stringPart = stringPart.replace(/\?/g,'')
  // Remove ! 
  stringPart = stringPart.replace(/!/g,'')
  return stringPart;
}

module.exports = SubtitleHero
