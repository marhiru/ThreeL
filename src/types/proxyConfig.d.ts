export interface ProxyAuth {
    username: string;
    password: string;
}

export interface ProxyConfig {
    host: string;
    port: number;
    protocol: string;
    auth?: ProxyAuth;
}