$(document).ready(function() {
    $('#upload-file').on('change', function() {
        var cursor = $(this);
        var files = cursor.get(0).files;
        if (files.length === 1) {
            // One or more files selected, process the file upload
            // create a FormData object which will be sent as the data payload in the
            // AJAX request
            var formData = new FormData();
            formData.append('upload', files[0], files[0].name);
            $.ajax({
                url: '/uploadfile',
                type: 'POST',
                data: formData,
                cache: false,
                timeout: 5000,
                processData: false,
                contentType: false,
                beforeSend: function() {
                    $('.upload-file').addClass('hidden');
                },
                complete: function() {
                    $('.upload-file').removeClass('hidden');
                    $('.uploadAlert').children(':first')
                        .delay(3000)
                        .fadeOut(2000);
                },
                success: function(data) {
                    switch (data.reply) {
                        case 'fileSize':
                            $('.uploadAlert').prepend(fileSize);
                            break;
                        case 'wrongType':
                            $('.uploadAlert').prepend(wrongType);
                            break;
                        case 'success':
                            $('.uploadAlert').prepend('<div class=\'alert alert-success text-center\'>Uploaded file size is ' + data.fileSize + ' kb</div>');
                            break;
                        default:
                            $('.uploadAlert').prepend(ajaxFailed);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });

});

$(document).on('click', '.upload-file', function() {
    $('#upload-file').click();
});

var fileSize = '<div class=\'alert alert-warning text-center\'>File size cannod exceed 10kb</div>';
var wrongType = '<div class=\'alert alert-warning text-center\'>File must be one of the follow formats: png/jpg/jpeg</div>';
var ajaxFailed = '<div class=\'alert alert-danger text-center\'>Something went wrong, try again.</div>';
