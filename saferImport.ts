import vm from "vm";
import fs from "fs";
import path from "path";
import type { Manifest } from "./FormGenerator"
type SandboxExports = Manifest

// This file provides a safer (read: not 100% safe) way to import user-provided JS/TS modules (like the manifest), blocking access to dangerous Node modules and APIs.
// It uses the Node VM module to create a sandboxed environment for executing the code. THIS IS BY NO MEANS FOOLPROOF, and is mostly intended 
// to prevent accidental misuse of the manifest file. This should not be considered a security measure against malicious code.

export class SaferConsole {
    constructor() {
        return new Proxy(this, {
            get: (_target, _prop) => {
                throw new Error('[runtime watchdog] Console access is forbidden in the manifest file. This is to prevent accidental logging of sensitive information.');
            },
        });
    }
}

/**
 * import a JS/TS module, blocking certain Node modules.
 *
 * @param modulePath - path to the module file
 * @param forbiddenModules - array of Node module names to block
 */
export async function saferImport<T = SandboxExports>(
    modulePath: string,
    forbiddenModules: string[] = ['fs', 'child_process', 'vm', 'net', 'tls', 'http', 'https', 'fetch', 'node-fetch']
): Promise<T> {
    const absolutePath = path.resolve(modulePath);
    const code = await fs.promises.readFile(absolutePath, "utf-8");

    // Create sandbox context
    const sandbox = {
        console: new SaferConsole(),
        require: (name: string) => {
            if (forbiddenModules.includes(name)) {
                throw new Error(`[runtime watchdog] Module "${name}" is forbidden from require in file ${modulePath}. This is to prevent accidental logging of sensitive information.`);
            }
            return require(name); // allow other modules
        },
        exports: {},
        module: { exports: {} },
        importModuleDynamically: async (specifier: string) => {
            if (forbiddenModules.includes(specifier)) {
                throw new Error(`[runtime watchdog] Module "${specifier}" is forbidden from import in file ${modulePath}. This is to prevent accidental logging of sensitive information.`);
            }
            return import(specifier);
        },
    };

    const context = vm.createContext(sandbox);

    // Wrap code in async IIFE so top-level await works in ESM
    const wrapped = `(async () => { ${code} })()`;
    await vm.runInContext(wrapped, context, { filename: absolutePath });

    // Return module exports
    return context.module.exports as T;
}