$(function(){
 var letao = new Letao();
 letao.login();

})



var Letao=function(){

}


Letao.prototype={
 login:function(){
 $('.btn-login').on('click',function(){
  var username=$('.username').val();
  var password=$('.password').val();
  
  if(!username.trim()){
    alert('用户名不能为空'); 
    return false; 
  }
  if(!password.trim()){
      alert('用户密码不能为空');
      return false;
  }
   
  $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      data:{username:username,password:password},
      success:function(data){
        //   console.log(data);
          if(data.error){
           alert(data.message);
          }else{
          
            location.href='index.html';
          }  
      }
    })
  })
 }
}