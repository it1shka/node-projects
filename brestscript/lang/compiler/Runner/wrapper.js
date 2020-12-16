function Execute(code){
    try{
    return Function(
        'print, getnum, clr, px, rect', 
    code)(
        console.log, 
        typeof window !== 'undefined' ? str => Number(prompt(str)) : () => undefined,
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