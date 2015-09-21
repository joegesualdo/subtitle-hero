var SubtitleHero = require("./index.js");
var fs = require('fs')
var path = require('path')

var gsrtFilePath = path.resolve() + '/greenmile.srt'
var hsrtFilePath = path.resolve() + '/the-wizard-of-oz.srt'
var subtitleObjects = []
SubtitleHero.convertSRT("Green mile", gsrtFilePath, function(err, gresult){
  subtitleObjects.push(gresult)
  SubtitleHero.convertSRT("The Wizard of Oz", hsrtFilePath, function(err, hresult){
    subtitleObjects.push(hresult)
    // console.log(hresult)
    SubtitleHero.getWordContexts(subtitleObjects, true, function(err, contexts){
      console.log(contexts.tail)
    })
  })
}) 
