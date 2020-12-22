# BookBnB Service

Este repositorio contiene una implementación en borrador de un servicio que se conecta con el smart contract en https://github.com/taller-de-programacion-2/bookbnb/.

Notar que este repositorio es solo una guía y se deberán implementar buenas practicas(tests, CI/CD, manejo de errores, etc) asi también como la implementación de las otras funcionalidades.

Para lanzar el proceso se debe correr `npm start` previamente habiendo configurado en el archivo `src/config.js` las variables necesarias, para desarrollo y pruebas se recomienda usar la red local. Se detalla en el repositorio del smart contract como deployar el Smart Contract, paso necesario para obtener el parámetro contractAddress de la configuración.

Para ejecutar el flujo implementado se debe:

1. Llamar al endpoint /identity con el verbo POST para crear una nueva identidad, las identidades son la representación de los usuarios en la blockchain.
1. Enviar fondos a la identidad creada, esto se puede hacer de dos maneras distintas dependiendo de la red en la que nos encontremos:
   - Local: Cuando se corre el proceso de ganache, un conjunto de addresses obtiene un balance muy alto de manera inicial, este balance se puede distribuir usando la consola de truffle(en el repositorio del smart contract `npx truffle console --network development`) y ejecutando en dicho REPL los siguientes comandos `const accounts = await web3.eth.getAccounts()` y `web3.eth.sendTransaction({ to: '0xf53c63F6ADe7381d17775a1351aD49F500A726b4', value: '10000000000000000000', from: accounts[0]})` donde el parametro to debe ser la cuenta a la que se le quiere dar fondos.
   - Testnet: A traves de una faucet, por ejemplo https://faucet.kovan.network, usando el address obtenido en el punto anterior
1. Crear una habitación mediante el endpoint /room con el verbo POST para crear una nueva habitación, se devolverá una transactionHash el cual identificará la habitación creada univocamente. Esta habitación quedara en estado pendiente hasta que la transacción sea confirmada por la red.
1. Para obtener la habitación creada se puede consultar al endpoint /room/:id con el verbo GET donde el :id es el transactionHash devuelto en el punto anterior.
