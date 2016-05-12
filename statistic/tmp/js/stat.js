var timeoutID;

function t(d){
	var t = {
		"optimism_rank":"Итоговая оценка",
		"connect_time":"Скорость реакции сервера",
		"total_time":"Скорость загрузки страницы",
		"size_download":"Объём главной страницы",
		"g_pr":"Авторитетность - PR",
		"ya_tic":"Авторитетность - тИЦ",
		"rank_alexa":"Место в рейтинге Alexa",
		"g_index":"Страниц в индексе - Google",
		"ya_index":"Страниц в индексе - Yandex",
		"mobile_version":"Наличие стандартов - Адаптивность",
		"is_micro_data":"Наличие стандартов - Микроразметка",
		"is_site_map":"Наличие стандартов - Sitemap.xml",
		"is_robots":"Наличие стандартов - Robots.txt",
		"dmoz":"Наличие в каталогах - DMOZ",
		"mailru_cat":"Наличие в каталогах - Mail.ru",
		"rambler_cat":"Наличие в каталогах - Rambler",
		"ya_catalog":"Наличие в каталогах - Яндекс.Каталог",
		"g_metrics":"Google.Analytics",
		"ya_metrics":"Яндекс.Метрика",
		"redirect_main_page":"Склейка зеркал",
		"not_found":"Корректность обработки 404",
		"correct_address":"Правильная адресация",
		"context_adv":"Контекстная реклама",
		"ya_news":"Яндекс новости",
		"ags":"Проверка сайта на АГС",
		"citation_flow":"Качество входящих ссылок - доверие",
		"trust_flow":"Качество входящих ссылок - цитирование",
		"domains_into":"Входящих ссылок - сайтов",
		"links_into":"Входящих ссылок - страниц",
		"chart":"Изменение количества входящих ссылок на ваш сайт",
		"domain_age":"Возраст домена",
		"ya_virus":"Вирусы"
	};
	var data = [];
	for (var i in d) {
		data.push(t[d[i]]);
	}
	return data;
}

function resend(c){
	timeoutID = setTimeout(function() {
		statInfo(c);
	}, 5000);
}

function screenShot(path){
	var stat = $('#stat_status'), screenshot = $('#screenshot'), url = $('#analys').attr('action');
	$.ajax({
		data: {pathImage:path},
        url: url,
		type: "POST",
		dataType: "json",
		cache: false,
		beforeSend: function(){
			stat.html('Делаю screenshot...');		
		},
		success: function(data) {
			if(data.image == true){
				screenshot.html('<img src="' + data.pathRoot + '" width="180" height="144">');
			}else{
				console.log(data);
				stat.html('Не удалось сохранить изображение!');
			}
		}, 
	    error: function(XMLHttpRequest, textStatus) {
		    alert('Пожалуйста повторите попытку через несколько минут.');
		}
	});
}

function table(c){		
	var data1 = [], 
		data2 = [];

	for (var prop in c) {
		data1[prop] = c[prop].date;
		data2[prop] = c[prop].hrefs;
	}
	
	data1.unshift('x');
	data2.unshift('data');
	
	c3.generate({
	    bindto: '#chart',
	    data: {
	      x: 'x',  
	      columns: [	
			data1,	  
			data2
	      ],
	      axes: {
	        data: 'y'
	      },
	      types: {
	        data: 'bar'
	      }
	    },
	    axis: {
	        x: {
	            type: 'timeseries',
	            tick: {
	                format: '%Y-%m-%d'
	            }
	        }
	    }
	});
}

function check(c, obj, name, params, child){
	var out = true, d, a = {};
	if($.type(child) !== 'undefined'){		
		if($.type(obj[name]) === "undefined"){
			out = false;
		}else{
			d = obj[name][child];
		}
	}else{
		if($.type(obj[name]) === "undefined"){
			out = false;
		}else{ 
			d = obj[name];
		}
	}	
	if ($.type(params) !== "undefined" && out) {
		if(params.length){
			var l = (d === true) ? 1 : 0;
			d = params[l];
		}
	}
	$('#'+name).html(d);
	if(!out){
		a['err'] = name;
		a['c'] = c;
	}
	return a;
}

