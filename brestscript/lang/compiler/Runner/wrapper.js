module.exports = function(code){
    try{
    return Function(
        'shout', 
    code)(
        console.log
    );
    }
    catch(e){
        throw 'JS Error: ' + e.message;
    }
}