var defaultOptions = createFromNull(), getObject, getArray;

getObject = function () { return {}; };
getArray = function () { return []; };

defineProperties( defaultOptions, {
	preserveWhitespace: { enumerable: true, value: false     },
	append:             { enumerable: true, value: false     },
	twoway:             { enumerable: true, value: true      },
	modifyArrays:       { enumerable: true, value: true      },
	data:               { enumerable: true, value: getObject },
	lazy:               { enumerable: true, value: false     },
	debug:              { enumerable: true, value: false     },
	transitions:        { enumerable: true, value: getObject },
	eventDefinitions:   { enumerable: true, value: getObject },
	noIntro:            { enumerable: true, value: false     },
	transitionsEnabled: { enumerable: true, value: true      },
	magic:              { enumerable: true, value: false     },
	adaptors:           { enumerable: true, value: getArray  }
});

Ractive = function ( options ) {

	var key, template, templateEl, parsedTemplate;

	// Options
	// -------
	for ( key in defaultOptions ) {
		if ( options[ key ] === undefined ) {
			options[ key ] = ( typeof defaultOptions[ key ] === 'function' ? defaultOptions[ key ]() : defaultOptions[ key ] );
		}
	}


	// Initialization
	// --------------

	// We use Object.defineProperties (where possible) as these should be read-only
	defineProperties( this, {
		// Generate a unique identifier, for places where you'd use a weak map if it
		// existed
		_guid: {
			value: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r, v;

				r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			})
		},

		// events
		_subs: { value: createFromNull() },

		// cache
		_cache: { value: {} }, // we need to be able to use hasOwnProperty, so can't inherit from null
		_cacheMap: { value: createFromNull() },

		// dependency graph
		_deps: { value: [] },
		_depsMap: { value: createFromNull() },

		// unresolved dependants
		_pendingResolution: { value: [] },

		// Create arrays for deferred attributes and evaluators
		_defAttrs: { value: [] },
		_defEvals: { value: [] },
		_defSelectValues: { value: [] },
		_defCheckboxes: { value: [] },
		_defRadios: { value: [] },
		_defObservers: { value: [] },

		// Keep a list of used evaluators, so we don't duplicate them
		_evaluators: { value: createFromNull() },

		// two-way bindings
		_twowayBindings: { value: {} },

		// transition manager
		_transitionManager: { value: null, writable: true },

		// animations (so we can stop any in progress at teardown)
		_animations: { value: [] },

		// nodes registry
		nodes: { value: {} },

		// property wrappers
		_wrapped: { value: createFromNull() }
	});

	// options
	this.modifyArrays = options.modifyArrays;
	this.magic = options.magic;
	this.twoway = options.twoway;
	this.lazy = options.lazy;
	this.debug = options.debug;

	if ( this.magic && noMagic ) {
		throw new Error( 'Getters and setters (magic mode) are not supported in this browser' );
	}

	if ( options.el ) {
		this.el = getEl( options.el );
		if ( !this.el && this.debug ) {
			throw new Error( 'Could not find container element' );
		}
	}


	this.data = options.data;
	

	// Components registry
	this.components = options.components || {};

	// Transition registry
	this.transitions = options.transitions;

	// Instance-specific event definitions registry
	this.eventDefinitions = options.eventDefinitions;

	// Adaptors
	this.adaptors = options.adaptors;


	// Parse template, if necessary
	template = options.template;

	
	if ( typeof template === 'string' ) {
		if ( !Ractive.parse ) {
			throw new Error( missingParser );
		}

		if ( template.charAt( 0 ) === '#' && doc ) {
			// assume this is an ID of a <script type='text/ractive'> tag
			templateEl = doc.getElementById( template.substring( 1 ) );
			if ( templateEl ) {
				parsedTemplate = Ractive.parse( templateEl.innerHTML, options );
			}

			else {
				throw new Error( 'Could not find template element (' + template + ')' );
			}
		}

		else {
			parsedTemplate = Ractive.parse( template, options );
		}
	} else {
		parsedTemplate = template;
	}

	// deal with compound template
	if ( isObject( parsedTemplate ) ) {
		this.partials = parsedTemplate.partials;
		parsedTemplate = parsedTemplate.main;
	} else {
		this.partials = {};
	}

	// If the template was an array with a single string member, that means
	// we can use innerHTML - we just need to unpack it
	if ( parsedTemplate && ( parsedTemplate.length === 1 ) && ( typeof parsedTemplate[0] === 'string' ) ) {
		parsedTemplate = parsedTemplate[0];
	}

	this.template = parsedTemplate;

	// Add partials to our registry
	if ( options.partials ) {
		for ( key in options.partials ) {
			if ( hasOwn.call( options.partials, key ) ) {
				this.partials[ key ] = options.partials[ key ];
			}
		}
	}

	this.parseOptions = {
		preserveWhitespace: options.preserveWhitespace,
		sanitize: options.sanitize
	};


	
	// temporarily disable transitions, if noIntro flag is set
	this.transitionsEnabled = ( options.noIntro ? false : options.transitionsEnabled );

	render( this, { el: this.el, append: options.append, complete: options.complete });

	// reset transitionsEnabled
	this.transitionsEnabled = options.transitionsEnabled;
};
