
import * as Input from "./module/input";

var authenticate = require("./module/authenticate");

async function test()
{
    var msg = await Input.input("foo? ");
    console.log(`msg: ${msg}`);
}

var login = () =>
{
    Input.input("> Username:").then((username) =>
                                 {
                                     Input.input("> Password:").then((password) =>
                                                                  {
                                                                      authenticate.authenticate(username, password)
                                                                      .then((token) =>
                                                                            {
//                                                                                console.log('\033[2J');
                                                                                console.log(`> Login successful!`);
                                                                                console.log(`> Login successful! Token:${token}`);
                                                                                // displayServers(token);
                                                                            }).catch((error)=>
                                                                      {
                                                                          console.log(`> Login unsuccessful!`);
                                                                          login();
                                                                      })
                                                                  })
                                 })
}

async function main()
{
    let message: string = 'Hello World4';
    console.log(message);

    login();
}

main();


