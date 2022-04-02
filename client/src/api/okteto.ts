export interface OktetoResult<E> {
  value: E
  error: string | null
};

export interface OktetoContext {
  name: string
  namespace: string
  builder: string
  registry: string
};

export type OktetoContextList = Array<OktetoContext>;

const getContextList = () : Promise<OktetoResult<OktetoContextList>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoContextList = [];
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'list', '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = JSON.parse(output);
          }
          done({ value, error });
        },
      },
    });
  });
};

const getContext = () : Promise<OktetoResult<OktetoContext | null>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoContext | null = null;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'show', '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = JSON.parse(output);
          }
          done({ value, error });
        },
      },
    });
  });
};

const setContext = (contextName: string) : Promise<OktetoResult<boolean>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value = false;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'use', contextName], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = true;
          }
          done({ value, error });
        },
      },
    });
  });
};

const deleteContext = (contextName: string) : Promise<OktetoResult<boolean>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value = false;
    window.ddClient.extension.host.cli.exec('okteto', ['context', 'delete', contextName], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          if (exitCode == 0) {
            value = true;
          }
          done({ value, error });
        },
      },
    });
  });
};

const getEndpointsList = (manifestFile: string) : Promise<OktetoResult<OktetoContextList>> => {
  return new Promise(done => {
    let output = '';
    let error: string | null = null;
    let value: OktetoContextList = [];
    window.ddClient.extension.host.cli.exec('okteto', ['endpoints', '-f', manifestFile, '-o', 'json'], {
      stream: {
        onOutput(line: { stdout: string | undefined, stderr: string | undefined }): void {
          output += line.stdout;
        },
        onError(e: string): void {
          console.error(e);
          error = `${error ?? ''}${e}`;
        },
        onClose(exitCode: number): void {
          console.log(output);
          if (exitCode == 0) {
            value = JSON.parse(output);
          }
          done({ value, error });
        },
      },
    });
  });
};

export default {
  getContextList,
  getContext,
  setContext,
  deleteContext,
  getEndpointsList
};
