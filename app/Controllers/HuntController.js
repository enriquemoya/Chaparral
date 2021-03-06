chaparral.controller("HuntsCtrl", ["$filter", "$scope", '$location', "Upload", "fireFact","$http", function($filter, $scope, $location, Upload, fireFact,$http) {

    //OBJECTS
    $scope.files_lodge;
    $scope.urlLodge = null;
    $scope.uploadLodge;
    $scope.progressLodge = 0;
    $scope.allSeasons = null;
    $scope.SelectType = null;
    $scope.SelectPrincipal = null;
    $scope.SelectAlbum = null;
    $scope.season = fireFact.firePath.season;
    $scope.TittleCreate;
    $scope.descriptionCreate;
    $scope.descriptionImage;
    //FUNCTIONS
    $scope.clear = function() {
        console.log($scope.TittleCreate, $scope.descriptionCreate);
        $scope.files_lodge = null;
        $scope.uploadLodge = false;
        $("#file_bucks").val("");
    }
    $scope.ChangeTittle = function() {
        $scope.TittleCreate = $("#Tittle_Hunt_Season").val();
    }
    $scope.ChangeImageDesc = function() {
        $scope.descriptionImage = $("#Desc_Hunt_Image").val();
    }
    $scope.ChangeDescription = function() {
        $scope.descriptionCreate = $("#Desc_Hunt_Season").val();
    }
    $scope.onFileSelected = function($files) {
        if ($scope.SelectType != null) {
            var path = fireFact.firePath.season + '/' + $scope.SelectPrincipal.tittle + '/';
            console.log(path);
            for (i = 0; i < $files.length; i++) {
                $scope.uploadLodge = true;
                form = new FormData();
                let dataFile = $files[i];
                let file = new File([dataFile],dataFile.$ngfName,{type:dataFile.type});
                form.append('files',file);
                $http.post(fireFact.api.storage+fireFact.api.season,form,{transformRequest: angular.identity,headers: {
                    'Content-Type': undefined}}).then(function (response_post) {
                    var _ref = fireFact.fireArray(fireFact.firePath.season + '/' + $scope.SelectType + '/Images');
                    var key = _ref.$add({
                        url: fireFact.api.storage+fireFact.api.season+'/'+response_post.data.filename,
                        type: $scope.SelectType,
                        season: fireFact.firePath.season,
                        description: $scope.descriptionImage != "" ? $scope.descriptionImage : null,
                        timestamp: Date.now()
                    }).then(function(response) {
                        $scope.clear();
                    }, function(error) {
                        Materialize.toast("Error undefined", 4000);
                    }).catch(function (err) {
                        console.log("error Firebase",err)
                    });
                    Materialize.toast("Upload Success", 4000);
                }).catch(function (err) {
                    console.log("error Post",err)
                })
            }
        } else {
            Materialize.toast("Select a type", 5000);
        }
    }

    $scope.Create = function($file) {
        if ($scope.SelectType == null && $scope.TittleCreate != "" && $scope.descriptionCreate != "") {
            var path = fireFact.firePath.season + '/' + $scope.TittleCreate + '/';
            $scope.uploadLodge = true;
            form = new FormData();
            let file = new File([$file],$file.$ngfName,{type:$file.type});
            console.log(file,$file)
            form.append('files',file);
            $http.post(fireFact.api.storage+fireFact.api.season,form,{transformRequest: angular.identity,headers: {
                'Content-Type': undefined}}).then(function (response_post) {
                console.log(response_post);
                var _ref = fireFact.fireArray(fireFact.firePath.season);
                _ref.$add({
                    tittle: $scope.TittleCreate,
                    description: $scope.descriptionCreate
                }).then(function(response) {
                    var key = response.key;
                    var _ref2 = fireFact.fireArray(fireFact.firePath.season + '/' + key + '/Images');
                    _ref2.$add({
                        url: fireFact.api.storage+fireFact.api.season+'/'+response_post.data.filename,
                        type: fireFact.firePath.season,
                        season: $scope.TittleCreate,
                        timestamp: Date.now()
                    }).then((response) => {

                    }, (error) => {

                    });
                    var _refe = fireFact.fireArray(fireFact.firePath.season + '/All');
                    _refe.$add({
                        tittle: $scope.TittleCreate,
                        description: $scope.descriptionCreate,
                        season: response.key,
                        image: {
                            url: fireFact.api.storage+fireFact.api.season+'/'+response_post.data.filename,
                            type: fireFact.firePath.season,
                            season: $scope.TittleCreate,
                            timestamp: Date.now()
                        }
                    }).then((response) => {}, (error) => {

                    })
                }, function(error) {
                    Materialize.toast("Error undefined", 4000);
                });
                Materialize.toast("Upload Success", 4000);
            });
            $scope.clear();
        } else {
            Materialize.toast("Select a type", 5000);
        }
    }
    $scope.DeleteImageHunts = function(item) {
        console.log(item)
        $http.delete(item.url).then(function (response) {
            if(response.data.error==false){
                var fireObject = fireFact.fireRef(fireFact.firePath.season + '/' + $scope.SelectType + '/Images' + '/' + item.$id);
                fireObject.$remove().then(function(ref) {
                    Materialize.toast("Deleted Success", 4000);
                }, function(error) {
                    Materialize.toast("Server Error", 4000);
                });
            }
        });
        fireObject = null;
        $scope.SelectAlbum.$ref();
    }
    $scope.setPrincipal = function(item) {
        var principal = fireFact.fireRef(fireFact.firePath.season + '/All/' + $scope.SelectPrincipal.$id + '/image');
        principal.url = item.url;
        principal.season = item.season;
        principal.timestamp = item.timestamp;
        principal.$save().then((response) => {
            Materialize.toast("Change success", 4000);
        }, (error) => {
            console.log(error)
            Materialize.toast("Error undefined", 4000);
        })
    }
    $scope.Delete_Season = function(season, item) {
        $("#deleteTittle_Season").html(item.tittle);
        $("#modalDelete_Hunts").modal('open');
        $("#deleteTittle_Season").data("item", item);
    }
    $scope.DeleteSeason = function() {
        var data = $("#deleteTittle_Season").data("item");
        console.log(data);
        var _storage = fireFact.fireStorage(fireFact.firePath.season + '/' + data.tittle + '/');
        _storage.$delete().then((ref) => { Materialize.toast("Delete Album", 4000) });
        var _ref = fireFact.fireRef(fireFact.firePath.season + '/' + data.season);
        var _ref2 = fireFact.fireRef(fireFact.firePath.season + '/All/' + data.$id);
        _ref.$remove().then((ref) => {}, (error) => {});
        _ref2.$remove().then((ref) => {}, (error) => {});
        $("#modalDelete_Hunts").modal('close');
    }
    $scope.GoBack = function() {
        $scope.SelectType = null;
        $scope.SelectPrincipal = null;
        $scope.SelectAlbum = null;
        $scope.GetBucks();
    }
    $scope.SelectSeason = function(season, id) {
        $scope.SelectType = season;
        $scope.SelectPrincipal = id;
        $scope.SelectAlbum = fireFact.fireArray(fireFact.firePath.season + '/' + season + '/Images');
    }
    $scope.viewModal = function(id) {
        $("#modalBucks").attr("src", $(id).attr('src'));
        $('#modalFoto_Bucks').modal('open');
    }
    $scope.GetBucks = function() {
        $scope.allSeasons = fireFact.fireArray(fireFact.firePath.season + '/All');
    }
    $scope.GetBucks();
}]);