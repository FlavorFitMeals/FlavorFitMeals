
function unselectAll() {
    for (var i = 0; i <= $(".selected").length; i++) {
        $($(".selected")[i]).toggleClass("selected");
    }
}

function select(elem) {
    unselectAll();
    activeItem = $(elem).attr("cartID");
    //console.log("trying to select" + activeItem)
    $($("#item" + activeItem).find("p")[0]).toggleClass("selected");
    checkError();
}

function removeItem(elem) {
    cid = $(elem).attr("cartID");
    tid = $(elem).attr("itemID");

    $("#" + tid).remove();
    cart[cid] = {
        removed: true
    }
    //console.log(cart)
    reorderItems();
    checkError()
    updateFinalOrder();
}

function reorderItems() {
    var items = $(".item-title");
    for (var i = 0; i < items.length; i++) {
        $($(".item-title")[i]).text("Item" + (i + 1) + ":");
    }
}

function checkError() {
    if (activeItem >= 0 && $(".selected").length == 0) {
        $(".s-cart-error").attr("class", "s-cart-error");
    } else {
        $(".s-cart-error").attr("class", "s-cart-error invisible");
    }
    if ($(".cart-item").length == 0) {
        $(".s-cart-error").attr("class", "s-cart-error invisible");
        $(".s-cart-body-spacefiller").text("Fill her up! - Click on items to add them to your shopping cart");
    } else {
        $(".s-cart-body-spacefiller").text("My Order:");
    }
}
//#submitOrderBtn
total = 0;
finalOrder = {};
function submitOrder() {
    var offset = 0;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].removed == false) {
            eval("finalOrder.item" + ((i + 1) - offset) + "={}");
            for (var key in cart[i]) {
                if (p.hasOwnProperty(key)) {
                    eval("finalOrder.item" + ((i + 1) - offset) + "={}"); //not finished
                    //console.log(key + " -> " + p[key]);
                }
            }
        } else {
            offset++;
        }
    }

}
receiptText = "";

function getFormattedDate() {
    var d = new Date(new Date());
    var date = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
    return date;
}

function updateFinalOrder() {
	total=0;
    clearReceipt();
    receiptText = "Thank you for ordering at \r\n" +
        "FlavorFit Meals\r\n" +
        "------------------\r\n" +
        "RECEIPT\r\n" +
        "------------------\r\n" + "\r\n";
    items = $(".cart-item");
    for (var i = 0; i < items.length; i++) {
    		
        var t = $(items[i]).find(".item-title").text();
        var c = $(items[i]).find(".carb").text();
        var d = $(items[i]).find(".dish").text();
        var q = $(items[i]).find(".roller")[0].value;
        total += 7 * q; 
        receiptText += t + "\r\n" + c + "\r\n" + d + "\r\nQuantity: " + q + "\r\n" + "\r\n";

        addReceiptText("--------------");
        addReceiptText(t);
        addReceiptText("--------------");
        addReceiptText(c);
        addReceiptText(d);
        addReceiptText("Quantity: " + q);
    }
    addReceiptText("Total: $" + total );
    $(".total").text("Total: $" + total);
    receiptText += "------------------\r\n" +
   		  "Total: $" + total + "\r\n" +
        "Date: " + getFormattedDate() + "\r\n" +
        "------------------\r\n";
    var $dr = $('#receipt-body').clone();
    $('#download-receipt').html($dr);
    
}

function clearReceipt() {
    $("#receipt-body").empty();
}

function addReceiptText(text) {
    var elem = document.createElement("span");
    $(elem).attr("class", "receipt-text");
    $(elem).text(text);
    $("#receipt-body").append(elem);
}

