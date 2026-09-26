import { defineConfig } from 'vite';
import sri from 'vite-plugin-sri'
import { rm, cp } from 'node:fs/promises'
import { resolve } from 'node:path'


function wordpressArtifact() {
    const root = resolve('.')
    const artifact = resolve(root, 'wp_artifact')

    return {
        name: 'wordpress-artifact',
        async closeBundle() {
            await rm(artifact, { recursive: true, force: true })
            await cp(resolve(root, 'wp_plugin'), artifact, { recursive: true })
            await cp(resolve(root, 'dist'), resolve(artifact, 'resources'), {
                recursive: true,
            })
        },
    }
}

export default defineConfig({
    base: './',
    plugins: [sri(), wordpressArtifact()],
    server: {
        watch: {
            usePolling: true,     // Force polling
            interval: 500,        // Check for changes every 500ms
        },
        host: false,
    },
});