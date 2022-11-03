// ==UserScript==
// @name        [DEBUG] XPath test
// @namespace   Vinicius W Haas
// @match     *
// @description derp
// @version     1
// ==/UserScript==

var tbody = null

function startGather(){
    localStorage["on"] = (!localStorage["on"])
    if ( ! localStorage["on"] ){
        tbody = null
        return
    }

    var wnhd = window.open ( "" , "" , "status=1,toolbar=1");

    wnhd.document.body.parentElement.innerHTML = '<head><style>table {\n  width: 100%;\n  border: 1px solid #000;\n}\n\nth, td {\n/*  width: 25%; */\n  text-align: left;\n  vertical-align: top;\n  border: 1px solid #000;\n  border-collapse: collapse;\n  padding: 0.3em;\n  caption-side: bottom;\n}\n\nthead {\n  padding: 0.3em;\n  color: #fff;\n  background: #000;\n}\n\nth {\n  background: #eee;\n}\n\n.odd th, .odd td {\n  background: #eee;\n}</style></head><body></body>';

    // tbody = wnhd.document.getElementsByTagName("table")[0].childNodes[1];
    // row = tbody.insertRow();
    // row.insertCell().innerHTML = "kljasldjflç";

    // wnhd.document.body.outerHTML=""

    var tdom = wnhd.document.createElement("table");
    wnhd.doRowcument.body.appendChild(tdom);
    var theadRow = tdom.createTHead().insertRow();
    theadRow.insertCell().innerHTML = "pathA" ;
    theadRow.insertCell().innerHTML = "pathB" ;
    theadRow.insertCell().innerHTML = "posA" ;
    theadRow.insertCell().innerHTML = "posB" ;
    theadRow.insertCell().innerHTML = "posC" ;

    theadRow.insertCell().innerHTML = "innerHTML" ;
    theadRow.insertCell().innerHTML = "src" ;
    theadRow.insertCell().innerHTML = "href" ;

    tbody = tdom.createTBody();
}

document.onclick= function(event) {
    if(!localStorage["on"]) return;
    if (event===undefined) event= window.event;                     // IE hack
    var target= 'target' in event? event.target : event.srcElement; // another IE hack

    var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
    var mxy= [ event.clientX+root.scrollLeft, event.clientY+root.scrollTop ];

    var path= getPathTo(target,true);
    var path2= getPathTo(target,false);
    var txy= getPageXY(target);

    // document.title = 'Clicked element '+path+' | '+(mxy[0]-txy[0])+','+(mxy[1]-txy[1])+' | ' + path2;
    console.log('A> '+path);
    console.log('B> '+path2);
    console.log('C> [ '+(mxy[0]-txy[0])+' , '+(mxy[1]-txy[1])+' ] , [ '+(mxy[0])+' , '+(mxy[1])+' ] , [ '+(txy[0])+' , '+(txy[1])+' ] ');
    console.log('----');


    var row = tbody.insertRow() ;
    row.insertCell().innerHTML = path ;
    row.insertCell().innerHTML = path2 ;
    row.insertCell().innerHTML = (mxy[0]-txy[0])+' , '+(mxy[1]-txy[1]) ;
    row.insertCell().innerHTML = (mxy[0])+' , '+(mxy[1]) ;
    row.insertCell().innerHTML = (txy[0])+' , '+(txy[1]) ;

    row.insertCell().innerHTML = target.innerHTML ;
    try { row.insertCell().innerHTML = target.src ;  } catch(_){ row.insertCell(); }
    try { row.insertCell().innerHTML = target.href ; } catch(_){ row.insertCell(); }


    return false;
}

function getPathTo(element,toroot) {
    if (element.id!=='' && !toroot)
        return '//'+element.tagName+'[@id='+element.id+']';
    if (element===document.body)
        return '//'+element.tagName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode,toroot)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
}

function getPageXY(element) {
    var x= 0, y= 0;
    while (element) {
        x+= element.offsetLeft;
        y+= element.offsetTop;
        element= element.offsetParent;
    }
    return [x, y];
}

try{       GM_registerMenuCommand("Call showcurrentdata()", startGather );  }
catch(e){  startGather()  }
