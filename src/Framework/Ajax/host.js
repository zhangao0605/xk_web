import storage from "../../utils/storage";

const api = {

  // 'localhost:8080': 'http://192.168.1.108:9000',
  // 'localhost:8080': 'http://baas.thinkey.xyz/api',
  // 'localhost:8080': 'http://192.168.0.110:9000',
  // 'localhost:8080': 'http://localhost:8080',
  // 'localhost:8080': '/mweb',                                 // 测试环境1.0
  // 'localhost:8080': 'http://192.168.1.108:9000',
  'localhost:8080': 'http://43.247.184.50:8280/xk-admin',
  // 'localhost:8080': 'http://192.168.0.126:9000',
  '192.168.0.100:8080': 'http://192.168.0.110:9000',
  '192.168.0.127:8080': 'http://192.168.1.108:9000',
};


export function getAppBaseUrl() {
  return (
    storage.temp("session", "baseUrl") ||
    api[location.host] ||
    location.protocol + "//" + location.host + '/xk-admin'
  ) + '/v2';
}
