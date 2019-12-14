function reload_limits() {
	$.ajax({
		url: "/get-limits",  
        cache: false,
        data: {'sel_num': $("#selected-num").val(), 'sel_type': $("#opertype").val(), 'act_org': $("#actorg").val(), 'bzona': $('#bzona').val()},
        dataType: 'json',
        success: function(limits) {
			var bid_vals = limits.bid_vals;
			var offer_vals = limits.offer_vals;
			var bidp_vals = limits.bidp_vals;
			var offerp_vals = limits.offerp_vals;
			var p_sumpvalue = limits.p_sumpvalue;
			var b_sumpvalue = limits.b_sumpvalue;
			var conf_done = limits.conf_done;
			var lim_table = [];
			var i;
				if (conf_done.Done == '0') {
					lim_table = [{sname: 'Суммарный часовой объем (МВт)', bid: bid_vals.SumPower, off: offer_vals.SumPower, bidp: bidp_vals.SumPower, offp: offerp_vals.SumPower},
								 {sname: 'Max. часовой объем (МВт)', bid: bid_vals.MaxPower, off: offer_vals.MaxPower, bidp: bidp_vals.MaxPower, offp: offerp_vals.MaxPower},
								 {sname: 'Min. часовой объем (МВт)', bid: bid_vals.MinPower, off: offer_vals.MinPower, bidp: bidp_vals.MinPower, offp: offerp_vals.MinPower},
								 {sname: 'Max. цена (тенге/кВтч)', bid: bid_vals.MaxPrice, off: offer_vals.MaxPrice, bidp: bidp_vals.MaxPrice, offp: offerp_vals.MaxPrice},
								 {sname: 'Min. цена (тенге/кВтч)', bid: bid_vals.MinPrice, off: offer_vals.MinPrice, bidp: bidp_vals.MinPrice, offp: offerp_vals.MinPrice}];
                } else {
					lim_table = [{sname: 'Суммарный часовой объем (МВт)', bid: bid_vals.SumPower, off: offer_vals.SumPower, bidp: bidp_vals.SumPower, offp: offerp_vals.SumPower},
								 {sname: 'Max. часовой объем (МВт)', bid: bid_vals.MaxPower, off: offer_vals.MaxPower, bidp: bidp_vals.MaxPower, offp: offerp_vals.MaxPower},
								 {sname: 'Min. часовой объем (МВт)', bid: bid_vals.MinPower, off: offer_vals.MinPower, bidp: bidp_vals.MinPower, offp: offerp_vals.MinPower},
								 {sname: 'Max. цена (тенге/кВтч)', bid: bid_vals.MaxPrice, off: offer_vals.MaxPrice, bidp: bidp_vals.MaxPrice, offp: offerp_vals.MaxPrice},
								 {sname: 'Min. цена (тенге/кВтч)', bid: bid_vals.MinPrice, off: offer_vals.MinPrice, bidp: bidp_vals.MinPrice, offp: offerp_vals.MinPrice},
								 {sname: 'итоги торгов'},
								 {sname: 'Единая цена, тенге/кВтч', bid: b_sumpvalue.BasePrice, bidp: p_sumpvalue.PickPrice},
								 {sname: 'Суммарный часовой объем сделок (МВт)', bid: b_sumpvalue.bSumpValue, bidp: p_sumpvalue.pSumpValue}];
				}
			$("#table-vals").jqGrid("clearGridData");
			for(i = 0; i <= lim_table.length; i++) $("#table-vals").jqGrid('addRowData', i + 1, lim_table[i]);
			var elem_b = 0;
			var elem_n = 0;
			var elem_n_old1;
			var elem_b_old1;
			var elem_n_old2;
			var elem_b_old2;
			var cur_name = '';
			var options = {
				xaxis: {
					show:  true,
				},
				yaxis: {
					show:  true,
				},
				legend:{
					container:$("#graph-legend"),
					labelBoxBorderColor: '#fff',
					noColumns: 3
				}
			};
			if (parseInt($('#bload :selected').val()) == 1) {
				if($("#data-graph").length > 0) {
					var current_graph = [];
					var selected_graph = [];
					var bid_graph = [];
					var off_graph = [];
					arr_tmp = limits.bid_graph.slice();
					for (i = 0; i < arr_tmp.length; i++) {
						elem_b = parseFloat(arr_tmp[i].Price);
						bid_graph[bid_graph.length] = [elem_n, elem_b];
						bid_graph[bid_graph.length] = [elem_n + parseInt(arr_tmp[i].Power), parseFloat(arr_tmp[i].Price)];
						elem_n_old1 = elem_n;
						elem_b_old1 = parseFloat(arr_tmp[i].Price);
						elem_n_old2 = elem_n + parseInt(arr_tmp[i].Power);
						elem_b_old2 = parseFloat(arr_tmp[i].Price);
						if (arr_tmp[i].Name !== '') {
							current_graph.push([elem_n_old1, elem_b_old1]);
							current_graph.push([elem_n_old2, elem_b_old2]);
							current_graph.push([null, null]);
							cur_name = arr_tmp[i].Name;
						}
						if (arr_tmp[i].Selected == '1') {
							selected_graph.push([elem_n_old1, elem_b_old1]);
							selected_graph.push([elem_n_old2, elem_b_old2]);
							selected_graph.push([null, null]);
						}
						elem_n = elem_n + parseInt(arr_tmp[i].Power);
					}
					elem_b = 0;
					elem_n = 0;
					arr_tmp = limits.off_graph.slice();
					for (i = 0; i < arr_tmp.length; i++) {
						elem_b = parseFloat(arr_tmp[i].Price);
						off_graph[off_graph.length] = [elem_n, elem_b];
						off_graph[off_graph.length] = [elem_n + parseInt(arr_tmp[i].Power), parseFloat(arr_tmp[i].Price)];
						elem_n_old1 = elem_n;
						elem_b_old1 = parseFloat(arr_tmp[i].Price);
						elem_n_old2 = elem_n + parseInt(arr_tmp[i].Power);
						elem_b_old2 = parseFloat(arr_tmp[i].Price);
						if (arr_tmp[i].Name !== '') {
							current_graph.push([elem_n_old1, elem_b_old1]);
							current_graph.push([elem_n_old2, elem_b_old2]);
							current_graph.push([null, null]);
							cur_name = arr_tmp[i].Name;
						}
						if (arr_tmp[i].Selected == '1') {
							selected_graph.push([elem_n_old1, elem_b_old1]);
							selected_graph.push([elem_n_old2, elem_b_old2]);
							selected_graph.push([null, null]);
						}
						elem_n = elem_n + parseInt(arr_tmp[i].Power);
					}
					var vline = limits.v_line.slice();
					if (vline.length > 0) {
						bid_graph[bid_graph.length] = vline;
					}
					$.plot("#data-graph", [
						{label: 'Продавцы', data:off_graph, color: "rgb(0, 0, 255)", points: {show: true}, lines: {show: true}},
						{label: 'Покупатели',data: bid_graph, color: "rgb(255, 0, 0)", points: {show: true}, lines: {show: true}},
						{label: cur_name, data:current_graph, color: "rgb(0, 255, 0)", points: {show: true}, lines: {show: true}},
						{data:selected_graph, color: "rgb(255, 255, 0)", points: {show: true}, lines: {show: true}}],
						options);
				}
			} else {
				if($("#data-graph").length > 0) {
					var currentp_graph = [];
					var selectedp_graph = [];
					var bidp_graph = [];
					var offp_graph = [];
					arr_tmp = limits.bidp_graph.slice();
					for (i = 0; i < arr_tmp.length; i++) {
						elem_b = parseFloat(arr_tmp[i].Price);
						bidp_graph[bidp_graph.length] = [elem_n, elem_b];
						bidp_graph[bidp_graph.length] = [elem_n + parseInt(arr_tmp[i].Power), parseFloat(arr_tmp[i].Price)];
						elem_n_old1 = elem_n;
						elem_b_old1 = parseFloat(arr_tmp[i].Price);
						elem_n_old2 = elem_n + parseInt(arr_tmp[i].Power);
						elem_b_old2 = parseFloat(arr_tmp[i].Price);
						if (arr_tmp[i].Name !== '') {
							currentp_graph.push([elem_n_old1, elem_b_old1]);
							currentp_graph.push([elem_n_old2, elem_b_old2]);
							currentp_graph.push([null, null]);
							cur_name = arr_tmp[i].Name;
						}
						if (arr_tmp[i].Selected == '1') {
							selectedp_graph.push([elem_n_old1, elem_b_old1]);
							selectedp_graph.push([elem_n_old2, elem_b_old2]);
							selectedp_graph.push([null, null]);
						}
						elem_n = elem_n + parseInt(arr_tmp[i].Power);
					}
					elem_b = 0;
					elem_n = 0;
					arr_tmp = limits.offp_graph.slice();
					for (i = 0; i < arr_tmp.length; i++) {
						elem_b = parseFloat(arr_tmp[i].Price);
						offp_graph[offp_graph.length] = [elem_n, elem_b];
						offp_graph[offp_graph.length] = [elem_n + parseInt(arr_tmp[i].Power), parseFloat(arr_tmp[i].Price)];
						elem_n_old1 = elem_n;
						elem_b_old1 = parseFloat(arr_tmp[i].Price);
						elem_n_old2 = elem_n + parseInt(arr_tmp[i].Power);
						elem_b_old2 = parseFloat(arr_tmp[i].Price);
						if (arr_tmp[i].Name !== '') {
							currentp_graph.push([elem_n_old1, elem_b_old1]);
							currentp_graph.push([elem_n_old2, elem_b_old2]);
							currentp_graph.push([null, null]);
							cur_name = arr_tmp[i].Name;
						}
						if (arr_tmp[i].Selected == '1') {
							selectedp_graph.push([elem_n_old1, elem_b_old1]);
							selectedp_graph.push([elem_n_old2, elem_b_old2]);
							selectedp_graph.push([null, null]);
						}
						elem_n = elem_n + parseInt(arr_tmp[i].Power);
					}
					var vlinep = limits.vp_line.slice();
					if (vlinep.length > 0) {
						bidp_graph[bidp_graph.length] = vlinep;
					}
					$.plot("#data-graph", [
						{label: 'Продавцы', data:offp_graph, color: "rgb(0, 0, 255)", points: {show: true}, lines: {show: true}},
						{label: 'Покупатели',data: bidp_graph, color: "rgb(255, 0, 0)", points: {show: true}, lines: {show: true}},
						{label: cur_name, data:currentp_graph, color: "rgb(0, 255, 0)", points: {show: true}, lines: {show: true}},
						{data:selectedp_graph, color: "rgb(255, 255, 0)", points: {show: true}, lines: {show: true}}],
						options);
				}                               
			}
		}
	});	
}

