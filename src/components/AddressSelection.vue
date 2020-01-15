<template>
  <div>
    <el-select v-model="province.code" placeholder="省" style="width: 150px" @change="handleProvinceChange">
      <el-option
        v-for="(item, index) in provinceList"
        :key="index"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
    <el-select v-model="city.code" placeholder="市" style="width: 150px; margin-left:10px" @change="handleCityChange">
      <el-option
        v-for="(item, index) in cityList"
        :key="index"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
    <el-select v-model="area.code" placeholder="区(县)" style="width: 150px; margin-left:10px" @change="handleAreaChange">
      <el-option
        v-for="(item, index) in areaList"
        :key="index"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import { getProvincesArr, getCitiesArr, getAreaArr } from '../utils/getAddressList'
  export default {
    name: "AddressSelection",
    props: {
      _provinceName: String,
      _cityName: String,
      _areaName: String,
    },
    data () {
      return {
        address: {},  //三级地址

        province: {},
        city: {},
        area: {},


        provinceList: getProvincesArr() || [],

        cityList: [],

        areaList: [],

      }
    },
    created () {
      this.province.name = this._provinceName;
      this.city.name = this._cityName;
      this.area.name = this._areaName;

      this.province = this.getAddressObject(this.provinceList, '', this.province.name) || {};
      this.cityList = getCitiesArr( this.province.code ) || [];

      this.city = this.getAddressObject(this.cityList, '', this.city.name) || {};
      this.areaList = getAreaArr( this.city.code ) || [];

      this.area = this.getAddressObject(this.areaList, '', this.area.name ) || {};


    },
    methods: {
      handleProvinceChange () {
        this.province = this.getAddressObject(this.provinceList, this.province.code)|| {};
        this.cityList = getCitiesArr( this.province.code ) || [];
        this.areaList = [];
        this.city = {};
        this.area = {};
        this.getOut();
      },
      handleCityChange () {
        this.city = this.getAddressObject(this.cityList, this.city.code)|| {};
        this.areaList = getAreaArr( this.city.code ) || [];
        this.area = {};
        this.getOut();

      },
      handleAreaChange () {
        this.area = this.getAddressObject(this.areaList, this.area.code)|| {};
        this.getOut();

      },
      getAddressObject(list, code, name = '') {
        if (!list || !list.length || (this.$isNullOrEmpty(code) && this.$isNullOrEmpty(name))){
          return {};
        }
        for(let i = 0; i < list.length; i++){
         if ((code && list[i].code === code) || (name && list[i].name === name)) {
            return JSON.parse(JSON.stringify(list[i]));
         }
        }
      },
      getOut () {
        this.address = {
          province: this.province,
          city: this.city,
          area: this.area
        };
        this.$emit('change', this.address);
      }
    }
  }
</script>

<style scoped>

</style>
