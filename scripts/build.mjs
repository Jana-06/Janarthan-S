process.env.ROLDOWN_WORKER_THREADS ??= '2'
process.env.NODE_ENV ??= 'production'

const { build } = await import('vite')
await build()
