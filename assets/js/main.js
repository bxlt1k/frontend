$('button[id = "login-btn"]').click(function (e) {
    e.preventDefault();

    $('input').removeClass('error');

    let email = $('input[name = "email"]').val(),
        pass = $('input[name = "pass"]').val();

    $.ajax({
        url: 'http://users.api.loc/signin',
        type: 'POST',
        dataType: 'json',
        data: {
            email: email,
            pass: pass
        },
        success(data) {
            if (data.status) {
                localStorage['jwt'] = data.jwt;
                document.location.href = '/chat';
            } else {
                if (data.type === '1') {
                    data.fields.forEach(function (field) {
                        $(`input[name="${field}"]`).addClass('error');
                    });
                }
                $('.msg').removeClass('none').text(data.message);
            }
        }
    });
});

$('button[id = "reg-btn"]').click(function (e) {
    e.preventDefault();

    $('input').removeClass('error');

    let firstname = $('input[name = "firstname"]').val(),
        lastname = $('input[name = "lastname"]').val(),
        email = $('input[name = "email"]').val(),
        pass = $('input[name = "pass"]').val(),
        pass_conf = $('input[name = "pass_conf"]').val();

    let formData = new FormData();

    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('pass', pass);
    formData.append('pass_conf', pass_conf);


    $.ajax({
        url: 'http://users.api.loc/signup',
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        data: formData,
        success(data) {
            if (data.status) {
                document.location.href = '/signin'
            } else {
                if (data.type === '1') {
                    data.fields.forEach(function (field) {
                        $(`input[name="${field}"]`).addClass('error');
                    });
                }
                $('.msg').removeClass('none').text(data.message);
            }
        }

    });
})