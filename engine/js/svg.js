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
    console.log('cx:' + this.attr('cx') + ' cy:' + this.attr('cy'));

    getClosestPointDistance(this.attr('cx'),  this.attr('cy'),  this.attr('r') );
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

var getClosestPointDistance = function (cx, cy, r) {
    // TODO: Need to adjust point calculation as (0,0) of board (50,-250) of circle
    cx = cx - 50;
    cy = cy + 250;
    var circleTopPoint = { 'x' : cx,'y' : cy - r };
    var circleLeftPoint = { 'x':cx - r,'y': cy };
    var circleRightPoint = { 'x' : cx + r, 'y': cy };
    var circleBottomPoint = { 'x' : cx, 'y': cy + r };

    var boundingTopPoint = { 'x' : 0, 'y': cy -r };
    var boundingLeftPoint = { 'x' : cx - r, 'y': 0 };
    var boundingRightPoint = { 'x' : cx + r, 'y': 0 };
    var boundingBottomPoint = { 'x' : 0, 'y': cy + r };

    var pathCoordinates = fullData.svg.obstacles.path.cordinates;

    for (let index = 0; index < pathCoordinates.length - 1; index++) {
        const pointA = pathCoordinates[index];
        const pointB = pathCoordinates[index + 1];
        getDistanceBetweenLineAndPoint(pointA, pointB, circleLeftPoint, boundingLeftPoint)
    }    
}


/*
* point A and point B are points on the path which are joined
* Pxy is an egde point on the circle
* Bxy is an edge point on the bounding svg
* Here, PointA and PointB points are used to get a straight line equation A1x + B1y + C1 = 0
* Then, solve for Pxy and Bxy to get A2x + B2y + C2 = 0
* Now if the two lines intersect, then distance d is to be calculated
*/
var getDistanceBetweenLineAndPoint = function (pointA, pointB, Pxy, Bxy) {
    
    /*
    * getting line equation of two points (x1,y1) and (x2,y2)
    * A = y2 - y1
    * B = x1 - x2
    * C = Ax1 + By1
     */
    // getting line equation A1x + B1y + C1 = 0 from pointA and pointB
    var A1 = pointB.y - pointA.y,
        B1 = pointA.x - pointB.x,
        C1 = (A1 * pointA.x) + (B1 * pointA.y);
    
    // getting line equation A2x + B2y + C2 = 0 from Pxy and Bxy
    var A2 = Pxy.y - Bxy.y,
        B2 = Bxy.x - Pxy.x,
        C2 = (Pxy.x * Bxy.y) - (Bxy.x * Pxy.y);
    
    // Noww check for intersection
    var det = A1 * B2 - A2 * B1;
    if(det == 0) {
        // the two lines are parallel
        console.log(`pointA: (${pointA.x},${pointA.y})  pointB: (${pointB.x},${pointB.y}) run parallel`);
    } else {
        // find intersection coordinates
        var x = (B2 * C1 - B1 * C2) / det,
            y = (A1 * C2 - A2 * C1) / det;
        console.log(`intersection point: (${x}, ${y})`)
        // find the distance
        // |A*X0 + B*Y0 + C| / sqrt(A*A + B*B)
        var distance = Math.abs(A1 * Pxy.x + B1 * Pxy.y + C1) / Math.sqrt(A1 * A1 + B1 * B1);
        console.log(`pointA: (${pointA.x},${pointA.y})  pointB: (${pointB.x},${pointB.y}) distance:${distance}`);

        // find distance between intersection point and Pxy
        // Distance between two points P(x1, y1) and Q(x2, y2) is given by:
        // d(P,Q) = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2))
        var dPQ = Math.sqrt(Math.pow((Pxy.x-x),2) + Math.pow((Pxy.y-y),2));
        console.log(`Point to point difference: ${dPQ}`)

    }

    // var a = pointA.y - pointB.y,
    //     b = pointB.x - pointA.x,
    //     c = (pointA.x * pointB.y) - (pointB.x * pointA.y),
    //     distance = Math.abs(a * Pxy.x + b * Pxy.y + c) / Math.sqrt(a * a + b * b);
    //     console.log(`pointA: (${pointA.x},${pointA.y})  pointB: (${pointB.x},${pointB.y}) distance:${distance}`);
    // return distance;
}