$(function() {
	var letao = new Letao();
    letao.login();
    letao.getQueryString();
});

var Letao = function() {

}

Letao.prototype = {
    //登录函数
    // 1. 点击登录按钮实现登录功能
    // 2. 获取当前输入用户名和密码
    // 3. 判断用户名和密码是否输入 
    // 4. 如果输入了就调用登录API实现登录
    login: function() {
        var that=this;
        //给登录按钮添加点击事件
        $('.btn-login').on('tap', function() {
        	   // 注意要把check默认设置为true
        		var check = true;
        	   //使用MUI的校验代码 注意把选择器改成自己
            mui(".mui-input-group input").each(function() {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    // console.log(label); <label>密码</label>
                    
                    mui.alert(label.innerText + "不允许为空");
                    //如果为空就设置为false 
                    check = false;
                    return false;
                }
            }); 
            //如果还为true 表示校验通过，继续执行业务逻辑  表示用户名和密码都输入了就可以调用APi
            if (check) {
               $.ajax({
               	url:'/user/login',
               	type:'post',               	
               	data:{username:$('.username').val(),password:$('.password').val()},
               	success:function (data) {
               		console.log(data);
               		//判断如果data.error有错 表示用户名或者密码错误
               		if(data.error){
               				mui.toast(data.message,{ duration:'long', type:'div' }) 
               		}else{
               			// 成功就要返回上一页 详情页面
                           // history.go(-1);
                     var returnUrl=that.getQueryString('returnUrl');
                     location.href=returnUrl;             
               		}
               	}
               })
            }
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
    }
}
