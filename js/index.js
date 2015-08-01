;;$(function () {

	// Call boxize
	$('.boxize').boxize();
	$('.boxize').boxizeUpload({
		url: 'upload.php'
	});

	$('.save-content').on('click', function () {
		var html = $('.boxize').html();
		console.log(html);
		return false;
	});
});