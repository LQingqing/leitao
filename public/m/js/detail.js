$(function(){
var letao=new Letao();

letao.initScroll();
letao.id=letao.getQueryString('id');
letao.getProductDetail();
letao.addCart();


})


var Letao=function(){

}

Letao.prototype={
id:" ",    
//mui区域滚动的初始化代码
initScroll:function(){
  mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
 },
 
//初始化轮播图的方法
initSlide: function() {
  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
      interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
  });
},

 //专门获取url参数的值的方法 根据参数名获取参数值
 getQueryString: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
},

 //根据商品id获取商品详情数据
 getProductDetail:function(){
  var that=this;
  $.ajax({
    url:'/product/queryProductDetail',
    data:{id:that.id},
    success:function(data){
      console.log(data);
    //调用轮播图的模板 
    var html=template('slideTpl',data);
    $('#slide').html(html);
    //初始化轮播图的方法
    that.initSlide();
    // 把尺码先处理成数组
    var min = data.size.split('-')[0];
    var max = data.size.split('-')[1];
    var sizeArr = [];
    //  循环从最小开始到最大
   for(var i=min;i<=max;i++){
       // 往数组中添加每一个尺码
     sizeArr.push(parseInt(i));
   }
   //把数组原理的40-50替换我们的sizeArr
   data.size = sizeArr;
   
    // 调用商品信息的模板
    var html=template('productInfoTpl',data);
    $('#product-detail').html(html);
   //默认数字框也动态生成也无法点击（在渲染完后再初始化数字框）
   mui('.mui-numbox').numbox();
  //  让尺码支持点击事件
  $('.btn-size').on('tap',function(){
    $(this).addClass('active').siblings().removeClass('active');
    })
   }
  })
 },

//加入购物车功能
addCart:function(){
  var that=this;
  // 1. 给加入购物车按钮添加点击事件
$('.btn-add-cart').on('tap',function(){
  //2 获取当前点击尺码的id
  var size = $('.btn-size.active').data('size');
  
  
//3.判断如果没有提示选尺码就提示
if(!size){
   // 第一次参数就是提示的内容 duration:1000 可以写毫秒数 也可以单词  long short
   mui.toast('请选择尺码', { duration: 2000, type: 'div' });
   return false;
}  
 //4. 获取当前选择的数量 使用MUI提供的方法来获取数字框的值
 var num = mui('.mui-numbox').numbox().getValue();
 
 
 if (!num) {
     mui.toast('请选择数量', { duration: 2000, type: 'div' });
     return false;
 }
 
// 5.调用添加购物车的API实现添加购物车
$.ajax({
  url:'/cart/addCart',
  type:'post',
  data:{productId:that.id,num:num,size:size},
  success:function(data){
    
    console.log(data);
    
   // 6. 判断如果data返回的值 有error表示有错 有错就跳转到登录有错都是没登录
 if(data.error){
   //详情页面跳转到登录 让登录完成后回到我的当前的详情页
   location.href = 'login.html?returnUrl=detail.html?id=' + that.id;
  
 }else{
  mui.confirm('加入成功，是否去购物车查看！', '温馨提示', ['是', '否'], function(e) {
    //点击了第一个按钮  是
    if (e.index == 0) {
        location.href = 'cart.html';
    } else {
        //点击了第二个按钮 否
        mui.toast('请继续添加', { duration: 'long', type: 'div' })
    }
   });
  }
 }
})
})
},  
 
}