const fs = require('fs');
const path = require('path');
const { stdout } = process;

(async function createProject () {
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist'), {recursive: true, force: true});
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
    stdout.write('The folder project-dist created\n');
    await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    await createHtml();
    await createCss();
  } catch (error) {
    console.log(error.message);
  }
})()

async function createHtml () {
  try {
    let sample = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const sampleComponents = sample.match(/{{.*}}/gi);
    if (sampleComponents) {
      for await (let component of sampleComponents) {
        const filename = `${component.replace(/{{|}}/g, '')}.html`;
        const content = await fs.promises.readFile(path.join(__dirname, 'components', filename), 'utf-8');
        sample = sample.replace(component, content);
      }
      await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), sample);
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function createCss() {
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist', 'style.css'), {recursive: true, force: true});
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    files.forEach(file => {
      if (file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
        let content = '';
        const input = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        input.on('data', chunk => content = content + chunk + '\n\n');
        input.on('end', () => {
          output.write(content);
        })
      }
    })
  } catch (error) {
    console.log(error.message);
  }
}

async function copyDir(pathFrom, pathTo) {
  try {
    await fs.promises.rm(pathTo, {recursive: true, force: true});
    await fs.promises.mkdir(pathTo, {recursive: true});
    stdout.write('The folder created\n');
    const elements = await fs.promises.readdir(pathFrom, {withFileTypes: true});    
    elements.forEach(element => {
      if (element.isDirectory()) {
        copyDir(path.join(pathFrom, element.name), path.join(pathTo, element.name));
      } else {
        const fullDest = path.join(pathFrom, element.name);
        const newDest = path.join(pathTo, element.name);
        fs.promises.copyFile(fullDest, newDest);
        stdout.write(`The file is ${element.name} coppied\n`);
      }
    })
  } catch (error) {
    console.log(error.message);
  }
}