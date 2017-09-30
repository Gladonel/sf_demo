/** ********************************************** **
	Your Custom Javascript File
	Put here all your custom functions
*************************************************** **/
var softwares = [{
	"id": "APP1",
    "name": "Acrobat Reader Pro X",
    "description": "Complete solution for working with PDF documents",
    "version": "12.0",
    "cost": 449,
    "historyMonth": 0
}, {
	"id": "APP2",
    "name": "Apache Tomcat",
    "description": "Application that executes Java servlets and renders web pages",
    "version": "7",
    "cost": 38.28,
    "historyMonth": 0
}, {
	"id": "APP3",
    "name": "Desktop Video",
    "description": "Video conferencing",
    "version": "2.6.1",
    "cost": 299.88,
    "historyMonth": 0
}, {
	"id": "APP4",
    "name": "Documentum",
    "description": "Content management repository",
    "version": "2.1.1",
    "cost": 163.94,
    "historyMonth": 4
}, {
	"id": "APP5",
    "name": "MyEclipse Blue",
    "description": "Primarily used for developing applications in JAVA language",
    "version": "14.4.1",
    "cost": 161.88,
    "historyMonth": 0
}, {
	"id": "APP6",
    "name": "Microsoft Office Pro 2013",
    "description": "Suite of Word, Excel, Powerpoint, OneNote, Publisher, Access",
    "version": "14 SP1",
    "cost": 280.89,
    "historyMonth": 6
}, {
	"id": "APP7",
    "name": "Microsoft Office Standard 2016",
    "description": "Suite of Word, Excel and PowerPoint",
    "version": "15 SP1",
    "cost": 213.89,
    "historyMonth": 0
}, {
	"id": "APP8",
    "name": "Salesforce",
    "description": "Customer relationship management",
    "version": "1.4.5",
    "cost": 1150.92,
    "historyMonth": 9
}];


jQuery(document).ready(function() {
    _softwareInit();
});


/** Remove Panel
	Function called by app.js on panel Close (remove)
 ************************************************** **/
function _closePanel(panel_id) {
    /** 
    	EXAMPLE - LOCAL STORAGE PANEL REMOVE|UNREMOVE

    	// SET PANEL HIDDEN
    	localStorage.setItem(panel_id, 'closed');
    	
    	// SET PANEL VISIBLE
    	localStorage.removeItem(panel_id);
    **/
}

function _softwareInit() {
	var removalCount = 0, removalAmount = 0;
	var removedApp = sessionStorage.getItem('removedApp');
	if (removedApp) {
		removedApp = JSON.parse(removedApp);

		// Init history list
		$(".no-removal").remove();
		$(".timeline").removeClass('hide');
		
		for (var i = removedApp.length - 1; i >= 0; i--) {
			$(".timeline").prepend(
				$('<li>').append(
					$("<p>")
						.append(
							$('<span>').addClass('wow fadeInRight').data('wow-delay', '0.1s').append('Requested to remove ' + removedApp[i].description + ' - $' + removedApp[i].cost)
						).append(
							$('<span>').addClass('timeline-icon wow fadeIn').data('wow-delay', '0.2s').append(
									$('<i>').addClass('fa fa-recycle color-green')
								)
						).append(
							$('<span>').addClass('timeline-date wow fadeInUp').data('wow-delay', '0.3s').append(removedApp[i].removedDate)
						)
				)
			);
		}
	}

    $('#sw-table tbody').append(
        $.map(softwares, function(item, index) {
			var removalStatus = 'No', removalClass = 'label-warning';
			if (removedApp) {
				var existed = false;
				$.each(removedApp, function(i, obj) {
					if (obj.id == item.id) {
						existed = true;
						return false;
					}
				});

				if (existed) {
					removalStatus = 'Yes';
					removalClass = 'label-success';
					removalCount++;
					removalAmount += item.cost;
				}
			}

            return '<tr data-index="' + index + '">' +
                '<td><input type="checkbox" class="checkboxes" name="chk"' + (removalStatus == 'Yes' ? 'disabled' : '') + ' /><input type="hidden" value="' + item.cost + '" /></td>' +
                '<td class="no-wrap">' + item.name + '</td>' +
                '<td class="softhide">' + item.description + '</td>' +
                '<td>' + item.version + '</td>' +
                '<td class="text-right">$' + item.cost.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td>' +
                '<td class="text-center activity-date hidden-xs" data-history-month="' + item.historyMonth + '"><span class="active-date"></span> <i class="glyphicon glyphicon-time"></i></td>' +
                '<td class="text-center"><span class="label ' + removalClass + '">' + removalStatus + '</span></td>' +
                '</tr>';
        }).join()
	);
	
	$('span.removal-count').text(removalCount);
	$('span.removal-amount').text(removalAmount);

	
}

function _calculateRemoveRequest() {

}