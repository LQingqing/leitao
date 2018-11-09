$(function(){
    var letao = new Letao();
    letao.querySecondCategory();
    letao.addBrand();  

})

var Letao = function() {

}

Letao.prototype={
    page: 1,
    pageSize: 5,
    //查询二级分类的列表 		
    querySecondCategory: function() {
        var that = this;
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: { page: this.page, pageSize: this.pageSize },
            success: function(data) {
                var html = template('secondCategoryTpl', data);
                $('.table tbody').html(html);
                var totalPages = Math.ceil(data.total / that.pageSize);
                that.getPage(totalPages);
            }
        })
    }, 
    // 添加品牌功能
    addBrand:function(){
        var that=this;
     $('.add-brand').on('click',function(){
       $.ajax({
        url: '/category/queryTopCategoryPaging',
        data: { page: 1, pageSize: 50 },
        success:function(data){
             console.log(data);
            var html = template('firstCategoryTpl', data);
              $('.select-category').html(html);
        }   
       })
     }) 
    //  给图片选择框添加事件 改变事件change
        $('.select-file').on('change', function(e) {
            //固定了图片的url地址 拼接上当前选择图片的名称  拼接成一个完成的路径 
            var imgSrc = '/mobile/images/' + e.target.files[0].name
            $('.img img').attr('src', imgSrc);
        });  

        $('.btn-save').on('click', function() {
            // 1. 获取当前选择的一级分类的id
            var categoryId = $('.select-category').val();
            if (!categoryId.trim()) {
                alert('请输入品牌名称');
                return false;
            }
            // 2. 获取当前输入的品牌名称
            var brandName = $('.brand-name').val();
            if (!brandName.trim() || brandName.length > 5) {
                alert('请输入品牌名称');
                return false;
            }
            // 3. 获取当前选择的图片
            var brandLogo = $('.img img').attr('src');
            // 4. 调用添加品牌的API实现添加品牌
            $.ajax({
            	url:'/category/addSecondCategory',
            	type:'post',
            	data:{brandName:brandName,categoryId:categoryId,brandLogo:brandLogo,hot:1},
            	success:function (data) {
            		//判断如果添加成功就刷新页面
            		if(data.success){
            			 that.querySecondCategory();
            		}
            	}
            })
        });
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
                that.querySecondCategory();
            }
        });

    }

}