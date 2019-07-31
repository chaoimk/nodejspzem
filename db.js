var myjson = require('./public/dbjson.js');
var DIPt=function(){
    this.PtID=-1;  // <-- class variable
	this.PtName="";  // <-- class variable
	this.PtDesc="";  // <-- class variable
    this.PtVal=0; // <-- class variable
    this.PtCurState=""; // <-- class variable
    this.PtState0=""; // <-- class variable
    this.PtState1=""; // <-- class variable
    this.LastTime; // <-- class variable
	this.Unit; // <-- class variable

}
DIPoint=[];
DIPtName=[];
AIPoint=[];
AIPtName=[];

DIPoint=JSON.parse(DI);
AIPoint=JSON.parse(AI);
for(var n=0;n<DIPoint.length;n++)
    DIPtName.push(DIPoint[n].PtName);
module.exports.DIPoint = DIPoint;

for(var n=0;n<AIPoint.length;n++)
    AIPtName.push(AIPoint[n].PtName);
module.exports.AIPoint = AIPoint;

var updateDI = function(PtName,PtVal) {
	var RPt=new DIPt();
	if(DIPoint.length>0)
	{
		var n=DIPtName.indexOf(PtName);
		console.log("updateDI"+PtName+String(n));
		if(n>=0){
			if(DIPoint[n].PtVal!=PtVal){
				var str='';
				
				if(PtVal==0)
				{
					DIPoint[n].PtCurState=DIPoint[n].PtState0;
					DIPoint[n].PtVal=0;
				}
				else
				{
					DIPoint[n].PtCurState=DIPoint[n].PtState1;
					DIPoint[n].PtVal=1;
				}
                DIPoint[n].LastTime= Date(); 

				RPt=DIPoint[n];
				RPt.LastTime= Date();
			}
		}
	}
    return RPt;
};
var updateAI = function(PtName,PtVal) {
	var RPt=new DIPt();
	if(AIPoint.length>0)
	{
		var n=AIPtName.indexOf(PtName);
		if(n>=0){
			AIPoint[n].PtVal=PtVal;
			AIPoint[n].LastTime= Date();
		}
		RPt=AIPoint[n];
	}
    return RPt;
};
module.exports.updateDI = updateDI;
module.exports.updateAI = updateAI;
