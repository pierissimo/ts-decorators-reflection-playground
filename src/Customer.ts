import { prop as mongooseProp, index, getModel, Model } from './mongoose.helpers';
import { prop as swaggerProp, getDefinition } from './swagger.helpers';

interface ICustomer {
	firstname: string;
	lastname: string;
	age: number;
}

// @ts-ignore
@index({ firstname: 1, lastname: 1 })
export default class Customer extends Model implements ICustomer {
	@mongooseProp({ required: true, index: true })
	@swaggerProp({ required: true, description: 'Customer first name' })
	firstname: string;

	@mongooseProp({ required: true, index: true })
	@swaggerProp({ required: true, description: 'Customer last name' })
	lastname: string;

	@mongooseProp({})
	@swaggerProp({})
	age: number;

	incrementAge() {
		this.age += 1;
		return this.save();
	}

	static findBestCustomer() {
		/// example
	}
}

(async function test() {
	const customerModel = getModel(Customer);
	const customerSwaggerDefinition = getDefinition(Customer);
	console.log(customerModel, customerSwaggerDefinition);
})();
