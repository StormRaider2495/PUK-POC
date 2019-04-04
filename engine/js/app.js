
var fullData, SVGData, contentData, panzoomInstance;
// document ready block.
$(document).ready(function () {
    //data calling block
    var xhr = $.getJSON("data/demo.json").then(function (data) {
        fullData = data
        //svgdata
        SVGData = fullData.svg;
        //contentdata
        contentData = fullData.content;

        populateQus(contentData);
        // populateSVG(SVGData);

        engageSettingPopup();
    });

});

var populateQus = function (data) {
    $(".question-container .qustionContent").html(data.qustionContent);
    $(".question-container .hint").html(data.hint);
    $(".question-container .instruction").html(data.instruction);
    $(".svg-container .svg-legend").html(data.svgLegend);
};
var populateSVG = function (data) {
    drawGrid(data.baseGrid);
    drawObstacles(data.obstacles);
    drawDraggable(data.draggable);
}

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
    panzoomInstance = panzoomElem.panzoom({
        cursor: "default",
        contain: "invert", 
        minScale: 1,
        maxScale: 5,
        $zoomIn: panzoomElem.parent().eq(0).find("#zoomIn"),
        $zoomOut: panzoomElem.parent().eq(0).find("#zoomOut"),
        $reset: panzoomElem.parent().eq(0).find("#zoomReset")
      });
    //  panzoomInstance = panzoom($('.inner-page-container')[0], {
    //     beforeWheel: function (e) {
    //         // allow wheel-zoom only if altKey is down. Otherwise - ignore
    //         var shouldIgnore = !e.altKey;
    //         return shouldIgnore;
    //     },
    //     onDoubleClick: function(e) {
    //         // `e` - is current double click event.
        
    //         return false; // tells the library to not preventDefault, and not stop propagation
    //     },
    //     center: 1
    // });
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
    $('.page-container').addClass('')
}

var resetAlterColors = function() {
    $('.page-container').removeClass('')
}


