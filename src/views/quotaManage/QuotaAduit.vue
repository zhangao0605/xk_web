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
                label="申请时间"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.createtime}}</span>
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
                label="审核状态"
                align="center">
                <template slot-scope="scope">
				<span class="color_choose">{{checkFilter[scope.row.ischeck]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <span class="to_do" @click="queryDetial(scope.row)">{{scope.row.ischeck=='3' ? '审核' : '查看'}}</span>
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
            title="配额审核"
            :close-on-click-modal="false"
            :visible.sync="auditApply"
            width="30%"
            :show-close="false"
            center>
            <div v-if="dialogType == '1'" class="dialog_result_wrap">
                <div class="dialog_result">
                    <p class="font_p">审核意见</p>{{checkFilter[applyCheckState]}}
                </div>
                <div class="dialog_result">
                    <p class="font_p">反馈意见</p>{{applySuggestion}}
                </div>
            </div>
            <div v-if="dialogType == '2'" class="dialog_aduit_wrap">
                <div class="dialog_result">
                    <p class="font_p">审核意见</p>
                    <el-radio v-model="radio" label="1">审核通过</el-radio>
                    <el-radio v-model="radio" label="2">审核驳回</el-radio>
                </div>
                <div class="dialog_result" style="align-items: flex-start">
                    <p class="font_p">反馈意见</p>
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入内容"
                    v-model="view.suggestion">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="this.cancelDialog">返回</el-button>
                <el-button type="primary" v-if="auditApply && dialogType == '2'" @click="this.submitAudit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import searchApi from '../../apis/assetAndQuotaManage.js';
    export default {
        name: 'quotaAduit',
        data () {
            return {
                tr_data: [],
                auditApply: false,     //配额申请弹框
                dialogType: '1',       //查看和审核类型   1查看  2审核
                applyCheckState: '',    //审核结果弹窗文本
                applySuggestion: '',   //审核结果弹窗建议
                radio: '',      //审核选择  1 通过    2 驳回
                coinFilter:{
                    '1': 'TUE',
                    '2': 'POC'
                },
				checkFilter:{
					'1': '审核通过',
					'2': '审核驳回',
					'3': '待审核'
				},
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
                sendcoinno:'',		//批次编号
                auditValue: '',    //审核状态
                coinTypeValue: '',  //币种
                view:{
					id:'',
					ischeck:'',				//审核意见
					suggestion:'',		//反馈详情
					batchno:'',
					cointype:'',
					coinquota:'',
				},
            }
        },
        created() {
            this.searchClick()
        },
        methods: {
            queryDetial(item){
                if(item.ischeck == '3'){
                    this.dialogType = '2';
                    this.auditApply = true;
                    this.view.id = item.id.toString();
                    this.view.batchno = item.batchno;
                    this.view.cointype = item.cointype;
                    this.view.coinquota = item.coinquota.toString();
                    this.view.ischeck = item.ischeck;
                    this.view.suggestion = item.suggestion;
                }else {
                    this.dialogType = '1';
                    this.auditApply = true;
                    this.applyCheckState = item.ischeck;
                    this.applySuggestion = item.suggestion;
                }
            },
            cancelDialog(){
                this.auditInputNum = false;
                this.auditApply = false;
                this.applyCheckState = '';
                this.applySuggestion = '';
                this.view = {
                    id:'',
					ischeck:'',				//审核意见
					suggestion:'',		//反馈详情
					batchno:'',
					cointype:'',
					coinquota:'',
                }
            },
            submitAudit(){
                if(!this.radio){
                    this.$message({
                        message: "请选择审核意见",
                        type: 'warning'
                    })
					return
				}
				if(!this.view.suggestion){
                    this.$message({
                        message: "请输入反馈意见",
                        type: 'warning'
                    })
					return
                }
                this.view.ischeck = this.radio;
                searchApi.coinQuotaUpdate(this.view).then((response)=>{
                    if(response.resultMap.resultCode==404){
                        this.$message.error("审核失败，请重试")
						return
					}
                    if( response.resultMap.resultCode==200){
						this.$message({
                            message: "审核成功",
                            type: 'success'
						})
                        this.cancelDialog()
						this.searchClick();
					}
                })
            },
            pagesChange(e){
                let obj = {
					batchno: this.sendcoinno,				//批次编号
					cointype: this.coinTypeValue,			//币种
					ischeck: this.auditValue,					//审核状态
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
					ischeck: this.auditValue,					//审核状态
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
    .dialog_aduit_wrap{
        display: flex;
        flex-direction: column;
        align-items: center;
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
