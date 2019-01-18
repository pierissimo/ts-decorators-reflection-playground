import 'reflect-metadata';

type SwaggerDefinition = {
	type: string;
	description?: string;
	properties?: { [key: string]: SwaggerDefinition };
	required?: string[];
};

export function prop(opts) {
	// this is the decorator factory
	return function(target: Object, key: string | symbol) {
		// this is the decorator

		// get the existing metadata props
		const props = Reflect.getMetadata('tsswagger:props', target) || [];
		props.push({ key, opts });
		// define new metadata props
		Reflect.defineMetadata('tsswagger:props', props, target);
	};
}

const getSchemaDefinition = (theClass: Function): SwaggerDefinition => {
	const props = Reflect.getMetadata('tsswagger:props', theClass.prototype) || [];
	return {
		type: 'object',
		properties: props.reduce((acc, { key, opts }) => {
			const type = Reflect.getMetadata('design:type', theClass.prototype, key);
			return {
				...acc,
				[key]: {
					type: type.name.toLowerCase(),
					...opts
				}
			};
		}, {}),
		required: props.reduce((acc, { key, opts }) => {
			if (opts.required) acc.push(key);

			return acc;
		}, [])
	};
};

export const getDefinition = (theClass: Function) => {
	const schemaDef = getSchemaDefinition(theClass);

	return schemaDef;
};
