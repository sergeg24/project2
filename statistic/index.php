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
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="<?php echo ROOT; ?>/js/c3.min.js"></script>
<script src="<?php echo ROOT; ?>/js/stat.js"></script>
<title>Какой сайт продвигаем?</title>
</head>

<body>

	<div id="block_statistic">

		<form id="analys" method="POST" action="<?php echo ROOT; ?>/php/stat.php">
			<input type="text" placeholder="Какой сайт продвигаем?">
			<button type="submit" onclick='stat();return false;'>Собрать</button>
		</form>
	
	<?php
	if (isset ( $_GET ['q'] )) {
		?>
		<script>
			$(function(){
				stat("<?=$_GET['q'];?>"); 
			});
		</script>
	<?php
	}
	?> 
	
	<div id="stat_status"></div>

		<div id="screenshot"></div>

		<div id="stat_box">

			<table>
				<tr>
					<td>Итоговая оценка:</td>
					<td><div>
							<span id="optimism_rank">0</span>/100
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Скорость реакции сервера:</td>
					<td><div>
							<span id="connect_time">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Скорость загрузки страницы:</td>
					<td><div>
							<span id="total_time">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Объём главной страницы:</td>
					<td><div>
							<span id="size_download">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Авторитетность:</td>
					<td><div>
							PR:<span id="g_pr">-</span>/10
						</div>
						<div>
							тИЦ:<span id="ya_tic">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Место в рейтинге Alexa:</td>
					<td><div>
							<span id="rank_alexa">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Страниц в индексе:</td>
					<td><div>
							<span id="g_index">-</span> в Google<br /> <span id="ya_index">-</span>
							в Яндексе
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Наличие стандартов:</td>
					<td><div><span id="mobile_version">-</span> Адаптивность<br /> <span
						id="is_micro_data">-</span> Микроразметка<br /> <span
						id="is_site_map">-</span> Sitemap.xml <br /> <span id="is_robots">-</span>
						Robots.txt</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Наличие в каталогах:</td>
					<td><div>
							<span id="dmoz">-</span> DMOZ<br /> <span id="mailru_cat">-</span>
							Mail.ru <br /> <span id="rambler_cat">-</span> Rambler<br />
							<span id="ya_catalog">-</span> Яндекс.Каталог</td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Счётчики:</td>
					<td><div>
							<span id="g_metrics">-</span> Google.Analytics<br /> <span
								id="ya_metrics">-</span> Яндекс.Метрика
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Технические параметры:</td>
					<td><div>
							<span id="redirect_main_page">-</span> Склейка зеркал<br /> <span
								id="not_found">-</span> Корректность обработки 404 <br /> <span
								id="correct_address">-</span> Правильная адресация</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Контекстная реклама:</td>
					<td><div>
							<span id="context_adv">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Яндекс новости:</td>
					<td><div>
							<span id="ya_news">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Проверка сайта на АГС:</td>
					<td><div>
							<span id="ags">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Качество входящих ссылок:</td>
					<td><div>
							<span id="citation_flow">-</span> доверие <br /> <span
								id="trust_flow">-</span> цитирование
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Входящих ссылок:</td>
					<td><div>
							<span id="domains_into">-</span> сайтов<br /> <span
								id="links_into">-</span> страниц</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Изменение количества входящих ссылок на ваш сайт:</td>
					<td><div id="chart">-</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Возраст домена:</td>
					<td><div>
							<span id="domain_age">-</span>
						</div></td>
				</tr>
			</table>

			<table>
				<tr>
					<td>Вирусы:</td>
					<td><div>
							<span id="ya_virus">-</span>
						</div></td>
				</tr>
			</table>

		</div>

	</div>

	<div id="block_stat_admin">

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

</body>

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
