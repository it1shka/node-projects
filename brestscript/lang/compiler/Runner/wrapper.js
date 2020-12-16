function Execute(code){
    Array.prototype.get = function(pos){
        return this[pos-1];
    }
    Array.prototype.set = function(pos, val){
        return (this[pos-1] = val);
    }
    try{
    return Function(
        'array, print, getnum, clr, px, rect', 
    code)(
        function(...args){
            return args;
        },
        console.log, 
        str => Number(prompt(str)),
        set_color, 
        set_pixel,
        rect
    );
    }
    catch(e){
        throw e;
        //throw 'JS Error: ' + e.message;
    }
}

if(typeof module !== 'undefined')
    module.exports = Execute;