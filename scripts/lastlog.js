if (typeof(cons2)== "undefined"){
  const cons2 = method => new Cons2(){get : method};
}

const lastlog = extendContent(Block, "lastlog", {
  dialog: null,
  loadDialog(){
    
  },
  isHidden(){
    return Vars.net.active() || !Vars.mobile;
  }
});
