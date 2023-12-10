import type { RapidDataDictionary, RapidDataDictionaryEntry, RapidEntity, RapidField } from '@ruiapp/rapid-extension';

export type IRapidModelUpdater<TEntity, TInput, TMainEntity = any> =
  | IRapidModelUpdaterBatchGetMode<TEntity, TInput, TMainEntity>
  | IRapidModelUpdaterSingleGetMode<TEntity, TInput, TMainEntity>;

export interface IRapidModelUpdaterCommon<TEntity, TInput, TMainEntity> {
  modelType: string;
  inputTitlePrinter: (input: TInput) => string;
  entityExistensePredicate: (input: TInput, entity: TEntity) => boolean;
  isEntityChanged: (inputEntity: TInput, remoteEntity: TEntity) => boolean;
  createEntity: (input: TInput, mainEntity: TMainEntity, inputIndex: number) => Promise<TEntity>;
  updateEntity: (input: TInput, remoteEntity: TEntity, mainEntity: TMainEntity, inputIndex: number) => Promise<TEntity>;
  relationFields?: {
    fieldName: keyof TInput;
    relation: 'one' | 'many';
    modelType: string;
  }[];
}

export interface IRapidModelUpdaterBatchGetMode<TEntity, TInput, TMainEntity>
  extends IRapidModelUpdaterCommon<TEntity, TInput, TMainEntity> {
  entityBatchMode: true;
  entityBatchFinder: (mainEntity: TMainEntity) => Promise<TEntity[]>;
}

export interface IRapidModelUpdaterSingleGetMode<TEntity, TInput, TMainEntity>
  extends IRapidModelUpdaterCommon<TEntity, TInput, TMainEntity> {
  entityBatchMode: false;
  entitySingleFinder: (entityKey: string) => Promise<TEntity | null>;
  entityKeyGetter: (input: TInput) => string;
}

export type ObjWithIdProp = {
  id: string;
};

export type CreateDataDictionaryInput = Omit<RapidDataDictionary, 'entries'>;

export type UpdateDataDictionaryInput = CreateDataDictionaryInput;

export type RapidDataDictionaryWithId = ObjWithIdProp & CreateDataDictionaryInput;

export type CreateDataDictionaryEntryInput = RapidDataDictionaryEntry & {
  disabled: boolean;
  orderNum: number;
  dictionary: string;
};

export type UpdateDataDictionaryEntryInput = CreateDataDictionaryEntryInput;

export type RapidDataDictionaryEntryWithId = ObjWithIdProp & CreateDataDictionaryEntryInput;

export type CreateRapidModelInput = Omit<RapidEntity, 'code' | 'fields' | 'dbSchema'>;

export type UpdateRapidModelInput = CreateRapidModelInput;

export type RapidModel = ObjWithIdProp & CreateRapidModelInput;

export type CreateRapidPropertyInput = RapidField & {
  model: string;
};

export type UpdateRapidPropertyInput = CreateRapidPropertyInput;

export type RapidProperty = ObjWithIdProp & RapidField;
