import { CartItem } from '@/hooks/useCart';
import { Category } from '@/hooks/useCategories';
import { Product } from '@/hooks/useProducts';
import { ECommerceProduct } from '@appmetrica/react-native-analytics';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getDeliverDays() {
	var result = [];
	var date = new Date();

	for (var day = 0; day <= 6; day++) {

		result.push({
			label: date.getDate() + ' ' + date.toLocaleString('default', {
				month: 'long'
			}),
			value: date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear(),
		})

		date.setDate(date.getDate() + 1);
	}

	return result;
}

export function getDeliverHours(selectedDay: string, selectedHour: number) {
	var result = [],
		hourStart = 11,
		hourEnd = 22;

	const date = new Date();
	const nowday = date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();
	const isNowday = selectedDay == nowday;

	if (isNowday) {
		hourStart = date.getHours() + 1;
	}

	if (getDeliverMinutes(selectedDay, selectedHour).length === 0) {
		hourStart += 1;
	}

	for (var hour = hourStart; hour <= hourEnd; hour++) {
		result.push({
			label: hour,
			value: hour
		})
	}
	return result;
}

export function getDeliverMinutes(selectedDay: string, selectedHour: number) {
	var result = [],
		minuteStart = 0,
		minuteEnd = 5;

	const date = new Date();
	const nowday = date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();
	const isNowday = selectedDay === nowday;
	const isNow = selectedHour == date.getHours() + 1;

	if (isNowday && isNow) {
		minuteStart = Math.ceil(date.getMinutes() / 10) + 1;
	}

	if (minuteStart >= minuteEnd)
		minuteStart = 0;

	for (var minute = minuteStart; minute <= minuteEnd; minute++) {
		result.push({
			label: minute === 0 ? '00' : (minute * 10) + '',
			value: minute === 0 ? '00' : (minute * 10) + ''
		})
	}
	return result;
}

export function makeECommerceProduct(product: Product, categories: Category[], viewCategoryId: number) {
	const parentCategory =
		categories.find((category) => {
			if (category.id === viewCategoryId) {
				return category;
			} else if (category.sub) {
				const sub = category.sub.find(
					(subCategory) => subCategory.id === viewCategoryId,
				);
				if (sub) {
					return category;
				}
			}
		}) ?? categories[0];

	const categoriesPath =
		parentCategory.id === viewCategoryId
			? [parentCategory.name]
			: [
				parentCategory.name,
				categories.find((category) => category.id === viewCategoryId)
					?.name ?? "",
			];

	const appMetricaProduct: ECommerceProduct = {
		sku: product.externalId,
		name: product.name,
		actualPrice: {
			amount: { amount: product.price, unit: "RUB" },
		},
		categoriesPath,
	};

	return appMetricaProduct;
}

export function getCartQuantityChange(cartItems: CartItem[], productId: number, setQuantityTo: number) {
	const cartItem = cartItems.find((item) => item.product.id === productId);
	return setQuantityTo - (cartItem?.quantity ?? 0);
}