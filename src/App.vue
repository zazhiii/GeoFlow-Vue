<template>
  <div id="app">
    <el-menu :default-active="'/home'" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="/home">
        主页
      </el-menu-item>
      <el-menu-item index="/geo-file">
        文件管理
      </el-menu-item>
      <el-menu-item index="/upload">
        文件上传
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<style>
#app {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
