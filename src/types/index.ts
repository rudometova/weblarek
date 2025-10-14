// Существующие типы
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Новые интерфейсы данных
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'card' | 'cash';

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IValidationErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Ответ от сервера для списка товаров
export interface IProductListResponse {
  items: IProduct[];
}

// Ответ от сервера при создании заказа
export interface IOrderResponse {
  id: string;
  total: number;
}