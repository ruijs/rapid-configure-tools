import path from "path";
import { generateModelIndexFiles } from "./generators/model-index-generator";
import { generateModelCodes, generateDictionaryCodes } from "./generators/model-codes-generator";
import { generateSdRpdModelTypes } from "./generators/model-types-generator";

export interface FileGenerateOption {
  declarationsDirectory: string;
}

export default class MetaFileGenerator {
  generateFiles(option: FileGenerateOption) {
    let { declarationsDirectory } = option;

    if (!path.isAbsolute(declarationsDirectory)) {
      declarationsDirectory = path.join(process.cwd(), declarationsDirectory);
    }

    console.log("Generating meta files...");
    console.log("generateModelIndexFiles");
    generateModelIndexFiles(declarationsDirectory);
    console.log("generateModelCodes");
    generateModelCodes(declarationsDirectory);
    console.log("generateDictionaryCodes");
    generateDictionaryCodes(declarationsDirectory);
    console.log("generateSdRpdModelTypes");
    generateSdRpdModelTypes(declarationsDirectory);
    console.log("Done.");
  }
}
