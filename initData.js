//music tree
var music=addTree("Music","tree");
var string=addTree("String","tree");
var violin=addTree("Violin","node");
var banjo=addTree("Banjo","node");
var ukulele=addTree("Ukulele","node");
var harp=addTree("Harp","node");
var cello=addTree("Cello","node");
var bass=addTree("Bass","node");
var wind=addTree("Wind","tree");
var recorder=addTree("Recorder","node");
var flute=addTree("Flute","node");
var accordion=addTree("Accordion","node");
var bagpipe=addTree("Bagpipe","node");
var brass=addTree("Brass","tree");
var trumpet=addTree("Trumpet","node");
var horn=addTree("Horn","node");
var trombone=addTree("Trombone","node");
var tuba=addTree("Tuba","node");
var bugle=addTree("Bugle","node");
var saxophone=addTree("Saxophone","node");
var percussion=addTree("Percussion","tree");
var triangle=addTree("Triangle","node");
var cowbell=addTree("Cowbell","node");
var xylophone=addTree("Xylophone","node");
var bongo=addTree("Bongo","node");
var conga=addTree("Conga","node");
addNodeToTree(music,string);
addNodeToTree(music,violin);
addNodeToTree(music,banjo);
addNodeToTree(music,ukulele);
addNodeToTree(music,harp);
addNodeToTree(music,cello);
addNodeToTree(music,bass);
addNodeToTree(music,wind);
addNodeToTree(music,recorder);
addNodeToTree(music,flute);
addNodeToTree(music,accordion);
addNodeToTree(music,bagpipe);
addNodeToTree(music,brass);
addNodeToTree(music,trumpet);
addNodeToTree(music,horn);
addNodeToTree(music,trombone);
addNodeToTree(music,tuba);
addNodeToTree(music,bugle);
addNodeToTree(music,saxophone);
addNodeToTree(music,percussion);
addNodeToTree(music,triangle);
addNodeToTree(music,cowbell);
addNodeToTree(music,xylophone);
addNodeToTree(music,bongo);
addNodeToTree(music,conga);
addConnection(music,string,violin);
addConnection(music,string,banjo);
addConnection(music,string,ukulele);
addConnection(music,string,harp);
addConnection(music,string,cello);
addConnection(music,string,bass);
addConnection(music,wind,recorder);
addConnection(music,wind,flute);
addConnection(music,wind,accordion);
addConnection(music,wind,bagpipe);
addConnection(music,brass,trumpet);
addConnection(music,brass,horn);
addConnection(music,brass,trombone);
addConnection(music,brass,tuba);
addConnection(music,brass,bugle);
addConnection(music,brass,saxophone);
addConnection(music,percussion,triangle);
addConnection(music,percussion,cowbell);
addConnection(music,percussion,xylophone);
addConnection(music,percussion,bongo);
addConnection(music,percussion,conga);
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
var p1=addTree("Programming","tree");
var p2=addTree("Web","tree");
var p3=addTree("Html","node");
var p4=addTree("Javascript","node");
var p5=addTree("CSS","node");
var p6=addTree("PHP","node");
var p8=addTree("High level","tree");
var p9=addTree("C++","node");
var p10=addTree("Java","node");
var p11=addTree("Python","node");
var p12=addTree("Low level","tree");
var p13=addTree("C","node");
addNodeToTree(p1,p2);
addNodeToTree(p1,p3);
addNodeToTree(p1,p4);
addNodeToTree(p1,p5);
addNodeToTree(p1,p6);
addNodeToTree(p1,p8);
addNodeToTree(p1,p9);
addNodeToTree(p1,p10);
addNodeToTree(p1,p11);
addNodeToTree(p1,p12);
addNodeToTree(p1,p13);
addConnection(p1,p2,p3);
addConnection(p1,p2,p4);
addConnection(p1,p2,p5);
addConnection(p1,p2,p6);
addConnection(p1,p8,p9);
addConnection(p1,p8,p10);
addConnection(p1,p8,p11);
addConnection(p1,p12,p13);
//html tree
var html1=addNode("Basics");
var html2=addNode("Elements");
var html3=addNode("Tags");
var html4=addNode("Attributes");
var html5=addNode("Doctype and comments");
addNodeToTree(p3,html1);
addNodeToTree(p3,html2);
addNodeToTree(p3,html3);
addNodeToTree(p3,html4);
addNodeToTree(p3,html5);
//css tree
var css1=addNode("Basics");
var css2=addNode("Cascading and inheritance");
var css3=addNode("Selectors");
var css4=addNode("Text Styles");
var css5=addNode("Color");
var css6=addNode("Boxes");
var css7=addNode("Layout");
var css8=addNode("Media");
addNodeToTree(p5,css1);
addNodeToTree(p5,css2);
addNodeToTree(p5,css3);
addNodeToTree(p5,css4);
addNodeToTree(p5,css5);
addNodeToTree(p5,css6);
addNodeToTree(p5,css7);
addNodeToTree(p5,css8);
//javascript tree
var javascript1=addNode("Values, variables, and literals");
var javascript2=addNode("Expressions and operators");
var javascript3=addNode("Regular expressions");
var javascript4=addNode("Statements");
var javascript5=addNode("Functions");
var javascript6=addNode("Iterators and generators");
var javascript7=addNode("Closures");
addNodeToTree(p4,javascript1);
addNodeToTree(p4,javascript2);
addNodeToTree(p4,javascript3);
addNodeToTree(p4,javascript4);
addNodeToTree(p4,javascript5);
addNodeToTree(p4,javascript6);
addNodeToTree(p4,javascript7);
//c tree
var c1=addNode("Assembly");
addNodeToTree(p13,c1);

