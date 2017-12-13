//FireWings Muliti-Language System

/* global __dirname */

//https://www.loc.gov/standards/iso639-2/php/code_list.php <-- ISO 639-1
//https://www.iso.org/iso-3166-country-codes.html <-- ISO 3166

/*The languages files are labled useing the language codes from ISO 639-1
For localisation (if any) the Alpha 2 Codes of ISO 3166 are used as the suffex
of the language *file* and a child of the language code in the langFiles constant.
IE for Canadian English, the language file wil be named "en-CA.js" 
("en", being the language code of english from ISO 639-1 in *lowercase* and
"CA", being the localtion code for Canadia in *UPPERCASE*, from ISO 3166)
("en", being a child of langFiles and "CA" being a child of "en")
NOTE: For languages that have no localisation, the 'localisation' code of "DEFAULT" 
will be used. This is required since a duel object format is implimented. For instance 
the Japanese file will be named "ja.js".

Adding Files...
When you add a new language to the system, you can ether give the
langFiles constant a String of the filename wrapped in the "tp" function (Just us tp("en-CA.js") as the property)
or load the file, (use "require(tp("en-CA.js"))" as the property) ether way the object is returned
but at the time of writeing, loading the language into the constant is the prefered way.
NOTE: While system specific file paths CAN be given, any pull requests (a guy can dream right?...) will not
be accepted. Due to the function no folders can be used all language files go into the "Language" folder (yes thats
*this* current folder).
ALSO NOTE: The differnt ways of loading can be mixed. For instance English may be loaded in memory but
Japanese may not.
*/

//Cross Platform Path Stuff
var path = require("path");
var fs = require("fs");

function tp(file){ 
    if (typeof(file) === "string" && fs.existsSync(path.join(__dirname, file))) {
    return path.join(__dirname, file);
    } else {
        console.error("Error: 00x001a00");
        console.error("File Error, Defaulting to Australian English");
        return path.join(__dirname, "en-AU.js");
    }
};

const langFiles = {
    en: {
        AU: require(tp("en-AU.js"))
    }
    /*,
    ja: { //Example for a Japanese File not loaded into memory.
      DEFAULT: tp("ja.js"),
    }*/
};

/*This function takes multiple forms if input ether;
1 command is given, The language, as a String, then the default locations is picked.
2 commands are given, The language then the location, with both as a Strings.
1 object is given, in the form {lang: "LangStr", loc:"LocStr"} (With LangStr being the language, LocStr being the location, both as strings.)
1 array is given, in the form ["LangStr", "LocStr"] (With LangStr being the language, LocStr being the location, both as strings.)
*/

module.exports = function (lang, loc) {
    if (typeof(lang) === "object"){ //Check if object is supplied
        if (Object.keys(lang)[0] === "lang") { //if so set prams
         loc = lang.loc;
         lang = lang.lang;
        } else { //else an array has been given, set prams
            loc = lang[1];
            lang = lang[0];
        }
    }
    if (typeof(lang) !== "string" || Object.keys(langFiles).indexOf(lang) < 0) lang = "en"; //Default (Since I wrote this and speak English)
    if (typeof(loc) !== "string" || Object.keys(langFiles[lang]).indexOf(loc) < 0) loc = Object.keys(langFiles[lang])[0]; //Use the first, if loccation is not suplied or dosent exits
    
    if (typeof(langFiles[lang][loc]) === "object"){ //Check if file is loaded into memory
        return langFiles[lang][loc]; //If so give it to them
    } else { //Check if file path is given
        return require(langFiles[lang][loc]); //If not load it!
    }
};