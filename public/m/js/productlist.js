$(function(){
 var letao=new Letao();
  letao.search= letao.getQueryString('search');
// 调用查询搜索商品 
 letao.queryProduct(function(data){
    var html=template('productlistTpl',data);
    $('.productlist-content .mui-row').html(html);  
 });
   //调用初始化下拉刷新
 letao.initPullRefresh();
 //调用商品的排序
 letao.sortProduct();
 //调用当前页面的搜索功能
 letao.searchProduct();
 })

var Letao=function(){

}

Letao.prototype={
    search: '',
    page: 1,
    pageSize: 2,
    price: '',
    num: '',
    
//专门获取url参数的值的方法 根据参数名获取参数值
 getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
 },
//查询商品列表函数
queryProduct:function(callback){
//1. 根据当前url获取的搜索关键字来查询商品列表
//2. 调用商品列表API传入search和page和pageSize
//3. 创建一个商品列表模板
//4. 拿到返回商品列表数据调用模板
//5. 把模板渲染到页面 

$.ajax({
    url:'/product/queryProduct',
    data:{proName:this.search,page:this.page,pageSize:this.pageSize,price:this.price,num:this.num},
    success:function(data){
    //   console.log(data);
    //  if(callback){
    //      callback(data);
    //  }  
     callback&&callback(data);
    
    }

}) 
},
//初始化下拉刷新和上拉加载 
initPullRefresh: function() {
 var that=this;   
    mui.init({
        pullRefresh: {
            //传入区域滚动(下拉刷新的父容器) 的选择器
            container: '#pullrefresh', //.mui-scroll-wrapper 也可以
            down: {
                //初始化下拉刷新 回调函数在你执行下拉操作的时候触发
                //必须传入下拉刷新的回调函数 写真实数据请求渲染页面
                callback: pulldownRefresh
            },
            up: {
                //初始化上拉 回调函数在你执行上拉操作的时候触发
                //必须传入上拉加载的回调函数 写真实数据请求渲染页面
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });
// 下拉刷新的回调函数
function pulldownRefresh(){
//设置一个定时器模拟请求延迟
setTimeout(function(){
// 下拉刷新就是刷新第一页
 that.page=1;
// 数据请求完毕结束下拉刷新
that.queryProduct(function(data){
var html = template('productlistTpl', data);
$('.productlist-content .mui-row').html(html);   
// 数据渲染完毕结束下拉刷新
mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
//下拉刷新完成后去重置上拉加载更多 但是自动触发一下上拉加载 没法解决
mui('#pullrefresh').pullRefresh().refresh(true);
  });
 },1000)
}
//上拉加载的回调函数
function pullupRefresh(){
 setTimeout(function(){
//上拉加载的时候请求后面的数据
  that.page++;
// 数据请求完毕结束上来加载
that.queryProduct(function(data){
    console.log(data);
    
// 判断当前data.data数组是否有长度
 if(data.data.length>0){
var html=template('productlistTpl',data);
// 上拉加载是需要加载更多 是要进行追加
$('.productlist-content .mui-row').append(html);
//有数据就结束上拉加载
mui('#pullrefresh').pullRefresh().endPullupToRefresh();
 }else{
 // 没有数据就结束上拉加载 并且提示没有数据了
mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
  }
 });
},1000)   


}

},

//商品排序的函数
sortProduct:function(){
 var that=this;
// 1. 给所有排序按钮添加点击事件
$('.title a').on('tap',function(){
// 2. 获取当前点击的a的排序方式
 var sortType=$(this).data('sort-type');
//  console.log(sortType);
//3.获取当前点击a的排序的顺序
var sort=$(this).data('sort');
// 4.判断如果sort == 1 设置为2  如果等于2 设置为1
sort = sort == 1 ? 2 : 1;
// console.log(sort);

//5.重新修改页面的sort属性
$(this).data('sort',sort);
 //6. 判断当前如果是价格排序就设置价格排序 如果数量排序就是设置数量排序
 if (sortType == 'price') {
     //如果价格排序就把价格设置为 sort 
     that.price = sort;
     //把数量设置为空
     that.num = '';
 } else {
     //如果数量排序就把数量设置为 sort 
     that.num = sort;
     //把数量设置为空
     that.price = '';
 }
 //7. 不管是价格还是数量排序调用APi获取数据渲染页面
 that.queryProduct(function(data) {
    var html = template('productlistTpl', data);
    $('.productlist-content .mui-row').html(html);
});

}) 
},

//当前商品列表页面的搜索功能
searchProduct: function() {
  var that = this;
  // 1. 给当前页面的搜索按钮添加点击事件
  $('.btn-search').on('tap', function() {
      // 2. 更新当前全局search的值 为当前输入的文本值
      that.search = $('.search-input').val();
      //重新搜索的page重置为1
      that.page = 1;
      that.pageSize = 1;
      //调用查询搜索商品
      that.queryProduct(function(data) {
          var html = template('productlistTpl', data);
          $('.productlist-content .mui-row').html(html);
      });
  });
}
}