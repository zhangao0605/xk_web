<template>
    <div class="wrap">
        <el-table
            :data="testList"
            border
            style="width: 100%; margin-top: 20px;"
            :header-cell-style="this.tableHeaderColor"
            >
            <el-table-column
                label="消费名称"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="数据值"
                align="center">
                <template slot-scope="scope">
                <span class="color_choose">{{scope.row.value}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                testList: [
                    {
                        name: '商城消费获得的商城芯力数量',
                        value: '1元=1分'
                    },
                    {
                        name: '商城内芯品消费获得的芯品芯力数量',
                        value: '1元=1分'
                    },
                    {
                        name: '芯客推广商品获得的商城芯力数量',
                        value: '1元=1分'
                    },
                    {
                        name: '芯品消费获得的芯品芯力数量',
                        value: '1元=1分'
                    },
                    {
                        name: '芯客推广商品获得的芯品芯力数量',
                        value: '1元=1分'
                    },
                ],
            }
        },
        created(){
        },
        methods: {}
    }
</script>

<style scoped>
    .wrap{
        padding: 20px 30px;
        background-color: #ffffff;
    }
</style>
