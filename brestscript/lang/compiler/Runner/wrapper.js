function Execute(code){
    try{
    return Function(
        'print, getnum', 
    code)(
        console.log, 
        window ? str => Number(prompt(str)) : () => undefined,
    );
    }
    catch(e){
        throw 'JS Error: ' + e.message;
    }
}

if(typeof module !== 'undefined')
    module.exports = Execute;