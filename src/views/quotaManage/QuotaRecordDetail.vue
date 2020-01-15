<template>
    <div class="trad_wrap">
        <div>筛选查询</div>
        <div class="inputs_wrap">
            <div class="input_wrap">
                流水号
                <el-input v-model="sendcoinno" class="input_style" placeholder="请输入批次号"></el-input>
            </div>

            <div class="input_wrap">
                手机号
                <el-input v-model="phone" class="input_style" placeholder="请输入批次号"></el-input>
            </div>

            <div class="input_wrap">
                币渠道
                <el-select v-model="coinwayValue"  class="input_style">
                    <el-option
                    v-for="item in coinwayOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input_wrap">
                交易类型
                <el-select v-model="transValue"  class="input_style">
                    <el-option
                    v-for="item in transTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input_wrap">
                交易状态
                <el-select v-model="statusValue"  class="input_style">
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input_wrap">
            </div>
        </div>

        <div class="btn_wrap">
            <el-button @click="this.searchClick" style="width: 200px" type="primary">查询</el-button>
        </div>

        <div style="margin-top: 20px">数据列表</div>

        <el-table
            :data="tr_data"
            border
            style="width: 100%; margin-top: 20px;"
            :header-cell-style="this.tableHeaderColor"
            >
            <el-table-column
                label="爆币批次号"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.sendcoinno}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="交易流水号"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.serialno}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="用户ID"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.userid}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="手机号"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.phoneno}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="币类型"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{coinFilter[scope.row.cointype]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="币渠道"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{wayFilter[scope.row.coinway]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="交易类型"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{transFilter[scope.row.transtype]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="交易状态"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{statusFilter[scope.row.transstatus]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="交易额"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.amount}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.createtime}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="chain_info_row" style="margin-top:20px">
            <div></div>

            <el-pagination
            @current-change="pagesChange"
            background
            layout="total, prev, pager, next"
            :total="0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import searchApi from '../../apis/assetAndQuotaManage.js';
    export default {
        name: 'quotaRecordDetail',
        data () {
            return {
                tr_data: [],
                sendcoinno: '',    //流水号
                phone: '',    //手机号
                coinwayValue: '',    //币渠道结果
                transValue: '',    //交易类型结果
                statusValue: '',    //交易状态
                quotaData: {},     //升级传递参数
                coinFilter:{
                    '1': 'TUE',
                    '2': 'POC'
                },
				transFilter:{
					'1': '收入',
					'2': '支出',
				},
				wayFilter:{
					'1': '兑现',
					'2': '爆币',
					'3': '商品返佣',
					'4': '充值',
					'5': '徒弟升级返佣',
					'6': '升级扣减'
				},
				statusFilter:{
					'1': '交易成功',
					'2': '交易失败',
					'3': '交易处理中'
				},
                coinwayOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '兑现'},
                    {value: '2', label: '爆币'},
                    {value: '3', label: '商品返佣'},
                    {value: '4', label: '充值'},
                    {value: '5', label: '徒弟升级返佣'},
                    {value: '6', label: '升级扣减'},
                ],
                transTypeOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '收入'},
                    {value: '2', label: '支出'}
                ],
                statusOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '交易成功'},
                    {value: '2', label: '交易失败'},
                    {value: '3', label: '交易处理中'},
                ],
            }
        },
        created() {
            this.quotaData = this.$store.getters.quotaData;
            this.searchClick()
        },
        methods: {
            pagesChange(e){
                
            },
            searchClick(){
                let params = {
					batchno: this.quotaData.batchno,
					cointype: this.quotaData.cointype,
					serialno: this.sendcoinno,			//流水号
					phoneno: this.phone,		//手机号
					coinway: this.coinwayValue,			//币渠道
					transtype: this.transValue,		//交易类型
					transstatus: this.statusValue,		//交易状态
					currentIndex: 0, //分页参数
					pageSize: 10,	//分页参数
                };
                searchApi.coinDetailsBatchno(params).then((response)=>{
                    this.tr_data = response.resultMap.List.length ? response.resultMap.List : []
                })
            }
        }
    }
</script>

<style scoped>
    .dialog_result{
        margin-top: 20px;
        width: 50%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .btn_wrap{
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center
    }
    .inputs_wrap{
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around
    }   
    .input_style{
        width: 70%;
        margin-left: 20px;
    }
    .input_wrap{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        font-size: 14px;
        width: 30%;
        margin-bottom: 20px;
    }
    .trad_wrap{
        padding: 20px 30px;
        background-color: #ffffff;
    }
    .color_choose {
        color: #666666;
    }
    .chain_info_row{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>
