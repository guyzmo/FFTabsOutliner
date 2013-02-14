'use strict'

function getClass(obj) {
  if (typeof obj === "undefined")
    return "undefined";
  if (obj === null)
    return "null";
  return Object.prototype.toString.call(obj)
    .match(/^\[object\s(.*)\]$/)[1];
}
function dir(obj) {
   var propList = "";
   for(var propName in obj) {
      //if(typeof(obj[propName]) != "undefined") {
         propList += (propName + ", ");
      //}
   }
   console.log("------------- Introspecting object: " + getClass(obj));
   console.log(propList);
   console.log("------------------------------------------------------------- ");
}

module.exports.getClass = getClass;
module.exports.dir = dir;
