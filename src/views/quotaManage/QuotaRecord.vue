<template>
    <div class="trad_wrap">
        <div>筛选查询</div>
        <div class="inputs_wrap">
            <div class="input_wrap">
                批次号
                <el-input v-model="sendcoinno" class="input_style" placeholder="请输入批次号"></el-input>
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
                标状态
                <el-select v-model="poolValue"  class="input_style">
                    <el-option
                    v-for="item in poolOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input_wrap">
                审核状态
                <el-select v-model="auditValue"  class="input_style">
                    <el-option
                    v-for="item in auditOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input_wrap">
                审核结果
                <el-select v-model="resultValue"  class="input_style">
                    <el-option
                    v-for="item in applyOptions"
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

        <div class="list_top">
            <div style="margin-top: 20px">数据列表</div>
            <el-button @click="this.addApplyRecord" style="width: 100px" type="primary">配额申请</el-button>
        </div>

        <el-table
            :data="tr_data"
            border
            style="width: 100%; margin-top: 20px;"
            :header-cell-style="this.tableHeaderColor"
            >
            <el-table-column
                label="批次号"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.batchno}}</span>
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
                label="币总额"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.coinquota}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="币余额"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.leftcoin}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="申请时间"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.createtime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="标状态"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{poolFilter[scope.row.poolstatus]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="已兑付金额"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.cashedcoin}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="过期币金额"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.expirecoin}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="审核状态"
                align="center">
                <template slot-scope="scope">
                    <span class="to_do" @click="applyDetail(scope.row)" v-if="scope.row.ischeck!='3'">{{checkFilter[scope.row.ischeck]}}</span>
					<span v-else>{{checkFilter[scope.row.ischeck]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="审核时间"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.updatetime || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="申请结果"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{applyFilter[scope.row.applystatus]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <span class="to_do" @click="queryDetial(scope.row)" v-if="scope.row.applystatus=='1'">交易明细</span>
					<span v-else>-</span>
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

        <el-dialog
            :title="applyResult == '1' ? '配额申请' : '审核结果'"
            :close-on-click-modal="false"
            :visible.sync="auditApply"
            width="30%"
            :show-close="false"
            center>
            <div v-if="applyResult == '1'">
                <div class="dialog_audit">
                    币类型
                    <el-select v-model="dialogSelectCoin" @change="queryLimit()" class="input_style"
                    placeholder="请选择"
                    >
                        <el-option
                        v-for="item in coinTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="auditInputNum" class="dialog_audit">
                    币总额
                    <el-input type="number" v-model="auditApplyValue" class="input_style"></el-input>
                </div>
            </div>
            <div v-if="applyResult == '2'" class="dialog_result_wrap">
                <div class="dialog_result">
                    <p class="font_p">审核意见</p>{{checkFilter[applyCheckState]}}
                </div>
                <div class="dialog_result">
                    <p class="font_p">反馈意见</p>{{applySuggestion}}
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="this.cancelDialog">返回</el-button>
                <el-button type="primary" v-if="auditApply && auditInputNum" @click="this.submitAudit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import searchApi from '../../apis/assetAndQuotaManage.js';
    export default {
        name: 'quotaRecord',
        data () {
            return {
                tr_data: [],
                auditApply: false,     //配额申请弹框
                auditInputNum:  false,    //配额申请输入金额
                applyResult: '1',    //区分申请弹框和审核结果弹框  1和2
                dialogSelectCoin: '',
                auditApplyValue: '',
                applyCheckState: '',    //审核结果弹窗文本
                applySuggestion: '',   //审核结果弹窗建议
                coinFilter:{
                    '1': 'TUE',
                    '2': 'POC'
                },
				poolFilter:{
					'1': '未满',
					'2': '已满标',
					'3': '已结标'
				},
				checkFilter:{
					'1': '审核通过',
					'2': '审核驳回',
					'3': '待审核'
				},
				applyFilter:{
					'1': '成功',
					'2': '失败',
					'3': '-'
				},
                poolOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '未满'},
                    {value: '2', label: '已满'},
                    {value: '3', label: '已结标'},
                ],
                applyOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '成功'},
                    {value: '2', label: '失败'}
                ],
                auditOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: '审核通过'},
                    {value: '2', label: '审核驳回'},
                    {value: '3', label: '待审核'}
                ],
                coinTypeOptions: [
                    {value: '', label: '全部'},
                    {value: '1', label: 'TUE'},
                    {value: '2', label: 'POC'}
                ],
                coinTypes: [
                    {value: '1', label: 'TUE'},
                    {value: '2', label: 'POC'}
                ],
                sendcoinno:'',		//批次编号
                poolValue: '',   //标状态
                auditValue: '',    //审核状态
                coinTypeValue: '',  //币种
                resultValue: ''  //审核结果
            }
        },
        created() {
            this.searchClick()
        },
        methods: {
            applyDetail(item){
                this.auditApply = true;
                this.applyResult = '2';
				this.applyCheckState = item.ischeck;
				this.applySuggestion = item.suggestion;
            },
            queryDetial(item){
                this.$store.dispatch('quota/setQuotaDetail',item).then(()=>{
                    this.$router.push({path: '/quotaDetail'})
                })
            },
            cancelDialog(){
                this.auditInputNum = false;
                this.auditApply = false;
                this.dialogSelectCoin = '';
                this.auditApplyValue = '';
            },
            submitAudit(){
                if(!this.auditApplyValue){
                    this.$message({
                        message: '请输入币总额',
                        type: 'warning'
                    });
					return
				}
                searchApi.coinquotaInsert(this.dialogSelectCoin, this.auditApplyValue).then((response)=>{
                    if( response.resultMap.resultCode==200){
						this.$message({
                            message: "设置成功",
                            type: 'success'
						})
                        this.cancelDialog()
						this.searchClick();
					}
                })
            },
            queryLimit(){
                searchApi.checkQuotaTypeNum(this.dialogSelectCoin).then(response=> {
					if(response.resultMap && response.resultMap.resultCode=="200"){
						if(response.resultMap.recordNumber>0){
							this.auditInputNum=false;
							this.$message({
                                message: '该批次币种未使用完，不能申请',
                                type: 'warning'
                            });
							return
						}else{
							this.auditInputNum=true;
						}
					}
				})
            },
            addApplyRecord(){
                this.auditApply = true;
                this.applyResult = '1';
            },
            pagesChange(e){
                let obj = {
					batchno: this.sendcoinno,				//批次编号
					cointype: this.coinTypeValue,			//币种
					poolstatus: this.poolValue,		//标状态
					ischeck: this.auditValue,					//审核状态
					applystatus: this.resultValue,		//申请结果
					currentIndex: e, //分页参数
					pageSize: 10,	//分页参数
				}
                searchApi.searchQuotaRecord(obj).then((response)=>{
                    this.tr_data = response.resultMap.List.length ? response.resultMap.List : []
                })
            },
            searchClick(){
                let obj = {
					batchno: this.sendcoinno,				//批次编号
					cointype: this.coinTypeValue,			//币种
					poolstatus: this.poolValue,		//标状态
					ischeck: this.auditValue,					//审核状态
					applystatus: this.resultValue,		//申请结果
					currentIndex: 0, //分页参数
					pageSize: 10,	//分页参数
				}
                searchApi.searchQuotaRecord(obj).then((response)=>{
                    this.tr_data = response.resultMap.List.length ? response.resultMap.List : []
                })
            }
        }
    }
</script>

<style scoped>
    .font_p{
        font-size: 14px;
        width: 100px;
    }
    .dialog_result_wrap{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .dialog_result{
        margin-top: 20px;
        width: 50%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .dialog_audit{
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center
    }
    .list_top{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between
    }
    .to_do{
        color: rgb(125, 70 ,245);
        cursor: pointer;
        font-size: 14px;
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
