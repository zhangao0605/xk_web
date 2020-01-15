<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
    <el-table :data="tableData">
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        align="center"
        :prop="item.prop"
        :label="item.label"
        :width="item.width">
        <template slot-scope="scope">
          <span v-if="!item.clickType">{{scope.row[item.prop]}}</span>
          <el-link v-if="item.clickType" @click="handleClick(item.clickType)" type="primary">{{scope.row[item.prop]}}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    name: "DialogWithTable",
    props:{
      dialogTitle: String,
      tableHeader: Array,
      tableData: Array,
    },
    data () {
      return {
        dialogVisible: false,
      }
    },
    methods: {
      showDialog () {

      },
      handleClick (mark) {
        this.$emit('handleClick', mark)
      }
    }
  }

  class TableTh{
    constructor(id, label, prop, width, clickType){
      this.id = id;
      this.label = label;
      this.prop = prop;
      this.width = width;
      this.clickType = clickType;
    }
  }
</script>

<style scoped>

</style>
