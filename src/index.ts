import Config from './Config';
import Logger from './Logger';
import Pomelo from './Pomelo';
import * as fs from 'fs';
import * as readline from 'readline';

const logger = new Logger();
const config = new Config();
const token = "YOUR_DISCORD_BOT_TOKEN"; // Substitua pelo seu token do bot
const pomelo = new Pomelo(config, logger, token);

// Função para perguntar ao usuário sobre o proxy e outras configurações
async function Setup() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query: string): Promise<string> => {
        return new Promise(resolve => rl.question(query, resolve));
    };

    const webhookUrl = await question('Qual é a URL do webhook? ');
    const target = await question('Qual é o username a ser verificado? ');
    const message = await question('O que você quer enviar no webhook? ');

    // Perguntas sobre proxy
    // const proxyType = await question('Qual tipo de proxy você deseja usar? (http/socks5) ');
    // const proxyValue = await question(`Qual é o valor da proxy? (exemplo HTTP: ip:porta, SOCKS5: socks5://username:password@ip:porta) `);

    rl.close();

    return { webhookUrl, target, message };
}

// Função principal
(async () => {
    const settings = await Setup();

    fs.writeFileSync('config.json', JSON.stringify(settings, null, 2)); // Armazena o JSON formatado
    console.log(`Configurações salvas em config.json\n`);

    const result = await pomelo.requestUsername(settings.target); // Faz a requisição com o username
    console.log(result);

    console.log(`Resultados de ${settings.target} enviados para o webhook`);
    await pomelo.dispatch(settings.webhookUrl, { username: settings.target, result, data: settings.message }); // Envia o resultado para o webhook

    // Integra a configuração do proxy no Pomelo
    // Integra o proxy
    // console.log(askProxySettings)
    // await pomelo.setProxy(settings.proxyType, settings.proxyValue)
})();