$(document).ready(function() {

    cart = [];
    activeItem = -1;
    itemNo = 0;

    function newItem() {
        cart.push({
            carb: "",
            dish: "",
            quantity: 1,
            removed: false,
        });
        activeItem++;
        $(".s-cart-body-spacefiller").text("My Order:");
        item = document.createElement("div");
        $(item).attr("id", "item" + itemNo);
        $(item).attr("cartID", itemNo);
        $(item).attr("class", "cart-item");
        $(item).attr("onclick", "select(this)");

        xbtn = document.createElement("div");
        $(xbtn).attr("class", "xbtn");
        $(xbtn).attr("cartID", itemNo);
        $(xbtn).attr("itemID", "item" + itemNo);
        $(xbtn).attr("onclick", "removeItem(this)");
        $(item).append(xbtn);

        title = document.createElement("p");
        $(title).text("Item" + (itemNo + 1) + ":");
        $(title).attr("class", "item-title");
        $(item).append(title);

        tab = document.createElement("tab");

        carb = document.createElement("p");
        $(carb).attr("class", "carb");
        $(carb).text("Carb: Not Selected");
        $(tab).append(carb);

        dish = document.createElement("p");
        $(dish).attr("class", "dish");
        $(dish).text("Dish: Not Selected");
        $(tab).append(dish);

        quantity = document.createElement("p");
        $(quantity).attr("class", "quantity");
        $(quantity).text("Quantity: ");

        roller = document.createElement("input");
        $(roller).attr("class", "roller");
        $(roller).attr("cartID", itemNo);
        $(roller).attr("type", "number");
        $(roller).attr("name", "quantity");
        $(roller).attr("maxlength", "2");
        $(roller).on("input", function() {
            quan = parseInt($(roller)[0].value);
            cid = $(roller).attr("cartID");
            cart[cid].quantity = quan;
            //console.log(cart[cid])
            updateFinalOrder();
        })
        $(roller).attr("min", "1");
        $(roller).attr("max", "5");


        roller.value = 1;

        $(quantity).append(roller);

        $(tab).append(quantity);

        $(item).append(tab);
        $(".s-cart-body").append(item);
        unselectAll();
        $($("#item" + itemNo).find("p")[0]).toggleClass("selected");
        itemNo++;
        //console.log(cart)
        reorderItems();

        noti("Item Created!");

    }
    $("#startOrdering").click(function() {
    	$([document.documentElement, document.body]).animate({
        scrollTop: $("#section-offer").offset().top
    	}, 1000);
		});
    // newItem();
    $(".s-cart-new-item").click(function() {
        newItem();
        updateFinalOrder();
    });
    x = 1;
    $(".s-cart-icon").click(function() {
        $(".s-cart").css("right", "0px")
        $(".s-cart-body").css("opacity", "1")
        $(".s-cart-footer").css("opacity", "1")
    });
    $(".s-cart-hide").click(function() {
        $(".s-cart").css("right", "-220px");
        $(".s-cart-body").css("opacity", "0");
        $(".s-cart-footer").css("opacity", "0");
    });
    if(window.innerWidth <= 924){
    	$(".s-cart").css("right", "-220px");
      $(".s-cart-body").css("opacity", "0");
      $(".s-cart-footer").css("opacity", "0");
    }
    $("#slide1").fadeIn(500);
    setInterval(function(){
    	x=$(".tut-image");
			for(var i = 0; i < x.length; i++){
				$(x[i]).css("height", $(x[i]).css("width"));
			}
    }, 1000/60);
    activeSlide = 1;
    function updateStep(){
    	if(activeSlide == 1){
    		$(".tut-step").text("#1 Choose your carb");
    	}
    	if(activeSlide == 2){
    		$(".tut-step").text("#2 Choose your dish");
    	}
    	if(activeSlide == 3){
    		$(".tut-step").text("#3 Submission and Payment");
    	}
    }
    $(".next").click(function(){
    	if(activeSlide != 3){
    		activeSlide++;
	    	id= "slide" + activeSlide;
	    	$("#slide1").fadeOut(500);
	    	$("#slide2").fadeOut(500);
	    	$("#slide3").fadeOut(500);

	    	$("#" + id).fadeIn(500);
	    	$(".checkbox").attr("class", "checkbox");
	    	$('*[checkslide="'+id+'"]').attr("class", "checkbox checked");
	    	//console.log(id)
    	}
    	updateStep();
    })
    $(".checkbox").click(function(){
    	$(".checkbox").attr("class", "checkbox");
    	$(this).attr("class", "checkbox checked");

    	$("#slide1").fadeOut(500);
    	$("#slide2").fadeOut(500);
    	$("#slide3").fadeOut(500);
    	var id = $(this).attr("checkslide");
    	activeSlide = Number(id[5]);
    	$("#" + id).fadeIn(500);
    	updateStep();
    });

    $("#tut-close").click(function(){
    	$("#tutorial").fadeOut(300);
    	$("#slide1").fadeIn(500);
    	$("#slide2").fadeOut(500);
    	$("#slide3").fadeOut(500);
    });
    $(".tut-skip").click(function(){
    	$("#tutorial").fadeOut(300);
    	$("#slide1").fadeIn(500);
    	$("#slide2").fadeOut(500);
    	$("#slide3").fadeOut(500);
    });
    function changeCarb(c) {
        if (activeItem == -1) {
            newItem();
        }
        cart[activeItem].carb = c;
        $("#item" + activeItem).find(".carb").text("Carb: " + c);
        //console.log(cart)
    }

    function changeDish(d) {
        if (activeItem == -1) {
            newItem();
        }
        cart[activeItem].dish = d;
        $("#item" + activeItem).find(".dish").text("Dish: " + d);
        //console.log(cart)
    }
    $(".carb-btn").click(function() {
        $(".s-cart-body-spacefiller").text("My Order:");
        changeCarb($(this).attr("carb"));
        updateFinalOrder();
        noti("Added To Cart!");
    })
    // $(".menu-item").click(function() {
    //     $(".s-cart-body-spacefiller").text("My Order:")
    //     changeDish($(this).find("h5").text())
    //     updateFinalOrder()
    // })
		
		$(".dish-btn").click(function() {     
			$(".s-cart-body-spacefiller").text("My Order:");
			var d=$(pc(this, 2)).find("h5").text();
			changeDish(d);
			updateFinalOrder();
			noti("Added To Cart!");
		});
		setTimeout(function(){
			$("#tutorial").fadeIn();
		}, 1500)
		$(".tut-trigger").click(function(){
			$("#tutorial").fadeIn();

			$(".checkbox").attr("class", "checkbox");
    	$('*[checkslide="slide1"]').attr("class", "checkbox checked");

    	$("#slide1").fadeIn(500);
    	$("#slide2").fadeOut(500);
    	$("#slide3").fadeOut(500);

    	activeSlide = 1;
    	updateStep();
		});
})
function pc(e, x){
	str="";
	elem = e;
	for(var i=0; i < x; i++){
		str+=".parentElement";	
	}
	return eval("elem" + str);
}
function noti(text){
	var n = document.createElement("div");
	$(n).attr("class", "noti");

	var p = document.createElement("p");
	$(p).attr("class", "noti-text");
	$(p).text(text);

	$(n).append(p);

	$(document.body).append(n);

	$(n).css("left", "-140px");

	$(n).animate({"left": "0px"}, 0.6);
	setTimeout(function(){
			$(n).animate({"left": "-140px"}, 0.6);
			setTimeout(function(){
				$(n).remove();
			},1000);
	}, 5000);

} 