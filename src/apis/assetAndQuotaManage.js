import request from '../utils/request'

export default {

    /**
     * 查询交易记录列表
     * @param params
     */
    searchTradingRecord(params){
        return request({
            url: '/CoindetailsQuery.do',
            method: 'post',
            data: params
        })
    },

    /**
     * 查询配额记录列表
     * @param params
     */
    searchQuotaRecord(params){
        return request({
            url: '/CoinquotaQuery.do',
            method: 'post',
            data: params
        })
    },

    /**
     * 检查配额币种数量
     * @param cointype
     */
    checkQuotaTypeNum(cointype){
        return request({
            url: '/CoinquotaQueryCointype.do',
            method: 'post',
            data: { cointype }
        })
    },

    /**
     * 检查配额币种数量
     * @param cointype
     * @param coinquota
     */
    coinquotaInsert(cointype,coinquota){
        return request({
            url: '/CoinquotaInsert.do',
            method: 'post',
            data: { cointype, coinquota }
        })
    },

    /**
    * 检查配额币种数量
    * @param params
    */
    coinDetailsBatchno(params){
        return request({
            url: '/CoindetailsQueryBatchno.do',
            method: 'post',
            data: params
        })
    },

    /**
    * 检查配额币种数量
    * @param params
    */
    coinQuotaUpdate(params){
        return request({
            url: '/CoinquotaUpdate.do',
            method: 'post',
            data: params
        })
    },
}

