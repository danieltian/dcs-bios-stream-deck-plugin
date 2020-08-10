const aircraftData = require('./dcs-bios-api/aircraft-data')

module.exports = (app) => {
  // Get the list of aircraft names.
  app.get('/aircraft-names', (request, response) => {
    response.send(Object.keys(aircraftData.aircraftControls))
  })

  // Get the controls for a particular aircraft.
  app.get('/aircraft-controls/:aircraftName', (request, response) => {
    const aircraftName = request.params.aircraftName
    response.send(aircraftData.aircraftControls[aircraftName])
  })
}