function get_status() {
	$.ajax({
		url: "/get-status",
		cache: false,
		dataType: 'json',
		type: 'GET',
		success: function(html) {
			var rst = parseInt(html.status);
			$('#status').val(rst);
		}
	});
}

function show_serv_time() {
	$.ajax({
		url: "/serv-time",  
		cache: false,
		dataType: 'json',
		success: function(html) {
			$("#serv-time").html(html.time);
			if (window.tradeStatus != html.status) {
				document.location.href='/trade';
			}
			if ($('#examplemath').html() != html.mathcaptcha) {
				$('#examplemath').html(html.mathcaptcha);
			}
			if (html.MaxIDs !== 0) {
				if ($("#max-ids").val() != parseInt(html.MaxIDs)) {
					$("#max-ids").val(html.MaxIDs);
					$('#trade-table').trigger('reloadGrid');
					$('#ztype').trigger('change');
					refresh_itogs();
				}
			}
		}  
	});
	$('#ztype').trigger('change');
}

function show_serv_time2() {
	$.ajax({
		url: "/serv-time2",  
		cache: false,
		dataType: 'json',
		success: function(html) {
			$("#serv-time").html(html.time);
			if (window.tradeStatus2 != html.status) {
				document.location.href='/trade2';
			}
			if ($('#examplemath').html() != html.mathcaptcha) {
				$('#examplemath').html(html.mathcaptcha);
			}
			if (html.MaxIDs !== 0) {
				if ($("#max-ids").val() != parseInt(html.MaxIDs)) {
					$("#max-ids").val(html.MaxIDs);
					$('#trade-table-bb').trigger('reloadGrid');
					$('#trade-table-bo').trigger('reloadGrid');
					$('#trade-table-pb').trigger('reloadGrid');
					$('#trade-table-po').trigger('reloadGrid');
					$('#ztype').trigger('change');
					refresh_itogs();
				}
			}
		}  
	});
	$('#ztype').trigger('change');
}

