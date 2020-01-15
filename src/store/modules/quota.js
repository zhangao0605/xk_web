const state = {
    quotaDetailData: {}
}

const mutations = {
    SET_QUOTA_DATA (state, data) {
        state.quotaDetailData = data
    },
}

const actions = {
    setQuotaDetail({commit}, data) {
        commit('SET_QUOTA_DATA', data)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
