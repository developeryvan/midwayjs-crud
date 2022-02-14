// import { SocksProxyAgent } from 'socks-proxy-agent';
import * as https from 'https';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
// import * as tunnel from 'tunnel';
const request: AxiosInstance = axios.create({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko' },
  maxRedirects: 0,
  timeout: 10000,
  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
  // httpsAgent: new SocksProxyAgent('socks5://127.0.0.1:1080'),
  // httpsAgent: new tunnel.httpsOverHttp({ proxy: { host: '127.0.0.1', port: '1081' } }),
});
axiosRetry(request, { retries: 3 });
export default request;
export const weRequest = async (options: AxiosRequestConfig, retry = true) => {
  try {
    const {
      data: { errcode, errmsg, ...data },
    } = await request(options);
    if (errcode) {
      retry = false;
      throw new Error(errmsg);
    }
    return data;
  } catch (error) {
    if (!retry) {
      throw error;
    }
    return weRequest(options, false);
  }
};
