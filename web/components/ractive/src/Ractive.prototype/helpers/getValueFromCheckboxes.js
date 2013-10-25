var getValueFromCheckboxes = function ( ractive, keypath ) {
	var value, checkboxes, checkbox, len, i, rootEl;

	value = [];

	// TODO in edge cases involving components with inputs bound to the same keypath, this
	// could get messy
	
	// if we're still in the initial render, we need to find the inputs from the as-yet off-DOM
	// document fragment. otherwise, the root element
	rootEl = ractive.rendered ? ractive.el : ractive.fragment.docFrag;
	checkboxes = rootEl.querySelectorAll( 'input[type="checkbox"][name="{{' + keypath + '}}"]' );
	
	len = checkboxes.length;

	for ( i=0; i<len; i+=1 ) {
		checkbox = checkboxes[i];

		if ( checkbox.hasAttribute( 'checked' ) || checkbox.checked ) {
			value[ value.length ] = checkbox._ractive.value;
		}
	}

	return value;
};