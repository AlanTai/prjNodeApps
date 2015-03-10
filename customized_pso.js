/* require libs */
GLOBAL.numeric = require('numeric');

/*
 *  Particles Swarm Optimization
 *  This is a standard PSO to find out optimal solution through out the stochastic spaces
 *  PS: Current test function is (0.007 * x_1 * (-x_2 -1)) * ( cos(x_1 + 0.3) - sin(x_2))+(1 - sin(x_1)) and the optimal value is around -1.798
 * */

GLOBAL.particles_swarm_optimization = GLOBAL.particles_swarm_optimization || {
		
		// configuration
		config : {
			variable_ranges : [[-15, -15],[15, 15]], // ranges of particles;
														// row 1 represent low
														// boundary and row 2
														// represent up boundary
			particles_size : 60, // size of particles swarm
			iteration : 50, // iteration number
			max_min_factor : -1, // 1 means to find max; -1 means to find min
			Emax : Number.MAX_VALUE, // maximum value
			Emin : -Number.MAX_VALUE, // minimum value
			Type : 0, // 0 for real number; 1 for integer
			
			c1 : 2.05, // cognitive parameter (original value; would be
						// replaced by linear change)
			c2 : 4.1 - 2.05, // c2 = 4.1 - c1 // social parameter (original
								// value; would be replaced by linear change)
			constriction_factor : 0.729, // constrain factor
			
			diff_of_ranges : [], // ranges of each parameter (from low
									// boundary to up boundary)
			up_boundaries : [], //
			low_boundaries : [], // low boundary
			
			particles_values : [], // values set of particles
			particles_initial_values : [], // initial values set of particles
			
			particles_velocity : [], // velocity set of particles
			particles_initial_velocity : [], // can be zero or certain
												// reasonable values based on
												// each particle range

			performance_index_set : [], // performance index set
			performance_initial_index_set : [], // initial performance index set
			
			learning_rate : 0, // learning rate
			learning_rate_self_param_min : 0.4, // minimum learning rate of
												// particle itself
			learning_rate_self_param_max : 0.9, // maximum learning rate of
												// particle itself
			learning_rate_cognitive_min : 1.9, // minimum learning rate of
												// cognitive parameter
			learning_rate_cognitive_max : 2.1, // maximum learning rate of
												// cognitive parameter
			learning_rate_cognitive : 0,
			learning_rate_social : 0,
			learning_rate_self : 0,
			
			min_cost : 0, // minimum cost
			min_cost_set : [],
			mean_cost : 0, // mean value
			mean_cost_set : [],
			RMS_cost : 0, // root-mean-square cost
			RMS_cost_set : [],
			
			local_optimal : 0, // local optimal
			index_local_optimal : 0, // index of global optimal in particles
										// set
			global_optimal : 0, // global optimal
			index_global_optimal : 0, // index of global optimal
			local_optimal_value_set : [],
			local_optimal_particles_set : [],
			global_optimal_value_set : [],
			global_optimal_particles_set : [],
			
			// customized performance index
			customized_performance_index : undefined,
		},
		
		set_customized_performance_index_and_variable_ranges : function(arg_customized_performance_index, arg_variable_ranges){
			this.config.customized_performance_index = arg_customized_performance_index;
			this.config.variable_ranges = arg_variable_ranges;
		},
		
		set_particles_size : function(arg_particles_size){
			this.config.particles_size = arg_particles_size;
		},
		
		set_iteration : function(arg_iteration){
			this.config.iteration = arg_iteration;
		},
		
		// initialization function
		init_pso : function(){
			/* new */
			this.config.low_boundaries = this.config.variable_ranges[0];
			this.config.up_boundaries = this.config.variable_ranges[1];
			this.config.diff_of_ranges = numeric.sub(this.config.up_boundaries, this.config.low_boundaries);
			
			// init particles' values
			this.config.particles_values = numeric.random([this.config.particles_size, this.config.variable_ranges[0].length]);
			var diff_ary = [];
			for(ith = 0; ith < this.config.variable_ranges[0].length ; ith++){
				var diff = Array.apply(null, new Array(this.config.variable_ranges[0].length)).map(Number.prototype.valueOf, 0);
				diff[ith] = this.config.diff_of_ranges[ith];
				diff_ary.push(diff);
			}
			
			this.config.particles_values = numeric.dotMMbig(this.config.particles_values, diff_ary);
			var temp_low_boundaries_matrix = numeric.rep([this.config.particles_size], this.config.low_boundaries);
			this.config.particles_values = numeric.add(this.config.particles_values, temp_low_boundaries_matrix);
			
			// init particles velocity
			this.config.particles_velocity = numeric.rep([this.config.particles_size], Array.apply(null, new Array(this.config.variable_ranges[0].length)).map(Number.prototype.valueOf, 0));
			
			// evaluate init particles set
			for(var ith = 0; ith < this.config.particles_size; ith++){
				var temp_particle_values = this.config.particles_values[ith];
				
				var performance_index;
				if(this.config.customized_performance_index === undefined){
					performance_index = (0.007 * temp_particle_values[0] * (-temp_particle_values[1] - 1)) * (Math.cos(temp_particle_values[0] + 0.3) - Math.sin(temp_particle_values[1])) + (1 - Math.sin(temp_particle_values[0]));
				}else{
					performance_index = this.config.customized_performance_index.apply(undefined, temp_particle_values);
				}
				
				if (performance_index > this.config.Emax){
					performance_index = this.config.Emax;
				}
				if (performance_index < this.config.Emin){
					performance_index = this.config.Emin;
				}
				this.config.performance_initial_index_set.push(performance_index);
			}
			
			// update optimal
			var temp_cost = numeric.mul(- this.config.max_min_factor, this.config.performance_initial_index_set);
			this.config.min_cost = Math.min.apply(Math, temp_cost);
			this.config.min_cost_set = numeric.rep([this.config.particles_size], this.config.min_cost);
			this.config.global_optimal = this.config.min_cost;
			var temp_min_index = temp_cost.indexOf(this.config.min_cost);
			var temp_optimal_particle = this.config.particles_values[temp_min_index];
			
			this.config.local_optimal_particles_set = numeric.rep([this.config.particles_size], temp_optimal_particle);
			this.config.global_optimal_particles_set = this.config.local_optimal_particles_set;
			this.config.local_optimal_value_set = numeric.rep([this.config.particles_size], this.config.min_cost);
			
			this.config.mean_cost = numeric.sum(temp_cost) / this.config.particles_size;
		},
		
		// go through iteration
		go_iteration : function(){
			for(var ith = 0; ith < this.config.iteration; ith++ ){
				
				this.config.learning_rate_self = this.config.learning_rate_self_param_max - (this.config.learning_rate_self_param_max - this.config.learning_rate_self_param_min) * (ith + 1) / this.config.iteration;
				
				this.config.learning_rate_cognitive = this.config.learning_rate_cognitive_max - (this.config.learning_rate_cognitive_max - this.config.learning_rate_cognitive_min) * (ith + 1) / this.config.iteration;
				this.config.learning_rate_social = 4.1 - this.config.learning_rate_cognitive;
				
				var random_factor_cognitive = numeric.random([this.config.particles_size, this.config.variable_ranges[0].length]);
				var random_factor_social = numeric.random([this.config.particles_size, this.config.variable_ranges[0].length]);
				
				var updated_self_learning_rate = numeric.mul(this.config.learning_rate_self, this.config.particles_velocity);
				
				var updated_cognitive_learning_rate = numeric.sub(this.config.local_optimal_particles_set, this.config.particles_values );
				
				updated_cognitive_learning_rate = numeric.mul(this.config.learning_rate_cognitive, random_factor_cognitive, updated_cognitive_learning_rate);
				
				var updated_social_learning_rate = numeric.sub(this.config.global_optimal_particles_set, this.config.particles_values);
				updated_social_learning_rate = numeric.mul(this.config.learning_rate_social, random_factor_social, updated_social_learning_rate);
				
				var temp_updated_velocity = numeric.add(updated_self_learning_rate, updated_cognitive_learning_rate, updated_social_learning_rate);
				
				// update velocity
				this.config.particles_velocity = numeric.mul(this.config.constriction_factor, temp_updated_velocity);
				
				// update particles' values
				this.config.particles_values = numeric.add(this.config.particles_values, this.config.particles_velocity);
				
				// find out values outside boundaries
				var low_boundaries_set = numeric.rep([this.config.particles_size], this.config.low_boundaries);
				var up_boundaries_set = numeric.rep([this.config.particles_size], this.config.up_boundaries);
				
				var outside_min_boundary = numeric.leq(this.config.particles_values, low_boundaries_set);
				var not_outside_min_boundary = numeric.not(outside_min_boundary);
				var min_replaced_values = numeric.mul(outside_min_boundary, low_boundaries_set);
				var min_original_values = numeric.mul(not_outside_min_boundary, this.config.particles_values);
				
				this.config.particles_values = numeric.add(min_replaced_values, min_original_values);
				
				var outside_max_boundary = numeric.geq(this.config.particles_values, up_boundaries_set);
				var not_outside_max_boundary = numeric.not(outside_max_boundary);
				var max_replaced_values = numeric.mul(outside_max_boundary, up_boundaries_set);
				var max_original_values = numeric.mul(not_outside_max_boundary, this.config.particles_values);
				
				this.config.particles_values = numeric.add(max_replaced_values, max_original_values);
				
				// evaluate performance
				this.config.performance_index_set = [];
				
				for(var jth = 0; jth < this.config.particles_size; jth++){
					var temp_particle_values = this.config.particles_values[jth];
					
					// performance index
					var performance_index;
					if(this.config.customized_performance_index === undefined){
						performance_index = (0.007 * temp_particle_values[0] * (-temp_particle_values[1] - 1)) * (Math.cos(temp_particle_values[0] + 0.3) - Math.sin(temp_particle_values[1])) + (1 - Math.sin(temp_particle_values[0]));
					}else{
						performance_index = this.config.customized_performance_index.apply(undefined, temp_particle_values);
					}
					
					if (performance_index > this.config.Emax){
						performance_index = this.config.Emax;
					}
					if (performance_index < this.config.Emin){
						performance_index = this.config.Emin;
					}
					this.config.performance_index_set.push(performance_index);
				}
				
				// temp cost
				var temp_cost_set = numeric.mul(- this.config.max_min_factor, this.config.performance_index_set);
				
				var temp_better_cost_set = numeric.lt(temp_cost_set, this.config.local_optimal_value_set);
				var not_temp_better_cost_set = numeric.not(temp_better_cost_set);
				var replaced_cost_set = numeric.mul(temp_better_cost_set, temp_cost_set);
				var original_cost_set = numeric.mul(not_temp_better_cost_set, this.config.local_optimal_value_set);
				this.config.local_optimal_value_set = numeric.add(replaced_cost_set, original_cost_set);
				
				var temp_better_cost_set_ary = [], not_temp_better_cost_set_ary = [];
				for(kth = 0; kth < this.config.variable_ranges[0].length ; kth++){
					temp_better_cost_set_ary.push(temp_better_cost_set);
					not_temp_better_cost_set_ary.push(not_temp_better_cost_set);
				}
				
				var better_cost_set = numeric.transpose(temp_better_cost_set_ary);
				better_cost_set = numeric.mul(better_cost_set, this.config.particles_values);
				
				var not_better_cost_set = numeric.transpose(not_temp_better_cost_set_ary);
				not_better_cost_set = numeric.mul(not_better_cost_set, this.config.local_optimal_particles_set);
				
				this.config.local_optimal_particles_set = numeric.add(better_cost_set, not_better_cost_set);
				
				var temp_optimal = Math.min.apply(Math, this.config.local_optimal_value_set);
				var temp_optimal_index = this.config.local_optimal_value_set.indexOf(temp_optimal);
				var pre_global_optimal = this.config.global_optimal;
				if (temp_optimal < this.config.global_optimal){
					this.config.global_optimal = temp_optimal;
					this.config.global_optimal_particles_set = numeric.rep([this.config.particles_size], this.config.particles_values[temp_optimal_index]);
					
					if (Math.abs(temp_optimal - pre_global_optimal) < numeric.epsilon){
						break;
					}
				}
			}
		},
		
		// start optimization
		start_optimization : function(){
			this.init_pso();
			this.go_iteration();
			console.log(JSON.stringify(this.config.global_optimal, 2, 2));
			console.log(JSON.stringify(this.config.global_optimal_particles_set, 2, 2));
		}
}

