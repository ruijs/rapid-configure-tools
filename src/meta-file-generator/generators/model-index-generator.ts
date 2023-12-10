/**
 * 用于生成模型索引文件，将模型定义按照类型分别导出。
 */

import fs from 'fs';
import { forEach } from 'lodash';
import path from 'path';
import { ensureDirectoryExists, enumFileBaseNamesInDirectory } from '../../utils/file-utility';

interface GenerateModelsIndexFileOption {
  /**
   * Where is the models directory.
   */
  modelsDir: string;
  /**
   * where we should output the models index file.
   */
  outputDir: string;
  /**
   * Where is the model type definition file.
   */
  typeDefFilePath: string;
  /**
   * The model category directory name.
   */
  categoryDirName: string;
  /**
   * The model type name in the `categoryDir`.
   */
  modelTypeName: string;

  modelsFileName: string;

  extraImports?: string[];

  modelWrapper?: string;
}

function generateModelIndexFilesOfTypeDir({
  modelsDir,
  outputDir,
  typeDefFilePath,
  categoryDirName,
  modelTypeName,
  modelsFileName,
  extraImports,
  modelWrapper,
}: GenerateModelsIndexFileOption) {
  const filesDir = path.join(modelsDir, categoryDirName);
  const fileNames = enumFileBaseNamesInDirectory(filesDir);

  const codes = [];
  codes.push(`import type { ${modelTypeName} as T${modelTypeName} } from '${typeDefFilePath}';`);
  forEach(extraImports, (extraImport) => {
    codes.push(extraImport);
  });

  for (const fileName of fileNames) {
    if (fileName.includes(" ")) {
      continue;
    }
    codes.push(`import ${fileName} from '../models/${categoryDirName}/${fileName}';`);
  }
  codes.push('');

  codes.push('export default [');
  for (const fileName of fileNames) {
    if (fileName.includes(" ")) {
      continue;
    }

    if (modelWrapper) {
      codes.push(`  ${modelWrapper}(${fileName}),`);
    } else {
      codes.push(`  ${fileName},`);
    }
  }
  codes.push(`] as T${modelTypeName}[];`);
  codes.push('');

  fs.writeFileSync(path.join(outputDir, modelsFileName + '.ts'), codes.join('\n'));
}

export function generateModelIndexFiles(declarationsDirectory: string) {
  const modelsDir = path.join(declarationsDirectory, 'models');
  const outputDir = path.join(declarationsDirectory, 'meta');
  const typeDefFilePath = '@ruiapp/rapid-extension';

  ensureDirectoryExists(outputDir);

  generateModelIndexFilesOfTypeDir({
    modelsDir,
    outputDir,
    typeDefFilePath,
    categoryDirName: 'entities',
    modelTypeName: 'RapidEntity',
    modelsFileName: 'entity-models',
    extraImports: [`import { autoConfigureRapidEntity } from '@ruiapp/rapid-extension/RapidEntityAutoConfigure';`],
    modelWrapper: 'autoConfigureRapidEntity',
  });

  generateModelIndexFilesOfTypeDir({modelsDir, outputDir, typeDefFilePath, categoryDirName: 'data-dictionaries', modelTypeName: 'RapidDataDictionary', modelsFileName: 'data-dictionary-models'});
  generateModelIndexFilesOfTypeDir({modelsDir, outputDir, typeDefFilePath, categoryDirName: 'pages', modelTypeName: 'RapidPage', modelsFileName: 'page-models'});
}

console.log('Generating meta index files...');
