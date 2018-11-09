$(function(){
  var letao=new Letao();
  letao.register();
  letao.getvCode();

})


var Letao=function(){

}

Letao.prototype={
    vCode: '',   
register:function(){
    var that=this;
$('.btn-register').on('tap',function(){
    mui(".mui-input-group input").each(function(){
        console.log(this.value);
         var check=true;
       if(!this.value||this.value.trim()==""){
          var label=this.previousElementSibling;
          mui.toast(label.innerText+'不能为空',{ duration:'short', type:'div' }); 
          check=false;
          return false;
       }
    });
    if(check=true){
        var username=$('.username').val();
        var mobile=$('.mobile').val();
        var password1=$('.password1').val();
        var password2=$('.password2').val();
        var vCode=$('.vcode').val();
        //判断手机号是否合法
        if (!(/^1[34578]\d{9}$/.test(mobile))) {
            mui.toast("请输入合法手机号", { duration: 'short', type: 'div' });
            return false;
        }

        if(password1!=password2){
            mui.toast("两次输入的密码不一致请重新输入", { duration: 'short', type: 'div' });
            return false;
        }
       if(vCode!=that.vCode){
        mui.toast("验证码输入错误", { duration: 'short', type: 'div' });
        return false;  
       }
       
       $.ajax({
           url:'/user/register',
          type: 'post',
        data: { username: username, password: password1, mobile: mobile, vCode: vCode },
           success:function(data){
             console.log(data);
             if(data.error){
                mui.toast(data.message, { duration: 'short', type: 'div' });
                return false;
             }else{
              location.href='login.html?returnUrl=user.html'
             }
           }
       })
    }
})

},

getvCode:function(){
    var that=this;
  $('.btn-getVCode').on('tap',function(){
    $.ajax({
       url:'/user/vCode',
       success:function(data){
           console.log(data.vCode);
        that.vCode=data.vCode;
           
       }

    })

  })  
    
}




}