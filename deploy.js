const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Установка соединения с Ethereum узлом
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Чтение скомпилированных ABI и байт-кода
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, 'build', 'SimpleStorage.abi'), 'utf8'));
const bytecode = fs.readFileSync(path.join(__dirname, 'build', 'SimpleStorage.bin'), 'utf8');

// Адрес и приватный ключ аккаунта для деплоя
const account = 'YOUR_ETHEREUM_ACCOUNT_ADDRESS';
const privateKey = 'YOUR_PRIVATE_KEY';

async function deployContract() {
    // Создание экземпляра контракта
    const contract = new web3.eth.Contract(abi);

    // Создание транзакции для деплоя контракта
    const deployTx = contract.deploy({
        data: '0x' + bytecode,
    });

    // Подсчет газа для транзакции
    const gas = await deployTx.estimateGas();

    // Получение nonce для аккаунта
    const nonce = await web3.eth.getTransactionCount(account, 'latest');

    // Создание подписанной транзакции
    const tx = {
        from: account,
        to: null,
        data: deployTx.encodeABI(),
        gas: gas,
        nonce: nonce,
        chainId: 1,  // Mainnet
    };

    // Подписание транзакции
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Отправка транзакции и получение транзакционного хеша
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Contract deployed at address:', receipt.contractAddress);
}

deployContract().catch(console.error);
