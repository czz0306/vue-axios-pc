<template>
  <div>
    <Layout>
      <Sider>
        <Anchor>
          <AnchorLink href="#basic_usage" title="Basic Usage" />
          <AnchorLink href="#static_position" title="Static Position" />
          <AnchorLink href="#API" title="API">
            <AnchorLink href="#Anchor_props" title="Anchor props" />
            <AnchorLink href="#Anchor_events" title="Anchor events" />
            <AnchorLink href="#AnchorLink_props" title="AnchorLink props" />
          </AnchorLink>
        </Anchor>
      </Sider>
      <Content>
        <div id='basic_usage' style='height:500px;margin-top:20px;background:pink'>basic_usage</div>
        <div id='static_position' style='height:500px;margin-top:20px;background:pink'>static_position</div>
        <div id='API' style='height:500px;margin-top:20px;background:pink'>API</div>
        <div id='Anchor_props' style='height:500px;margin-top:20px;background:pink'>Anchor_props</div>
        <div id='Anchor_events' style='height:500px;margin-top:20px;background:pink'>Anchor_events</div>
        <div id='AnchorLink_props' style='height:500px;margin-top:20px;background:pink'>AnchorLink_props</div>
      </Content>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
      this.getData();
    },
    methods: {
      getData() {
        this.$http.data()
          .then(res=>{
            console.log(res);
          },err=>{
            console.log(err)
          })/* 
          .catch(function(error) {
            console.log(error);
          }); */
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    color: #fff;
  }
</style>
