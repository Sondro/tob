angular.module('MapsCtrl', []).controller('MapsController', function($scope, $http) {

    $scope.itemsCountPerPage = 4; // this should match however many results your API puts on one page
    $scope.totalPages = 0;
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.scaled = false;

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {

        // this is just an example, in reality this stuff should be in a service
        $http.get('/api/maps/gallery/?page=' + pageNumber)
        .then(function(result) {

        	var items = result.data.pages;

            for (var i = 0; i < items.length; i++){

                var item = items[i];

                var mapData2DArray = JSON.parse(item.data);
                
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                var imageData = ctx.createImageData(item.width, item.height);
                var data = imageData.data;

                var x_max = item.width - 1;
                var x = 0;
                var y = 0;

                //console.log(item.width, item.height);

                for (var j = 0; j < data.length; j += 4) {
                    
                    var currMapID = mapData2DArray[x][y];
                    var color;
                    if (currMapID === 0) // nothing
                        color = [10, 10, 10];
                    else if (currMapID === 1) // block
                        color = [255, 0, 0];
                    else if (currMapID === 2) // trap
                        color = [0, 0, 255];
                    else if (currMapID === 3) // trap
                        color = [0, 255, 0];

                    data[j]     = color[0]; // red
                    data[j + 1] = color[1]; // green
                    data[j + 2] = color[2]; // blue
                    data[j + 3] = 255;

                    if (x < x_max){
                        x++;
                    } else {
                        y++;
                        x = 0;
                    }
                }

                var newCanvas = $("<canvas>")
                    .attr("width", imageData.width)
                    .attr("height", imageData.height)[0];

                newCanvas.getContext("2d").putImageData(imageData, 0, 0);

                if (!$scope.scaled){
                    ctx.scale(6.45, 6.45);
                    $scope.scaled  = true;
                }

                ctx.drawImage(newCanvas, 0, 0);

                //ctx.putImageData(imageData, 0, 0);
                items[i].imgData = canvas.toDataURL();
            }
            
            $scope.items = items;
            
            $scope.totalPages = result.data.count;
        });
    }
});