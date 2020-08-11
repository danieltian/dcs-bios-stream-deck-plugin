const { exec } = require('child_process')

exec(`start cmd.exe /K node proxy.js ${process.argv.join(' ')}`)
