<template>
    <div class="wrap">
        <div v-if="activeIndex == '2'" class="position_btn">
            <el-button type="primary" @click="this.addNewIdentity">添加新身份</el-button>
        </div>

        <div v-if="activeIndex == '1'">
            <CardSetComponent/>
        </div>
        <div v-else>
            <el-table
                :data="testList"
                border
                style="width: 100%; margin-top: 20px;"
                :header-cell-style="this.tableHeaderColor"
                >
                <el-table-column
                    label="用户身份"
                    align="center">
                    <template slot-scope="scope">
                    <span class="color_choose">{{scope.row.identity}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="芯城卡价格"
                    align="center">
                    <template slot-scope="scope">
                    <span v-if="scope.row.xincheng=='0'" style="color: red">禁止</span>
                    <span v-else class="color_choose">{{scope.row.xincheng}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="城客卡价格"
                    align="center">
                    <template slot-scope="scope">
                    <span v-if="scope.row.chengke=='0'" style="color: red">禁止</span>
                    <span v-else class="color_choose">{{scope.row.chengke}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="芯品卡价格"
                    align="center">
                    <template slot-scope="scope">
                    <span v-if="scope.row.xinpin=='0'" style="color: red">禁止</span>
                    <span v-else class="color_choose">{{scope.row.xinpin}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="品客卡价格"
                    align="center">
                    <template slot-scope="scope">
                    <span v-if="scope.row.pinke=='0'" style="color: red">禁止</span>
                    <span v-else class="color_choose">{{scope.row.pinke}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="芯城审核"
                    align="center">
                    <template slot-scope="scope">
                    <span v-if="scope.row.xinchengAudit=='0'" style="color: red">禁止</span>
                    <span v-else class="color_choose">允许</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="芯品审核"
                    align="center">
                    <template slot-scope="scope">
                    <span v-if="scope.row.xinpinAudit=='0'" style="color: red">禁止</span>
                    <span v-else class="color_choose">允许</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                    <span class="to_do color_choose" @click="showSetModal(scope.row)">修改</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog
                :title="dialogType=='1' ? '身份设置':'添加新身份'"
                :close-on-click-modal="false"
                :visible.sync="setDialog"
                width="30%"
                @close="dialogClose"
                center>
                <div v-if="dialogType=='1'" class="dialog_wrap">
                    <div class="dialog_row">
                        <p class="row_left">芯城卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="setFormData.xincheng" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="setFormData.xincheng=='0'"
                                    type="number"
                                    v-model="setInputData.xincheng">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="setFormData.xincheng" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">城客卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="setFormData.chengke" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="setFormData.chengke=='0'"
                                    type="number"
                                    v-model="setInputData.chengke">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="setFormData.chengke" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">芯品卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="setFormData.xinpin" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="setFormData.xinpin=='0'"
                                    type="number"
                                    v-model="setInputData.xinpin">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="setFormData.xinpin" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">品客卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="setFormData.pinke" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="setFormData.pinke=='0'"
                                    type="number"
                                    v-model="setInputData.pinke">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="setFormData.pinke" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row" style="margin-top:30px;">
                        <p class="row_left">芯城审核</p>
                        <div class="row_right_foot">
                            <el-radio v-model="setFormData.xinchengAudit" label="1">允许</el-radio>
                            <el-radio v-model="setFormData.xinchengAudit" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row" style="margin-top:30px;">
                        <p class="row_left">芯品审核</p>
                        <div class="row_right_foot">
                            <el-radio v-model="setFormData.xinpinAudit" label="1">允许</el-radio>
                            <el-radio v-model="setFormData.xinpinAudit" label="0">禁止</el-radio>
                        </div>
                    </div>
                </div>
                <div v-else class="dialog_wrap">
                    <div class="dialog_row">
                        <p class="row_left">新身份名称</p>
                        <div class="row_right">
                            <el-input
                            type="text"
                            v-model="addFormData.identity">
                            </el-input>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">芯城卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="addFormData.xincheng" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="addFormData.xincheng=='0'"
                                    type="number"
                                    v-model="addInputData.xincheng">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="addFormData.xincheng" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">城客卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="addFormData.chengke" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="addFormData.chengke=='0'"
                                    type="number"
                                    v-model="addInputData.chengke">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="addFormData.chengke" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">芯品卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="addFormData.xinpin" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="addFormData.xinpin=='0'"
                                    type="number"
                                    v-model="addInputData.xinpin">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="addFormData.xinpin" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row">
                        <p class="row_left">品客卡价格</p>
                        <div class="row_right">
                            <el-radio v-model="addFormData.pinke" label="1" style="display: flex;flex-direction: row;align-items: center;">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-input
                                    :disabled="addFormData.pinke=='0'"
                                    type="number"
                                    v-model="addInputData.pinke">
                                    </el-input>
                                    <!-- <p class="row_right_text">天</p> -->
                                </div>
                            </el-radio>
                            <el-radio v-model="addFormData.pinke" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row" style="margin-top:30px;">
                        <p class="row_left">芯城审核</p>
                        <div class="row_right_foot">
                            <el-radio v-model="addFormData.xinchengAudit" label="1">允许</el-radio>
                            <el-radio v-model="addFormData.xinchengAudit" label="0">禁止</el-radio>
                        </div>
                    </div>
                    <div class="dialog_row" style="margin-top:30px;">
                        <p class="row_left">芯品审核</p>
                        <div class="row_right_foot">
                            <el-radio v-model="addFormData.xinpinAudit" label="1">允许</el-radio>
                            <el-radio v-model="addFormData.xinpinAudit" label="0">禁止</el-radio>
                        </div>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="this.changeCardData">确认修改</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import CardSetComponent from './CardSetComponent';

    export default {
        components: {
            CardSetComponent,
        },
        data () {
            return {
                activeIndex: '1',    //导航栏
                setDialog: false,
                dialogType: '',   //弹框类型1修改   2新增  
                radio: '',
                setInputData: {
                    xincheng: '',
                    chengke: '',
                    xinpin: '',
                    pinke: '',
                },
                setFormData: {
                    identity: '',
                    xincheng: '',
                    chengke: '',
                    xinpin: '',
                    pinke: '',
                    xinchengAudit: '',
                    xinpinAudit: ''
                },
                addInputData: {
                    xincheng: '',
                    chengke: '',
                    xinpin: '',
                    pinke: '',
                },
                addFormData: {
                    identity: '',
                    xincheng: '0',
                    chengke: '0',
                    xinpin: '0',
                    pinke: '0',
                    xinchengAudit: '0',
                    xinpinAudit: '0'
                },
                testList: [
                    {
                        identity: '普通用户',
                        xincheng: '0',
                        chengke: '0',
                        xinpin: '0',
                        pinke: '0',
                        xinchengAudit: '0',
                        xinpinAudit: '0'
                    },
                    {
                        identity: '导师',
                        xincheng: '0',
                        chengke: '0',
                        xinpin: '5000',
                        pinke: '0',
                        xinchengAudit: '0',
                        xinpinAudit: '1'
                    },
                    {
                        identity: '校董',
                        xincheng: '0',
                        chengke: '0',
                        xinpin: '0',
                        pinke: '0',
                        xinchengAudit: '0',
                        xinpinAudit: '1'
                    },
                ],
            }
        },
        created(){
        },
        methods: {
            handleSelect(index){
                // this.activeIndex = index
            },
            showSetModal(item){
                this.dialogType = '1';
                this.setFormData = {...item};
                if(item.xincheng != '0'){
                    this.setFormData.xincheng = '1';
                    this.setInputData.xincheng = item.xincheng;
                }
                if(item.chengke != '0'){
                    this.setFormData.chengke = '1';
                    this.setInputData.chengke = item.chengke;
                }
                if(item.xinpin != '0'){
                    this.setFormData.xinpin = '1';
                    this.setInputData.xinpin = item.xinpin;
                }
                if(item.pinke != '0'){
                    this.setFormData.pinke = '1';
                    this.setInputData.pinke = item.pinke;
                }
                this.setDialog = true
            },
            changeCardData(){
                if(this.dialogType == '1'){
                    let obj = {...this.setFormData}
                    if(obj.xincheng == '1'){
                        obj.xincheng = this.setInputData.xincheng
                    }
                    if(obj.chengke == '1'){
                        obj.chengke = this.setInputData.chengke
                    }
                    if(obj.xinpin == '1'){
                        obj.xinpin = this.setInputData.xinpin
                    }
                    if(obj.pinke == '1'){
                        obj.pinke = this.setInputData.pinke
                    }
                }else if(this.dialogType == '2'){
                    let obj = {...this.addFormData}
                    if(obj.xincheng == '1'){
                        obj.xincheng = this.addInputData.xincheng
                    }
                    if(obj.chengke == '1'){
                        obj.chengke = this.addInputData.chengke
                    }
                    if(obj.xinpin == '1'){
                        obj.xinpin = this.addInputData.xinpin
                    }
                    if(obj.pinke == '1'){
                        obj.pinke = this.addInputData.pinke
                    }
                }
                this.setDialog = false
            },
            addNewIdentity(){
                this.dialogType = '2';
                this.setDialog = true
            },
            dialogClose(){
                if(this.dialogType == '1'){
                    this.setFormData={
                        identity: '',
                        xincheng: '',
                        chengke: '',
                        xinpin: '',
                        pinke: '',
                        xinchengAudit: '',
                        xinpinAudit: ''
                    };
                    this.setInputData={
                        xincheng: '',
                        chengke: '',
                        xinpin: '',
                        pinke: '',
                    }
                }else if(this.dialogType == '2'){
                    this.addFormData={
                        identity: '',
                        xincheng: '',
                        chengke: '',
                        xinpin: '',
                        pinke: '',
                        xinchengAudit: '',
                        xinpinAudit: ''
                    };
                    this.addInputData={
                        xincheng: '',
                        chengke: '',
                        xinpin: '',
                        pinke: '',
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .position_btn{
        position: absolute;
        right: 30px;
        top: 30px;
    }
    .wrap{
        padding: 20px 30px;
        background-color: #ffffff;
        position: relative;
    }
    .row_left{
        font-size: 14px;
        width: 25%;
        margin-right: 30px;
        text-align: right
    }
    .row_right_foot{
        width: 60%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
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
