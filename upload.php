<?php

if ( $_FILES['file'] ) {

	$file = $_FILES['file'];
	$name = $file['name'];
	$tmp_name = $file['tmp_name'];

	$dir = dirname(__FILE__);
	$path = 'uploads/' . $name;
	$target = $dir . '/' . $path;
	if ( move_uploaded_file($tmp_name, $target) ) {
		die($path);
	} else die('error');
}
die(0);