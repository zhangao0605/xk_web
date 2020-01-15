<template>

</template>

<script>
  export default {
    name: "OtherDialog",
    props:{

    },
    data () {

    },
    methods: {
      show_dialog (mark) {
        switch (mark) {
          case 'xin_mall_points': this.xin_mall_points_dialog (mark); break;
          case 'xin_product_points': this.xin_product_points_dialog (mark); break;
          case 'xin_mall_cooperative': this.xin_mall_cooperative_dialog (mark); break;
          case 'xin_product_cooperative': this.xin_product_cooperative_dialog (mark); break;
          case 'MTO_number_wallet': this.MTO_number_wallet_dialog (mark); break;
          case 'BTO_number_wallet': this.BTO_number_wallet_dialog (mark); break;
          case 'MTO_certified_wallet': this.MTO_certified_wallet_dialog (mark); break;
          case 'BTO_certified_wallet': this.BTO_certified_wallet_dialog (mark); break;
        }
        this.dialog.is_show = true;
      },
      show_brand_owned_detail () {

      },

    }
  }
</script>

<style scoped lang="scss">

</style>
