/* require libs */
GLOBAL.my_synaptic = require('synaptic');

/* init NN */
GLOBAL.my_neural_network = GLOBAL.my_neural_network || {};

my_neural_network.init_synpatic = function(){
	my_neural_network.neuron = my_synaptic.Neuron,
	my_neural_network.layer = my_synaptic.Layer,
	my_neural_network.network = my_synaptic.Network,
	my_neural_network.Trainer = my_synaptic.Trainer,
	my_neural_network.Architect = my_synaptic.Architect;
	
	my_neural_network.Perceptron = function(input, hidden, output){
		// create layers
		var input_layer = new my_neural_network.layer(input),
			hidden_layer = new my_neural_network.layer(input),
			output_layer = new my_neural_network.layer(output);
		
		// connect layers
		input_layer.project(hidden_layer);
		hidden_layer.project(output_layer);
		
		// set the layers
		this.set({
			input : input_layer,
			hidden: [hidden_layer],
			output: output_layer
		});
	}
	
	my_neural_network.Perceptron.prototype = new my_neural_network.network();
	my_neural_network.Perceptron.prototype.constructor = my_neural_network.Perceptron;
	
	console.log("Successfully Initiate neural-network elements");
}

// start action
my_neural_network.init_synpatic();