
import nats , { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan; // ? it might be undefined

    get client(){
        if(!this._client){
            throw new Error('Cant access client before its connectd ...');
        }

        return this._client;
    }

    connect(clusterId:string, clientId:string, url:string){
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise( (resolve, reject) => {
            this.client.on('connect', () => {   // or this._client!.on()
                console.log('Connected to NATS');
                resolve('');
            });

            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();