function statInfo(c, params){		
	var stat = $('#stat_status'), chart = $('#chart'), rank, attempts_update = 5,
		metrics, columns = [], domain, stat_box = $('#stat_box'),
		url = $('#analys').attr('action');
	if($.type(params) === 'undefined'){
		params = {session:true};
	}
	$.ajax({					
		data: params,
        url: url,
		type: "POST",
		dataType: "json",
		cache: false,
		beforeSend: function(){
			if($.type(params.domain) !== 'undefined'){
				domain = params.domain.domainEntity.domain
				stat.html('Собираю статистику для сайта ' + domain);
				stat_box.css({'opacity':'0.5'});
			}			
		},
		success: function(data) {
			
			console.log(data);
			
			if(data == false){
				stat.html('Переобновляем data...');
				resend(0);
				return false;
			}

			if($.type(data.domain.domainEntity) === 'undefined'){
				stat.html('Переобновляем domainEntity...');
				resend(0);
				return false;
			}

			if($.type(data.runProcessor.metrics) === 'undefined'){
				stat.html('Переобновляем metrics...');
				resend(0);
				return false;
			}
				
			domain = data.domain.domainEntity;
			metrics = data.runProcessor.metrics;	
			rank = data.runProcessor.rank;

			if($.type(data.runProcessor.metrics.screenShot) === 'undefined'){
				stat.html('Переобновляем screenshot...');
				resend(0);
			}else{
				screenShot(metrics.screenShot);
			}
			
			var e = [];
					
			e.push(check(c,domain, 'connect_time'));
			e.push(check(c,domain, 'total_time'));
			e.push(check(c,domain, 'size_download'));
			e.push(check(c,metrics, 'g_pr'));
			e.push(check(c,metrics, 'ya_tic'));
			e.push(check(c,metrics, 'rank_alexa'));
			e.push(check(c,metrics, 'g_index'));
			e.push(check(c,metrics, 'ya_index'));
			e.push(check(c,metrics, 'mobile_version', ['no','yes']));
			e.push(check(c,metrics, 'is_micro_data', ['no','yes']));
			e.push(check(c,metrics, 'is_robots', ['no','yes']));
			e.push(check(c,metrics, 'is_site_map', ['no','yes']));
			e.push(check(c,metrics, 'dmoz', ['no','yes']));
			e.push(check(c,metrics, 'mailru_cat', ['no','yes']));
			e.push(check(c,metrics, 'rambler_cat', ['no','yes']));
			e.push(check(c,metrics, 'ya_catalog', ['no','yes']));
			e.push(check(c,metrics, 'g_metrics', ['no','yes']));
			e.push(check(c,metrics, 'ya_metrics', ['no','yes']));
			e.push(check(c,metrics, 'redirect_main_page', ['no','yes']));
			e.push(check(c,metrics, 'not_found', ['no','yes']));
			e.push(check(c,metrics, 'correct_address', ['no','yes']));
			e.push(check(c,metrics, 'context_adv', ['no','yes']));
			e.push(check(c,metrics, 'ya_news', ['no','yes']));
			e.push(check(c,metrics, 'ags', ['no','yes']));
			e.push(check(c,metrics, 'citation_flow'));	
			e.push(check(c,metrics, 'trust_flow'));
			e.push(check(c,metrics, 'domains_into'));
			e.push(check(c,metrics, 'links_into'));
			e.push(check(c,metrics, 'domain_age', [], 'string'));	
			e.push(check(c,metrics, 'ya_virus', ['Не обнаружены','Обнаружены']));
			e.push(check(c,rank, 'optimism_rank'));
			e.push(check(c,metrics, 'history'));
			
			var errors = [], warning = [];
			
			for (var i in e) {
				e[i].c++;
				if($.type(e[i].err) !== 'undefined'){									
					if(e[i].c == attempts_update){
						$('#'+e[i].err).html('<span class="err_stat">Нет данных</span>');	
						warning.push(e[i].err);	
						continue;
					}else{
						errors.push(e[i].err);					
						stat.html('Переобновляю ' + e[i].err + '...');
						$('#'+e[i].err).html('<div class="load">Идёт сбор данных</div>');
					}
				}
			}
						
			if(!errors.length){			
				columns = metrics.history;						
				if(columns.length){
					table(columns);
				}
				stat.empty();
				var m = 'Данные для сайта ' + domain.domain + ' успешно собранны!';
				document.title = m;
				stat.html(m);
				stat_box.css({'display':'block', 'opacity':'1'});
				if(warning.length){
					warning = t(warning);
					stat.append('<div id="warning_stat">Присутствуют не обработанные значения: '+warning.join(", ")+"</div>");
				}
				clearTimeout(timeoutID);
				return false;
			}else{
				c++;
				console.log('attempts update: ' + c);
				resend(c);
				errors = t(errors);
				stat.html('<div id="errors_stat">Нет данных: ' + errors.join(", ") + '. Обрабатываю...</div>');
				stat_box.css({'display':'block', 'opacity':'1'});
			}
		},
	    error: function(XMLHttpRequest, textStatus) {
	       alert('Пожалуйста повторите попытку через несколько минут.');
	       return false;
	    }
	});
} 

