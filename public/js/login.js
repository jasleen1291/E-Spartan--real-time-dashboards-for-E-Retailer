function login() {
    var username = $('#userName').val();
    var password = $('#password').val();
    //console.log(username + " : " + password);
    $("#wrongpassword").css("display", "none");
    if (username == '' || password == '') {
        alert('Something is missing!. Please fill out the fields properly.');
        return;
    } else {
        $.post("/api/login", {
            userName: username,
            password: password
        }).done(function(data) {
            if (!data.type) {
                console.log("Login Error:" + data.data)
                $("#wrongpassword").show();
                return;
            } else {
                var role = data.data.role;
                sessionStorage.removeItem("user_id");
                sessionStorage.setItem("user_id", data.data.user_id);
                if (role == "retailer") {
                    window.location.href = "/api/retailerhome";
                }
                else {
                    window.location.href ="/";
                }
                // var url = '/home';
                //  var form = $('<form action="' + url + '" method="post">' +
                //    '<input type="text" name="api_url" value="' +url + '" />' +
                //    '</form>');
                //  $('body').append(form);
                //  form.submit();
            }
        });
    }
}

function signup() {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var emailAddress = $('#emailAddress').val();
    var password = $('#signupPassword').val();
    var x = document.getElementById("userRole").selectedIndex;
    var y = document.getElementById("userRole").options;
    var role = y[x].text;
    //console.log(username + " : " + password);
    // $('#signupButton').prop('disabled', true);
    $("#signupstatus").show();
    $("#signuperror").css("display", "none");
    $("#signupsuccessful").css("display", "none");
    if (emailAddress == '' || password == '' || firstName == '' || lastName == '') {
        console.log("error")
        $('#error').text("error");
        return;
    } else {
        $.post("/api/signup", {
            "userName": emailAddress,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "role": role,
            "password": password
        }).done(function(data) {
            if (!data.type) {
                console.log("Signup Error:" + data.data)
                // $('#signupButton').prop('disabled', false);
                $("#signupstatus").css("display", "none");
                $("#signuperror").show();
                return;
            } else {
                console.log("Signup successfull");
                // $('#signupButton').prop('disabled', false);
                $("#signupstatus").css("display", "none");
                $("#signupsuccessful").show();
                //window.location.href ="/api/retailerhome";
                // var url = '/home';
                //  var form = $('<form action="' + url + '" method="post">' +
                //    '<input type="text" name="api_url" value="' +url + '" />' +
                //    '</form>');
                //  $('body').append(form);
                //  form.submit();
            }
        });
    }
}