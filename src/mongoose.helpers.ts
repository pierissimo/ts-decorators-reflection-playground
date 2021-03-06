import { model, Schema } from 'mongoose';

export class Model {
	save: () => {};
}

// Decorators
export function prop(opts) {
	// this is the decorator factory
	return function(target: Object, key: string | symbol) {
		// this is the decorator

		// get the existing metadata props
		const props = Reflect.getMetadata('tsmongoose:props', target) || [];
		props.push({ key, opts });
		// define new metadata props
		Reflect.defineMetadata('tsmongoose:props', props, target);
	};
}

export function index(index) {
	// this is the decorator factory
	return function(target: Object) {
		// this is the decorator

		// get the existing metadata props
		const indexes = Reflect.getMetadata('tsmongoose:indexes', target) || [];
		indexes.push(index);
		// define new metadata props
		Reflect.defineMetadata('tsmongoose:indexes', indexes, target);
	};
}

// Helper functions
const getSchemaDefinition = (theClass: Function) => {
	const props = Reflect.getMetadata('tsmongoose:props', theClass.prototype);
	return props.reduce((acc, { key, opts }) => {
		const type = Reflect.getMetadata('design:type', theClass.prototype, key);
		return {
			...acc,
			[key]: {
				type,
				...opts
			}
		};
	}, {});
};

const EXCLUDED_INSTANCE_METHODS = ['constructor'];
const EXCLUDED_STATIC_METHODS = ['name', 'length', 'prototype'];

export const getModel = (theClass: Function, modelName = theClass.name) => {
	const schemaDef = getSchemaDefinition(theClass);
	const methods = Object.getOwnPropertyNames(theClass.prototype)
		.filter(n => !EXCLUDED_INSTANCE_METHODS.includes(n))
		.reduce((acc, methodName) => ({ ...acc, [methodName]: theClass.prototype[methodName] }), {});

	const statics = Object.getOwnPropertyNames(theClass)
		.filter(n => !EXCLUDED_STATIC_METHODS.includes(n))
		.reduce((acc, methodName) => ({ ...acc, [methodName]: theClass[methodName] }), {});

	const indexes = Reflect.getMetadata('tsmongoose:indexes', theClass) || [];

	const schema = new Schema(schemaDef);
	schema.methods = methods;
	schema.statics = statics;
	schema.index(indexes);

	return model(modelName, schema);
};
