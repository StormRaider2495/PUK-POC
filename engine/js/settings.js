
var engageSettingPopup = function () {
    $('.settings-popup').eq(0).off('click').on('click', function () {
        // open settings pop-up
        $('.settings-popup-modal').eq(0).show(200, function () {
            bindSettingsFunctionality();
        });
    });

    $('.settings-popup-modal .close').eq(0).off('click').on('click', function () {
        // close settings pop-up
        $('.settings-popup-modal').eq(0).hide(200);
    });

    initializePanZoomFuncitonality();
}

var initializePanZoomFuncitonality = function () {
    var panzoomElem = $('.inner-page-container');
    // initialize jquery panzoom element with config
    panzoomInstance = panzoomElem.panzoom({
        cursor: "default",
        contain: "invert", 
        minScale: 1,
        maxScale: 5,
        $zoomIn: panzoomElem.parent().eq(0).find("#zoomIn"),
        $zoomOut: panzoomElem.parent().eq(0).find("#zoomOut"),
        $reset: panzoomElem.parent().eq(0).find("#zoomReset")
      });
      // allow child dragging event
      panzoomInstance = panzoomElem.panzoom("option","ignoreChildrensEvents",true);
}

var bindSettingsFunctionality = function () {
    $('#colorReset').off('click').on('click', function () {
        resetAlterColors();
    });
    $('#switchColors').off('click').on('click', function () {
        alterDocColors();
    });
    $('#panUp').off('click').on('click', function () {
        doPan(0, -100, true, false);
    });
    $('#panLeft').off('click').on('click', function () {
        doPan(-100, 0, true, false);
    });
    $('#panRight').off('click').on('click', function () {
        doPan(100, 0, true, false);
    });
    $('#panDown').off('click').on('click', function () {
        doPan(0, 100, true, false);
    });
}

var doPan = function (x, y, rel, anim) {
    panzoomInstance.panzoom("pan", x, y, { relative: rel, animate: anim });
}

var alterDocColors = function() {
    $('.page-container').addClass('yellow-overlay');
}

var resetAlterColors = function() {
    $('.page-container').removeClass('yellow-overlay');
}