//Sports tree
var s1=addTree("Sports","tree");
var s2=addTree("Archery","node");
var s3=addTree("Basketball","node");
var s4=addTree("Bat-and-ball","tree");
var s5=addTree("Baseball","node");
var s6=addTree("Softball","node");
var s7=addTree("Bowling","node");
var s8=addTree("Cycling","node");
var s9=addTree("Combat","tree");
var s10=addTree("Grappling","node");
var s12=addTree("Skirmish","node");
var s13=addTree("Weapons","node");
var s14=addTree("Striking","node");
var s15=addTree("Fishing","node");
var s16=addTree("Football","node");
var s17=addTree("Golf","node");
var s18=addTree("Gymnastics","node");
var s19=addTree("Dance","tree");
var s20=addTree("Ballet","node");
var s21=addTree("Jazz","node");
var s22=addTree("Hip-hop","node");
var s23=addTree("Breakdancing","node");
var s24=addTree("Tap","node");
addNodeToTree(s1,s2);
addNodeToTree(s1,s3);
addNodeToTree(s1,s4);
addNodeToTree(s1,s5);
addNodeToTree(s1,s6);
addNodeToTree(s1,s8);
addNodeToTree(s1,s9);
addNodeToTree(s1,s10);
addNodeToTree(s1,s12);
addNodeToTree(s1,s13);
addNodeToTree(s1,s14);
addNodeToTree(s1,s15);
addNodeToTree(s1,s16);
addNodeToTree(s1,s17);
addNodeToTree(s1,s18);
addNodeToTree(s1,s19);
addNodeToTree(s1,s20);
addNodeToTree(s1,s21);
addNodeToTree(s1,s22);
addNodeToTree(s1,s23);
addNodeToTree(s1,s24);

// Bat-and-ball
addNodeToTree(s4,s5);
addNodeToTree(s4,s6);
addConnection(s1,s4,s5);
addConnection(s1,s4,s6);

// Combat
addNodeToTree(s9,s10);
addNodeToTree(s9,s12);
addNodeToTree(s9,s13);
addNodeToTree(s9,s14);
addConnection(s1,s9,s10);
addConnection(s1,s9,s12);
addConnection(s1,s9,s13);
addConnection(s1,s9,s14);

