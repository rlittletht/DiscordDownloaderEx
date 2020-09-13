
var _readline = require("readline");

var _ireadLine = _readline.createInterface(
    {
    input: process.stdin,
    output: process.stdout
    });

export async function input(question: string): Promise<string>
{
    return new Promise((resolve, reject) => 
                       _ireadLine.question(question, (answer) => resolve(answer)));
}

export function close()
{
    _ireadLine.close();
}

