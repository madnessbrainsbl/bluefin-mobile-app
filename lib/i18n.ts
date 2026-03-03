import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

//translate en key to english

const resources = {
  en: {
    translation: {
      "errors": {
        "unknownError": "Unknown error",
        "somethingWentWrong": "Something went wrong",
        "reload": "Reload",
        "invalidCode": "Invalid code",
        "userNotActive": "User is not active",
        "noConnection": "No internet connection",
        "checkConnection": "Check connection in settings",
      },
      "drawer": {
        "menu": "Menu",
        "current_delivery_address": "Delivery address",
        "work_hours": "Work hours",
        "select": "Select",
        "city": "City",
        "settings": "Settings"
      },
      "modal": {
        "understood": "Understood",
        "ok": "OK",
        "cancel": "Cancel",
        "confirmDeleteAddress": "Delete address?",
        "orderCreated": "Order created",
      },
      "loginSheet": {
        "phoneNumber": "Phone number",
        "enterThePhoneNumber": "Please enter your phone number to authorize in the app",
        "phone": "Phone",
        "sendCode": "Send code",
        "incorrectNumber": "Your number is incorrect",
        "enterCode": "Enter code",
        "codeWasSent": "Code sent to number",
        "changePhoneNumber": "Change",
        "resendCode": "Get new code",
        "invalidCode": "Invalid code",
      },
      "citySheet": {
        "selectCity": "Select city",
      },
      "addressSheet": {
        "selectAddress": "Select delivery address",
        "chooseOrAuthStart": "Menu in our establishments differs, so we suggest selecting a delivery address",
        "chooseOrAuthEnd": "to choose the last address",
        "authorize": "or authorize",
        "noHouseNumber": "No house number specified",
        "confirmAddress": "Confirm address",
        "outOfDeliveryZone": "Outside delivery zone",
        "deliveryCost": "Delivery cost",
        "minPrice": "Minimum order price",
        "newDepartmentWarning": "Changing the address may change the restaurant serving your order.\n" +
          "This may lead to changes in the menu,\n" +
          "and cart will be cleared.\n\n" +
          "Are you sure you want to change the address?",
      },
      "userProfileSheet": {
        "editUserProfile": "Edit delivery address",
        "save": "Save",
      },
      "product": {
        "gr": "gr",
        "order": "Order",
        "inCart": "In cart",
        "updateBasket": "Order",
        "portion": "Portion",
        "kkal": "Kcal",
        "proteins": "P",
        "fats": "F",
        "weight": "Weight",
        "carbohydrates": "C",
      },
      "catalogScreen": {
        "emptyCategory": "No items in this category",
      },
      "profile": {
        "addressName": "Address name",
        "addressLine": "Address",
        "entrance": "Entrance",
        "floor": "Floor",
        "flat": "Apartment/Office",
        "intercomCode": "Intercom code",
      },
      "searchScreen": {
        "search": "Search",
        "startTyping": "Start typing ...",
      },
      "personalScreen": {
        "personalData": "Personal data",
        "ordersHistory": "Orders history",
        "logout": "Log out",
        "name": "Name",
        "phone": "Phone",
        "email": "Email",
        "birthday": "Birthday",
        "agreePhoneSubscription": "Agree to receive information on special offers and news on my phone number",
        "agreeEmailSubscription": "Agree to receive information on special offers and news on my email address",
        "addAddress": "+ Add new address",
        "deliveryAddresses": "Delivery addresses",
        "cancel": "Cancel",
        "save": "Save",
        "deleteUser": "Delete account",
        "confirmUserDeletion": "Are you sure you want to delete your account?",
        "loyaltyCard": "Loyalty card",
        "loyaltyLevel": {
          "name": "Loyalty card level",
          5: {
            "name": "Bronze",
            "description": "5% cashback"
          },
          7: {
            "name": "Silver",
            "description": "7% cashback"
          },
          10: {
            "name": "Gold",
            "description": "10% cashback"
          },
          15: {
            "name": "Platinum",
            "description": "15% cashback"
          }
        },
        "bonusBalance": "Bonus score"
        
      },
      "orderHistoryScreen": {
        "ordersHistory": "Orders history",
        "orderNumber": "Order number",
        "repeat": "Repeat",
        "details": "Details",
        "repeatingOrder": "Repeating order",
        "accepted": "Accepted",
        "paid": "Paid",
        "awaitingPayment": "Awaiting payment",
        "pay": "Pay",
        "downloadInvoice": "Download invoice",
        "shareInvoice": "Share invoice",
        "bonusSpent": "Bonus Spent",
        "bonusSum": "Bonus gain:"
      },
      "cartScreen": {
        "cart": "Cart",
        "delivery": "Delivery",
        "checkout": "Checkout",
        "overhoursOrders": "Orders placed outside working hours will be processed after 10:00 on the next working day",
        "promocode": "Promocode",
        "apply": "Apply",
        "deliveryPrice": "Delivery",
        "free": "Free",
        "totalPrice": "Total",
        "orderPriceTooLow": "Minimum order amount {{minPrice}} ₽ (excluding delivery)",
        "chooseGift": "Choose gift",
        "choose": "Choose",
        "emptyCart": "Your cart is empty",
        "notApplied": "- not applied",
        "makeOrder": "Make order",
      },
      "checkoutScreen": {
        "checkout": "Checkout",
        "delivery": "Delivery",
        "unathorized": "To continue, you need to log in to your account",
        "authorize": "Log in",
        "phone": "Phone",
        "name": "Name",
        "email": "Email",
        "personNumber": "Number of people",
        "chooseProfile": "Select delivery address",
        "deliveryAddresses": "Delivery addresses",
        "addAddress": "Add new address",
        "takeByAnotherPerson": "Order will be received by another person",
        "anotherPersonName": "Recipient's name",
        "whenToDeliver": "When to deliver",
        "deliverNow": "As soon as possible",
        "selectDataAndTime": "Select date and time",
        "day": "Day",
        "hour": "Hour",
        "minute": "Minute",
        "paymentType": "Payment method",
        "comment": "Comment",
        "agreeToTerms": "Agree to terms and conditions of personal data processing and offer agreement",
        "deliveryPrice": "Delivery",
        "free": "Free",
        "totalPrice": "Total",
        "order": "Order",
        "cashChange": "Cash change from",
        "validationErrors": {
          "emptyName": "Name is required",
          "emptyEmail": "Email is required",
          "emptyPaysystem": "Payment method is required",
          "emptyProfile": "Delivery address is required",
        },
        "requestedBonusPayment": "Pay with bonus",
        "maxBonus": "Max bonus",
        "bonusEstimation": "Bonus gains"
      },
      "ordersScreen": {
        "back": "Back",
        "orderNumber": "Order №",
        "orderDetails": "Order details",
        "orderNumberText": "Order number",
        "orderStatus": "Order status",
        "date": "Date",
        "paysystem": "Payment method",
        "comment": "Comment",
        "deliveryAddress": "Delivery Address",
        "order": "Order",
        "quantity": "Quantity",
        "price": "Price",
        "total": "Total",
        "promocodes": "Promocodes",
      },
      "settingsScreen": {
        "trackingPermission": "Allow user data tracking",
        "trackingPermissionDescription": "We collect data to track app performance and analyze order statistics to improve user experience.",
        "trackingPermissionDescriptionCannotAsk": "We collect data to track app performance and analyze order statistics to improve user experience. Next, you will be taken to the app's permission settings, where you can enable this option.",
        "trackingPermissionDisable": "We collect data to track app performance and analyze order statistics to improve user experience. Next, you will be taken to the app's permission settings, where you can enable this option.",
        "resetState": "Reset state",
        "resetStateConfirmation": "Are you sure you want to reset the state of the application?",
      }
    }
  },
  ru: {
    translation: {
      "errors": {
        "unknownError": "Неизвестная ошибка",
        "somethingWentWrong": "Что-то пошло не так",
        "reload": "Перезагрузить",
        "invalidCode": "Неверный код",
        "userNotActive": "Пользователь не активен",
        "noConnection": "Нет соединения с интернетом",
        "checkConnection": "Проверьте подключение к интернету в настройках",
      },
      "drawer": {
        "menu": "Меню",
        "current_delivery_address": "Адрес доставки",
        "work_hours": "График работы",
        "select": "выбрать",
        "city": "город",
        "settings": "Настройки"
      },
      "modal": {
        "understood": "Ок",
        "ok": "ОК",
        "cancel": "Отмена",
        "confirmDeleteAddress": "Удалить адрес?",
        "orderCreated": "Заказ создан",

      },
      "loginSheet": {
        "phoneNumber": "Номер телефона",
        "enterThePhoneNumber": "Пожалуйста, введите номер Вашего телефона для авторизации в приложении",
        "phone": "Телефон",
        "sendCode": "Отправить код",
        "incorrectNumber": "Ваш номер указан некорректно",
        "enterCode": "Введите код",
        "codeWasSent": "Код отправлен на номер",
        "changePhoneNumber": "Изменить",
        "resendCode": "Получить новый код",
        "invalidCode": "Неверный код",
      },
      "citySheet": {
        "selectCity": "Выберите город",
      },
      "addressSheet": {
        "selectAddress": "Выберите адрес доставки",
        "chooseOrAuthStart": "Меню в наших заведениях отличается, поэтому предлагаем сразу выбрать адрес доставки ",
        "chooseOrAuthEnd": ", чтобы выбрать последний адрес",
        "authorize": "или авторизоваться",
        "noHouseNumber": "Не указан номер дома",
        "confirmAddress": "Подтвердить адрес",
        "outOfDeliveryZone": "Вне зоны доставки",
        "deliveryCost": "Цена доставки",
        "minPrice": "Минимальная сумма заказа",
        "newDepartmentWarning": "При смене адреса может измениться ресторан, обслуживающий ваш заказ.\n" +
          "Это может привести к изменению ассортимента," +
          " и ваша корзина будет очищена.\n\n" +
          "Вы уверены, что хотите изменить адрес?",

      },
      "userProfileSheet": {
        "editUserProfile": "Редактировать адрес доставки",
        "save": "Сохранить",
      },
      "product": {
        "gr": "гр",
        "order": "Заказать",
        "inCart": "В корзине",
        "updateBasket": "Изменить",
        "portion": "порция",
        "kkal": "Ккал",
        "proteins": "Б",
        "fats": "Ж",
        "weight": "Вес",
        "carbohydrates": "У",
      },
      "catalogScreen": {
        "emptyCategory": "В этой категории пока нет товаров",
      },
      "profile": {
        "addressName": "Название адреса",
        "addressLine": "Адрес",
        "entrance": "Подъезд",
        "floor": "Этаж",
        "flat": "Квартира/Офис",
        "intercomCode": "Код домофона",
      },
      "searchScreen": {
        "search": "Поиск",
        "startTyping": "Начните вводить название ...",
      },
      "personalScreen": {
        "personalData": "Личные данные",
        "ordersHistory": "История заказов",
        "logout": "Выйти",
        "name": "Имя",
        "phone": "Телефон",
        "email": "Email",
        "birthday": "Дата рождения",
        "agreePhoneSubscription": "Согласен получать информацию по спецпредложениям и новостям на номер мобильного телефона",
        "agreeEmailSubscription": "Согласен получать информацию по спецпредложениям и новостям на мой адрес электронной почты",
        "addAddress": "Добавить новый адрес",
        "deliveryAddresses": "Адреса доставки",
        "cancel": "Отменить",
        "save": "Сохранить",
        "deleteUser": "Удалить аккаунт",
        "confirmUserDeletion": "Вы уверены что хотите удалить аккаунт?",
        "loyaltyCard": "Карта лояльности",
        "loyaltyLevel": {
          "name": "Уровень карты лояльности",
          5: {
            "name": "Бронза",
            "description": "Кэшбек баллами 5%"
          },
          7: {
            "name": "Серебро",
            "description": "Кэшбек баллами 7%"
          },
          10: {
            "name": "Золото",
            "description": "Кэшбек баллами 10%"
          },
          15: {
            "name": "Платина",
            "description": "Кэшбек баллами 15%"
          }
        },
        "bonusBalance": "Бонусные баллы"
      },
      "orderHistoryScreen": {
        "ordersHistory": "История заказов",
        "orderNumber": "Заказ",
        "repeat": "Повторить заказ",
        "details": "Посмотреть",
        "repeatingOrder": "Повторяем заказ",
        "accepted": "Принят",
        "paid": "Оплачен",
        "awaitingPayment": "Ожидает оплаты",
        "pay": "Оплатить",
        "downloadInvoice": "Загрузить счет",
        "shareInvoice": "Поделится счетом",
        "bonusSpent": "из них бонусами",
        "bonusSum": "Бонусов получено:"
      },
      "cartScreen": {
        "cart": "Корзина",
        "delivery": "Куда доставить",
        "checkout": "Оформление",
        "overhoursOrders": "Заказы, оставленные в нерабочее время, будут обработаны после 10:00 ближайшего рабочего дня",
        "promocode": "Промокод",
        "apply": "Применить",
        "deliveryPrice": "Доставка",
        "free": "бесплатно",
        "totalPrice": "Итого",
        "orderPriceTooLow": "Минимальная сумма заказа {{minPrice}} ₽",
        "chooseGift": "Выбрать подарок",
        "choose": "Выбрать",
        "emptyCart": "Ваша корзина пуста",
        "notApplied": "- не удалось применить",
        "makeOrder": "Оформить заказ",
      },
      "checkoutScreen": {
        "checkout": "Оформление",
        "delivery": "Куда доставить",
        "unathorized": "Для продолжения необходимо войти в аккаунт",
        "authorize": "Войти",
        "phone": "Телефон",
        "name": "Имя",
        "email": "Email",
        "personNumber": "Кол-во персон",
        "chooseProfile": "Выберите адрес доставки",
        "deliveryAddresses": "Адреса доставки",
        "addAddress": "Добавить новый адрес",
        "takeByAnotherPerson": "Заказ получит другой человек",
        "anotherPersonName": "Имя получателя",
        "whenToDeliver": "Когда доставить",
        "deliverNow": "В ближайшее время",
        "selectDataAndTime": "Выберите дату и время",
        "day": "День",
        "hour": "Час",
        "minute": "Минуты",
        "paymentType": "Способ оплаты",
        "comment": "Комментарий",
        "agreeToTerms": "Согласен с условиями обработки персональных данных и условиями договора оферты",
        "deliveryPrice": "Доставка",
        "free": "бесплатно",
        "totalSum": "Сумма заказа",
        "discount": "Скидка",
        "totalPrice": "Итого",
        "order": "Заказать",
        "cashChange": "Сдача c",
        "validationErrors": {
          "emptyName": "Необходимо указать имя",
          "emptyEmail": "Необходимо указать email",
          "emptyPaysystem": "Не выбран способ оплаты",
          "emptyProfile": "Не выбран адрес доставки",
        },
        "requestedBonusPayment": "Бонусные баллы",
        "maxBonus": "Можно потратить",
        "bonusEstimation": "Будет начислено бонусов"
      },
      "ordersScreen": {
        "back": "Назад",
        "orderNumber": "Заказ №",
        "orderDetails": "Детали заказа",
        "orderNumberText": "Номер заказа",
        "orderStatus": "Статус",
        "date": "Дата",
        "paysystem": "Способ оплаты",
        "comment": "Комментарий",
        "deliveryAddress": "Адрес доставки",
        "order": "Заказ",
        "quantity": "Количество",
        "price": "Цена",
        "total": "Итого",
        "promocodes": "Промокоды",
        "deliveryPrice": "Доставка"
      },
      "settingsScreen": {
        "trackingPermission": "Разрешить отслеживание данных пользователя",
        "trackingPermissionDescription": "Мы собираем данные для отслеживания производительности приложения и анализа статистики заказов для улучшения пользовательского опыта.",
        "trackingPermissionDescriptionCannotAsk": "Мы собираем данные для отслеживания производительности приложения и анализа статистики заказов для улучшения пользовательского опыта. Далее произойдет переход в настройки разрешения приложения, где вы можете включить эту опцию.",
        "trackingPermissionDisable": "Разрешение уже получено, вы можете отключить его в настройках приложения.",
        "resetState": "Сбросить данные приложения",
        "resetStateConfirmation": "Вы уверены, что хотите сбросить состояние приложения?",
      }
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: "ru-RU", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
