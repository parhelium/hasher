clearCache = function ( ractive, keypath ) {
	var cacheMap, wrappedProperty;

	// Is there a wrapped property at this keypath?
	if ( wrappedProperty = ractive._wrapped[ keypath ] ) {
		// Did we unwrap it?
		if ( wrappedProperty.teardown() !== false ) {
			ractive._wrapped[ keypath ] = null;
		}
	}
	
	ractive._cache[ keypath ] = undefined;

	if ( cacheMap = ractive._cacheMap[ keypath ] ) {
		while ( cacheMap.length ) {
			clearCache( ractive, cacheMap.pop() );
		}
	}
};