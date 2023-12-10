import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import fs from 'fs';
import path from 'path';
import AppUpdater from './AppUpdater';
import { newDictionaryUpdater } from './DictionaryUpdater';
import { newDictionaryEntryUpdater } from './DictionaryEntryUpdater';
import { newModelUpdater } from './ModelUpdater';
import { newPropertyUpdater } from './PropertyUpdater';
import type { RapidDataDictionary, RapidEntity } from '@ruiapp/rapid-extension';

export interface RapidModelsUpdateOptions {
  appDataDirLocation: string;
  rapidApiUrl: string;
  entities: RapidEntity[];
  dataDictionaries: RapidDataDictionary[];
}

export default class RapidModelsUpdater {
  #rapidConfigApi: AxiosInstance;
  #entities: RapidEntity[];
  #dataDictionaries: RapidDataDictionary[];

  constructor(options: RapidModelsUpdateOptions) {
    this.#entities = options.entities;
    this.#dataDictionaries = options.dataDictionaries;

    const { appDataDirLocation, rapidApiUrl } = options;

    const cookieJarStorageLocation = path.join(appDataDirLocation, 'rapid-cookie-jar.json');
    if (!fs.existsSync(appDataDirLocation)) {
      fs.mkdirSync(appDataDirLocation);
    }
    
    let jar: CookieJar;
    if (fs.existsSync(cookieJarStorageLocation)) {
      const cookieJSON = fs.readFileSync(cookieJarStorageLocation).toString();
      jar = CookieJar.deserializeSync(cookieJSON);
    } else {
      jar = new CookieJar();
    }
    
    this.#rapidConfigApi = wrapper(
      axios.create({
        jar,
        baseURL: rapidApiUrl,
        validateStatus: null,
      }),
    );
  }

  updateRapidSystemConfigurations() {
    const rapidConfigApi = this.#rapidConfigApi;

    const appUpdater = new AppUpdater({
      modelUpdaters: [
        newDictionaryUpdater(rapidConfigApi),
        newDictionaryEntryUpdater(rapidConfigApi),
        newModelUpdater(rapidConfigApi),
        newPropertyUpdater(rapidConfigApi),
      ],
    });
    appUpdater.updateModels([
      {
        modelType: 'dictionary',
        entities: this.#dataDictionaries.filter(item => !item.metaOnly),
      },
      {
        modelType: 'model',
        entities: this.#entities.filter(item => !item.metaOnly),
      },
    ]);
  }
}