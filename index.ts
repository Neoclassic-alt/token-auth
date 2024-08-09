export interface IParams {
  save: string | null;
}

export interface IResponse {
  access_token: string;
  refresh_token: string;
  user_data?: { [key: string]: any };
}

type MiddlewareType = (method: string, prevValue: any) => any;
type MethodType = (...params: any[]) => Promise<any>;

export class Authorization {
  params: IParams = {
    save: "localStorage",
  };

  _access_token: null | string = null;
  _refresh_token: null | string = null;

  user_data: null | undefined | { [key: string]: any } = null;
  _middlewares: MiddlewareType[] = [];
  _methods: { [key: string]: MethodType } = {};

  constructor(params: Partial<IParams>) {
    this.params = { ...this.params, ...params };
  }

  async execute(method: string, ...args: any[]) {
    let currentMiddlewareValue: any;
    if (method in this._methods) {
      for (let i = 0; i < this._middlewares.length; i++) {
        // замыкание
        currentMiddlewareValue = this._middlewares[i](
          method,
          currentMiddlewareValue
        );
      }
      return await this._methods[method](...args);
    } else {
      throw new Error(`Method "${method}" is not defined.`);
    }
  }

  addMiddleware(func: MiddlewareType) {
    this._middlewares.push(func);
  }

  setMethods(methods: { [key: string]: MethodType }) {
    this._methods = methods;
  }

  saveAccessToken(access_token: string) {
    this._access_token = access_token;
    if (this.params.save === "localStorage") {
      localStorage.setItem("access_token", access_token);
    }
  }

  saveRefreshToken(refresh_token: string) {
    this._refresh_token = refresh_token;
    if (this.params.save === "localStorage") {
      localStorage.setItem("refresh_token", refresh_token);
    }
  }

  getAccessToken() {
    if (this._access_token === null && this.params.save === "localStorage") {
      this._access_token = localStorage.getItem("access_token");
    }
    return this._access_token;
  }

  getRefreshToken() {
    if (this._refresh_token === null && this.params.save === "localStorage") {
      this._refresh_token = localStorage.getItem("refresh_token");
    }
    return this._refresh_token;
  }

  getUserData() {
    return this.user_data;
  }

  getMiddlewares() {
    return this._middlewares;
  }

  getMethods() {
    return this._methods;
  }
}
