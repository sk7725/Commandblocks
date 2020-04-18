command(tile,msg){
    if(msg.substring(0,1)!="/") msg="/"+msg;
    var argstmp = msg.substring(1).split('"');
    var args=[];
    for(var i=0;i<argstmp.length;i++){
      if(i%2==0){
        if(argstmp[i].trim()!=''){
          args=args.concat(argstmp[i].trim().split(' '));
        }
      }
      else{
        args.push(argstmp[i].trim());
      }
    }
    if(args.length==0){
      return;
    }
    var cmd = args[0];
    args = args.splice(1);
    switch(cmd){
      case 'overwrite':
        this.setMessageBlockText(null,tile,args.join(' '));
      break;
      case 'say':
        Call.sendMessage(args.join(' '));
      break;
    }
  }
