module.exports = function(code){
    try{
    return Function(
        'write', 
    code)(
        console.log
    );
    }
    catch(e){
        throw 'JS Error: ' + e.message;
    }
}