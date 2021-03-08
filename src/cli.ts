import commander from 'commander';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

commander.createCommand()
  .description(require('../package').description)
  .version(require('../package').version)
  .addCommand(commander.createCommand('set')
    .arguments('<apiKey>')
    .description('Set the 2captcha api key.')
    .action(async function(this: {args: Array<string>}) {
      const rootPath = path.join(os.homedir(), 'animeloyalty');
      await fs.ensureDir(rootPath);
      await fs.writeFile(path.join(rootPath, '2captcha.txt'), this.args[0]);
    }))
  .parse();
