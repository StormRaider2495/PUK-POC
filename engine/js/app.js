
var fullData, SVGData, contentData;
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
        populateSVG(SVGData)
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

