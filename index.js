var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var SubtitleHero = {
  convertXml: convertXml,
  getYoutubeUrlOfPart: getYoutubeUrlOfPart
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

module.exports = SubtitleHero
