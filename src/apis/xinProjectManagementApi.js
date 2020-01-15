import request from "../utils/request";
import { getAppBaseUrl } from "../Framework/Ajax/host";

export default {

  get_project_list (page, rows, project, status, projectNO, xtoRelease) {
    return request({
      url: '/project/list',
      method: 'post',
      data: { page, rows, project, status, projectNO, xtoRelease }
    })
  },

  update_project ({id, name, xtoRelease, xtoName, xtoExpiredTime, xtoExchangeMaxCount, xtoExchangeRoundPoint, xtoInviteMaxCount, xtoInviteRoundCount, profitMallPercent, profitBrandPercent, xtoIconUrl, miniappUrl, projectDescPicture}) {
    return request({
      url: '/project/update',
      method: 'post',
      data: {id, name, xtoRelease, xtoName, xtoExpiredTime, xtoExchangeMaxCount, xtoExchangeRoundPoint, xtoInviteMaxCount, xtoInviteRoundCount, profitMallPercent, profitBrandPercent, xtoIconUrl, miniappUrl, projectDescPicture}
    })
  },

  upload_project_image () {
    return getAppBaseUrl() + '/project/upload'
  }
}
