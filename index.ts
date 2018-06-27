import { IStorage } from "yeezy-cache/dist/core/Storage/IStorage";
import Redis from "redis"

export default class RedisStorage implements IStorage {

    private defaultExpirationInSeconds: number;
    private client: Redis;

    constructor(options: { defaultExpirationInSeconds: number }, redisOptions: { host: string, port: number }) {
        this.defaultExpirationInSeconds = options.defaultExpirationInSeconds;
        this.client = new Redis.createClient(redisOptions.port, redisOptions.host);
    }

    clear(hashKey: string) {
        try {
            this.client.del(hashKey)
        } catch (err) {
            console.error(`Could not delete key ${hashKey} from Redis.`)
        }
    }

    store(hashKey: string, value: any) {

        let storableValue: string;
        if (typeof value === 'object') {
            storableValue = JSON.stringify(value)
        } else if (typeof value === 'string') {
            storableValue = value
        } else {
            throw 'Stored value must be a string'
        }

        try {
            this.client.set(hashKey, storableValue, 'EX', this.defaultExpirationInSeconds)
        } catch (err) {
            console.error(`Could not set key ${hashKey} in Redis.`)
        }
    }

    retrieve(hashKey: string) {
        try {
            return this.client.get(hashKey)
        } catch (err) {
            console.error(`Could not set key ${hashKey} in Redis.`)
        }
    }
}