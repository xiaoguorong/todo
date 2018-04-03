let iscroll=new IScroll(".content",{
	mouseWheel:true,
	scrollbars:true
});
var state="project";
$(".add").click(function(){
	$(".mask").show();	
	$(".submit").show();
	$(".update").hide();
	$(".inputarea").transition({y:0},500);
})
$(".cancel").click(function(){
	$(".inputarea").transition({y:"-62vh"},500,function(){
		$(".mask").hide();
	});
})
$(".submit").click(function(){
	var val=$("#text").val();
	if(val==""){
		return;
	}
	$("#text").val("");
	var data=getData();
	var time=new Date().getTime();
	data.push({connect:val,time,star:false,done:false})
	save(data);
	render();
	$(".inputarea").transition({y:"-62vh"},500,function(){
		$(".mask").hide();
	})
})
$(".update").click(function(){
	var val=$("#text").val();
	if(val==""){
		return;
	}
	$("#text").val("");
	var data=getData();
	var index=$(this).data("index");
	data[index].connect=val;
	save(data);
	render();
	$(".inputarea").transition({y:"-62vh"},500,function(){
		$(".mask").hide();
	})
})
function getData(){
	return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function save(data){
	localStorage.todo=JSON.stringify(data);
}
function render(){
	var data=getData();
	console.log(data)
	var str="";
	data.forEach(function(val,index){
		if(state=="project"&&val.done==false){
		str+="<li id="+index+"><p>"+val.connect+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">*</span><div class='changestate'>完成</div></li>"
		}
		else if(state=="done"&&val.done==true){
		str+="<li id="+index+"><p>"+val.connect+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">*</span><div class='del'>删除</div></li>"
	   }
	})
	alert("1")
	$(".itemlist").html(str);
	iscroll.refresh();
	touch();
}
render();
function parseTime(time){
	var date=new Date();
	date.setTime(time);
	var year=date.getFullYear();
	var month=setZero(date.getMonth()+1);
	var day=setZero(date.getDate());
	var hour=setZero(date.getHours());
	var minute=setZero(date.getMinutes());
	var second=setZero(date.getSeconds());
	return year+"/"+month+""+day+"<br>"+hour+":"+minute+":"+second;
}
function setZero(n){
	return n<10?"0"+n:n;
}
let hua=document.querySelectorAll(".itemlist li");
$(".project").click(function(){
	$(this).addClass("active").siblings().removeClass("active");
	state="project";
	render();
})
$(".done").click(function(){
	$(this).addClass("active").siblings().removeClass("active");
	state="done";
	render();
})
$(".itemlist").on("click",".changestate",function(){
	var index=$(this).parent().attr("id");
	var data=getData();
	data[index].done=true;
	save(data);
	render();
}).on("click",".del",function(){
	var index=$(this).parent().attr("id");
	var data=getData();
	data.splice(index,1);
	save(data);
	render();
}).on("click","span",function(){
	var index=$(this).parent().attr("id");
	var data=getData();
	data[index].star=!data[index].star;
	save(data);
	render();
}).on("click","p",function(){
	var index=$(this).parent().attr("id");
	var data=getData();
	$(".mask").show();
	$(".inputarea").transition({y:0},500);
	$("#text").val(data[index].connect);
	$(".submit").hide();
	$(".update").show().data("index",index);
})
function touch(){
	$(".itemlist>li").each(function(index,ele){
		let hammer=new Hammer(ele);
		let sx,movex;
		let state="start";
		let max=window.innerWidth/5;
		let flag=true;//手指离开之后是否有动画
		hammer.on("panstart",function(e){
			sx=e.center.x;
		})
		hammer.on("panmove",function(e){
			let cx=e.center.x;
			movex=cx-sx;
			if(movex>0&&state=="start"){
				flag=false;
				return;
			}
			if(movex<0&&state=="end"){
				flag=false;
				return;
			}
			if(Math.abs(movex)>max){
				flag=false;
				state=state=="start"?"end":"start";
				if(state=="end"){
					$(ele).css("x",-max);
				}else{
					$(ele).css("x",0);
				}
				return;
			}
			if(state=="end"){
				movex=-max+cx-sx;
			}
			flag=true;
			$(ele).css("x",movex);
		})
		hammer.on("panend",function(e){
			if(!flag){
				return;
			}
			if(Math.abs(movex)<max/2){
				$(ele).transition({"x":0});
				state="start";
			}else{
				$(ele).transition({"x":-max});
				state="end";
			}
		})
	})
}
// hua.forEach(function(ele){
// 	let sx,sy,movex;
// 	let state="start";
// 	let max=window.innerWidth/5;
// 	console.log(max)
// 	let flag=true;//手指离开之后是否有动画
// 	ele.ontouchstart=function(e){
// 		sx=e.changedTouches[0].clientX;
// 	}
// 	ele.ontouchmove=function(e){
// 		ele.style.transition=`none`;
// 		let cx=e.changedTouches[0].clientX;
// 		console.log(cx)
// 		movex=cx-sx;
// 		if(movex>0&&state=="start"){
// 			console.log("向右移动")
// 			flag=false;
// 			return;
// 		}
// 		if(movex<0&&state=="end"){
// 			console.log("向右移  x动")
// 			flag=false;
// 			return;
// 		}
// 		if(Math.abs(movex)>max){
// 			console.log("超过");
// 			flag=false;
// 			state=state=="start"?"end":"start";
// 			return;
// 		}
// 		if(state=="end"){
// 			console.log("向左移动")
// 			movex=-max+cx-sx;
// 		}
// 		flag=true;
// 		ele.style.transform=`translateX(${movex}px)`;
// 	}
// 	ele.ontouchend=function(e){
// 		if(!flag){
// 			return;
// 		}
// 		ele.style.transition=`all 1s`;
// 		if(Math.abs(movex)<max/2){
// 			ele.style.transform=`translateX(0)`;
// 			state="start";
// 		}else{
// 			ele.style.transform=`translateX(${-max}px)`;
// 			state="end";
// 		}
// 	}
// })

