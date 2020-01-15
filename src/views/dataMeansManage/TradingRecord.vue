<template>
    <div class="trad_wrap">
        <div>筛选查询</div>
        <div class="inputs_wrap">
            <div class="input_wrap">
                爆币批次号
                <el-input v-model="sendcoinno" class="input_style" placeholder="请输入批次号"></el-input>
            </div>
            <div class="input_wrap">
                流水号
                <el-input v-model="serialno" class="input_style" placeholder="请输入流水号"></el-input>
            </div>
            <div class="input_wrap">
                手机号
                <el-input v-model="phone" class="input_style" placeholder="请输入手机号"></el-input>
            </div>
            <div class="input_wrap">
                用户ID
                <el-input v-model="userid" class="input_style" placeholder="请输入用户ID"></el-input>
            </div>
            <div class="input_wrap">
                币类型
                <el-select v-model="coinTypeValue"  class="input_style">
                    <el-option
                    v-for="item in coinTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
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
                <el-select v-model="transTypeValue"  class="input_style">
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
                <span class="color_choose">{{coinFilter[scope.row.coinytype]}}</span>
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
                label="交易额"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.amount}}</span>
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
                label="创建时间"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{timestampToTime(scope.row.createtime)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{timestampToTime(scope.row.updatetime)}}</span>
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
        name: 'tradingRecord',
        data () {
            return {
                tr_data: [],
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
                statusOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '交易成功'},
                    {value: '2', label: '交易失败'},
                    {value: '3', label: '交易处理中'},
                ],
                transTypeOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '收入'},
                    {value: '2', label: '支出'}
                ],
                coinwayOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '兑现'},
                    {value: '2', label: '爆币'},
                    {value: '3', label: '商品返佣'},
                    {value: '4', label: '充值'},
                    {value: '5', label: '徒弟升级返佣'},
                    {value: '6', label: '升级扣减'},
                ],
                coinTypeOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: 'TUE'},
                    {value: '2', label: 'POC'}
                ],
                sendcoinno:'',		//批次编号
                serialno:'',		//流水号
                phone:'',		//手机号
                userid:'',			//用户id
                statusValue: '',   //交易状态
                transTypeValue: '',    //交易类型 
                coinTypeValue: '',  //币种
                coinwayValue: ''  //币渠道
            }
        },
        created(){
            this.searchClick()
        },
        methods: {
            pagesChange(e){
                let obj = {
                    sendcoinno: this.sendcoinno,
                    serialno: this.serialno,
                    userid: this.userid,
                    phoneno: this.phone,
                    coinway: this.coinwayValue,
                    coinytype: this.coinTypeValue,
                    transtype: this.transTypeValue,
                    transstatus: this.statusValue,
                    currentIndex: e,
                    pageSize: 10,
                };
                searchApi.searchTradingRecord(obj).then((response)=>{

                })
            },
            searchClick(){
                let obj = {
                    sendcoinno: this.sendcoinno,
                    serialno: this.serialno,
                    userid: this.userid,
                    phoneno: this.phone,
                    coinway: this.coinwayValue,
                    coinytype: this.coinTypeValue,
                    transtype: this.transTypeValue,
                    transstatus: this.statusValue,
                    currentIndex: 0,
                    pageSize: 10,
                };
                searchApi.searchTradingRecord(obj).then((response)=>{

                })
            }
        }
    }
</script>

<style scoped>
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
