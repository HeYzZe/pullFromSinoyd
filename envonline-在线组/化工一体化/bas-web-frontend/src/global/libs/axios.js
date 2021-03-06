import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import config from '@/config';
import router from '@/routes';
import { IEVersion } from '@/libs/tools';

const isIE = IEVersion();

const Axios = axios.create({
  timeout: config.http.timeout,
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: status => (status >= 200 && status < 300),
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' }),
});

const { CancelToken } = axios;
const requestMap = new Map();

const toLogin = () => {
  if (process.env.NODE_ENV === 'production') {
    window.location.href = `${window.location.origin}/fxhgfrontend/#/login`;
  } else {
    router.replace({ name: 'login' });
  }
};

let timeout = null;
const refreshToken = () => {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(() => {
    store.dispatch('auth/RefreshToken');
  }, 5 * 60 * 1000);
};

// 检测 token 到期
const checkExpireToken = (error) => {
  const { response, config } = error;
  const { status, data } = response;
  const msg = data.msg || '';
  if (status === 403 || status === 402) {
    store.commit('auth/Logout');
    toLogin();
  } else if (status === 401 || (msg.includes('授权已过期'))) {
    // 刷新token
    store.dispatch('auth/RefreshToken', config).then(() => {
      // 重新获取导航
      store.dispatch('auth/GetMenu');
    }).catch(() => {
      store.commit('auth/Logout');
      toLogin();
    });
  }
};

// 请求前置拦截器
Axios.interceptors.request.use(
  (cfg) => {
    // 设置凭证
    if (store.state.auth.token && cfg.headers.Authorization !== '') {
      cfg.headers.common.Authorization = store.state.auth.token;
    }
    if (cfg.url.indexOf('bas/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('sys/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('cfg/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('keyPoints/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('res/') === 0) {
      cfg.url = `sinoyd-doc/${cfg.url}`;
    }
    if (cfg.url.indexOf('export') === 0) {
      cfg.timeout = 0;
    }
    if (cfg.url.indexOf('keypoints/') === 0) {
      cfg.url = `sinoyd-keypoints/${cfg.url}`;
    }

    if (cfg.url.indexOf('energy/') === 0) {
      cfg.url = `sinoyd-eec/${cfg.url}`;
    }

    // fix: 修复IE下 get 缓存机制问题
    if (cfg.method === 'get' && isIE) {
      if (cfg.params) {
        cfg.params._rendertime = new Date().getTime();
      } else {
        cfg.params = { _rendertime: new Date().getTime() };
      }
    }

    // 防止重复请求
    if (config.http.repeated) {
      const keyString = qs.stringify(Object.assign({}, { url: cfg.url, method: cfg.method }, cfg.data));
      if (requestMap.get(keyString)) {
        cfg.cancelToken = new CancelToken((cancel) => {
          cancel('请求发送中...');
        });
      }
      requestMap.set(keyString, true);
      Object.assign(cfg, { ckeyString: keyString });
    }

    return cfg;
  },
  error => Promise.reject(error)
);

// 响应前置拦截器
Axios.interceptors.response.use(
  (response) => {
    // 重置requestMap
    const { config } = response;
    requestMap.set(config.ckeyString, false);

    if (response.data.success && response.config.headers.Authorization) {
      store.commit('auth/SetToken', response.config.headers.Authorization);
    }

    if (!/proxy\/auth\/refresh-token/.test(response.config.url)) {
      // 持续刷新TOKEN, 间隔 5 分钟
      refreshToken();
    }

    return response;
  },
  (error) => {
    requestMap.set(error.config.ckeyString, false);

    if (!/proxy\/auth\/login/.test(error.config.url) && error.response.status > 400) {
      checkExpireToken(error);
    }

    return Promise.reject(error);
  }
);

Axios.all = axios.all;
Axios.spread = axios.spread;

export default Axios;
