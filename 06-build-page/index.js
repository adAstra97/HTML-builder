const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const distFolderPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const distAssetsFolderPath = path.join(distFolderPath, 'assets');

const readableStream = fs.createReadStream(templatePath);
const outputHTML = fs.createWriteStream(
  path.join(distFolderPath, 'index.html'),
);
const outputCSS = fs.createWriteStream(path.join(distFolderPath, 'style.css'));

const createDistFolder = async () => {
  try {
    await fsPromises.mkdir(distFolderPath, { recursive: true });
  } catch (err) {
    console.error(err);
  }
};

const createContentObj = async (pathArray) => {
  const obj = {};

  for (const component of pathArray) {
    if (component.isFile() && path.extname(component.name) === '.html') {
      const componentName = component.name.replace('.html', '');
      const componentContent = await fsPromises.readFile(
        path.join(componentsFolderPath, component.name),
        'utf-8',
      );

      obj[`{{${componentName}}}`] = componentContent;
    }
  }
  return obj;
};

const replaceTemplateTags = async () => {
  try {
    const components = await fsPromises.readdir(componentsFolderPath, {
      withFileTypes: true,
    });

    const componentsContent = await createContentObj(components);

    readableStream.on('data', (chunk) => {
      let convertedHTML = chunk.toString();
      const pairArray = Object.entries(componentsContent);

      for (const [word, content] of pairArray) {
        convertedHTML = convertedHTML.replace(word, content);
      }

      outputHTML.write(convertedHTML);
    });
  } catch (err) {
    console.error(err);
  }
};

const mergeStyles = async () => {
  const stylesArr = await fsPromises.readdir(stylesFolderPath, {
    withFileTypes: true,
  });

  stylesArr.forEach((item) => {
    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(stylesFolderPath, item.name);
      const readableStream = fs.createReadStream(filePath);
      readableStream.on('data', (chunk) =>
        outputCSS.write(chunk.toString() + '\n'),
      );
    }
  });
};

const readAssetsFolder = async (currentFolder, targetFolder) => {
  try {
    const arr = await fsPromises.readdir(currentFolder, { recursive: true });

    for (const file of arr) {
      const sourceFilePath = path.join(currentFolder, file);
      const targetFilePath = path.join(targetFolder, file);

      const stat = await fsPromises.stat(sourceFilePath);

      if (stat.isFile()) {
        await fsPromises.copyFile(sourceFilePath, targetFilePath);
      } else {
        await fsPromises.mkdir(targetFilePath, { recursive: true });
        await readAssetsFolder(sourceFilePath, targetFilePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const createDistAssetsFolder = async () => {
  try {
    await fsPromises.rm(distAssetsFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(distAssetsFolderPath, { recursive: true });
    await readAssetsFolder(assetsFolderPath, distAssetsFolderPath);
  } catch (err) {
    console.error(err);
  }
};

const runBuild = async () => {
  await createDistFolder();
  await replaceTemplateTags();
  await mergeStyles();
  await createDistAssetsFolder();
};

runBuild();
