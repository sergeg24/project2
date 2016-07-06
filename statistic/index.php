<?php session_start(); ?>

<?php
define('ROOT', str_replace('index.php', 'tmp', $_SERVER['SCRIPT_NAME']));
?>

<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="ru"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="ru"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="ru"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="ru">
<!--<![endif]-->

<head>
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- Load c3.css -->
<link href="<?php echo ROOT; ?>/css/style.css" rel="stylesheet"
	type="text/css">
<link href="<?php echo ROOT; ?>/css/c3.css" rel="stylesheet"
	type="text/css">
<!-- Load d3.js and c3.js -->

<link href="<?php echo ROOT; ?>/css/nprogress.css" rel="stylesheet"
	type="text/css">

<script src="//d3js.org/d3.v3.min.js"></script>
<script src="<?php echo ROOT; ?>/js/c3.min.js"></script>
<script src="<?php echo ROOT; ?>/js/lang.js"></script>
<script src="<?php echo ROOT; ?>/js/stat.js"></script>
<script src="<?php echo ROOT; ?>/js/nprogress.js"></script>

<title>Какой сайт продвигаем?</title>
</head>

<body>
	
<div id="block_statistic">

	<form id="analys" method="POST" action="<?php echo ROOT; ?>/php/stat.php">
		<input type="text" placeholder="Какой сайт продвигаем?">
		<button type="submit" onclick='stat();return false;'>Собрать</button>
	</form>
	
	<?php
	if ( isset($_GET ['q']) ){
		?>
		<script>
			$(function(){
				stat("<?=$_GET['q'];?>"); 
			});
		</script>
	<?php
	}
	?> 
		
	<div class="clear"></div>
	<br/>
	<div id='stat_print'>
		<div id="screenshot"></div>
		
		<div id="description"></div>
		
		<div class="clear"></div>
		<br/>
		<div id="stat_box">
			<table id="table_js"></table> 
		</div>
	</div>
	
	<div id="block_stat_admin">
		<div id="bsa_panel">
			<a href="" onclick="statStop();return false;">Остановить анализ</a> |
			<a href="" onclick="PopupPrint($('#stat_print').html()); return false;">Печать</a>
		</div>
		<div class="clear"></div>
		
		<h3>Статус:</h3>
		
		<div id="stat_status">-</div>
		
		<div class="clear"></div>
		
		<h3>Console:</h3>
		<div id="console"></div>
		
		<div class="clear"></div>
		
		<div id="ssd">
		<?php if(isset($_COOKIE['site_name_user']) && !empty($_COOKIE['site_name_user'])){ ?>
			<?php
			$snu = str_replace ( '\"', '"', $_COOKIE ['site_name_user'] );
			$session_data = unserialize ( $snu );
			?>
			<?php if(!empty($session_data)){ ?>		
				<p>
					Всего проверенно Вами (<span id="ssd_count"><?php echo count($session_data);?></span>):
				</p>
				<?php foreach($session_data as $key => $site_name_user){ ?>
				<ul>
					<li id="n<?php echo $key; ?>"><a href="#"
						onclick="stat('<?php echo $site_name_user;?>');return false;"><?php echo $site_name_user;?></a>
						| <em><a href="#"
							onclick="ssd('<?php echo $site_name_user;?>');return false;">удалить</a></em></li>
				</ul>
				<?php } ?>
			<?php } ?>	
		<?php } ?>
		</div>

		<div id="sc">
		<?php $sites = open_dir(ROOT.'/cashe/'); ?>
		<?php if(!empty($sites)){ ?>
			<p>Всего проверенных сайтов (<?php echo count($sites); ?>):</p>
			<ul>
			<?php foreach($sites as $site){	?>
				<li><a href="#" onclick="stat('<?php echo $site;?>');return false;"><?php echo $site;?></a></li>
			<?php }	?>
			</ul>
		<?php }	?>	
		</div>

	</div>
	
</div>



</body>

<script>
	table_create();
    NProgress.start();
    window.onload = function () {
		NProgress.done();
	};
</script>

</html> 

<?php
function open_dir($path) {
	$files = array ();
	if(file_exists($_SERVER ['DOCUMENT_ROOT'] . $path)){
		if ($handle = opendir ( $_SERVER ['DOCUMENT_ROOT'] . $path )) {
			while ( false !== ($file = readdir ( $handle )) ) {
				if ($file == '.' || $file == '..')
					continue;
				$files [] = $file;
			}
			closedir ( $handle );
		}
	}
	return $files;
}
?>