function show_local_time() {
	var ldate = new Date();
	var sdd = ldate.getDate();
	if (sdd < 10) sdd = '0' + sdd;
	var smm = ldate.getMonth() + 1;
	if (smm < 10) smm = '0' + smm;
	var syyyy = ldate.getFullYear();
	var shh = ldate.getHours();
	if (shh < 10) shh = '0' + shh;
	var smn = ldate.getMinutes();
	if (smn < 10) smn = '0' + smn;
	var sss = ldate.getSeconds();
	if (sss < 10) sss = '0' + sss;
	var sdate = sdd + '.' + smm + '.' + syyyy;
}

function highlightDays() {
}

function refresh_ltrade(nsession) {
		$.ajax({
			url: "/refresh-ltrade",
			data: {'nsession': nsession},
			dataType: 'json',
			type: 'POST',
			cache: false,
			success: function(html) {
				$("#periodt").text(html.Periodt);
					$("#ztype").find('option').remove().prop( 'disabled',true );
				    $("#minpower").find('input').remove().prop( 'disabled',true );
				if ((html.Types == 'R') || (html.Types === '')) {
					if (parseInt($('#ur').val()) === 1) {
						$("#ztype").append( '<option selected="selected" value="1">Покупка</option>' );
					} else {
						$("#ztype").append( '<option selected="selected" value="2">Продажа</option>' );
						$("#minpower").append( '<input type="text" class="form-control" name="minpower" id="minpower" value="0">' );
					}
				} else {
					if (parseInt($('#usertype').val()) === 2 || parseInt($('#usertype').val()) === 5) {
						$("#ztype").append( '<option selected="selected" value="1">Покупка</option>' );
					} else {
						$("#ztype").append('<option selected="selected" value="1">Покупка</option><option value="2">Продажа</option>');
					}
				}
			}
		});
}

function refresh_itogs() {
	$.ajax({
		url: "/get-itogs",  
		cache: false,
		data: {'nsession': $("#nsession").val(), 'usercode': $("#usercode").val(), 'bzona': $('#bzona').val()},
		dataType: 'json',
		type: 'GET',
		success: function(html) {
			var i;
            if (typeof(html.fitogi) !== "undefined") {
				$("#table-itog").jqGrid("clearGridData");
				for(i = 0; i <= html.fitogi.length; i++) $("#table-itog").jqGrid('addRowData', i + 1, html.fitogi[i]);
            }
            if (parseInt($('#nsession').val()) == 2) {
				if (typeof(html.bloads) !== "undefined") {
					$("#table-itog-b").jqGrid("clearGridData");
					for(i = 0; i <= html.bloads.length; i++) $("#table-itog-b").jqGrid('addRowData', i + 1, html.bloads[i]);
                }
				if (typeof(html.ploads) !== "undefined") {
					$("#table-itog-p").jqGrid("clearGridData");
					for(i = 0; i <= html.ploads.length; i++) $("#table-itog-p").jqGrid('addRowData', i + 1, html.ploads[i]);
                }
            }
		}
	});
}