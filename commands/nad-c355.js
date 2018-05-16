
const commands = [
	{ 
		'name': 'Main.Model',
		'operators': [
			'?'
		],
		'values': []
	},
	{ 
		'name':	'Main.Mute',
		'operators': [
			'=',
			'+',
			'-',
			'?'
		],
		'values': [
			'On',
			'Off'
		]
	},
	{ 
		'name':'Main.Power',
		'operators': [
			'=',
			'+',
			'-',
			'?'
		],
		'values': [
			'On',
			'Off'
		]
	},
	{
		'name':	'Main.Source',
		'operators': [
			'=',
			'+',
			'-',
			'?'
		],
		'values': [
			'Tuner',
			'CD',
			'Video',
			'Aux',
			'Disk',
			'Ipod',
			'Tape2'
		]
	},
	{ 
		'name': 'Main.SpeakerA',
		'operators': [
			'=',
			'+',
			'-',
			'?'
		],
		'values': [
			'On',
			'Off'
		]
	},
	{
		'name': 'Main.SpeakerB',
		'operators': [
			'=',
			'+',
			'-',
			'?'
		],
		'values': [
			'On',
			'Off'
		]
	},
	{
		'name': 'Main.Tape1',
		'operators': [
			'=',
			'+',
			'-',
			'?'
		],
		'values': [
			'On',
			'Off'
		]
	},
	{
		'name':	'Main.Volume',
		'operators': [
			'+',
			'-',
		],
		'values': []
	}
];

class Command {
	constuctor(commandDefinition) {
		{this.name, this.operators, this.values} = commandDefinition;
		// this.name = commandDefinition.name;
		// this.operators = commandDefinition
	}
}

