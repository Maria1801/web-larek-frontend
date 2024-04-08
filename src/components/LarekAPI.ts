import { IProduct, IOrder, ApiListResponse, ILarekApi } from '../types';
import { Api } from './base/api';

export class LarekApi extends Api implements ILarekApi {
	constructor(readonly baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	productList(): Promise<ApiListResponse | void> {
		return this.get('/product')
			.then((data: ApiListResponse) => data)
			.catch((err) => console.error(err));
	}
	productItem(id: string): IProduct {
		throw new Error('Method not implemented.');
	}
	submitOrder(order: IOrder): void {
		throw new Error('Method not implemented.');
	}
}
