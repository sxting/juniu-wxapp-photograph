/**
 * Created by xiejinbin on 2017/3/1.
 */
import {http} from '../../utils/http';
import {constant} from '../../utils/constant';
let loginService = {};
loginService.blogin = (data) => {
  let apiUrl = constant.apiUrl + '/appuser/blogin.json';
  return http.post(apiUrl, data);
}

module.exports = {
  loginService: loginService
}
