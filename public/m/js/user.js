$(function(){
  var letao=new Letao();
  letao.queryUserMessage();
  letao.exit();

})


var Letao=function(){

}

Letao.prototype={
queryUserMessage:function(){
$.ajax({
    url:'/user/queryUserMessage',
    success:function(data){
        // console.log(data);
        if(data.error){
            location.href='login.html?returnUrl=user.html';
        }
    var html=template('userMessageTpl',data);
     $('.mui-media-body').html(html);   
    }
})



},

exit:function(){
 $('.btn-exit').on('tap',function(){
     
    $.ajax({
        url:'/user/logout',
        success:function(data){
            // console.log(data);
            if(data.success){
                location.href='login.html?returnUrl=user.html';
            }
            
        }
    })
  
 })   
  
}


}