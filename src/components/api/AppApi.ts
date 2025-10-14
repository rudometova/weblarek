import { IApi, IProduct, IOrder, IOrderResponse, IProductListResponse } from '../../types';

export class AppApi {
    constructor(private baseApi: IApi) {}

    async getProductList(): Promise<IProduct[]> {
        const response = await this.baseApi.get<IProductListResponse>('/product');
        return response.items;
    }

    async createOrder(order: IOrder): Promise<IOrderResponse> {
        return await this.baseApi.post<IOrderResponse>('/order', order);
    }
}