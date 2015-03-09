/* require libs */
GLOBAL.my_synaptic = require('synaptic');

/* init NN */
GLOBAL.my_neural_network = GLOBAL.my_neural_network || {};

my_neural_network.neuron = my_synaptic.Neuron,
my_neural_network.layer = my_synaptic.Layer,
my_neural_network.network = my_synaptic.Network,
my_neural_network.Trainer = my_synaptic.Trainer,
my_neural_network.Architect = my_synaptic.Architect;

//
my_neural_network.Perceptron(){}