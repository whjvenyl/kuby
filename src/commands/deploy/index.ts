import { readdir, stat } from 'fs-extra';
import { Arguments, Argv, CommandModule } from 'yargs';

import { RootArguments } from '../../root-arguments';
import { Logger } from '../../utils/logger';
import { applyCommand } from '../apply';
import { prepareCommand } from '../prepare';

type DeployArguments = RootArguments & {
  sourceFolder: string;
  destinationFolder: string;
};

export const deployCommand: CommandModule<RootArguments, DeployArguments> = {
  command: 'deploy [sourceFolder] [destinationFolder]',
  aliases: 'dep',
  describe: 'Prepare and deploy all found yaml files.',

  builder: (argv: Argv<RootArguments>) =>
    argv
      .positional('sourceFolder', {
        description: 'Folder to search for yaml files.',
        type: 'string',
        default: './k8s/',
      })
      .positional('destinationFolder', {
        description: 'Folder to put prepared yaml files in.',
        type: 'string',
        default: './deployment/',
      })
      .completion('completion', false as any, async (_, argv: Arguments) => {
        if (argv._.length >= 4) {
          return [];
        }
        const dirs = [];
        const directory = await readdir(process.cwd());
        for (const path of directory) {
          const stats = await stat(path);
          if (stats.isDirectory()) {
            dirs.push(path);
          }
        }
        return dirs;
      }),

  async handler(args: Arguments<DeployArguments>): Promise<void> {
    if (args.getYargsCompletions) {
      return;
    }

    const logger = new Logger('deployment');
    logger.debug('Execute deployment');

    await prepareCommand.handler(args);
    await applyCommand.handler({
      ...args,
      deployFolder: args.destinationFolder,
    });

    logger.success('Deployments applied.');
  },
};
