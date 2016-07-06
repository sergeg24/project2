
function p(){
	return {
		'resendTime': 3000,
		'attempts_update': 10,
		'stat': $('#stat_status'),
		'screenshot': $('#screenshot'),
		'url': $('#analys').attr('action'),
		'stat_box': $('#stat_box'),
		'description': $('#description'),
		'console':$('#console'),
	};
}

stop = false;

function statStop(){
	console_log('Timer Id: ' + timeId);
	if(!timeId){
		p().stat.text('Нет данных!');
		return false;
	}	
	stop = true;
	console_log('Timer Id clear: ' + timeId);
	clearTimeout(timeId);
	$('.load').text('Нет данных').removeClass('load');
	p().stat.text('Анализ остановлен!');
	history.pushState(null, null, location.pathname);
	NProgress.done();
}

function console_log(data){
	if($.type(data) === 'object'){
		console.log(data);
		p().console.append('<div>'+data+' - console</div>');
	}else{
		p().console.append('<div>'+data+'</div>');
	}	
	var block = document.getElementById("console");
	block.scrollTop = block.scrollHeight;	
}

function t(d){
	var t = lang();
	var data = [];
	var l = 'rus';	
	for (var i in d) {
		if($.type(t[d[i]]) !== 'undefined'){
			data.push(t[d[i]][l]);
		}else{
			for(i2 in t){
				if($.type(t[i2].childe) !== 'undefined'){
					if($.type(t[i2].childe[d[i]]) !== 'undefined'){
						data.push(t[i2].childe[d[i]][l]);
					}
				}
			}
		}
	}
	return data;
}


function resend(c){
	if(stop) return false;
	return setTimeout(function() {
		statInfo(c);
	}, p().resendTime);
}

