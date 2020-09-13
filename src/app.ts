
import * as Input from "./module/input";

async function test()
{
    var msg = await Input.input("foo? ");
    console.log(`msg: ${msg}`);
}

async function main()
{
    let message: string = 'Hello World4';
    console.log(message);

    await test();
    Input.close();
}

main();


