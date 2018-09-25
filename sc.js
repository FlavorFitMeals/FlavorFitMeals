// Initialize Firebase
var amIdkfoLql = {
    apiKey: "AIzaSyCOSJO2dFZsryZCeiPArvZlE_TjgOvmcc8",
    authDomain: "favorfitmeals2.firebaseapp.com",
    databaseURL: "https://favorfitmeals2.firebaseio.com",
    projectId: "favorfitmeals2",
    storageBucket: "favorfitmeals2.appspot.com",
    messagingSenderId: "733987654817"
};
firebase.initializeApp(amIdkfoLql);
var database = firebase.database()
var ref = database.ref("orders")

var order = {
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function printReceipt() {
    return receiptText;
}
$("#rbf").on("submit", function(e) {
	e.preventDefault();
    download("FlavorFitMeals - " + getFormattedDate(), printReceipt())
})
d = 0;
$("#orderForm").on('submit', function(e) {
	//stop form submission
	e.preventDefault();

    if (d == 0 && $(".cart-item").length != 0) {
        order.firstname = $("#firstname").val()
        order.lastname = $("#lastname").val()
        order.email = $("#email").val()
        order.address = $("#address").val()
        order.phonenumber = $("#phonenumber").val()
        order.notes = $("#notes").val()
        order.total = "$" + total
        var f  = 1;
        var a = [order.firstname, order.lastname, order.email, order.address, order.phonenumber]
     	for(var i in a){
     		if (a[i].length > 30){
     			f = -1;
     		}
     	}
     	if(order.notes.length > 300){
     		f = -1
     	}
        order.time = getFormattedDate();
        order.food = {};
      	receiptText += "Firstname: " + order.firstname + "\r\n" + 
      				   "Lastname: " + order.lastname + "\r\n" + 
      				   "email: " + order.email + "\r\n" + 
      				   "address: " + order.address + "\r\n" + 
      				   "phonenumber: " + order.phonenumber + "\r\n" + 
      				   "------------------\r\n" +
      				   "END OF RECEIPT\r\n" +
      				   "------------------\r\n";  
      				   
        var offset = 0;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].removed == true) {
                offset++;
            } else {
                newItemObj = {
                    carb: cart[i].carb,
                    dish: cart[i].dish,
                    quantity: cart[i].quantity,
                }
                eval("order.food.item" + (i - offset) + "=newItemObj")
            }
        }
        // console.log("Sending Order...")
        // console.log(order)
        if(f == 1){
        	// ref.push(order)
        	ref.child(order.firstname + " " + order.lastname).set(order)
        }
        // console.log($("#reservationModal"))
        $("#reservationModal").toggleClass("show")
        $("#reservationModal").removeAttr("aria-hidden")
        $("#reservationModal").css("display", "block")
        //console.log($("#reservationModal"))
        d = 1
        $("#wait").removeClass("displaying")
        setTimeout(function(){ d=0 }, 60000 * 3 )
    } else {
    	if(d == 1){
    		$("#wait").attr("class", "displaying")
    	} else{
    		alert("There is no food in the shopping cart.")
    	}
    }
});
$(".close").click(function() {
    $("#reservationModal").toggleClass("show")
    $("#reservationModal").attr("aria-hidden", "true")
    $("#reservationModal").css("display", "none")
})