/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
import jQuery from 'jquery'

jQuery(function($){
	$.datepicker.regional['ru'] = {
//        onChangeMonthYear: function(year, month, inst) {
//            getDays(year, month);
 //       },
//        beforeShowDay: highlightDays,
 //       onSelect: function(dateText, inst) {
//			arefresh_trade();
//        	return false;
//          window.location.replace("/"+glob_LangSite+"/press-sluzhba/novosti_ministerstva/?date=" + dateText);
//        },
		closeText: 'Закрыть',
		prevText: '&#x3C;Пред',
		nextText: 'След&#x3E;',
		currentText: 'Сегодня',
		changeMonth: true,
		changeYear: true,
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Нед',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$('#sdate').datepicker({
        onChangeMonthYear: function(year, month, inst) {
            getDays(year, month);
        },
        beforeShowDay: highlightDays,
        onSelect: function(dateText, inst) {
			arefresh_trade();
			return false;
        },
    });

	$.datepicker.setDefaults($.datepicker.regional['ru']);
});