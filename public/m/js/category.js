$(function(){
var letao=new Letao();
letao.rightContentSlide();
 letao.queryTopCategory();
 letao.querySecondCategory();
})

var Letao=function(){

}

Letao.prototype={
// 右边内容区域滚动的初始化代码
rightContentSlide:function(){
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
},
 //获取一级分类
 queryTopCategory: function() {
    // 1. 调用ajax请求请求一级分类
    $.ajax({
        url: '/category/queryTopCategory',
        success: function(data) {
          var html=template('queryTopCategoryTpl',data)
        //  把生成模板渲染到页面
           $('.category-left ul').html(html); 
        }
    });
},
// 获取二级分类
querySecondCategory:function(){
  $('.category-left ul').on('tap','li a',function(){
    // console.log($(this).data('id'));
  querySecondCategoryData($(this).data('id'));
  $(this).parent().addClass('active').siblings().removeClass('active');
  })

  querySecondCategoryData(1);

  function querySecondCategoryData(id){
    $.ajax({
        url:'/category/querySecondCategory',
        data:{'id':id}, 
        success:function(data){
         var html=template('querySecondCategoryTpl',data);
         $('.category-right .mui-row').html(html);
        }
    })   
  }
  

 
}
}