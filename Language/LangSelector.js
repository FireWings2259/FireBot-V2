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
will be used in the object. This is required since a duel object format is implimented. For instance 
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

EG1 if adding the Australian and Canadian English files to the object then the layout would be as so;
{
    en:{
        AU: require(tp("en-AU.js")), //loading the object into memory.
        CA: tp("en-CA") //Requiring the object be loaded later.
    }
}
EG2 if adding the Japanese language file then the object would look like so;
{
    ja:{
        DEFAULT: tp("ja.js")
    }
}

Once this is done then you must add the full name of the Language and Loaction to the 'lfFD' object (langFiles Full Definition).
To do this simply add the ISO 639-1 code for the language in *lowercase* to said object and add a key called 'name' and set the property to the language name.
If there are locations for the language then add the Alpha 2 code from ISO 3166 in *UPPERCASE* as a key of the language and set the property to be the name of the location.
EG1 if adding the Australian and Canadian English files to the object then the layout would be as so;
{
    en:{
        name:"English",
        AU:"Australian",
        CA:"Canadian"
    }
}
EG2 if adding the Japanese language file then the object would look like so;
{
    ja:{
        name:"Japanese"
    }
}
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
    ,
    ja: { //Example for a Japanese File not loaded into memory.
      DEFAULT: tp("ja.js")
    }
};

const lfFD = {
    en:{
        name: "English",
        AU:"Australian"
    },
    ja:{
        name:"Japanese"
    }
};

/*This function takes multiple forms if input ether;
1 argument is given, The language, as a String, then the default locations is picked.
2 arguments are given, The language then the location, with both as a Strings.
1 object is given, in the form {lang: "LangStr", loc:"LocStr"} (With LangStr being the language, LocStr being the location, both as strings.)
1 array is given, in the form ["LangStr", "LocStr"] (With LangStr being the language, LocStr being the location, both as strings.)
3 arguments are given, with the Language and Location being anything and the 3rd argument being anything except undifined. 
            NOTE: !! THIS WILL GIVE THE ARRAY OF ALL AVAILABLE TRANSLATIONS NOT THE FILE THEMSELFS !!
*/

module.exports = function (lang, loc, dumpLangFiles) {
    if (dumpLangFiles !== undefined) return exportLangFilesArray();
    if (typeof(lang) === "object"){ //Check if object is supplied
        if (Object.keys(lang)[0] === "lang") { //if so set prams
         loc = lang.loc;
         lang = lang.lang;
        } else { //else an array has been given, set prams
            loc = lang[1];
            lang = lang[0];
        }
    }
    if (typeof(lang) !== "string" || Object.keys(langFiles).indexOf(lang) < 0) lang = Object.keys(langFiles)[0]; //Use the first language in LangFiles, if if language is not suplied or dosen't exist in query
    if (typeof(loc) !== "string" || Object.keys(langFiles[lang]).indexOf(loc) < 0) loc = Object.keys(langFiles[lang])[0]; //Use the first location, if loccation is not suplied or dosen't exist in query
    
    if (typeof(langFiles[lang][loc]) === "object"){ //Check if file is loaded into memory
        return langFiles[lang][loc]; //If so give it to them
    } else { //Check if file path is given
        return require(langFiles[lang][loc]); //If not load it!
    }
};

function exportLangFilesArray(){
    let array = [];
    let names = [];
    for (i=0;i < Object.keys(langFiles).length;i++){
        let x = [Object.keys(langFiles)[i]];
        let y = [lfFD[Object.keys(langFiles)[i]].name];
        for (ii=0;ii < Object.keys(langFiles[Object.keys(langFiles)[i]]).length;ii++){
            x.push(Object.keys(langFiles[Object.keys(langFiles)[i]])[ii]);
            if (Object.keys(langFiles[Object.keys(langFiles)[i]])[ii] !== "DEFAULT") 
                y.push(lfFD[Object.keys(langFiles)[i]][Object.keys(langFiles[Object.keys(langFiles)[i]])[ii]]);
        }
        array.push(x);
        names.push(y);
    }
    return [names, array];
}