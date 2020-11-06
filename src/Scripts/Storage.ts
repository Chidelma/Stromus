import Amplify, { Storage } from 'aws-amplify';

export default class Store {

    store:any;

    constructor() {

        Amplify.configure({
            Auth : {
                identityPoolId: 'us-east-1:1f1d6548-193d-496e-acc6-8d5dc3a09ebc',
                region: 'ca-central-1',
                identityPoolRegion: 'ca-central-1',
                userPoolId: 'ca-central-1_UZxAd5Yq0',
                userPoolWebClientId: '3hecekg27o2b50rp4bdfb9q9gg'
            },
            Storage: {
                AWSS3: {
                    bucket: 'strom-storage', //REQUIRED -  Amazon S3 bucket name
                    region: 'ca-central-1'
                }
            }
        });

        this.store = Storage;
    }

    async uploadImage(image:any, dir_name:string, id:string):Promise<string> {

        let result:any = await this.store.put(dir_name + id + '.jpg', image, {
                                                contentType: 'image/png'
                                            });

        return result.key;                                  
    }

    async getImageUrl(key:string):Promise<string> {

        let signedUrl:string = await this.store.get(key);

        return signedUrl;
    }
}