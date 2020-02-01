const aircraftData = require('./dcs-bios-api/aircraft-data')

// Cache the aircraft names.
const aircraftNames = Object.keys(aircraftData.aircraftControls)

module.exports = app => {
  // Get the list of aircraft names.
  app.get('/aircraft-names', (request, response) => {
    response.send(aircraftNames)
  })

  // Get the controls for a particular aircraft.
  app.get('/aircraft-controls/:aircraftName', (request, response) => {
    const aircraftName = request.params.aircraftName
    response.send(aircraftData.aircraftControls[aircraftName])
  })

  app.get('/heartbeat', (request, response) => {
    response.send('ok')
  })
}
