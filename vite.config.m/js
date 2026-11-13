import { defineConfig } from 'vite'
import sri from "vite-plugin-sri-gen";
import { rm, cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { createRequire } from 'node:module'
import { viteSingleFile } from "vite-plugin-singlefile"

const require = createRequire(import.meta.url)
const archiver = require('archiver').ZipArchive

const pluginName = 'name-change-form-generator'

async function zipDirectory(source, output, folderName) {
    await new Promise((resolve, reject) => {
        const archive = new archiver('zip')
        const stream = createWriteStream(output)

        stream.on('close', resolve)
        stream.on('error', reject)
        archive.on('error', reject)

        archive.pipe(stream)
        archive.directory(source, folderName)
        archive.finalize()
    })
}

function wordpressArtifact() {
    const root = resolve('.')
    const artifact = resolve(root, 'wp_artifact')

    return {
        name: 'wordpress-artifact',

        async closeBundle() {
            await rm(artifact, { recursive: true, force: true })
            await rm(resolve(root, `${pluginName}.zip`), { force: true })

            await mkdir(artifact, { recursive: true })
            await cp(resolve(root, 'wp_plugin'), artifact, { recursive: true })

            const resources = resolve(artifact, 'resources')
            await mkdir(resources, { recursive: true })
            await cp(resolve(root, 'dist'), resources, { recursive: true })

            await zipDirectory(
                artifact,
                resolve(root, `${pluginName}.zip`),
                pluginName
            )
        },
    }
}

export default defineConfig({
    base: './',
    plugins: [sri(), wordpressArtifact()],
    server: {
        watch: {
            usePolling: true,
            interval: 500,
        },
        host: false,
    },
})