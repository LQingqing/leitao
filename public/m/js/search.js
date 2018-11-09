$(function(){
 var letao=new Letao();
//  调用添加历史记录
letao.addHistory();
// 调用查询历史记录
letao.queryHistory();
// 调用删除历史记录
letao.deleteHistory();
// 调用清空历史记录
letao.clearHistory();
})

var Letao=function(){
 

}

Letao.prototype={

// 添加收索历史记录
addHistory:function(){
  var that=this;
    
// 1給搜索按钮添加点击事件
$('.search-from .btn-search').on('tap',function(){
    // console.log(this);
// 2获取当前输入框输入的值
var search=$('.search-input').val();
// console.log(text);
 // 3判断当前输入框的是否有输入
 if(!search){
   alert('请输入要搜索的商品');
   return false;
 }
// 4获取本地储存中是否有值 有值就使用储存中的值 没有值就使用空数组 
 var  historyData=localStorage.getItem('historyData');
 // 5 判断当前本地储存的是否有值
 if(historyData){
    // 如果有值就把值转成数组（因为本地储存中都是字符串） 
     historyData=JSON.parse(historyData);
 }else{
    // 如果没有值就是空数组 
     historyData=[];
    //  console.log(historyData);
 }
 //6判断当前输入的值是否在数组存在
    if(historyData.indexOf(search)!=-1){
   // 7 如果存在就把旧的值删掉·
   historyData.splice(historyData.indexOf(search),1);
    //8 把新增的值添加 让新增在最前面
   historyData.unshift(search);
 }else{
    // 9如果输入的值在数组中不存在 直接追加到最前面
    historyData.unshift(search);  
 }

  //10.把添加完成的数组保存到本地存储中 
     //设置值要把数组转成字符串
   localStorage.setItem('historyData',JSON.stringify(historyData));   
  //11. 在添加完成后调用查询刷新页面
   that.queryHistory()
  //  12 添加完成后清空输入框
  $('.search-input').val('');
  //search按钮的跳转  
  window.location.href = 'productlist.html?search=' + search;
 });

},

// 查询收搜历史记录
queryHistory:function(){
 // 1.获取本地储存有值就转换 没有值就为空数组
 var historyData=JSON.parse(localStorage.getItem('historyData'))||[];
//  2.调用模板的时候把数组包装成对象调用模板 数组不能用在模板里面必须是对象
var html=template('searchHistoryTpl',{'rows':historyData});
$('.content ul').html(html);
// 3把模板调用的数组默认渲染到页面 
},

// 删除收搜历史记录
deleteHistory:function(){
  var that=this;  
//1. 给所有删除xx添加点击事件
$('.content ul').on('tap','li i',function(){
    // console.log(this);
    //2.获取当前点击xx的删除的索引
    var index=$(this).data('index');
 // console.log($(this).data('index'));
 //3.获取当前本地储存的数组 把当前索引的值删掉
   var historyData=JSON.parse(localStorage.getItem('historyData'))||[];
   historyData.splice(index,1);
//4.删完后存储到本地存储中 把数组转成字符串
 localStorage.setItem('historyData',JSON.stringify(historyData));
//5.在删除完成后调用查询刷新页面
 that.queryHistory();
})
},

// 清空历史记录
clearHistory:function(){
 var that=this;   
//1.清空按钮添加点击事件
$('.title a').on('tap',function(){
    // console.log(this);
//2.调用本地储存removeItem 删除某个键和值
localStorage.removeItem('historyData');
//3.在清空完成后调用查询刷新页面
that.queryHistory();   
});
},


}