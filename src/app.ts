
import * as Input from "./module/input";

var authenticate = require("./module/authenticate");

async function test()
{
    var msg = await Input.input("foo? ");
    console.log(`msg: ${msg}`);
}

async function login() : Promise<string>
{
    let username : string = await Input.input("> Username:");
    let password : string = await Input.input("> Password:");

    let token : string = null;

    try
    {
        token = await authenticate.authenticate(username, password);
    }
    catch (error)
    {
        console.log(`> Login unsuccessful! (${error})`);
        return await login();
    }

    // console.log('\033[2J');
    console.log(`> Login successful!`);
    return token;
}

async function main()
{
    let token: string = await login();
    console.log(`> Login successful! Token:${token}`);
}

main();


