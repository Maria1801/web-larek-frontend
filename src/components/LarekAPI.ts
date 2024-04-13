import {
	IProduct,
	IOrder,
	ApiListResponse,
	ILarekApi,
	ApiPostResponse,
} from '../types';
import { Api } from './base/api';

export class LarekApi extends Api implements ILarekApi {
	constructor(readonly baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	productList(): Promise<ApiListResponse | void> {
		return this.get('/product')
			.then((data: ApiListResponse) => data);
	}
	productItem(id: string): Promise<IProduct | void> {
		return this.get('/product/'+ id)
		.then((data: IProduct) => data);
	}
	submitOrder(order: IOrder): Promise<ApiPostResponse | void> {
		return this.post('/order', order)
			.then((response: ApiPostResponse) => response);
	}
}
