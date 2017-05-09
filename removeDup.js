
Array.prototype.removeDup = function(){
                var result = [];
                var obj = {};
                for(var i = 0; i < this.length; i++){
                    if(!obj[this[i]]){
                        result.push(this[i]);
                        obj[this[i]] = 1;
                    }
                }

                return result;
            }

var jarname = [1,2,2,2,3,4,5]
jarname.removeDup3();
