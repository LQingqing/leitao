$(function() {
    var letao = new Letao();
    //调用一级分类的函数
    letao.queryTopCategory();
    //调用添加一级分类的函数
    letao.addTopCategory();

})

var Letao = function() {

}

Letao.prototype = {
    page: 1,
    pageSize: 5,
    //查询一级分类的函数
    // 1. 页面加载就马上调用查询
    // 2. 调用后台的API实现查询一级分类的数据
    // 3. 创建一级分类的表格的模板
    // 4. 渲染到表格里面
    queryTopCategory: function() {
        var that = this;
        console.log(this.page);
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: { page: this.page, pageSize: this.pageSize },
            success: function(data) {
                console.log(data);
                var html = template('firstCategoryTpl', data);
                $('.table tbody').html(html);
                //计算当前的总的页码数
                var totalPages = Math.ceil(data.total / that.pageSize);
                that.getPage(totalPages);
            }
        })
    },
    //添加一级分类的功能
    // 1. 点击模态框的保存获取当前输入的分类的名称
    // 2. 调用添加一级分类的API传入当前一级分类名称
    addTopCategory: function() {
        var that = this;
        $('.btn-save').on('click', function() {
            //获取当前输入框输入的分类名称
            var categoryName = $('.category-name').val();
            if(!categoryName.trim() || categoryName.length > 5){
                // 如果没有输入分类名称返回
                alert('分类名称不合法');
                return false;
            }
            //调用添加一级分类的APi
            $.ajax({
                url:'/category/addTopCategory',
                type:'post',
                data:{categoryName:categoryName},
                success:function (data) {
                    // console.log(data);
                    
                    //如果添加成功重新渲染页面
                    if(data.success){
                        that.queryTopCategory();   
                        $('.category-name').val(''); 
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
                //改了页面数据要重新查询获取一级分类的数据
                that.queryTopCategory();
            }
        });

    }
}
