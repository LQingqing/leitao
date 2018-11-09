$(function(){
 var letao=new Letao();
 letao.queryUser();
 letao.updateUser();

})


var Letao=function(){

}


Letao.prototype={
  page: 1,
  pageSize: 5,
 queryUser:function(){
   var that=this;
   $.ajax({
     url:'/user/queryUser' , 
     data:{page:this.page, pageSize:this.pageSize},
     success:function(data){
          console.log(data);
        var html=template('userTpl',data);
        $('tbody').html(html);
        var totalPages = Math.ceil(data.total/that.pageSize); 
        that.getPage(totalPages);
    
     }
    })
 },
 updateUser:function(){
   var that=this;
  $('.table tbody').on('tap','btn-option',function(){
   var id=$(this).data('id');
    var isDelete=$(this).data('is-delete')
    if(isDelete==0){
      isDelete=1;
    }else{
      isDelete=0;
    }
    $.ajax({
      type: 'post',
      data: { id: id, isDelete: isDelete },
      success:function(data){
        if(data.success){
          //重新查询
          that.queryUser();
        }
      }
    })
  })
 },

 //定义分页的函数
    getPage: function(totalPages) {
        var that = this;
        //当前显示页码数
        // var currentPage = 1;
        // 总页数 比如13条 每页5条   13/5 = 3页  Math.ceil(数据总条数/每页大小 )
        // var totalPages = totalPages;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: 5, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function(event, originalEvent, type, page) {
                //拿到当前点击的page赋值给全局的page
                that.page = page;
                //改了页面数据要重新查询
                that.queryUser();
            }
        });

    }
}