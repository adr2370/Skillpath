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
var strings=addNode("strings");
var fingering=addNode("fingering");
var reading=addNode("reading");
var notes=addNode("notes");
addNodeToTree(cello,strings);
addNodeToTree(cello,fingering);
addNodeToTree(cello,reading);
addNodeToTree(cello,notes);
addConnection(cello,strings,notes);
addConnection(cello,fingering,notes);
//violin tree
addNodeToTree(violin,strings);
addNodeToTree(violin,fingering);
addNodeToTree(violin,reading);
addNodeToTree(violin,notes);
addConnection(violin,strings,notes);
addConnection(violin,fingering,notes);
//bass tree
addNodeToTree(bass,strings);
addNodeToTree(bass,fingering);
addNodeToTree(bass,reading);
addNodeToTree(bass,notes);
addConnection(bass,strings,notes);
addConnection(bass,fingering,notes);

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