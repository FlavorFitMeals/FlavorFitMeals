
function unselectAll() {
    for (var i = 0; i <= $(".selected").length; i++) {
        $($(".selected")[i]).toggleClass("selected")
    }
}

function select(elem) {
    unselectAll()
    activeItem = $(elem).attr("cartID")
    console.log("trying to select" + activeItem)
    $($("#item" + activeItem).find("p")[0]).toggleClass("selected")
    checkError()
}

function removeItem(elem) {
    cid = $(elem).attr("cartID")
    tid = $(elem).attr("itemID")

    $("#" + tid).remove()
    cart[cid] = {
        removed: true
    }
    console.log(cart)
    reorderItems()
    checkError()
    updateFinalOrder()
}

function reorderItems() {
    var items = $(".item-title")
    for (var i = 0; i < items.length; i++) {
        $($(".item-title")[i]).text("Item" + (i + 1) + ":")
    }
}

function checkError() {
    if (activeItem >= 0 && $(".selected").length == 0) {
        $(".s-cart-error").attr("class", "s-cart-error")
    } else {
        $(".s-cart-error").attr("class", "s-cart-error invisible")
    }
    if ($(".cart-item").length == 0) {
        $(".s-cart-error").attr("class", "s-cart-error invisible")
        $(".s-cart-body-spacefiller").text("Fill her up! - Click on items to add them to your shopping cart")
    } else {
        $(".s-cart-body-spacefiller").text("My Order:")
    }
}
//#submitOrderBtn
finalOrder = {};

function submitOrder() {
    var offset = 0;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].removed == false) {
            eval("finalOrder.item" + ((i + 1) - offset) + "={}")
            for (var key in cart[i]) {
                if (p.hasOwnProperty(key)) {
                    eval("finalOrder.item" + ((i + 1) - offset) + "={}") //not finished
                    console.log(key + " -> " + p[key]);
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
    var date = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear()
    return date
}

function updateFinalOrder() {
    clearReceipt()
    receiptText = "Thank you for ordering at \r\n" +
        "Flavor Fit Meals\r\n" +
        "------------------\r\n" +
        "RECEIPT\r\n" +
        "------------------\r\n" + "\r\n";
    items = $(".cart-item");
    for (var i = 0; i < items.length; i++) {
        var t = $(items[i]).find(".item-title").text()
        var c = $(items[i]).find(".carb").text()
        var d = $(items[i]).find(".dish").text()
        var q = $(items[i]).find(".roller")[0].value

        receiptText += t + "\r\n" + c + "\r\n" + d + "\r\nQuantity: " + q + "\r\n" + "\r\n";

        addReceiptText("--------------")
        addReceiptText(t)
        addReceiptText("--------------")
        addReceiptText(c)
        addReceiptText(d)
        addReceiptText("Quantity: " + q)
    }
    receiptText += "------------------\r\n" +
        "Date: " + getFormattedDate() + "\r\n" +
        "------------------\r\n";
    var $dr = $('#receipt-body').clone();
    $('#download-receipt').html($dr);
}

function clearReceipt() {
    $("#receipt-body").empty()
}

function addReceiptText(text) {
    var elem = document.createElement("span")
    $(elem).attr("class", "receipt-text")
    $(elem).text(text)
    $("#receipt-body").append(elem)
}
$(document).ready(function() {

    cart = []
    activeItem = -1
    itemNo = 0;

    function newItem() {
        cart.push({
            carb: "",
            dish: "",
            quantity: 1,
            removed: false
        });
        activeItem++;
        $(".s-cart-body-spacefiller").text("My Order:")
        item = document.createElement("div")
        $(item).attr("id", "item" + itemNo)
        $(item).attr("cartID", itemNo)
        $(item).attr("class", "cart-item")
        $(item).attr("onclick", "select(this)")

        xbtn = document.createElement("div")
        $(xbtn).attr("class", "xbtn")
        $(xbtn).attr("cartID", itemNo)
        $(xbtn).attr("itemID", "item" + itemNo)
        $(xbtn).attr("onclick", "removeItem(this)")
        $(item).append(xbtn)

        title = document.createElement("p");
        $(title).text("Item" + (itemNo + 1) + ":")
        $(title).attr("class", "item-title")
        $(item).append(title)

        tab = document.createElement("tab")

        carb = document.createElement("p")
        $(carb).attr("class", "carb")
        $(carb).text("Carb: Not Selected")
        $(tab).append(carb)

        dish = document.createElement("p")
        $(dish).attr("class", "dish")
        $(dish).text("Dish: Not Selected")
        $(tab).append(dish)

        quantity = document.createElement("p")
        $(quantity).attr("class", "quantity")
        $(quantity).text("Quantity: ")

        roller = document.createElement("input")
        $(roller).attr("class", "roller")
        $(roller).attr("cartID", itemNo)
        $(roller).attr("type", "number")
        $(roller).attr("name", "quantity")
        $(roller).on("input", function() {
            quan = parseInt($(roller)[0].value)
            cid = $(roller).attr("cartID")
            cart[cid].quantity = quan
            console.log(cart[cid])
            updateFinalOrder()
        })
        $(roller).attr("min", "1")
        $(roller).attr("max", "5")


        roller.value = 1

        $(quantity).append(roller)

        $(tab).append(quantity)

        $(item).append(tab)
        $(".s-cart-body").append(item)
        unselectAll()
        $($("#item" + itemNo).find("p")[0]).toggleClass("selected")
        itemNo++;
        console.log(cart)
        reorderItems()

    }
    // newItem();
    $(".s-cart-new-item").click(function() {
        newItem();
        updateFinalOrder()
    })
    x = 1;
    $(".s-cart-icon").click(function() {
        $(".s-cart").css("right", "0px")
        $(".s-cart-body").css("opacity", "1")
        $(".s-cart-footer").css("opacity", "1")
    })
    $(".s-cart-hide").click(function() {
        $(".s-cart").css("right", "-220px")
        $(".s-cart-body").css("opacity", "0")
        $(".s-cart-footer").css("opacity", "0")
    })

    function changeCarb(c) {
        if (activeItem == -1) {
            newItem()
        }
        cart[activeItem].carb = c
        $("#item" + activeItem).find(".carb").text("Carb: " + c)
        console.log(cart)
    }

    function changeDish(d) {
        if (activeItem == -1) {
            newItem()
        }
        cart[activeItem].dish = d
        $("#item" + activeItem).find(".dish").text("Dish: " + d)
        console.log(cart)
    }
    $(".carb-btn").click(function() {
        $(".s-cart-body-spacefiller").text("My Order:")
        changeCarb($(this).attr("carb"))
        updateFinalOrder()
    })
    $(".menu-item").click(function() {
        $(".s-cart-body-spacefiller").text("My Order:")
        changeDish($(this).find("h5").text())
        updateFinalOrder()
    })
})