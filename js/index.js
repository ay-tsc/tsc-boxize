;;$(function () {

	// Call boxize
	$('.boxize').boxize();

	$('.save-content').on('click', function () {
		var html = $('.boxize').html();
		console.log(html);
		return false;
	});
});