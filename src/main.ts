// import './scss/styles.scss'; // Временно закомментируем
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { ProductList } from './components/models/ProductList';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/api/AppApi';
//import { IProduct } from './types';

// Инициализация классов
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);
const productsModel = new ProductList();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Функция для тестирования моделей данных
async function testModels() {
    console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===');

    // 1. Тестирование ProductList
    console.log('\n1. ТЕСТ ProductList:');
    
    // Сохраняем тестовые данные
    productsModel.setItems(apiProducts.items);
    console.log('✅ Массив товаров сохранен:', productsModel.getItems());
    
    // Получаем товар по ID
    const testProduct = productsModel.getItem('854cef69-976d-4c2a-a18c-2aa45046c390');
    console.log('✅ Товар по ID:', testProduct);
    
    // Сохраняем выбранный товар
    if (testProduct) {
        productsModel.setSelectedItem(testProduct);
        console.log('✅ Выбранный товар:', productsModel.getSelectedItem());
    }

    // 2. Тестирование Cart
    console.log('\n2. ТЕСТ Cart:');
    
    // Добавляем товары в корзину
    if (testProduct) {
        cartModel.addItem(testProduct);
        console.log('✅ Товар добавлен в корзину');
    }
    
    // Добавляем еще один товар
    const secondProduct = productsModel.getItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
    if (secondProduct) {
        cartModel.addItem(secondProduct);
    }
    
    console.log('✅ Товары в корзине:', cartModel.getItems());
    console.log('✅ Общая стоимость:', cartModel.getTotal());
    console.log('✅ Количество товаров:', cartModel.getCount());
    console.log('✅ Проверка наличия товара:', cartModel.contains('854cef69-976d-4c2a-a18c-2aa45046c390'));
    
    // Удаляем товар
    cartModel.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
    console.log('✅ После удаления товара:', cartModel.getItems());

    // 3. Тестирование Buyer
    console.log('\n3. ТЕСТ Buyer:');
    
    // Сохраняем данные покупателя
    buyerModel.setData({
        payment: 'card',
        email: 'test@example.com',
        phone: '+79991234567',
        address: 'Москва, ул. Примерная, д. 1'
    });
    console.log('✅ Данные покупателя:', buyerModel.getData());
    
    // Проверяем валидацию
    console.log('✅ Валидация с полными данными:', buyerModel.validate());
    
    // Проверяем валидацию с неполными данными
    const incompleteBuyer = new Buyer();
    incompleteBuyer.setData({ email: 'test@example.com' });
    console.log('✅ Валидация с неполными данными:', incompleteBuyer.validate());
    
    // Очистка данных
    buyerModel.clear();
    console.log('✅ После очистки:', buyerModel.getData());

    // 4. Тестирование API
    console.log('\n4. ТЕСТ API:');
    try {
        const productsFromApi = await appApi.getProductList();
        console.log('✅ Товары с сервера:', productsFromApi);
        
        // Сохраняем полученные товары в модель
        productsModel.setItems(productsFromApi);
        console.log('✅ Товары сохранены в модель:', productsModel.getItems());
        
    } catch (error) {
        console.error('❌ Ошибка при получении товаров с сервера:', error);
        console.log('⚠️  Используем тестовые данные как fallback');
        productsModel.setItems(apiProducts.items);
    }

    console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
}

// Запускаем тестирование при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Приложение инициализировано');
    testModels();
});