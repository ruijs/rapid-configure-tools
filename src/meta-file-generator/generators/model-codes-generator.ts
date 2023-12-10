import fs from 'fs';
import { each, map, snakeCase } from 'lodash';
import path from 'path';
import type { RapidDataDictionary, RapidEntity } from '@ruiapp/rapid-extension';


function generateEntitySingularCodes(modelsDir: string, metaDir: string, codes: string[]) {
  const entities = require(path.join(metaDir, "entity-models")).default;
  const entitySingularCodes = map(entities, entity => snakeCase(entity.code));

  codes.push(`export const entitySingularCodes = [`);
  each(entitySingularCodes, entitySingularCode => {
    codes.push(`  '${entitySingularCode}',`);
  });
  codes.push(`] as const;`);
  codes.push(`export type TEntitySingularCodes = typeof entitySingularCodes[number];`);
  codes.push(``);
}

function generateEntityFieldCodes(modelsDir: string, metaDir: string, codes: string[]) {
  const entities: RapidEntity[] = require(path.join(metaDir, "entity-models")).default;

  codes.push(`const entityFieldCodes = {`);
  each(entities, entity => {
    codes.push(`  '${entity.code}': [`);

    const fieldCodes = map(entity.fields, field => field.code);
    each(fieldCodes, fieldCode => {
      codes.push(`    '${fieldCode}',`);
    });
    codes.push(`  ],`);
  });
  codes.push(`} as const;`);
  codes.push(`export type TEntityFieldCodes = typeof entityFieldCodes;`);
  codes.push(`export type TEntityCodes = keyof TEntityFieldCodes;`);
  codes.push(``);
}

export function generateModelCodes(declarationsDirectory: string) {
  const modelsDir = path.join(declarationsDirectory, 'models');
  const metaDir = path.join(declarationsDirectory, 'meta');

  const codes: string[] = [];

  generateEntitySingularCodes(modelsDir, metaDir, codes);
  generateEntityFieldCodes(modelsDir, metaDir, codes);

  const fileName = path.join(metaDir, 'model-codes.ts');
  fs.writeFileSync(fileName, codes.join('\n'));
}


function generateDataDictionaryCodes(modelsDir: string, metaDir: string, codes: string[]) {
  const dictionaries: RapidDataDictionary[] = require(path.join(metaDir, "data-dictionary-models")).default;

  codes.push(`const dictionaryCodes = [`);
  each(dictionaries, dictionary => {
    codes.push(`  '${dictionary.code}',`);
  });
  codes.push(`] as const;`);
  codes.push(`export type TDictionaryCodes = typeof dictionaryCodes[number];`);
  codes.push(``);
}

export function generateDictionaryCodes(declarationsDirectory: string) {
  const modelsDir = path.join(declarationsDirectory, 'models');
  const metaDir = path.join(declarationsDirectory, 'meta');

  const codes: string[] = [];

  generateDataDictionaryCodes(modelsDir, metaDir, codes);

  const fileName = path.join(metaDir, 'data-dictionary-codes.ts');
  fs.writeFileSync(fileName, codes.join('\n'));
}
