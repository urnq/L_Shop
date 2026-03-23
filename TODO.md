# Никита (ТИМЛИД) - ветка `dev-nikita`

- [ ] `server/package.json`
- [ ] `server/tsconfig.json`
- [ ] `server/.env.example`
- [ ] `server/src/index.ts`

- [ ] `server/src/types/index.ts`
- [ ] `server/src/models/UserModel.ts`
- [ ] `server/src/models/ProductModel.ts`
- [ ] `server/src/models/CartModel.ts`
- [ ] `server/src/models/OrderModel.ts`
- [ ] `server/src/data/users.json`
- [ ] `server/src/data/products.json`
- [ ] `server/src/data/carts.json`
- [ ] `server/src/data/orders.json`

- [ ] `server/src/middleware/auth.ts`
- [ ] `server/src/controllers/authController.ts`
- [ ] `server/src/routes/authRoutes.ts`

- [ ] `server/src/controllers/cartController.ts`
- [ ] `server/src/routes/cartRoutes.ts`

- [ ] `server/src/controllers/orderController.ts`
- [ ] `server/src/routes/orderRoutes.ts`

- [ ] `server/src/controllers/productController.ts`
- [ ] `server/src/routes/productRoutes.ts`

- [ ] Проверить CORS
- [ ] Добавить error handling middleware
- [ ] Протестировать все эндпоинты

---

# Саша - ветка `dev-sasha`

- [ ] `client/package.json`
- [ ] `client/tsconfig.json`
- [ ] `client/webpack.config.js`
- [ ] `client/index.html`
- [ ] `client/src/index.ts`

- [ ] `client/src/styles/global.css`
- [ ] `client/src/components/Header.ts`
- [ ] `client/src/components/Footer.ts`
- [ ] `client/src/components/Button.ts`

- [ ] `client/src/components/ProductCard.ts`
- [ ] `client/src/pages/HomePage.ts`

- [ ] `client/src/components/Filters.ts`
- [ ] Обновить `client/src/pages/HomePage.ts` (добавить Filters)

- [ ] `client/src/router.ts`
- [ ] Обновить `client/src/index.ts` (подключить роутер)
- [ ] Обновить `client/src/components/Header.ts` (добавить data-link)

- [ ] `client/src/components/Loader.ts`
- [ ] Обновить `client/src/pages/HomePage.ts` (добавить Loader)
- [ ] Обновить `client/src/styles/global.css` (стили для Loader)

- [ ] Обновить `client/src/styles/global.css` (медиа-запросы, мобильная версия)
- [ ] Обновить `client/src/components/ProductCard.ts` (добавить data-title, data-price)
- [ ] Обновить `client/src/pages/HomePage.ts` (добавить data-атрибуты для фильтров)

---

# Паша - ветка `dev-pasha`

- [ ] `client/src/types/index.ts`
- [ ] `client/src/services/api.ts`

- [ ] `client/src/store/authStore.ts`
- [ ] `client/src/store/cartStore.ts`

- [ ] `client/src/components/AuthForm.ts`
- [ ] `client/src/components/ProtectedRoute.ts`
- [ ] `client/src/pages/AuthPage.ts`

- [ ] `client/src/components/CartItem.ts`
- [ ] `client/src/pages/CartPage.ts`

- [ ] `client/src/components/DeliveryForm.ts`
- [ ] `client/src/pages/CheckoutPage.ts`

- [ ] `client/src/components/OrderCard.ts`
- [ ] `client/src/pages/OrdersPage.ts`

- [ ] Обновить `client/src/pages/AuthPage.ts` (добавить data-registration)
- [ ] Обновить `client/src/pages/CartPage.ts` (добавить data-title="basket", data-price="basket")
- [ ] Обновить `client/src/components/DeliveryForm.ts` (добавить data-delivery-address, data-delivery-phone, data-delivery-email)
- [ ] Обновить `client/src/pages/CheckoutPage.ts` (интеграция с cartStore)

---

# 🚀 Запуск проекта

## Бэкенд (Никита)
```bash
cd server
npm install
npm run dev
# Сервер на http://localhost:3000