function stat(n) 
{ 
	if(n == 'undefined') n = '';
	
	var site_name = $('input').val(),
		stat 	  = $('#stat_status'),
		url       = $('#analys').attr('action');
	
	if(n) site_name = n;
    $.ajax({	
		url: url, 
        data: "site_name=" + site_name,
		type: "POST",
		dataType: "json",
		beforeSend: function(){
			stat.html('Получение id сайта.');
		}, 
        success: function(data) { 
			if($.type(data.domain) !== 'undefined'){
				site_name = data.domain.domainEntity.domain;
				history.pushState(null, null, '?q='+site_name);
				menuUpdate(site_name);
				$('#screenshot').empty().text('загрузка фотографии...').show();
				$('#stat_box table div > span, #chart').html('<div class="load">Идёт сбор данных</div>');
				statInfo(0, data);	
			}else{ 
				stat.html('Произошла ошибка!');  
			} 
        },
		error: function(XMLHttpRequest, textStatus) {
		    alert('Пожалуйста повторите попытку через несколько минут.');
		}
    }); 
	return false;
}

function menuUpdate(site_name){
	var url = $('#analys').attr('action'),
	    search='', activeMenu;
    $.ajax({	
		url: url,
        data: "site_name=" + site_name,
		type: "POST",
		dataType: "json",
        success: function(data) { 
			if(data.ssd_session){
				var patt="",json_ssd_session;
				patt += '<p>Всего проверенно Вами (<span id="ssd_count">'+data.ssd_session_count+'</span>):</p>';
				patt += '<ul>';
				json_ssd_session = $.parseJSON(data.ssd_session); 
				var search = location.search;
				search = search.split('=');
				for (var key in json_ssd_session) {
					if(search[1] == json_ssd_session[key]){
						activeMenu = 'activeSite';
					}else{
						activeMenu = '';
					}
					patt += '<li id="n'+key+'" class="'+activeMenu+'"><a href="#" onclick="stat(\''+json_ssd_session[key]+'\');return false;">'+json_ssd_session[key]+'</a> | ';
					patt += '<em><a href="#" onclick="ssd(\''+json_ssd_session[key]+'\');return false;">удалить</a></em></li>';
				}						
				patt += '</ul>';
				$('#ssd').html(patt);
			}
        },
		error: function(XMLHttpRequest, textStatus) {
		    alert('Пожалуйста повторите попытку через несколько минут.');
		    return false;
		}
    }); 
}

function ssd(site_name){
	var stat = $('#stat_status'),
		url = $('#analys').attr('action');
	$.ajax({	
		url: url,
        data: "ssd=" + site_name, 
		type: "POST",
		dataType: "json",
		beforeSend: function(){
			stat.html('Удаляю сайт '+site_name+'...');
		},
        success: function(data) {
			console.log(data);   
			if(data.ssd === true){
				stat.html('Сайт '+site_name+' успешно удален!');
				$('#n'+data.key).remove();
				$('#ssd_count').text(data.count);
				if(data.count == 0){
					$('#ssd').hide();
				}
			}
        },
		error: function(XMLHttpRequest, textStatus) {
		    alert('Пожалуйста повторите попытку через несколько минут.');
		    return false;
		}
    }); 
}