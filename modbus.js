var readholdingregister=function(add,regnum,regcnt)
{
        var s=[];
        s[0]=add;
        s[1]=4;
        var t=regnum/256;s[2]=parseInt(t);
        s[3]=regnum%256;
        t=regcnt/256;s[4]=parseInt(t);
        s[5]=regcnt%256;
        return cal_crc(s);
        
}
var cal_crc=function(s_buf)
{
     var modbuscrc = 40961;
     var Rcrc=65535;
     var s1=[];

     for(var i=0;i<s_buf.length;i++)
     {
         var crc=s_buf[i];s1.push(s_buf[i]);
			
         Rcrc=Rcrc ^ crc; 
         for(var n=1;n<9;n++)
	 {
                var bit=Rcrc & 1;
                Rcrc=Rcrc>>1;
                if(bit==1)
                    Rcrc = Rcrc ^ modbuscrc;
	 }
     }    
         var t=Rcrc%256;
         s1.push(parseInt(t));
         t=Rcrc/256;
         t=t%256;
         s1.push(parseInt(t));
	 return s1;

};

var chk_crc=function(s_buf)
{
        var s=[];
        if((s_buf.length<3)|| (s_buf.length>30))
            return 0;
        var crc_l=s_buf[s_buf.length-2];
        var crc_h=s_buf[s_buf.length-1];
        s_buf.splice(s_buf.length-1,1);
        s_buf.splice(s_buf.length-1,1);
        s=cal_crc(s_buf);
        if((crc_l==s[s.length-2]) & (crc_h==s[s.length-1]))
		{
			//console.log("resultOK");
            return 1;
		}
        else
        {
			//console.log("result NOK "+s[s.length-2].toString());
            return 1;
		}

};

var decode=function(s_buf)
{
	var s=[];
    if(s_buf.length>3)
	{
		//console.log('decode '+ s_buf);
		if(chk_crc(s_buf))
		{
			var len=s_buf[2];
			//console.log('crc ok '+s_buf.length + '  '+len);
            if(s_buf.length>=(len+2))
			   for(var i=0;i<len;i++)
			       s.push(s_buf[i+3]);
		}
	}
	return s;

}

module.exports.readholdingregister = readholdingregister;
module.exports.decode = decode;

//var r=readholdingregister(17,107,3);
//console.log(r);
