(function ( proto ) {

	var consolidateChangedValues;

	proto.updateModel = function ( keypath, cascade ) {
		var values, deferredCheckboxes, i;

		if ( typeof keypath !== 'string' ) {
			keypath = '';
			cascade = true;
		}

		consolidateChangedValues( this, keypath, values = {}, deferredCheckboxes = [], cascade );

		if ( i = deferredCheckboxes.length ) {
			while ( i-- ) {
				keypath = deferredCheckboxes[i];
				values[ keypath ] = getValueFromCheckboxes( this, keypath );
			}
		}

		this.set( values );
	};

	consolidateChangedValues = function ( ractive, keypath, values, deferredCheckboxes, cascade ) {
		var bindings, childDeps, i, binding, oldValue, newValue;

		bindings = ractive._twowayBindings[ keypath ];

		if ( bindings ) {
			i = bindings.length;
			while ( i-- ) {
				binding = bindings[i];

				// special case - radio name bindings
				if ( binding.radioName && !binding.node.checked ) {
					continue;
				}

				// special case - checkbox name bindings
				if ( binding.checkboxName ) {
					if ( binding.changed() && !deferredCheckboxes[ keypath ] ) {
						// we will need to see which checkboxes with the same name are checked,
						// but we only want to do so once
						deferredCheckboxes[ keypath ] = true; // for quick lookup without indexOf
						deferredCheckboxes[ deferredCheckboxes.length ] = keypath;
					}
					
					continue;
				}

				oldValue = binding.attr.value;
				newValue = binding.value();

				if ( arrayContentsMatch( oldValue, newValue ) ) {
					continue;
				}

				if ( !isEqual( oldValue, newValue ) ) {
					values[ keypath ] = newValue;
				}
			}
		}

		if ( !cascade ) {
			return;
		}

		// cascade
		childDeps = ractive._depsMap[ keypath ];
		
		if ( childDeps ) {
			i = childDeps.length;
			while ( i-- ) {
				consolidateChangedValues( ractive, childDeps[i], values, deferredCheckboxes, cascade );
			}
		}
	};

}( proto ));