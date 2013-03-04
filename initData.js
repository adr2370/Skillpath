//music tree
var music=addTree("music","tree");
var string=addTree("string","tree");
var cello=addTree("cello","node");
var violin=addTree("violin","node");
var bass=addTree("bass","node");
addNodeToTree(music,string);
addNodeToTree(music,cello);
addNodeToTree(music,violin);
addNodeToTree(music,bass);
addConnection(music,string,cello);
addConnection(music,string,violin);
addConnection(music,string,bass);
//cello tree
var strings=[addNode("strings"),addNode("strings"),addNode("strings")];
var fingering=[addNode("fingering"),addNode("fingering"),addNode("fingering")];
var reading=[addNode("reading"),addNode("reading"),addNode("reading")];
var notes=[addNode("notes"),addNode("notes"),addNode("notes")];
addNodeToTree(cello,strings[0]);
addNodeToTree(cello,fingering[0]);
addNodeToTree(cello,reading[0]);
addNodeToTree(cello,notes[0]);
addConnection(cello,strings[0],notes[0]);
addConnection(cello,fingering[0],notes[0]);
//violin tree
addNodeToTree(violin,strings[1]);
addNodeToTree(violin,fingering[1]);
addNodeToTree(violin,reading[1]);
addNodeToTree(violin,notes[1]);
addConnection(violin,strings[1],notes[1]);
addConnection(violin,fingering[1],notes[1]);
//bass tree
addNodeToTree(bass,strings[2]);
addNodeToTree(bass,fingering[2]);
addNodeToTree(bass,reading[2]);
addNodeToTree(bass,notes[2]);
addConnection(bass,strings[2],notes[2]);
addConnection(bass,fingering[2],notes[2]);

//programming tree
var a=addTree("programming","tree");
var b=addTree("web","tree");
var c=addTree("low level","tree");
var d=addTree("html","node");
var e=addTree("javascript","node");
var f=addTree("c","node");
addNodeToTree(a,b);
addNodeToTree(a,c);
addNodeToTree(a,d);
addNodeToTree(a,e);
addNodeToTree(a,f);
addConnection(a,b,d);
addConnection(a,b,e);
addConnection(a,c,f);
//html tree
var g=addNode("basics");
addNodeToTree(d,g);
//javascript tree
var h=addNode("functions");
addNodeToTree(e,h);
//c tree
var i=addNode("assembly");
addNodeToTree(f,i);