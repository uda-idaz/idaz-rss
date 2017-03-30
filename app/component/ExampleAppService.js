'use strict'

class ExampleAppService{

  setText(id, text){
    var a ;
    document.getElementById(id).innerHTML = text;
  }

}

export { ExampleAppService };
