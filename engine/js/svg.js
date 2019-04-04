var canvaselm,
    paper,
    canvasHeight,
    canvasWidth,
    vlno,
    hlno,
    vd,
    hd,
    draggable,
    resizeCircle,
    dropabbleSet,
    draggableSet;


var initializePaperData = function (baseGrid) {
    canvasHeight = baseGrid.height;
    canvasWidth = baseGrid.width;
    vlno = baseGrid.vertical;   //no. of vertical lines
    hlno = baseGrid.horizontal; //no. of horizontal lines
    vd = canvasHeight / vlno;   //per unit sq height
    hd = canvasWidth / hlno;    //per unit sq width
}

var createPaper = function () {
    canvaselm = document.getElementById('canvas');
    canvaselm.height = canvasHeight;
    canvaselm.width = canvasWidth;
    paper = Raphael(canvaselm);
    dropabbleSet = paper.set();
}

var renderGrid = function () {
    //draw horizontal line
    for (i = 0; i <= vlno; i++) {
        var hL = paper.path("M0," + (i * vd) + " L" + canvasWidth + "," + (i * vd));
        dropabbleSet.push(hL);
    }
    //draw vertical line
    for (i = 0; i <= hlno; i++) {
        var vL = paper.path("M" + (i * hd) + ",0 L" + (i * hd) + "," + canvasHeight);
        dropabbleSet.push(vL);
    }
}

var drawObstacles = function (obstacles) {
    for (const obstacle in obstacles) {
        if (obstacles.hasOwnProperty(obstacle)) {
            const element = obstacles[obstacle];
            dropabbleSet.push(createEachObstacle(element));
        }
    }
};

var createEachObstacle = function (obstacleData) {
    var str = '';
    for (i = 0; i < obstacleData.cordinates.length; i++) {
        var ml = i > 0 ? ' L' : 'M';
        var x = obstacleData.cordinates[i].x * hd;
        var y = obstacleData.cordinates[i].y * vd;
        str += ml + x + ',' + y;
    }
    var obstacle = paper.path(str);
    obstacle.attr({
        "opacity": obstacleData.opacity,
        "fill": obstacleData.color
    });
    return obstacle;
}


var drawDraggable = function (draggableData) {
    dropabbleSet.translate(100, 0);
    if (draggableData.struc === "circle") {
        draggable = paper.circle(0, 0, draggableData.unit)
    }
    resizeCircle = paper.circle(draggableData.unit, 0, 5);
    draggableSet = paper.set(draggable, resizeCircle);
    draggableSet.attr({ "fill": draggableData.color, "opacity": draggableData.opacity });
    draggableSet.translate(50, canvasHeight / 2);
    draggable.drag(onDragMove, onDragStart, onDragComplete);
    resizeCircle.drag(resizeonDragMove, resizeonDragStart, resizeonDragComplete);
}

function onDragStart() {
    this.ox = this.attr('cx');
    this.oy = this.attr('cy');
    this.r = this.attr('r');
}

function onDragMove(dx, dy) {
    this.attr({ cx: this.ox + dx, cy: this.oy + dy });
    resizeCircle.attr({ cx: this.ox + this.r + dx, cy: this.oy + dy });
}

function onDragComplete() {
    console.log('dragStop');
    var maxYValid = (canvasHeight / 2) + this.attr('r');
    var minYvalid = ((canvasHeight / 2) - this.attr('r')) * -1;
    var maxXVaild = canvasWidth + 50 - this.attr('r');
    var minXVaild = (50 + this.attr('r'));
    if ((this.attr('cy') > maxYValid) || (this.attr('cy') < minYvalid) || (this.attr('cx') < minXVaild) || (this.attr('cx') > maxXVaild)) {
        reinitializeDrag();
    }
};

function resizeonDragStart() {
    this.distance = draggable.attr('r');
    this.ox = this.attr('cx');
};

function resizeonDragMove(dx) {
    if (((this.distance + dx) > 10) && ((this.distance + dx) < 350)) {
        this.attr({ cx: this.ox + dx });
        draggable.attr({ r: this.distance + dx });
    }
};
function resizeonDragComplete() {
    var drgEdges = calcDragEdges();
    var maxmin = getMaxMinEdges();
    console.log(drgEdges);
    console.log(maxmin);
    console.log((drgEdges.top > maxmin.maxY), (drgEdges.right > maxmin.maxX), (drgEdges.left < maxmin.minX), (drgEdges.bottom < maxmin.minY));
    if ((drgEdges.top > maxmin.maxY) || (drgEdges.right > maxmin.maxX) || (drgEdges.left < maxmin.minX) || (drgEdges.bottom < maxmin.minY)) {
        reinitializeDrag();
    }
}

var reinitializeDrag = function () {
    draggable.attr({ cx: 0, cy: 0, r: 20 });
    resizeCircle.attr({ cx: 20, cy: 0 });
}



var calcDragEdges = function () {
    var topEdge = draggable.attr('cy') + draggable.attr('r');
    var rightEdge = draggable.attr('cx') + draggable.attr('r')-50;
    var leftEgde = draggable.attr('cx') - draggable.attr('r') + 50;
    var bottomEgde = (draggable.attr('cy') - draggable.attr('r'));
    return { "top": topEdge, "right": rightEdge, "left": leftEgde, "bottom": bottomEgde };
}



var getMaxMinEdges = function () {
    var maxXVaild = canvasWidth;
    var maxYValid = (canvasHeight / 2);
    var minXVaild = 100;
    var minYvalid = (canvasHeight / 2) * -1;
    return { "maxY": maxYValid, "maxX": maxXVaild, "minX": minXVaild, "minY": minYvalid };
}