function screenShot(path){
	$.ajax({
		data: {pathImage:path},
        url: p().url,
		type: "POST",
		dataType: "json",
		cache: false,
		beforeSend: function(){
			p().stat.html('Загрузка изображения...');		
		},
		success: function(data) {
			if(data.image){
				p().screenshot.html('<img src="' + data.pathRoot + '" width="180" height="144">');
			}else{
				console_log(data);
				p().stat.html('Не удалось сохранить изображение!');
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

function check(c,  obj, name, params, child){
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

timeId = 0;

function statInfo(c,  params){
	
	var rank, metrics, columns = [], domain;
		
	if($.type(params) === 'undefined'){
		params = {session:true};
	}
	
	$.ajax({					
		data: params,
        url: p().url,
		type: "POST",
		dataType: "json",
		cache: false,
		beforeSend: function(){
			if($.type(params.domain) !== 'undefined'){
				p().stat.html('Собирается статистика для сайта ' + q());
				p().stat_box.css({'opacity':'0.5'});
			}			
		},
		success: function(data) {
			
			console_log(data);
			
			if(data == false){
				p().stat.html('Переобновляем data.');
				resend(0);
				return false;
			}

			if($.type(data.domain.domainEntity) === 'undefined'){
				p().stat.html('Переобновляем domainEntity.');
				timeId = resend(0);
				return false;
			}

			if($.type(data.runProcessor.metrics) === 'undefined'){
				p().stat.html('Переобновляем metrics.');
				timeId = resend(0);
				return false;
			}
				 
			domain = data.domain.domainEntity;
			metrics = data.runProcessor.metrics;	
			rank = data.runProcessor.rank;

			if($.type(data.runProcessor.metrics.screenShot) === 'undefined'){
				p().stat.html('Переобновляем screenshot.');
				timeId = resend(0);
			}else{
				screenShot(metrics.screenShot);
			}
			
			var e = [];
		
			e.push(check(c, domain, 'description'));
			e.push(check(c, domain, 'connect_time'));
			e.push(check(c, domain, 'total_time'));
			e.push(check(c, domain, 'size_download'));
			//e.push(check(c, metrics, 'g_pr'));
			e.push(check(c, metrics, 'ya_tic'));
			e.push(check(c, metrics, 'rank_alexa'));
			e.push(check(c, metrics, 'g_index'));
			e.push(check(c, metrics, 'ya_index'));
			e.push(check(c, metrics, 'mobile_version', ['no','yes']));
			e.push(check(c, metrics, 'is_micro_data', ['no','yes']));
			e.push(check(c, metrics, 'is_robots', ['no','yes']));
			e.push(check(c, metrics, 'is_site_map', ['no','yes']));
			e.push(check(c, metrics, 'dmoz', ['no','yes']));
			e.push(check(c, metrics, 'mailru_cat', ['no','yes']));
			e.push(check(c, metrics, 'rambler_cat', ['no','yes']));
			e.push(check(c, metrics, 'ya_catalog', ['no','yes']));
			e.push(check(c, metrics, 'g_metrics', ['no','yes']));
			e.push(check(c, metrics, 'ya_metrics', ['no','yes']));
			e.push(check(c, metrics, 'redirect_main_page', ['no','yes']));
			e.push(check(c, metrics, 'not_found', ['no','yes']));
			e.push(check(c, metrics, 'correct_address', ['no','yes']));
			e.push(check(c, metrics, 'context_adv', ['no','yes']));
			e.push(check(c, metrics, 'ya_news', ['no','yes']));
			e.push(check(c, metrics, 'ags', ['no','yes']));
			e.push(check(c, metrics, 'citation_flow'));	
			e.push(check(c, metrics, 'trust_flow'));
			e.push(check(c, metrics, 'domains_into'));
			e.push(check(c, metrics, 'links_into'));
			e.push(check(c, metrics, 'domain_age', [], 'string'));	
			e.push(check(c, metrics, 'ya_virus', ['Не обнаружены','Обнаружены']));
			e.push(check(c, rank,    'optimism_rank'));
			e.push(check(c, metrics, 'history'));
		
			var errors = [], warning = [];
					
			for (var i in e) {
				e[i].c++;
				if($.type(e[i].err) !== 'undefined'){									
					if(e[i].c == p().attempts_update){
						$('#'+e[i].err).html('<span class="err_stat">Нет данных</span>');	
						warning.push(e[i].err);	
						continue;
					}else{
						errors.push(e[i].err);					
						p().stat.html('Переобновляю ' + e[i].err + '...');
						$('#'+e[i].err).html('<div class="load">Идёт сбор данных</div>');
					}
				}
			}
			
			var allValue = e.length;
			var countErr = errors.length;			
			var pecent = (allValue-countErr)/allValue*100;
			console_log('Pecent: ' + pecent + '%');
			NProgress.set(pecent/100);
			
			if(!countErr){			
				columns = metrics.history;						
				if(columns.length){
					table(columns);
				}
				p().stat.empty();
				var m = 'Данные для сайта ' + domain.domain + ' успешно собранны!';
				document.title = m;
				p().stat.html(m);
				p().stat_box.css({'display':'block', 'opacity':'1'});
				if(warning.length){
					warning = t(warning);
					p().stat.append('<div id="warning_stat">Присутствуют не обработанные значения: '+warning.join(", ")+"</div>");
				}
				NProgress.done();
				clearTimeout(timeId);
				return false;
			}else{
				c++;
				console_log('attempts update: ' + c);
				timeId = resend(c);
				errors = t(errors);
				p().stat.html('<div id="errors_stat">Нет данных: ' + errors.join(", ") + '. Обрабатываю...</div>');
				p().stat_box.css({'display':'block', 'opacity':'1'});
			}
		},
	    error: function(XMLHttpRequest, textStatus) {
			NProgress.done();
	        alert('Пожалуйста повторите попытку через несколько минут.');
	        return false;
	    }
	});
} 

function stat(n) 
{ 
	if(n == 'undefined') n = '';
		
	var site_name = $('#analys input[type="text"]').val();
	
	if(n) site_name = n;
	
    $.ajax({	
		url: p().url, 
        data: "site_name=" + site_name,
		type: "POST",
		dataType: "json",
		beforeSend: function(){
			NProgress.start();
			p().stat.html('Получение id сайта.');
		}, 
        success: function(data) { 
			if($.type(data.domain) !== 'undefined'){
				site_name = data.domain.domainEntity.domain;
				history.pushState(null, null, '?q='+site_name);
				menuUpdate(site_name);
				$('#screenshot').empty().text('загрузка фотографии...').show();
				$('#stat_box table div > span, #chart').html('<div class="load">Идёт сбор данных</div>');
				stop = false;
				p().console.empty();
				statInfo(0, data);	
			}else{ 
				NProgress.done();
				p().stat.html('Произошла ошибка!');  
			} 
        },
		error: function(XMLHttpRequest, textStatus) {
			NProgress.done();
		    alert('Пожалуйста повторите попытку через несколько минут.');
		}
    }); 
	return false;
}

function q(){
	var search = location.search;
	search = search.split('=');
	if($.type(search[1]) !== 'undefined'){
		return search[1];
	}
	return false;
}

function menuUpdate(site_name){
	
	var activeMenu;
		
    $.ajax({	
		url: p().url,
        data: "site_name=" + site_name,
		type: "POST",
		dataType: "json",
        success: function(data) { 
			if(data.ssd_session){
				var patt="",json_ssd_session;
				patt += '<p>Всего проверенно Вами (<span id="ssd_count">'+data.ssd_session_count+'</span>):</p>';
				patt += '<ul>';
				json_ssd_session = $.parseJSON(data.ssd_session); 
				for (var key in json_ssd_session) {
					if(q() == json_ssd_session[key]){
						activeMenu = 'activeSite';
					}else{
						activeMenu = '';
					}
					patt += '<li id="n'+key+'" class="'+activeMenu+'"><a href="#" onclick="stat(\''+json_ssd_session[key]+'\');return false;">'+json_ssd_session[key]+'</a> | ';
					patt += '<em><a href="#" onclick="ssd(\''+json_ssd_session[key]+'\');return false;">удалить</a></em></li>';
				}						
				patt += '</ul>';
				$('#ssd').html(patt).show();
			}
        },
		error: function(XMLHttpRequest, textStatus) {
		    alert('Пожалуйста повторите попытку через несколько минут.');
		    return false;
		}
    }); 
}

function ssd(site_name){
	if (!confirm("Вы уверены что хотите удалить сайт?") ) {
		return false;
	}
	$.ajax({	
		url: p().url,
        data: "ssd=" + site_name, 
		type: "POST",
		dataType: "json",
		beforeSend: function(){
			NProgress.start();
			p().stat.html('Удаляю сайт '+site_name+'...');
		},
        success: function(data) {
			console_log(data);   
			if(data.ssd === true){
				p().stat.html('Сайт '+site_name+' успешно удален!');
				$('#n'+data.key).remove();
				$('#ssd_count').text(data.count);
				if(data.count == 0){
					$('#ssd').hide();
				}
				NProgress.done();
			}
        },
		error: function(XMLHttpRequest, textStatus) {
			NProgress.done();
		    alert('Пожалуйста повторите попытку через несколько минут.');
		    return false;
		}
    }); 
}

function table_create(){
	var langObj = lang();
	var table_js = $('#table_js');
	var pat = '';
	for(var key in langObj){	 		
		if($.type(langObj[key].childe) !== 'undefined'){
			var childe  = langObj[key].childe;
			pat += "<tr><td>"+langObj[key].rus+"</td><td>";
			for(var keyChilde in childe){								
				pat += "<div>"+childe[keyChilde].rus+": <span id='"+keyChilde+"'>-</span></div>";
			}
			pat += "</td></tr>";
		}else{
			if($.type(langObj[key].rus) !== 'undefined'){			
				pat += "<tr><td>"+langObj[key].rus+": </td><td><span id='"+key+"'>-</span></td></tr>";
			}
		}
	}
	table_js.html(pat);
}

function PopupPrint(data){
	var mywindow = window.open('', q(), 'height=768,width=1024');
	mywindow.document.write('<html><head><title>'+q()+'</title>');

	mywindow.document.write('</head><body >');
	mywindow.document.write(data);
	mywindow.document.write('</body></html>');

	mywindow.document.close();
	mywindow.focus();

	mywindow.print();
	mywindow.close();

	return true;
}