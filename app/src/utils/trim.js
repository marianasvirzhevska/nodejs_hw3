export default (values) => {
    const _values = { ...values };
    Object.keys(_values).forEach( (key) => {
        if (typeof _values[key] === 'string') {
            _values[key] = _values[key].trim();
        }
    } );
    return _values;
};
