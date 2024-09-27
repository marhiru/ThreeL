import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Config from './Config';
import Logger from './Logger';
import * as fs from 'fs';
import { ProxyConfig } from './types/proxyConfig';

class Pomelo {
    private endpoint: string;
    private headers: object;
    private session: AxiosInstance;
    private proxiesNotWorking: string[];
    private removeProxies: boolean;
    private timeout: number;
    private logger: Logger;
    private token: string | null;
    private proxyConfig: ProxyConfig | null;
    private proxyType: string | null = null;
    private proxyValue: string | null = null;

    constructor(config: Config, logger: Logger, token: string) {
        this.endpoint = "https://discord.com/api/v9"; // Endpoint base
        this.headers = { "Content-Type": "application/json" }; // Adiciona o token aos cabeçalhos
        this.session = axios.create();
        this.proxiesNotWorking = [];
        this.removeProxies = config.get("remove_proxies");
        this.timeout = config.get("timeout") || 30000; // 30 seconds
        this.logger = logger;
        this.token = token; // Armazena o token

        // Carrega as configurações de proxy do arquivo config.json
        try {
            this.proxyConfig = null;
        } catch (error) {
            this.logger.log(`Error loading proxy config: ${error}`);
            this.proxyConfig = null;
        }

        this.logger.log(`Timeout set to ${this.timeout}`);
        this.logger.log(`Remove proxies set to ${this.removeProxies}`);
        this.logger.log(`Headers set to ${JSON.stringify(this.headers)}`);
    }

    async requestUsername(username: string) {
        // axios({
        //     baseURL: this.endpoint,
        //     headers: this.headers,
        //     // data: {
        //     //     username: username // Passa o username no corpo da requisição
        //     // },
        //     // timeout: this.timeout
        // });

        // Adiciona a configuração de proxy se disponível
        // if (this.proxyConfig) {
        //     axiosConfig.proxy = {
        //         protocol: this.proxyConfig.protocol,
        //         host: this.proxyConfig.host,
        //         port: this.proxyConfig.port,
        //         auth: this.proxyConfig.auth
        //     };
        // }

        try {
            const response = await this.session.post(`${this.endpoint}/unique-username/username-attempt-unauthed`, {
                username: username // Passa o username no corpo da requisição
            }, {
                timeout: this.timeout
            });
            return response.data;
        } catch (error) {
            console.log(error)
            this.logger.log(`Error requesting username ${username}: ${error}`);
        }
    }

    async dispatch(webhookUrl: string, message: any) {
        try {
            const body = {
                content: JSON.stringify(message, null, 2) // Formata o JSON com indentação
            };

            await axios.post(webhookUrl, message, {
                headers: { "Content-Type": "application/json" }
            });
            this.logger.log(`\nPayload: ${JSON.stringify(message)}`);
        } catch (error) {
            this.logger.log(`Error sending to webhook: ${error}`);
        }
    }

    // Método para configurar o proxy
    // async setProxy(type: string, value: string) {
    //     this.proxyType = type;
    //     this.proxyValue = value;
    //     this.logger.log(`Proxy configurado: [${type}] ${value}`);

    //     // Validação da proxy
    //     try {
    //         let proxyConfig: ProxyConfig;

    //         switch (type) {
    //             case 'socks5':

    //                 const match = value.match(/socks5:\/\/(.*):(.*)@(.*):(\d+)/);
    //                 if (match) {
    //                     const username = match[1];
    //                     const password = match[2];
    //                     const host = match[3];
    //                     const port = parseInt(match[4]);

    //                     console.log(match)

    //                     proxyConfig = {
    //                         protocol: 'socks5',
    //                         host,
    //                         port,
    //                         auth: {
    //                             username,
    //                             password
    //                         }
    //                     };
    //                 } else {
    //                     throw new Error('Formato de proxy SOCKS5 inválido');
    //                 }
    //                 break;

    //             case 'http':
    //                 const [host, port] = value.split(':');
    //                 proxyConfig = {
    //                     host,
    //                     port: parseInt(port),
    //                     protocol: 'http'
    //                 };
    //                 break;

    //             default:
    //                 throw new Error('Tipo de proxy inválido');
    //         }

    //         this.proxyConfig = proxyConfig; // Armazena a configuração de proxy
    //         // Configuração de proxy para a requisição de teste
    //         const axiosTestConfig: AxiosRequestConfig = {
    //             proxy: {
    //                 host: '192.168.3.108',
    //                 port: 1080,
    //                 auth: {
    //                     username: 'makenas',
    //                     password: 'okwqd'
    //                 },
    //                 protocol: 'SOCKS5',
    //                 // protocol: proxyConfig.protocol,
    //                 // auth: proxyConfig.auth,
    //                 // host: proxyConfig.host,
    //                 // port: proxyConfig.port,
    //             }
    //         };

    //         const testResponse = await axios.get('https://ipinfo.io/json', axiosTestConfig);
    //         this.logger.log(`Proxy está funcionando. IP da conexão: ${testResponse.data.ip}`);
    //     } catch (error) {
    //         this.logger.log(`Erro ao validar a proxy: ${error}`);
    //         return (
    //             typeof error === 'object' &&
    //             error !== null &&
    //             'message' in error &&
    //             typeof error.message === 'string'
    //         )
    //     }
    // }

    // ... outros métodos existentes ...
}

export default Pomelo;