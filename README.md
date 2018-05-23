# nad-controller
Some NAD amplifier has a RS-232 port on the back that accepts commands and emits changes when any of the physical buttons are pressed. This library makes it a little easier to work with it.

## Functionality
- Validation that the commands exists and are correct for a specific model.
- Queueing of commands. The serial port only accepts one command at a time, and if commands are sent too frequent some command will be ignored.
- Distinguishing if events are triggered by physical pressing buttons or if they are triggered by a serial port command.

## Example
```javascript
const NadController = require('nad-controller');

let controller = new NadController('/dev/ttyUSB0', '../config/nad-c355.json');
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



