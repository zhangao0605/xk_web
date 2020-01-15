<template>
    <div>
        <el-table
            :data="cardList"
            border
            style="width: 100%; margin-top: 20px;"
            :header-cell-style="this.tableHeaderColor"
            :span-method="objectSpanMethod"
            >
            <el-table-column
                label="卡片名称"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="特权说明"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="使用有效期"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.useDuration+'天'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="激活有效期"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.validDuration+'天'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="币数"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.coins}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="芯权数"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.powers}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="身份"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{identityName[scope.row.identity]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                <span class="to_do color_choose" @click="showModal(scope.row)">操作</span>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            :title="formData.name || '卡片设置'"
            :close-on-click-modal="false"
            :visible.sync="setDialog"
            width="30%"
            center>
            <div class="dialog_wrap">
                <div class="dialog_row" style="align-items: flex-start">
                    <p class="row_left">特权说明</p>
                    <div class="row_right">
                        <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="请输入内容"
                        v-model="formData.remark">
                        </el-input>
                    </div>
                </div>
                <div class="dialog_row">
                    <p class="row_left">使用有效期</p>
                    <div class="row_right">
                        <el-input
                        style="width: 80%"
                        type="number"
                        v-model="formData.useDuration">
                        </el-input>
                        <p class="row_right_text">天</p>
                    </div>
                </div>
                <div class="dialog_row">
                    <p class="row_left">激活有效期</p>
                    <div class="row_right">
                        <el-input
                        style="width: 80%"
                        type="number"
                        v-model="formData.validDuration">
                        </el-input>
                        <p class="row_right_text">天</p>
                    </div>
                </div>
                <div class="dialog_row">
                    <p class="row_left">币数</p>
                    <div class="row_right">
                        <el-input
                        style="width: 80%"
                        type="number"
                        v-model="formData.coins">
                        </el-input>
                    </div>
                </div>
                <div class="dialog_row">
                    <p class="row_left">芯权数</p>
                    <div class="row_right">
                        <el-input
                        style="width: 80%"
                        type="number"
                        v-model="formData.powers">
                        </el-input>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="this.changeCardData">确认修改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import cardApi from '../../apis/cardTypeManagement';
    export default {
        data () {
            return {
                setDialog: false,
                radio: '',
                formData: {
                    name: '',
                    id: '',
                    remark: '',
                    useDuration: '',
                    validDuration: '',
                    coins: '',
                    powers: ''
                },
                identityName: {
                    '-1':'原价',
                    '0': '普通用户',
                    '1': '芯客',
                    '2': '导师',
                    '3': '校董',
                },
                mergeList: [],
                cardList: [],
            }
        },
        created(){
            this.getCardList()
        },
        methods: {
            getMergeList(dataList){
                let list = [];
                let typeIndex = 0;
                for(let i = 0; i < dataList.length; i++){
                    if(i === 0){
                        list.push(1);
                        typeIndex = 0;
                    }else {
                        if(dataList[i].type == dataList[i-1].type){
                            list[typeIndex] += 1;
                            list.push(0)
                        }else {
                            list.push(1);
                            typeIndex = i;
                        }
                    }
                }
                this.mergeList = list
            },
            showModal(item){
                this.formData = {
                    name: item.name,
                    id: item.id,
                    coins: item.coins,
                    powers: item.powers,
                    useDuration: item.useDuration,
                    validDuration: item.validDuration,
                    remark: item.remark
                };
                this.setDialog = true
            },
            changeCardData(){
                if(!this.formData.validDuration){
                    this.$message({
                        message: "请设置激活有效期",
                        type: 'warning'
                    })
                    return;
                }
                if(!this.formData.useDuration){
                    this.$message({
                        message: "请设置使用有效期",
                        type: 'warning'
                    })
                    return;
                }
                if(!this.formData.coins){
                    this.$message({
                        message: "请设置币数",
                        type: 'warning'
                    })
                    return;
                }
                if(!this.formData.powers){
                    this.$message({
                        message: "请设置芯权数",
                        type: 'warning'
                    })
                    return;
                }
                if(!this.formData.remark){
                    this.$message({
                        message: "请设置特权说明",
                        type: 'warning'
                    })
                    return;
                }
                let obj = {
                    id: this.formData.id,
                    // status: 0,
                    coins: this.formData.coins,
                    powers: this.formData.powers,
                    remark: this.formData.remark,
                    useDuration: this.formData.useDuration,
                    validDuration: this.formData.validDuration
                }
                cardApi.UpdateCardDetail(obj).then((response)=>{
                    if(response.code == 200){
                        this.getCardList()
                        this.$message({
                            message: "修改成功",
                            type: 'success'
                        })
                    }
                })
                this.setDialog = false
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    let _row = this.mergeList[rowIndex];
                    let _col = _row > 0 ? 1: 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
            },
            getCardList(){
                cardApi.GetCardList({}).then((response)=>{
                    if(response.data.data.length){
                        this.cardList = response.data.data;
                        this.getMergeList(response.data.data)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .row_left{
        font-size: 14px;
        width: 25%;
        margin-right: 30px;
        text-align: right
    }
    .row_right{
        width: 60%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .row_right_text{
        margin-left: 16px;
    }
    .dialog_wrap{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .dialog_row{
        margin-top: 20px;
        width: 70%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between
    }
    .color_choose {
        color: #666666;
    }
    .to_do{
        color: rgb(125, 70 ,245);
        cursor: pointer;
        font-size: 14px;
    }
</style>
