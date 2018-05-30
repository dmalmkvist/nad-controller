# nad-controller
Some NAD amplifiers has an RS-232 port on the back that offers functionality to control the amplifiers behaviour. The amplifiers has a number of properties that can be read and most of them can also be changed. Different models have a different set of properties. In addition to this,  if a physical button is pressed this is also send over the serial port. This library aims to makes it a little easier to work with it by wrapping it all in one interface.

## Functionality
- Queueing of commands. The serial port only accepts one command at a time, and if commands are sent too frequent some command will be ignored.
- Distinguishing if events are triggered by physical pressing buttons or if they are triggered by a serial port command.

## Example
```javascript
const NadController = require('nad-controller');

let controller = new NadController('/dev/ttyUSB0', { model: NadController.MODELS.C355 });
controller.open((error) => {

  controller.set('Main.Power', 'On', (error, data) => {
    console.log('Power is: ' + data.value);  // writes "Power is: On"
  });

  controller.get('Main.Model', (error, data) => {
    console.log('Model: ' + data.value);  // Writes "Model: C355"
  });

  controller.increment('Main.Volume', (error, data) => {
    console.log('Volume increased');
  });
});

```