// Dance
addNodeToTree(s19,s20);
addNodeToTree(s19,s21);
addNodeToTree(s19,s22);
addNodeToTree(s19,s23);
addNodeToTree(s19,s24);
addConnection(s1,s19,s20);
addConnection(s1,s19,s21);
addConnection(s1,s19,s22);
addConnection(s1,s19,s23);
addConnection(s1,s19,s24);


// Hiphop



//Breakdancing tree
var breakdancing1=addNode("Toprock");
var breakdancing2=addNode("Popping");
var breakdancing3=addNode("Locking");
var breakdancing4=addNode("Moonwalk");
var breakdancing5=addNode("6-step");
var breakdancing6=addNode("Flare");
var breakdancing7=addNode("Backspins");
var breakdancing8=addNode("Turtles");
var breakdancing9=addNode("Airtracks");
var breakdancing10=addNode("Windmill");
var breakdancing11=addNode("Jackhammer");
var breakdancing12=addNode("2000s");
var breakdancing13=addNode("Freeze");
var breakdancing14=addNode("Suicides");
var breakdancing15=addNode("Headspins");
addNodeToTree(s23,breakdancing1);
addNodeToTree(s23,breakdancing2);
addNodeToTree(s23,breakdancing3);
addNodeToTree(s23,breakdancing4);
addNodeToTree(s23,breakdancing5);
addNodeToTree(s23,breakdancing6);
addNodeToTree(s23,breakdancing7);
addNodeToTree(s23,breakdancing8);
addNodeToTree(s23,breakdancing9);
addNodeToTree(s23,breakdancing10);
addNodeToTree(s23,breakdancing11);
addNodeToTree(s23,breakdancing12);
addNodeToTree(s23,breakdancing13);
addNodeToTree(s23,breakdancing14);
addNodeToTree(s23,breakdancing15);

//Toprock
addNodeToTree(breakdancing1,breakdancing2);
addNodeToTree(breakdancing1,breakdancing3);
addNodeToTree(breakdancing1,breakdancing4);
// addConnection(s23,breakdancing1,breakdancing2);
// addConnection(s23,breakdancing1,breakdancing3);
// addConnection(s23,breakdancing1,breakdancing4);

//6-step
addNodeToTree(breakdancing5,breakdancing6);
addNodeToTree(breakdancing5,breakdancing7);
addNodeToTree(breakdancing5,breakdancing8);
addNodeToTree(breakdancing5,breakdancing9);
addNodeToTree(breakdancing5,breakdancing11);
addNodeToTree(breakdancing5,breakdancing12);
// addConnection(s23,breakdancing5,breakdancing6);
// addConnection(s23,breakdancing5,breakdancing7);
// addConnection(s23,breakdancing5,breakdancing8);
// addConnection(s23,breakdancing5,breakdancing9);
// addConnection(s23,breakdancing5,breakdancing11);
// addConnection(s23,breakdancing5,breakdancing12);

// Windmill: Need Flare, Backspins
addNodeToTree(breakdancing6,breakdancing10);
addNodeToTree(breakdancing7,breakdancing10);
addConnection(breakdancing5,breakdancing6,breakdancing10);
addConnection(breakdancing5,breakdancing7,breakdancing10);

// Suicide: Need Jackhammer, Freeze
addNodeToTree(breakdancing11,breakdancing14);
addNodeToTree(breakdancing13,breakdancing14);
addConnection(breakdancing5,breakdancing11,breakdancing14);
// addConnection(s23,breakdancing13,breakdancing14);

// Headspins: Need Turtles, Airtracks, Jackhammer, 2000s
addNodeToTree(breakdancing8,breakdancing15);
addNodeToTree(breakdancing9,breakdancing15);
addNodeToTree(breakdancing11,breakdancing15);
addNodeToTree(breakdancing12,breakdancing15);
addConnection(breakdancing5,breakdancing8,breakdancing15);
addConnection(breakdancing5,breakdancing9,breakdancing15);
addConnection(breakdancing5,breakdancing11,breakdancing15);
addConnection(breakdancing5,breakdancing12,breakdancing15);
