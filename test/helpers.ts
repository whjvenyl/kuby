import { write } from 'clipboardy';
import { prompt, registerPrompt } from 'inquirer';
import { vol } from 'memfs';

import { exec } from '../src/utils/exec';
import { spawn } from '../src/utils/spawn';

export function clearGlobalMocks(): void {
  (process as any).exit.mockClear();
  (spawn as jest.Mock<number>).mockClear();
  (exec as jest.Mock).mockClear();
  (write as jest.Mock).mockClear();
  (prompt as jest.Mock).mockClear();
  (registerPrompt as jest.Mock).mockClear();
  vol.reset();
}