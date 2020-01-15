import request from "../utils/request";

export default {

    /**
     * 卡片身份列表
     * @param params
     */
    GetCardList(params){
        return request({
            url: '/card/list',
            method: 'post',
            data: params
        })
    },

    /**
     * 修改卡片身份信息
     * @param params
     */
    UpdateCardDetail(params){
        return request({
            url: '/card/update',
            method: 'post',
            data: params
        })
    }
}