// test
// GLOBAL.particles_swarm_optimization.start_optimization();

GLOBAL.customized_optimization = GLOBAL.customized_optimization || {};
GLOBAL.customized_optimization.performance_index = function(arg_x, arg_y, arg_z, arg_a){
	/* Performance index for Demo:
	 * sin(arg_x) * cos(arg_y + 0.5 * arg_x) + arg_z^2 * cos(arg_x + arg_y * arg_z);
	 * Ranges:
	 * -10 < arg_x < 30
     * 20  < arg_y < 50
	 * -15 < arg_z < 25
	 * 5   < arg_a < 70 */
	return (Math.sin(arg_x * arg_a) * Math.cos(arg_y + 0.5 * arg_x) + Math.pow(arg_z, 2) * Math.cos(arg_x + arg_y * arg_z));
};

GLOBAL.customized_optimization.variable_ranges = [[-10, 20, -15, 5], [30, 50, 25, 70]];
GLOBAL.particles_swarm_optimization.set_customized_performance_index_and_variable_ranges(GLOBAL.customized_optimization.performance_index, GLOBAL.customized_optimization.variable_ranges);
GLOBAL.particles_swarm_optimization.set_particles_size(200);
GLOBAL.particles_swarm_optimization.set_iteration(300);
GLOBAL.particles_swarm_optimization.start_optimization();
