var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var srtParser = require('srt-stream-parser');
var striptags = require('striptags');
var CommonWords = require('common-english-words')
var fs = require('fs')
var async = require('async')
var path = require('path')

var SubtitleHero = {
  convertXml: convertXml,
  getYoutubeUrlOfPart: getYoutubeUrlOfPart,
  getWordContexts: getWordContexts,
  convertSRT: convertSRT
}

function getWordContexts(subtitleObjects, excludeCommonWords, callback){
  wordsObj = {}
  async.each(subtitleObjects, function(subtitleObj, callback) {
    CommonWords.getWords(function(err, commonWords){
      var parts = subtitleObj.parts
      for(var i = 0; i < parts.length;i++){
        stringPart = stripSpecialCharacters(parts[i].text)

        arr = stringPart.split(" ")
        for(var x = 0; x < arr.length; x++){
          if(excludeCommonWords){
            if(commonWords.indexOf(arr[x].toLowerCase()) > -1){
              continue;
            }
          }
          // seconds before and after the current text
          buffer_length = 5;
          var startIndex;
          var endIndex;
          var duration;
          var dur;
          var start;
          if ((parts[i].start - buffer_length) >= 0){
            startTime = parts[i].start - buffer_length
            // This adds a buffer to the beginning and end
            duration = parts[i].duration + buffer_length + buffer_length
          } else {
            startTime = parts[i].start
            // This adds a buffer to the end
            duration = parts[i].duration + buffer_length
          }

          var wordContext = {
            word: arr[x].toLowerCase(),
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
      callback()
    });
  }, function(err){
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A subtitleObject failed to process');
      } else {
        callback(null, wordsObj)
      }
  });
}

function convertSRT(srtFilePaths, callback){
  subtitlesArray = []
  async.each(srtFilePaths, function(srtFilePath, callback) {
    var srt_file = fs.createReadStream(srtFilePath);
    var subtitles = {
      // Name the subtitle by the name of the srt file
      source: path.basename(srtFilePath, path.extname(srtFilePath)),
      parts: []
    };
    srt_file.pipe(srtParser()).on('data', function(data) {
        var data = JSON.parse(data);
        // subtitles.push(data);
        part = {
          start: (data.start/1000),
          duration: ((data.end - data.start)/1000),
          text: striptags(stripSpecialCharacters(data.dialogs.join(" ")))
        }
        subtitles.parts.push(part)
    }).on('end', function () {
      // console.log(subtitles)
      subtitlesArray.push(subtitles)
      callback()
    });
  }, function(err){
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A subtitle failed to process');
      } else {
        callback(null, subtitlesArray)
      }
  });
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
