# token-auth-boris

## Подготовка к использованию

```TypeScript
import { Authorization } from 'token-auth-boris'

const auth = Authorization({})

const methods = {
  register: async (data) => await fetch('https://example.org/api/register', {
    headers: ...
    body: JSON.stringify(data)
  }),
  checkUser: async (data) => await fetch('https://example.org/api/checkUser', {
    headers: ...
    body: JSON.stringify(data)
  })
}

auth.setMethods(methods)

const checkToken(prevValue) => true

auth.addMiddleware(checkToken)

export default auth
```

## Middlewares

Имеются возможность создавать `middleware`, которые выполняются перед выполнением собственных методов. Это может быть, допустим, проверка и обновление токенов.

Возможно создавать несколько `middleware`. Каждый `middleware` выполняется друг за другом. `Middleware`, которое возвращает значение, может использоваться в следующем `middleware` благодаря prevValue.

Синтаксис: `const middleware = (method: string, prevValue: any) => any`

## Использование

```TypeScript
const info = await auth.execute('getUser', ...args)
```

Количество параметров args строго соответствует кол-ву параметров при присвоении метода.

### Сохранение токенов

Имеется возможность сохранять токены с помощью функций `saveRefreshToken(string)` и `saveAccessToken(string)`. Токены сохраняются в localStorage, если не задано обратное.

## Задание информации

- `setMethods(methods: { [key: string]: MethodType })`
- `addMiddleware(func: (prevValue: any) => any)`
- `saveAccessToken(token: string)`
- `saveRefreshToken(token: string)`

## Получение информации

- `getAccessToken()`
- `getRefreshToken()`
- `getMiddlewares()`
- `getMethods()`