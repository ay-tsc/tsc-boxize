<?php

if ( $_FILES['file'] ) {
	$files = $_FILES['file'];
	$file_names = $files['name'];

	foreach($file_names as $index => $name) {
		$dir = dirname(__FILE__);
		$path = 'uploads/' . $name;
		$target = $dir . $path;
		if ( move_uploaded_file($files['tmp_name'][$index], $target) ) {
			return $path;
		} 
	}
}
die(0);