class Config {
    private settings: { [key: string]: any };

    constructor() {
        this.settings = {
            remove_proxies: false,
            timeout: 30000 // 30 seconds
        };
    }

    get(key: string): any {
        return this.settings[key];
    }
}

export default Config;