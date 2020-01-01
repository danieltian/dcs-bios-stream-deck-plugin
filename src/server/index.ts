import express from 'express'

export default (app: express.Application) => {
  app.get('/heartbeat', (request, response) => {
    response.send('ok')
  })
}
