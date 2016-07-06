<?php
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
	
	session_start();
	
	$cashe = true;
	$siteApi = 'https://start.optimism.ru/api';
	define('ROOT', str_replace('php/stat.php', '', $_SERVER['SCRIPT_NAME']));
	$USERAGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11';
	$session_id = 0;
	//code..
	
	function safe($name) {
		$except = array('\\', '/', ':', '*', '?', '"', '<', '>', '|', 'domain_', 'runProcessor_', 'www.');
		$pos = strripos($name, 'https');
		if ($pos !== false) {
			$except[] = 'https';
		}else{
			$except[] = 'http';
		}
		return str_replace($except, '', trim($name));
	}
	
	function downloadImage($url, $target) {
		
		global $USERAGENT;
				
		if(!$hfile = fopen($target, "w")) return false;
	
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_USERAGENT, $USERAGENT);	
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FILE, $hfile);
	
		if(!curl_exec($ch)){ 
			curl_close($ch);
			fclose($hfile);
			unlink($target);
			return false;
		}
	
		fflush($hfile); 
		fclose($hfile);
		curl_close($ch);
		return true;
	}
	
	function setSiteNameSession($name, $extract = false){
		$name = safe($name);
		$output = false;
		if(!empty($name)){
			$session_data = array();
			if(isset($_COOKIE['site_name_user']) && !empty($_COOKIE['site_name_user'])){
				$snu = str_replace('\"', '"', $_COOKIE['site_name_user']);
				$session_data = unserialize($snu);
				if($extract){
					$key = array_search($name, $session_data);
					if($session_data[$key]){
						unset($session_data[$key]);
						$output['out'] = true;
						$output['key'] = $key;
						$output['count'] = count($session_data);
					}	
				}
			}			
			if(!in_array($name, $session_data) && !$extract){
				array_push($session_data, $name);
				$output = true;
			}
			$serialize_snc = serialize($session_data);
			setcookie("site_name_user", $serialize_snc, time() + 3600 * 365, '/', $_SERVER['SERVER_NAME']);
		}
		return $output;
	}
	
	function getContent($url, $referer = null)
	{
		global $USERAGENT;
		
		$ch = curl_init();
		 
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_REFERER, $referer);
		curl_setopt($ch, CURLOPT_USERAGENT, $USERAGENT);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		 
		$output = curl_exec($ch); // get content
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); // Получаем HTTP-код
		 
		curl_close($ch);
		return $output;
	}
	
	function clearCashe($namecashe = ''){
		if(empty($namecashe)) die('empty data!');
		$nameDir = safe($namecashe);
		$namecashe = md5(str_replace('.', '_', $namecashe));
		$pathcashe = $_SERVER['DOCUMENT_ROOT'].ROOT.'cashe/'.$nameDir.'/';
		if (file_exists($pathcashe.$namecashe)) {
			unlink($pathcashe.$namecashe);
		}
	}
	
	function setCashe($namecashe = '', $data = '', $cashe_time = 86400000){
		if(empty($namecashe) || empty($data)) die('empty data!');
		$nameDir = safe($namecashe);
		$namecashe = md5(str_replace('.', '_', $namecashe));
		$pathcashe = $_SERVER['DOCUMENT_ROOT'].ROOT.'cashe/'.$nameDir.'/';
		$cache_file = $pathcashe.$namecashe;		
		if(!file_exists($pathcashe)){
			mkdir($pathcashe, 0755, true);
		}
		if ((time() - $cashe_time) > @filemtime($cache_file)) {
			$handle = fopen($cache_file, 'w');
			fwrite($handle, serialize($data));
			fclose($handle);
		}
	}
	
	function getCashe($namecashe = '', $cashe_time = 86400000){
		if(empty($namecashe)) die('empty data!');
		$nameDir = safe($namecashe);
		$namecashe = md5(str_replace('.', '_', $namecashe));
		$pathcashe = $_SERVER['DOCUMENT_ROOT'].ROOT.'cashe/'.$nameDir.'/';
		if (file_exists($pathcashe.$namecashe)) {
			if ((time() - $cashe_time) < @filemtime($pathcashe.$namecashe)) {
				return file_get_contents($pathcashe.$namecashe);
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	$output = array();
	
	function objectToArray($d) {
		if(is_object($d)) {
			$d = get_object_vars($d);
		}
		if(is_array($d)) {
			return array_map(__FUNCTION__, $d);
		} else {
			return $d;
		}
	}
	
	if(isset($_POST['ssd']) && !empty($_POST['ssd'])){
		$siteName = setSiteNameSession($_POST['ssd'], true);
		if($siteName['out']){
			$output['ssd'] = $siteName['out'];
			$output['key'] = $siteName['key'];
			$output['count'] = $siteName['count'];
		}
	}
	
	if(isset($_POST['session'])) {
		if(!isset($_SESSION['stat'])) die('Session not found!');
		$statObj = json_decode($_SESSION['stat']);
		$statArray = objectToArray($statObj);
		$session_id = $statArray['domain']['session']['uniq_id'];
		$_POST['domain'] = $statArray['domain'];
		$domain = $statArray['domain']['domainEntity']['domain'];
		clearCashe('runProcessor_'.$domain);
		clearCashe('domain_'.$domain);
	}
	
	if(isset($_POST['site_name']) && !empty($_POST['site_name'])) {
		if(isset($_SESSION['stat']))unset($_SESSION['stat']);
		$domain = safe($_POST['site_name']);
		$url = $siteApi.'/domain/'.$domain;
		$casheContent = getCashe('domain_'.$domain);	
		if(!empty($casheContent) && $cashe){
			$content = unserialize($casheContent);
		}else{
			$content = getContent($url, true);
		}			
		$contentObj = json_decode($content);		
		$session_id = $contentObj->session->uniq_id;	
		if($contentObj->domainEntity->status_code == '200'){
			setSiteNameSession($_POST['site_name']);
			if(isset($_COOKIE['site_name_user']) && !empty($_COOKIE['site_name_user'])){
				$session_data = str_replace('\"', '"', $_COOKIE['site_name_user']);
				$session_data = unserialize($session_data);
				$output['ssd_session'] = json_encode($session_data);
				$output['ssd_session_count'] = count($session_data);
			}
			setCashe('domain_'.$domain, $content);
			$output['domain'] = $contentObj;
			$_SESSION['stat'] = json_encode($output);
		}else{
			clearCashe('domain_'.$domain);
		}
	}
	
	if(isset($_POST['domain']) && !empty($_POST['domain'])) {
		$output['domain'] = $_POST['domain'];
		$code = $output['domain']['domainEntity']['id'];
		$url = $siteApi.'/runProcess/'.$code.'/'.$session_id;	
		$domain = $output['domain']['domainEntity']['domain'];		
		$casheContent = getCashe('runProcessor_'.$domain);
		if(!empty($casheContent) && $cashe){
			$content = unserialize($casheContent);
		}else{
			$content = getContent($url, true);
		}
		setCashe('runProcessor_'.$domain, $content);
		$contentObj =json_decode($content);
		
		if(empty($contentObj->metrics->badge)){
			echo "false";
			exit();
		}
		$output['runProcessor'] = $contentObj;
	}
	
	if(isset($_POST['pathImage']) && !empty($_POST['pathImage'])) {
		$pathImage = $_POST['pathImage'];
		$nameImage = str_replace('screenshot/', '', $pathImage);
		$dirImage = str_replace(array('.jpeg', '.jpg'), '', $nameImage);
		$pathSite = $siteApi.'/'.$pathImage;
		$path = ROOT.'cashe/'.$dirImage.'/';
		$pathRoot = $_SERVER['DOCUMENT_ROOT'].$path;
		if(file_exists($pathRoot.$nameImage)){
			$image = true;
		}else{
			$image = downloadImage($pathSite, $pathRoot.$nameImage);
		}
		$output['image'] = $image;
		$output['pathRoot'] = $path.$nameImage;
	}
		
	echo json_encode($output);
	
	exit;
}
?>