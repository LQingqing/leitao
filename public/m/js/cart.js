$(function(){
var letao=new Letao();
// 调用查询购物车商品的函数
letao.queryCart(function(data){
    var html=template('cartTpl',data);
    $('.cart-list').html(html);
});
//调用初始化下拉刷新上拉加载的函数
letao.initPullrefresh(); 
// 调用删除购物车商品的函数
letao.deleteCart();
// 调用编辑购物车商品的函数
letao.editCart();

letao.getSum();
});



var Letao=function(){

}


Letao.prototype={
page:1,
pageSize:5,
 //查询购物车的函数
    // 1. 调用查询购物车API 
    // 2. 获取APi返回的数据
    // 3. 创建购物车列表的模板
    // 4. 渲染购物车列表模板
queryCart:function(callback){
    $.ajax({
     url:'/cart/queryCartPaging',
     data:{page:this.page,pageSize:this.pageSize},
     success:function(data){
        //   console.log(data);
      if(data instanceof Array){
          data={data:data};
      }
   callback && callback(data);
      }
    })
  },

  //初始化下拉刷新
    // 1. 调用初始化下拉刷新的函数
    // 2. 指定下拉刷新的回调函数
    // 3. 指定上拉加载的回调函数
    // 4. 去下拉刷新的回调函数里面刷新数据 请求第一页数据 刷新页面
    // 5. 去上拉加载的回调函数里面请求数据 请求下一页的数据 追加页面
initPullrefresh:function(){
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
  //下拉刷新的回调函数
  function pulldownRefresh(argument) {
    setTimeout(function() {
        // 下拉刷新的时候重置page=1
        that.page = 1;
        that.queryCart(function(data) {
            var html = template('cartTpl', data);
            $('.cart-list').html(html);
            //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            //下拉刷新完成后去重置上拉加载更多 但是自动触发一下上拉加载 没法解决
            mui('#pullrefresh').pullRefresh().refresh(true);
        });
    }, 1000)
  }
  //上拉加载的回调函数
  function pullupRefresh(argument) {
    setTimeout(function() {
        // 下拉刷新的时候重置page=1
        that.page++;
        that.queryCart(function(data) {
            // 由于后台返回的数据为空的时候返回是一个空数组不是一个对象 data{data:[]}
            // 由于公共函数里面处理成对象了就判断对象里面的data数组的长度是否大于0
            if (data.data.length > 0) {
                var html = template('cartTpl', data);
                $('.cart-list').append(html);
                //结束上拉加载
                mui('#pullrefresh').pullRefresh().endPullupToRefresh();
            } else {
                //结束上拉加载 并且提示没有更多数据
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        });
    }, 1000)
  }
}, 

//删除购物车的商品
    // 1. 给删除的列添加滑动事件  slideleft 事件是zepto事件
    // 2. 滑动事件里面触发确认框问否要删除
    // 3. 点击了是就要删除 调用API删除当前商品
    // 4. 点击了否 就滑回去了
deleteCart:function(){
       var that=this;
        var btnArray = ['是', '否'];
        //第二个demo，向左拖拽后显示操作图标，释放后自动触发的业务逻辑
        $(".cart-list").on('tap','.mui-table-view-cell .btn-delete', function(event) {
            var elem = this;
            var id=$(elem.parentNode.parentNode).data('id');
        
            mui.confirm('确认删除该条记录？', '温馨提示', btnArray, function(e) {
                if (e.index == 0) {
                    // elem.parentNode.parentNode.remove();
                    $.ajax({
                        url:'/cart/deleteCart',
                        data:{id:id},
                        success:function(data){
                        if(data.success){
                            that.queryCart(function(data){
                                var html=template('cartTpl',data);
                                $('.cart-list').html(html);
                                  //结束下拉刷新
                                  mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                                  //下拉刷新完成后去重置上拉加载更多 但是自动触发一下上拉加载 没法解决
                                   mui('#pullrefresh').pullRefresh().refresh(true);
                            });
                            mui.toast('删除成功', { duration: 'short', type: 'div' })  
                        }else{
                        //如果失败表示未登录
                    location.href = 'login.html';
                        } 
                    }
                })
                } else {
                    setTimeout(function() {
                        mui.swipeoutClose(elem.parentNode.parentNode);
                    }, 0);
                }
            });
        });

},

// 购物车的编辑
// 1.点击编辑按钮 弹出一个确认框
// 2确认框里放编辑商品的尺码和数量
// 3点击确定调用编辑API传入当前编辑后的尺码和购物车id
// 4编辑成功后重新刷新页面
// 5点击取消滑动回去
editCart:function(){
    var that=this;
 $('.cart-list').on('tap', '.mui-table-view-cell .btn-edit', function(){
    var elem = this;
  var product=$(this).data('product');
//   console.log(product);
  var start=product.productSize.split('-')[0];
  var end = product.productSize.split('-')[1];
  var arr=[];
  for(var i=start;i<=end;i++){
     arr.push(parseInt(i));
  }
    //  console.log(arr);
     product.productSize=arr;
    var html=template('editTpl', product);
    //去掉模板中的回车换行 因为回车换行在确认框里面会变成br标签
     html = html.replace(/[\r\n]/g, "");
     
     mui.confirm(html, '编辑商品标题', ['确认', '取消'], function(e) {
         if (e.index == 0) {
            var size=$('.btn-size.active').data('size');
            var num = mui('.mui-numbox').numbox().getValue();
        $.ajax({
            url:'/cart/updateCart',
            type:'post',
            data:{id:product.id,size:size,num:num},
            success:function(data){
                // console.log(data);
                if(data.success){
                    // 编辑成功重新刷新页面，把页面变成第一页
                    that.page=1;
                    that.queryCart(function(data){
                        var html=template('cartTpl',data);
                        $('.cart-list').html(html);
                    });  
                }
                
            }
        })
         } else {
             //如果点击了否 滑回去
             setTimeout(function() {
                //获取是当前的li标签 但是elem是点击删除按钮 父元素 父元素才是li DOM不是zepto对象
                mui.swipeoutClose(elem.parentNode.parentNode);
            }, 0);
         }
     })
    //点击选取尺码的初始化代码  
   $('.btn-size').on('tap',function(){
     $(this).addClass('active').siblings().removeClass('active');
   })
    //等数字框动态加载完后再次初始化数字框
    mui('.mui-numbox').numbox();
 })
 } ,

//计算总金额
    // 1. 当复选框发生改变的时候获取所有选中的复选框
    // 2. 获取选中复选框的商品价格和数量
    // 3. 把每个商品价格 * 数量 = 当前商品总价
    // 4. 定义总和把每个商品的总价 累加起来
    // 5. 把总金额显示到页面
 getSum: function(){
$('.cart-list').on('change','input[type="checkbox"]',function(){
  var checkeds=$('input:checked');
//   console.log(checked);
var count=0;
checkeds.each(function(index,value){
   var sum=0;
    var num=$(value).data('num');
    var price=$(value).data('price');
    sum=num*price;
    count+=sum;
    
})
count = count.toFixed(2);
// console.log(count)
$("#order .left span").html(count);

 })

 }

}