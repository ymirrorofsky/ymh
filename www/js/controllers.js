angular.module('starter.controllers', [])
	.controller('homeCtrl', function ($rootScope, $scope, $cordovaGeolocation, Area, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, $http, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, Lbs, $ionicPopup, Storage, $cordovaInAppBrowser, System) {
		// $scope.$on("$ionicView.beforeEnter", function(){
		// 	if(!$rootScope.globalInfo.user.uid){
		// 		$state.go('auth.login');
		// }
		// })
		$scope.pageData = {
			focusListData: [],
			navList: [],
			shopsList: []
		}; // 初始化页面数据
		$scope.shops = {
			shopsList: ''
		};
		$scope.keywords = '';
		// 加载首页幻灯和导航
		Message.loading('加载中……');
		Home.fetch().then(function (data) {
			$scope.pageData = {
				focusListData: data.slide,
				navList: data.navList
			};
			$scope.pageData.navList.length = 9;
			if ($scope.pageData.focusListData) {
				console.log($scope.pageData);
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
				$ionicSlideBoxDelegate.loop(true);
			}
			Message.hidden();
		});
		$scope.seemore = function () {
			$state.go('shops.linelocations');
		}
		$scope.showMsg = function () {
			$rootScope.globalInfo.noticeNum = 0;
			// Storage.set("noticeNum", $rootScope.globalInfo);
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		// 首页搜索功能
		$scope.goSearch = function () {
			$state.go('my.offlinesearch')
		}
		//1：定位失败，2：定位中，3：定位成功, 4：并获取到更新
		$scope.ymhPosition = {
			lat: '',
			lng: '',
			city: '',
			status: 1
		}
		document.addEventListener("deviceready", function () {
			if (Storage.get("ymhPosition") === null) {
				$scope.ymhPosition.status = 2;
				Message.loading("定位中……");
				baidumap_location.getCurrentPosition(function (result) {
					//   alert(JSON.stringify(result)+'91');
					$scope.ymhPosition.lat = result.latitude;
					$scope.ymhPosition.lng = result.longitude;
					$scope.ymhPosition.city = result.city;
					$scope.ymhPosition.status = 3;
					Storage.set("ymhPosition", $scope.ymhPosition);
					$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				}, function (error) {
					Message.show('定位失败。请手动选择城市')
					//                    alert(JSON.stringify(error)+'Last');
				});
			} else {
				$scope.ymhPosition.status = 3;
				$scope.ymhPosition.city = Storage.get("ymhPosition").city;
				$scope.ymhPosition.lat = Storage.get("ymhPosition").lat;
				$scope.ymhPosition.lng = Storage.get("ymhPosition").lng;
				//		$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				//校正历史定位

				var newPosition = {
					city: '',
					lat: '',
					lng: ''

				}
				baidumap_location.getCurrentPosition(function (result) {
					//  alert(JSON.stringify(result)+'117');
					newPosition.lat = result.latitude;
					newPosition.lng = result.longitude;
					newPosition.city = result.city;
					if (newPosition.city !== "" && newPosition.city != $scope.ymhPosition.city) {
						//提示切换位置  弹窗
						$ionicPopup.confirm({
							template: '当前城市为：' + newPosition.city + '是否切换？',
							buttons: [{
								text: '取消',
								onTap: function () {
									return false;
								}
							}, {
								text: '确定',
								type: 'button-calm',
								onTap: function () {
									$scope.ymhPosition.status = 3;
									$scope.ymhPosition.city = newPosition.city;
									$scope.ymhPosition.lat = newPosition.lat;
									$scope.ymhPosition.lng = newPosition.lng;
									Storage.set("ymhPosition", $scope.ymhPosition);
									$scope.$broadcast('shops.list.update', $scope.ymhPosition);
									return true;
								}
							}]
						});
					} else if (newPosition.city !== "" && newPosition.city == $scope.ymhPosition.city && $scope.ymhPosition.lat != newPosition.lat && $scope.ymhPosition.lng != newPosition.lng) {
						$scope.ymhPosition.status = 3;
						$scope.ymhPosition.city = newPosition.city;
						$scope.ymhPosition.lat = newPosition.lat;
						$scope.ymhPosition.lng = newPosition.lng;
						Storage.set("ymhPosition", $scope.ymhPosition);
						$scope.$broadcast('shops.list.update', $scope.ymhPosition);
						//								if(Lbs.calcDistance($scope.ymhPosition, newPosition) > 100) {
						//									$scope.ymhPosition.status = 3;
						//									$scope.ymhPosition.city = newPosition.city;
						//									$scope.ymhPosition.lat = newPosition.lat;
						//									$scope.ymhPosition.lng = newPosition.lng;
						//									Storage.set("ymhPosition", $scope.ymhPosition);
						//									$scope.$broadcast('shops.list.update', $scope.ymhPosition);
						//								}
					}

				}, function (error) {
					Message.show('定位失败，请手动选择城市')
				});
			};
		}, false)

		//		document.addEventListener("deviceready", function () {
		//			if (Storage.get("ymhPosition") === null) {
		//				var geolocationOption = {
		//					timeout: 5000,
		//					maximumAge: 10000,
		//					enableHighAccuracy: false
		//				};
		//				$scope.ymhPosition.status = 2;
		//				Message.loading("定位中……");
		//				$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function (position) {
		//					$scope.ymhPosition.lat = position.coords.latitude;
		//					$scope.ymhPosition.lng = position.coords.longitude;
		//					//alert($scope.ymhPosition.lat);
		//					//				alert($scope.ymhPosition.lng);
		//					Lbs.getCity(function (respond) {
		//						if (respond.code == 0) {
		//							$scope.ymhPosition.city = respond.data;
		//							$scope.ymhPosition.status = 3;
		//							Storage.set("ymhPosition", $scope.ymhPosition);
		//							$scope.$broadcast('shops.list.update', $scope.ymhPosition);
		//						} else {
		//							$scope.ymhPosition.status = 1;
		//							Message.show(respond.msg);
		//						}
		//					},
		//						function () {
		//							$scope.ymhPosition.status = 1;
		//							Message.show("定位失败，请手动选择当前城市");
		//						}, $scope.ymhPosition);
		//				}, function (err) {
		//					$scope.ymhPosition.status = 1;
		//					//Message.show('定位失败，请在左上角手动选择当前城市！', 1000);
		//					console.info(err);
		//					return false;
		//				})
		//			} else {
		//				$scope.ymhPosition.status = 3;
		//				$scope.ymhPosition.city = Storage.get("ymhPosition").city;
		//				$scope.ymhPosition.lat = Storage.get("ymhPosition").lat;
		//				$scope.ymhPosition.lng = Storage.get("ymhPosition").lng;
		//				//				$scope.$broadcast('shops.list.update', $scope.ymhPosition);
		//				//校正历史定位
		//				$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function (position) {
		//					var newPosition = {};
		//					newPosition.lat = position.coords.latitude;
		//					newPosition.lng = position.coords.longitude;
		//					Lbs.getCity(function (respond) {
		//						if (respond.code == 0) {
		//							newPosition.city = respond.data;
		//							if (newPosition.city !== "" && newPosition.city != $scope.ymhPosition.city) {
		//								//提示切换位置  弹窗
		//								$ionicPopup.confirm({
		//									template: '当前城市为：' + newPosition.city + '是否切换？',
		//									buttons: [{
		//										text: '取消',
		//										onTap: function () {
		//											return false;
		//										}
		//									}, {
		//											text: '确定',
		//											type: 'button-calm',
		//											onTap: function () {
		//												$scope.ymhPosition.status = 3;
		//												$scope.ymhPosition.city = newPosition.city;
		//												$scope.ymhPosition.lat = newPosition.lat;
		//												$scope.ymhPosition.lng = newPosition.lng;
		//												Storage.set("ymhPosition", $scope.ymhPosition);
		//												$scope.$broadcast('shops.list.update', $scope.ymhPosition);
		//												return true;
		//											}
		//										}]
		//								});
		//							}
		//							$scope.ymhPosition.status = 3;
		//							$scope.ymhPosition.city = newPosition.city;
		//							$scope.ymhPosition.lat = newPosition.lat;
		//							$scope.ymhPosition.lng = newPosition.lng;
		//							Storage.set("ymhPosition", $scope.ymhPosition);
		//							$scope.$broadcast('shops.list.update', $scope.ymhPosition);
		//							//							if(Lbs.calcDistance($scope.ymhPosition, newPosition) > 500) {
		//							//								$scope.ymhPosition.status = 3;
		//							//								$scope.ymhPosition.city = newPosition.city;
		//							//								$scope.ymhPosition.lat = newPosition.lat;
		//							//								$scope.ymhPosition.lng = newPosition.lng;
		//							//								Storage.set("ymhPosition", $scope.ymhPosition);
		//							//								$scope.$broadcast('shops.list.update', $scope.ymhPosition);
		//							//							}
		//						}
		//					}, function () {
		//						console.info(err);
		//					}, newPosition);
		//				}, function (err) {
		//					console.info(err);
		//					return false;
		//				});
		//			};
		//		}, false)

		// 获取首页商家
		$scope.$on('shops.list.update', function (event, data) {
			Home.fetchShops(data.page, data.lat, data.lng, '', '', 1).then(function (response) {
				// console.log("更新商家", data);
				$scope.ymhPosition.status = 4;
				if (response.code == 1) {
					//					Message.show(response.msg);
					return;
				}
				$scope.shops.shopsList = response.data;
			});
		});
		// 列表下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			document.addEventListener("deviceready", function () {
				if (Storage.get("ymhPosition") === null) {
					$scope.ymhPosition.status = 2;
					Message.loading("定位中……");
					baidumap_location.getCurrentPosition(function (result) {
						$scope.ymhPosition.lat = result.latitude;
						$scope.ymhPosition.lng = result.longitude;
						$scope.ymhPosition.city = result.city;
						$scope.ymhPosition.status = 3;
						Storage.set("ymhPosition", $scope.ymhPosition);
						$scope.$broadcast('shops.list.update', $scope.ymhPosition);
					}, function (error) {
						Message.show('定位失败。请手动选择城市')
						//                    alert(JSON.stringify(error)+'Last');
					});
				} else {
					$scope.ymhPosition.status = 3;
					$scope.ymhPosition.city = Storage.get("ymhPosition").city;
					$scope.ymhPosition.lat = Storage.get("ymhPosition").lat;
					$scope.ymhPosition.lng = Storage.get("ymhPosition").lng;
					//		$scope.$broadcast('shops.list.update', $scope.ymhPosition);
					//校正历史定位

					var newPosition = {
						city: '',
						lat: '',
						lng: ''
					}
					baidumap_location.getCurrentPosition(function (result) {
						newPosition.lat = result.latitude;
						newPosition.lng = result.longitude;
						newPosition.city = result.city;
						if (newPosition.city !== "" && newPosition.city != $scope.ymhPosition.city) {
							//提示切换位置  弹窗
							$ionicPopup.confirm({
								template: '当前城市为：' + newPosition.city + '是否切换？',
								buttons: [{
									text: '取消',
									onTap: function () {
										return false;
									}
								}, {
									text: '确定',
									type: 'button-calm',
									onTap: function () {
										$scope.ymhPosition.status = 3;
										$scope.ymhPosition.city = newPosition.city;
										$scope.ymhPosition.lat = newPosition.lat;
										$scope.ymhPosition.lng = newPosition.lng;
										Storage.set("ymhPosition", $scope.ymhPosition);
										$scope.$broadcast('shops.list.update', $scope.ymhPosition);
										return true;
									}
								}]
							});
						} else if (newPosition.city !== "" && newPosition.city == $scope.ymhPosition.city && $scope.ymhPosition.lat != newPosition.lat && $scope.ymhPosition.lng != newPosition.lng) {
							$scope.ymhPosition.status = 3;
							$scope.ymhPosition.city = newPosition.city;
							$scope.ymhPosition.lat = newPosition.lat;
							$scope.ymhPosition.lng = newPosition.lng;
							Storage.set("ymhPosition", $scope.ymhPosition);
							$scope.$broadcast('shops.list.update', $scope.ymhPosition);
							//								if(Lbs.calcDistance($scope.ymhPosition, newPosition) > 100) {
							//									$scope.ymhPosition.status = 3;
							//									$scope.ymhPosition.city = newPosition.city;
							//									$scope.ymhPosition.lat = newPosition.lat;
							//									$scope.ymhPosition.lng = newPosition.lng;
							//									Storage.set("ymhPosition", $scope.ymhPosition);
							//									$scope.$broadcast('shops.list.update', $scope.ymhPosition);
							//								}
						}
					}, function (error) {
						Message.show('定位失败，请手动选择城市')
						//                    alert(JSON.stringify(error)+'Last');
					});
				};
			}, false)

			Home.fetch().then(function (data) {
				$scope.pageData = {
					focusListData: data.slide,
					navList: data.navList
				};
				if ($scope.pageData.focusListData) {
					$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
					$ionicSlideBoxDelegate.loop(true);
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: 500
				});
			});
			$scope.noMore = true;
			$scope.page = 2;
		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			Home.fetchShops($scope.page, $scope.ymhPosition.lat, $scope.ymhPosition.lng, '', '', 1).then(function (data) {
				$scope.page++;
				$scope.shops.shopsList = $scope.shops.shopsList.concat(data.data);
				//$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (data.code == 0 && data.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};

		// 选择城市modal
		$ionicModal.fromTemplateUrl('templates/modal/location.html', {
			scope: $scope
			//			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.citySelectModal = modal;
		});
		//选择城市的数据列表
		Area.getcityList(function (data) {
			$scope.cityList = data;
		});
		$scope.openModal = function () {
			$scope.citySelectModal.show();
			//			$http.get('data/city.json').success(function(data) {
			//				$scope.cityList = data;
			//				$scope.citySelectModal.show();
			//			});
		};
		//	$http.get('data/city.json').success(function(data) {
		//							$scope.cityList = data;
		//							console.log($scope.cityList);
		//				});
		//        Area.getcityList(function(data) {
		//				$scope.cityList = data;
		//				console.log(data);
		//			});

		// 锚点跳转
		$scope.quickSelect = function (x) {
			$location.hash(x);
			$anchorScroll();
			$ionicScrollDelegate.$getByHandle('citySelectScroll').resize();
		};
		// 选择市
		$scope.selectCity = function (city) {
			Home.getSearchCity(city).then(function (response) {
				Message.hidden();
				if (response.code == 1) {
					Message.show(response.msg);
					return;
				}
				$scope.shops.shopsList = response.data;
				$scope.ymhPosition.status = 3;
				$scope.ymhPosition.city = city;
				//noinspection JSUnresolvedVariable
				$scope.ymhPosition.lat = response.data.latlng.lat;
				$scope.ymhPosition.lng = response.data.latlng.lng;
				Storage.set("ymhPosition", $scope.ymhPosition);
				$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
				$ionicSlideBoxDelegate.update();
			});
			$scope.citySelectModal.hide();
		};

		// 调试的用的
		Home.fetchShops(1, 0, 0, '', '', 1).then(function (response) {
			// console.log("更新商家", data);
			$scope.ymhPosition.status = 4;
			if (response.code == 1) {
				//					Message.show(response.msg);
				return;
			}
			$scope.shops.shopsList = response.data;
		});

	})
	.controller('ContactCtrl', function ($rootScope, $scope, Message, $timeout, Jpush) {

		$scope.info = {
			infoList: ''
		};
		Jpush.getMessageList().then(function (response) {
			$scope.info.infoList = response;
		})

	})
	.controller('imMessagePersonCtrl', function ($rootScope, $scope, $stateParams, Message, $timeout, Jpush, $ionicScrollDelegate) {
		$scope.$on("$ionicView.enter", function () {
			console.log($stateParams.username);
			$scope.username = $stateParams.username;
			$scope.info = {
				infoList: [],
				message: '',
				allData: ''
			};

			Jpush.getsignMessage($stateParams.username).then(function (response) {
				//			alert(JSON.stringify(response))
				$scope.info.allData = response;
				if (response.length > 10) {
					$scope.info.infoList = $scope.info.allData.splice(-10, 10);
				} else {
					$scope.info.infoList = $scope.info.allData;
				}
				$ionicScrollDelegate.scrollBottom()
				//			$scope.info.message=JSON.stringify(response)
				Jpush.resetPersonMessage($stateParams.username)
			})
		});

		//Jpush.testfunction();
		$rootScope.$on('imReceiveMessage', function (event, data) {
			//				 	alert('rec1689'+JSON.stringify(data))
			if (data.from.username == $stateParams.username) {
				$scope.info.infoList.push(data);
				$timeout(function () {
					$ionicScrollDelegatescrollBottom();
					Jpush.resetPersonMessage($stateParams.username)
				})
			}
		});
		//加载显示更多
		$scope.doLoad = function () {
			console.log('ss')
			if ($scope.info.allData.length > 10) {
				$scope.info.infoList = $scope.info.allData.splice(-10, 10).concat($scope.info.infoList)
			} else {
				$scope.info.infoList = $scope.info.allData.concat($scope.info.infoList)
			}

			$timeout(function () {

				//					$ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,newheight-lastheight)
				//				var lastheight=	newheight||0;
				//           	$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
				$scope.$broadcast('scroll.refreshComplete');
				//           	$ionicLoading.show({
				//					noBackdrop: true,
				//					template: '刷新成功！',
				//					duration: '3000'
				//				});
			})
		}
		window.addEventListener('native.keyboardshow', function () {
			//			alert('ss')
			$timeout(function () {
				$ionicScrollDelegate.resize();
				$ionicScrollDelegate.scrollBottom()

			}, 10)

			// $ionicScrollDelegate.scrollTo(0,200); 
		});

		$scope.send = false;
		//  	 $scope.showBox=false;
		//  	 Jpush.initIm()
		$scope.contactIm = function () {

			//			if($scope.info.name==''){
			//				Message.show('请输入用户名')
			//				return
			//			}
			if ($scope.info.message == '') {
				Message.show('请输入发送消息')
				return
			}
			console.log($rootScope.globalInfo.user)
			//         alert($scope.send)
			//         alert(JSON.stringify($scope.info.message))
			if ($scope.send == false) {
				Jpush.creatIm($scope.username).then(function (response) {
					//         alert('ss1'+JSON.stringify(response))			
					$scope.send = true;
					Jpush.sendIm($scope.username, $scope.info.message).then(function (response) {
						$scope.info.infoList.push(response);
						$timeout(function () {
							$ionicScrollDelegate.scrollBottom();
						}, 10)
						$scope.info.message = ''
					});
				})
			} else {
				Jpush.sendIm($scope.username, $scope.info.message).then(function (response) {
					$scope.send = true;
					$scope.info.infoList.push(response);
					$timeout(function () {
						$ionicScrollDelegate.scrollBottom();
					}, 10)

					$scope.info.message = ''
				})
			}
		}

	})

	.controller('shopallcateCtrl', function ($rootScope, $scope, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, $ionicPopup, Storage) {
		// $scope.$on("$ionicView.beforeEnter", function(){
		// 	if(!$rootScope.globalInfo.user.uid){
		// 		$state.go('auth.login');
		// }
		// });
		Home.getlinecatelist().then(function (response) {
			console.log(response);
			if (response.code == 1) {
				Message.show(response.msg);
				$scope.linecateList = response.data;
				return;
			}
			$scope.linecateList = response.data;
		});

		// 下拉加载更多商家
		//		$scope.noMore = true;
		//		$scope.page = 2;
		//		$scope.loadMoreGoods = function() {
		//			Home.fetchShops($scope.page).then(function(data) {
		//				$scope.page++;
		//				//$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data.data);
		//				$scope.$broadcast('scroll.infiniteScrollComplete');
		//				if(data.code != 0) {
		//					$ionicLoading.show({
		//						noBackdrop: true,
		//						template: '没有更多商家了！',
		//						duration: '1200'
		//					});
		//					$scope.noMore = false;
		//				}
		//			});
		//		};

	})
	.controller('linelocationsCtrl', function ($rootScope, $scope, $cordovaGeolocation, Area, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, Home, Message, $location, $ionicScrollDelegate, Lbs, $ionicPopup, Storage, $timeout, $stateParams) {
		// $scope.$on("$ionicView.beforeEnter", function(){
		// 	if(!$rootScope.globalInfo.user.uid){
		// 		$state.go('auth.login');
		// }
		// });
		console.log($stateParams);
		$scope.empty = false;
		$scope.sortgoods = false;
		$scope.classgoods = false;
		$scope.citygoods = false;
		$scope.shops = {
			shopsList: ''
		};
		//		console.log(Storage.get("ymhPosition"));
		$scope.ymhPosition = Storage.get("ymhPosition");
		$scope.sortname = '';
		$scope.classname = $stateParams.cid;
		$scope.keywords = '';
		$scope.linecateList = {};
		// 加载商家列表
		//		Message.loading('加载中……');
		Home.fetchShops(1, 0, 0, $scope.classname).then(function (response) {
			if (response.code == 1) {
				Message.show(response.msg);
				$scope.empty = true;
				return;
			}
			$scope.empty = false;
			$scope.shops.shopsList = response.data;
		});
		Home.getlinecatelist().then(function (response) {
			if (response.code == 1) {
				Message.show(response.msg);
				$scope.linecateList = response.data;
				return;
			}
			$scope.linecateList = response.data;
		});
		$timeout(function () {
			if ($stateParams.title != '') {
				$('.lineshop-check a #1').html($stateParams.title);
			} else {
				console.log('test');
			}
		}, 200)
		//选择分类后商品列表
		$scope.filtershops = function (classid, title) {
			$scope.classgoods = false;
			//            console.log(classid);
			$scope.classname = classid;
			if (classid == '') {
				$('.lineshop-check a #1').html('全部');
				$('.linshops-class ul li:first').addClass('red').siblings().removeClass('red');
			} else {
				$('.lineshop-check a #1').html(title);
				$('.linshops-class ul #' + classid).addClass('red').siblings().removeClass('red');
			}
			Home.fetchShops(1, 0, 0, $scope.classname, '', $scope.sortname).then(function (response) {
				console.log(response.data);
				// console.log("更新商家", data);
				// $scope.ymhPosition.status = 4;
				if (response.code == 1) {
					Message.show(response.msg);
					$scope.shops.shopsList = '';
					$scope.empty = true;
					return;
				}
				$scope.empty = false;
				$scope.shops.shopsList = response.data;
			});

		}
		$scope.cityshops = function () {
			$scope.citygoods = false;
			console.log(Storage.get("ymhPosition"));
			Home.fetchShops(1, $scope.ymhPosition.lat, $scope.ymhPosition.lng, $scope.classname, '', $scope.sortname).then(function (response) {
				console.log(response.data);
				// console.log("更新商家", data);
				// $scope.ymhPosition.status = 4;
				if (response.code == 1) {
					Message.show(response.msg);
					$scope.shops.shopsList = '';
					$scope.empty = true;
					return;
				}
				$scope.empty = false;
				$scope.shops.shopsList = response.data;
			});
		}
		$scope.choshow = function (ids) {
			$('.lineshop-check a span').removeClass('redbordown');
			$('.lineshop-check #' + ids).addClass('redbordown');
			if (ids == '1') {
				$scope.classgoods = true;
				console.log($scope.linecateList);
				angular.forEach($scope.linecateList, function (objs) {
					if ($('.lineshop-check a #1').html() == objs.title) {
						console.log(objs.id);
						$timeout(function () {
							console.log($('#' + objs.id));
							$('#' + objs.id).addClass('red').siblings().removeClass('red');

						}, 200)

					}
				})
			}
			if (ids == '2') {
				$scope.sortgoods = true;
			}
			if (ids == '3') {
				$scope.citygoods = true;
				console.log(Storage.get("ymhPosition"));
				//				$scope.newposition = Storage.get("ymhPosition");
			}
		}
		$scope.gogood = function (sortid) {
			$scope.sortname = sortid;
			$scope.sortgoods = false;
			Home.fetchShops(1, 0, 0, $scope.classname, '', $scope.sortname).then(function (response) {
				console.log(response.data);
				// console.log("更新商家", data);
				// $scope.ymhPosition.status = 4;
				if (response.code == 1) {
					Message.show(response.msg);
					$scope.shops.shopsList = '';
					$scope.empty = true;
					return;
				}
				$scope.empty = false;
				$scope.shops.shopsList = response.data;
			});
		}
		// 首页搜索功能
		$scope.search = function () {
			$state.go('my.offlinesearch');
			//			Home.goCategory($scope.keywords);
		};
		//		$scope.ymhPosition = {
		//			"status": 1
		//		};
		//1：定位失败，2：定位中，3：定位成功, 4：并获取到更新
		// 获取首页商家
		//		$scope.$on('shops.list.update', function(event, data) {
		//			Home.fetchShops(data.page, data.lat, data.lng).then(function(response) {
		//				// console.log("更新商家", data);
		//				$scope.ymhPosition.status = 4;
		//			if(response.code == 1) {
		//				Message.show(response.msg);
		//				$scope.shops.shopsList='';
		//				$scope.empty=true;
		//				return;
		//			}
		//			$scope.empty=false;
		//			$scope.shops.shopsList = response.data;
		//			});
		//		});
		// 列表下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			if (Storage.get("ymhPosition") === null) {
				var geolocationOption = {
					timeout: 5000,
					maximumAge: 10000,
					enableHighAccuracy: false
				};
				$scope.ymhPosition.status = 2;
				Message.loading("定位中……");
				$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function (position) {
					$scope.ymhPosition.lat = position.coords.latitude;
					$scope.ymhPosition.lng = position.coords.longitude;
					//alert($scope.ymhPosition.lat);
					//				alert($scope.ymhPosition.lng);
					Lbs.getCity(function (respond) {
						if (respond.code == 0) {
							$scope.ymhPosition.city = respond.data;
							$scope.ymhPosition.status = 3;
							Storage.set("ymhPosition", $scope.ymhPosition);
							$scope.$broadcast('shops.list.update', $scope.ymhPosition);
						} else {
							$scope.ymhPosition.status = 1;
							Message.show(respond.msg);
						}
					},
						function () {
							$scope.ymhPosition.status = 1;
							Message.show("定位失败，请手动选择当前城市");
						}, $scope.ymhPosition);
				}, function (err) {
					$scope.ymhPosition.status = 1;
					//Message.show('定位失败，请在左上角手动选择当前城市！', 1000);
					console.info(err);
					return false;
				})
			} else {
				$scope.ymhPosition.status = 3;
				$scope.ymhPosition.city = Storage.get("ymhPosition").city;
				$scope.ymhPosition.lat = Storage.get("ymhPosition").lat;
				$scope.ymhPosition.lng = Storage.get("ymhPosition").lng;
				$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				//校正历史定位
				$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function (position) {
					var newPosition = {};
					newPosition.lat = position.coords.latitude;
					newPosition.lng = position.coords.longitude;
					Lbs.getCity(function (respond) {
						if (respond.code == 0) {
							newPosition.city = respond.data;
							if (newPosition.city !== "" && newPosition.city != $scope.ymhPosition.city) {
								//提示切换位置  弹窗
								$ionicPopup.confirm({
									template: '当前城市为：' + newPosition.city + '是否切换？',
									buttons: [{
										text: '取消',
										onTap: function () {
											return false;
										}
									}, {
										text: '确定',
										type: 'button-calm',
										onTap: function () {
											$scope.ymhPosition.status = 3;
											$scope.ymhPosition.city = newPosition.city;
											$scope.ymhPosition.lat = newPosition.lat;
											$scope.ymhPosition.lng = newPosition.lng;
											Storage.set("ymhPosition", $scope.ymhPosition);
											$scope.$broadcast('shops.all.update', $scope.ymhPosition);
											return true;
										}
									}]
								});
							}
							$scope.ymhPosition.status = 3;
							$scope.ymhPosition.city = newPosition.city;
							$scope.ymhPosition.lat = newPosition.lat;
							$scope.ymhPosition.lng = newPosition.lng;
							Storage.set("ymhPosition", $scope.ymhPosition);
							$scope.$broadcast('shops.list.update', $scope.ymhPosition);
							//							if(Lbs.calcDistance($scope.ymhPosition, newPosition) > 500) {
							//								$scope.ymhPosition.status = 3;
							//								$scope.ymhPosition.city = newPosition.city;
							//								$scope.ymhPosition.lat = newPosition.lat;
							//								$scope.ymhPosition.lng = newPosition.lng;
							//								Storage.set("ymhPosition", $scope.ymhPosition);
							//								$scope.$broadcast('shops.list.update', $scope.ymhPosition);
							//							}
						}
					}, function () {
						console.info(err);
					}, newPosition);
				}, function (err) {
					console.info(err);
					return false;
				});
			};
			Home.fetchShops(1, $scope.ymhPosition.lat, $scope.ymhPosition.lng, $scope.classname, '', $scope.sortname).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					Message.show(response.msg);
					$scope.shops.shopsList = '';
					$scope.empty = true;
					return;
				} else {
					$scope.empty = false;
					$scope.shops.shopsList = response.data;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			});

			Home.getlinecatelist().then(function (response) {
				if (response.code == 1) {
					Message.show(response.msg);
					$scope.linecateList = response.data;
					return;
				}
				$scope.linecateList = response.data;
			});
			$scope.noMore = true;
			$scope.page = 2;
		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			Home.fetchShops($scope.page, $scope.ymhPosition.lat, $scope.ymhPosition.lng, $scope.classname, '', $scope.sortname).then(function (data) {
				$scope.page++;
				$scope.shops.shopsList = $scope.shops.shopsList.concat(data.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (data.code == 0 && data.data == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};

		// 选择城市modal
		$ionicModal.fromTemplateUrl('templates/modal/location.html', {
			scope: $scope
			//			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.citySelectModal = modal;
		});
		Area.getcityList(function (data) {
			$scope.cityList = data;
		});
		$scope.openModal = function () {
			$scope.citySelectModal.show();
			//			$http.get('data/city.json').success(function(data) {
			//				$scope.cityList = data;
			//				$scope.citySelectModal.show();
			//			});
		};

		// 锚点跳转
		$scope.quickSelect = function (x) {
			$location.hash(x);
			$anchorScroll();
			$ionicScrollDelegate.$getByHandle('citySelectScroll').resize();
		};
		// 选择市
		$scope.selectCity = function (city) {
			Home.getSearchCity(city).then(function (response) {
				Message.hidden();
				if (response.code == 1) {
					Message.show(response.msg);
					return;
				}
				$scope.shops.shopsList = response.data;
				$scope.ymhPosition.status = 3;
				$scope.ymhPosition.city = city;
				//noinspection JSUnresolvedVariable
				$scope.ymhPosition.lat = response.data.latlng.lat;
				$scope.ymhPosition.lng = response.data.latlng.lng;
				Storage.set("ymhPosition", $scope.ymhPosition);
				console.log(Storage.get("ymhPosition"));
				$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
				$ionicSlideBoxDelegate.update();
			});
			$scope.citySelectModal.hide();
		};
	})
	.controller('onlineCtrl', function ($window, $rootScope, $timeout, $scope, $ionicHistory, Poor, $cordovaGeolocation, Area, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, $http, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, Lbs, $ionicPopup, Storage, $cordovaInAppBrowser, System, Article, Good) {
		$scope.$on("$ionicView.beforeEnter", function () {
			//			Message.loading('加载中……');
			//			if(window.localStorage.getItem("didIntro")=== null){
			//			Poor.getFirstBanner().then(function(response) {
			//				$state.go('poorson.introPage');
			//			$scope.info = response.data;
			//			if($scope.info) {
			//				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			//				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(false);
			//				Message.hidden();
			//			}
			//		})
			// }
			Home.getnounDict();
			Home.getnoticelist().then(function (response) {
				$scope.noticelist = response.data;
				$timeout(function () {
					var notice_swiper = new Swiper("#notice_swiper", {
						direction: "vertical",
						autoplay: 2000, //可选选项，自动滑动,
						loop: true,
						slidesPerView: "auto",
						loopedSlides: 6
					});
				}, 0)
			})
		});

		$scope.ymhPosition = {
			status: '',
			lng: '',
			lat: '',
			city: ''
		}
		document.addEventListener("deviceready", function () {
			if (Storage.get("ymhPosition") === null) {
				$scope.ymhPosition.status = 2;
				Message.loading("定位中……");
				baidumap_location.getCurrentPosition(function (result) {
					$scope.ymhPosition.lat = result.latitude;
					$scope.ymhPosition.lng = result.longitude;
					$scope.ymhPosition.city = result.city;
					$scope.ymhPosition.status = 3;
					Storage.set("ymhPosition", $scope.ymhPosition);

				}, function (error) {
					//	Message.show('定位失败。请手动选择城市')
					//                    alert(JSON.stringify(error)+'Last');
				});
			}
		}, false)

		$scope.goSearch = function () {
			$state.go('my.onlinesearch');
		}
		$scope.goqianDao = function () {
			$state.go('user.qiandao');
		}

		$scope.showMsg = function () {
			$rootScope.globalInfo.noticeNum = 0;
			// Storage.set("noticeNum", $rootScope.globalInfo);
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		// 初始化页面数据
		$scope.keywords = '';
		// 加载首页幻灯和导航
		Message.loading('加载中……');
		Home.onlinefetchShops(1, 0, 0).then(function (response) {
			Message.hidden();
			console.log(response);
			if (response.code == 1) {
				Message.show(response.msg);
				return;
			}
			$scope.shops = {
				slide: response.data.slide,
				shopsList: response.data.shops
			};
			if ($scope.shops.slide) {
				$ionicSlideBoxDelegate.$getByHandle().update();
				$ionicSlideBoxDelegate.loop(true);
			}
		});
		//热卖
		$scope.type = 1;
		Home.onlinefetchgoods($scope.type).then(function (response) {
			console.log(response);
			if (response.code == 1) {
				Message.show(response.msg);
			} else {
				$scope.goods = response.data.goods;
			}
		});
		Home.getnoticelist().then(function (response) {
			$scope.noticelist = response.data;
			$timeout(function () {
				var notice_swiper = new Swiper("#notice_swiper", {
					direction: "vertical",
					autoplay: 2000, //可选选项，自动滑动,
					loop: true,
					slidesPerView: "auto",
					loopedSlides: 6
				});
			}, 0)
		})
		Home.getHomeRec().then(function (res) {
			$scope.recInfo = res.data;
			Message.hidden();
		});


		$scope.$on("$ionicView.afterLeave", function () {
			console.log('leave')
			$('.tab_online_one').css({
				'display': 'block'
			})
			$('div.usetop').removeClass('addstyle');
			$('.tab_online_change').removeClass('addstyle180');
			$('.tab_online_change').removeClass('addstyle84');
		})
		//		$scope.$on("$ionicView.beforeLeave", function() {
		//			console.log('1leave')
		//		})
		//		$scope.$on("$ionicView.afterLeave", function() {
		//			console.log('2leave')
		//		})


		$scope.flag = false;
		$scope.navid = 0;
		$scope.curCateIndex = -1


		$scope.switchNav = function (id, curCateIndex) {
			$ionicScrollDelegate.$getByHandle('goodsList-scroll').scrollTop();		
			$scope.calcScrollHeight(function(){
				$ionicScrollDelegate.$getByHandle('content-scroll').scrollBy(0, $scope.fixPoint,true);
				$('#ion-scroll').css('height', $scope.scrollHeight + 'px')
			})

			if (curCateIndex >= 0 || curCateIndex == -1) {
				$scope.curCateIndex = curCateIndex
				console.log(curCateIndex)
			}
			$scope.navid = id;
			$scope.navListid = id;
			
			console.log($scope.navid)
			console.log(id)
			if (id == 0) {
				Home.onlinefetchgoods($scope.type, 1).then(function (response) {
					console.log('1073')
					console.log(response);
					if (response.code == 1) {
						Message.show(response.msg);
					} else {
						$scope.goods = response.data.goods;
					}
				});
			} else {
				Good.getonGoodsList(id, $scope.type, '', 1).then(function (response) {
					console.log('1084')
					console.log(response)
					$scope.goods = response.data;
				});
			}
			$scope.noMore = true;
			$scope.page = 2;
			$timeout(function () {
				console.log('456456165')
				$scope.noMore = false;
			}, 1000)

			// var numbers = $('.cate-online-scroll').offset().top;
			// console.log(numbers)
			// if(numbers >55) {
			// 	$('.tab_online_one').css({
			// 		'display': 'none'
			// 	})
			// 	$('div.usetop').addClass('addstyle');
			// }
			// if(id == 0) {
			// 	$('.tab_online_change').removeClass('addstyle180');
			// 	$('.tab_online_change').addClass('addstyle84');
			// } else {
			// 		$('.tab_online_change').addClass('addstyle180');
			// 	$('.tab_online_change').removeClass('addstyle84');
			// }


			// $('#ion-scroll').css('height',$scope.scrollHeight+'px')
		}



		$scope.switchNavList = function (id) {
			$scope.noMore = true;
			$scope.page = 2;
			console.log(id)
			$scope.navListid = id;
			Good.getonGoodsList(id, $scope.type, '', 1).then(function (response) {
				console.log('1084')
				console.log(response)
				$scope.goods = response.data;
			});
		}
		// 下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			var lastHeight=-10;
			Home.onlinefetchShops(1, 0, 0).then(function (response) {
				console.log(response);
				if (response.code == 1) {
					Message.show(response.msg);
					return;
				}
				$scope.shops = {
					slide: response.data.slide,
					shopsList: response.data.shops
				};
				if ($scope.shops.slide) {
					$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
					$ionicSlideBoxDelegate.loop(true);
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '2000'
				});
			});
			//			Home.onlinefetchgoods($scope.type).then(function(response) {
			//				console.log(response);
			//				if(response.code == 1) {
			//					Message.show(response.msg);
			//					$scope.goods = response.data.goods;
			//				} else {
			//					$scope.goods = response.data.goods;
			//				}
			//			});
			$scope.noMore = true;
			$scope.page = 2;

		};
		$scope.goodsType = {
			0: '【淘宝】',
			1: '【天猫】',
			2: '【亿民惠】'
		}
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			if($scope.noMore){
				if ($scope.navid == 0) {
					Home.onlinefetchgoods($scope.type, $scope.page).then(function (response) {
						$scope.page++;
						if (response.data != '') {
							$scope.goods = $scope.goods.concat(response.data.goods);
						}
						$scope.$broadcast('scroll.infiniteScrollComplete');
						if (response.code != 0) {
							$ionicLoading.show({
								noBackdrop: true,
								template: '没有更多商品了！',
								duration: '1200'
							});
							$scope.noMore = false;
						}
					});
				} else {
					Good.getonGoodsList($scope.navListid, $scope.type, '', $scope.page).then(function (response) {
						console.log('1084')
						$scope.page++;
						console.log(response)
						$scope.goods = $scope.goods.concat(response.data);
						$scope.$broadcast('scroll.infiniteScrollComplete');
						if (response.code != 0) {
							$ionicLoading.show({
								noBackdrop: true,
								template: '没有更多商品了！',
								duration: '1200'
							});
							$scope.noMore = false;
						}
					});
	
				}
			}
			

   
		};
		$scope.active = function (id) {
			$scope.calcScrollHeight(function(){
				$ionicScrollDelegate.$getByHandle('content-scroll').scrollBy(0, $scope.fixPoint,true);
				$('#ion-scroll').css('height', $scope.scrollHeight + 'px')
			})
			$scope.noMore = false;
			console.log($scope.type)
			if (id == '') {
				if ($scope.type == 3 || $scope.type == 4) {
					console.log($scope.type)
					if ($scope.type == 3) {
						console.log($scope.type)
						$scope.type = 4
					} else {
						$scope.type = 3
					}
				} else {
					$scope.type = 3
				}
			} else {
				$scope.type = id;
			}
			console.log($scope.type)

			if ($scope.navid == 0) {
				Home.onlinefetchgoods($scope.type, 1).then(function (response) {
					console.log('1084')
					console.log(response)
					$scope.goods = response.data.goods;
				});
			} else {
				Good.getonGoodsList($scope.navListid, $scope.type, '').then(function (response) {
					console.log(response)
					$scope.goods = response.data;
				});
			}
			$timeout(function () {
				$scope.noMore = true;
			}, 1000)
		}

		$scope.scrollHeight = 0
		$scope.calcScrollHeight = function (callback) {
			$timeout(function () {
				console.log($('ion-header-bar'))
				$scope.fixPoint = parseInt($('#cate-online-scroll').offset().top) - parseInt($('ion-header-bar').eq(0).css('height'))
				var h1 = parseInt($('.online_nav_list').eq(0).css('height'))
				var h2 = parseInt($('.onlineshops-serch').eq(0).css('height'))
				var h3 = parseInt($('.tab-nav').eq(0).css('height'))
				var h4 = parseInt($('ion-header-bar').eq(0).css('height'))
				$scope.scrollHeight = parseInt($('html').css('height')) - (h1 + h2 + h3 + h4)
				console.log($scope.scrollHeight)
				if(callback){
					$timeout(function(){
						callback()
					},50)			
				}		
			}, 100)
		}
//		  setInterval(function(){
//		  	console.log($('#cate-online-scroll').offset().top)
//		  	console.log($('#ion-scroll').offset().top)
//		console.log($('.goodsList_online').offset().top)
//		  	console.log($ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top)
//		  },1000)
          var lastcateHeight=300;
		$scope.onScroll = function () {
				console.log($('ion-header-bar').height())
			if ($('#cate-online-scroll').offset().top < 46) {
//				alert($('#ion-scroll').css('overflow-y'));
				$scope.noMore = true;
				$('#ion-scroll').css('height', $scope.scrollHeight + 'px')
                $('#ion-scroll').css('overflow-y', 'scroll');
//              lastcateHeight=	$('#cate-online-scroll').offset().top;
			} else {
				console.log($('#ion-scroll').css('overflow-y'))
				$scope.noMore = false;
				$('#ion-scroll').css('height', 'auto')
				 $('#ion-scroll').css('overflow-y', 'hidden');
//				lastcateHeight=	$('#cate-online-scroll').offset().top;
//				if($ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top<=lastHeight&&$ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top==0){
//					$('#ion-scroll').css('overflow-y', 'hidden');
//					lastHeight=0;
//				}else{
//					lastHeight=$ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top;
//				}
//              $('#ion-scroll').css('overflow-y', 'hidden');
//              lastcateHeight=	$('#cate-online-scroll').offset().top;
// 				 if($('#cate-online-scroll').offset().top<=lastcateHeight){
// //				 	$('#ion-scroll').css('overflow-y', 'hidden');
// //				 	if($('#cate-online-scroll').offset().top<=100){
// 				 	$('#ion-scroll').css('overflow-y', 'scroll');
// //				 	}
// 				 	lastcateHeight=	$('#cate-online-scroll').offset().top;
// 				 }else{
// 				 	$('#ion-scroll').css('overflow-y', 'hidden');
// 				 	lastcateHeight=	$('#cate-online-scroll').offset().top;
// 				 }
// 			}
		}
		}
//		document.addEventListener("deviceready", function() {
////			alert(device.model) R7plus
////			alert(device.manufacturer) oppo
//		},false)
		var lastHeight=-10;
		$scope.godslistScroll=function(){
			  // 				$('#ion-scroll').css('overflow-y', 'scroll');
   				//添加测试
			 if($ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top>lastHeight){
				$('#ion-scroll').css('overflow-y', 'scroll');
				lastHeight=$ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top;
//                 alert($ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top)
			 }else if($ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top<=lastHeight&&$ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top<10){
				$('#ion-scroll').css('overflow-y', 'hidden');
				lastHeight=$ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top;
			}
		}
		$scope.downFun=function(){
			console.log('456')
			if($ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top==0){
				lastHeight=$ionicScrollDelegate.$getByHandle('goodsList-scroll').getScrollPosition().top;
				var num=  $('#ion-scroll').height() -20
//              $('#ion-scroll').animate({height:num},'50');
				$('#ion-scroll').css('overflow-y', 'hidden');
				$('#ion-scroll').css('height',num)
			}
		}
		$scope.calcScrollHeight()

	})
	// 商家搜索列表
	.controller('shopsCategoryCtrl', function ($scope, Home, $stateParams, Message, $ionicLoading) {
		$scope.keywords = $stateParams.keywords;
		$scope.pageData = {
			shopsList: ''
		};
		Home.categoryList($scope.keywords).then(function (data) {
			Message.hidden();
			$scope.pageData.shopsList = data;
		});
		$scope.searchShop = function () {
			Home.goCategory($scope.keywords);
		};
		// 下拉刷新
		$scope.doRefresh = function () {
			$scope.refreshing = true;
			Home.categoryList($scope.keywords).then(function (data) {
				$scope.pageData.shopsList = data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			})
		};
		// 上拉加载更多
		$scope.page = 2;
		$scope.noMore = true;
		$scope.loadMoreGoods = function () {
			$scope.refreshing = false;
			Home.categoryList($scope.keywords, $scope.page).then(function (data) {
				$scope.page++;
				$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (data.code != 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			})
		}
	})
	.controller('onlineshopgoodscateCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Good) {
		console.log($stateParams);
		//$scope.pageMsg.titleArr._class={featuredList:''};
		//		Home.fetchnav().then(function(response) {
		//			$scope.pageMsg.titleArr._class = response.data; //分类
		//			console.log($scope.pageMsg.titleArr._class);
		//			Message.hidden();
		//		});
		$scope.spid = $stateParams.spid;
		Shop.onshopsCateList($stateParams.spid).then(function (response) {
			console.log(response);
			$scope.cateslist = response.data;
		})
	})
	.controller('online-goodscateCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Good) {
		console.log($stateParams);
		//$scope.pageMsg.titleArr._class={featuredList:''};
		//		Home.fetchnav().then(function(response) {
		//			$scope.pageMsg.titleArr._class = response.data; //分类
		//			console.log($scope.pageMsg.titleArr._class);
		//			Message.hidden();
		//		});
		$scope.recom = true;
		$scope.goodsremCate = {};
		console.log($stateParams);
		//		Good.getrecomCate().then(function(response){
		//			console.log(response);
		//			$scope.recomList=response.data;
		//		});
		$scope.getrecom = function () {
			$scope.recom = true;
			$('.goodsList-classify li').removeClass('clickchange');
			$('.goodsList-classify li:first').addClass('clickchange');
			//			$scope.recomList=$scope.goodsremCate;
		};
		$scope.goodsCate = {};
		Good.getCateList().then(function (response) {
			console.log(response);
			$scope.recomList = response.data.rec;
			$scope.goodsCate = response.data.cate;
		})
		//点击商品列表
		$scope.getClassify = function (id) {
			$scope.recom = false;
			console.log(id);
			$('.goodsList-classify li').removeClass('clickchange');
			$('.goodsList-classify #p' + id).addClass('clickchange');
			if (id == '' || id == null) {
				$('.goodsList-classify li:first').addClass('clickchange');
			}
			angular.forEach($scope.goodsCate, function (obj) {
				if (id == obj.id) {
					$scope.goodstwocate = obj;
					console.log($scope.goodstwocate);
				}
			})
			$('.goodsList-classify li').removeClass('clickchange');
			$('.goodsList-classify #p' + id).addClass('clickchange');
			if (id == '' || id == null) {
				$('.goodsList-classify li:first').addClass('clickchange');
			}
		};
	})
	.controller('activegoodslistCtrl', function ($rootScope, $ionicLoading, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Good) {
		console.log($stateParams);
		$scope.goodsList = {};
		$scope.types = $stateParams.types;
		$scope.showtypes = '';
		$scope.keywords = '';
		$scope.empty = false;
		Good.getactivegoodsList($stateParams.types, 1, 1).then(function (response) {
			console.log(response);
			if (response.code == 1) {
				$scope.empty = true;
				return
			}
			$scope.goodsList = response.data;
		});
		$scope.searchgoods = function () {
			$scope.keywords = $('.onlineshops-serch input').val();
			console.log($scope.keywords);
			Good.getactivegoodsList($stateParams.types, 1, $scope.showtypes, $scope.keywords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodsList = response.data;
					return;
				}
				$scope.empty = false;
				$scope.goodsList = response.data;
			});
		};
		$scope.showchoo = function (showtypes) {
			$scope.showtypes = showtypes;
			$('.onlineshops-serch dd ').children().removeClass('red');
			$('.onlineshops-serch dd a').children().removeClass('red');
			$('.onlineshops-serch dd a b').children().removeClass('red');
			$('#' + showtypes).addClass('red');
			Good.getactivegoodsList($stateParams.types, 1, $scope.showtypes, $scope.keywords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodsList = response.data;
					return;
				}
				$scope.empty = false;
				$scope.goodsList = response.data;
			});
		};
		$scope.showchoo1 = function () {
			if ($scope.showtypes == '3') {
				$scope.showtypes = 4;
				$('.priceshow  b i:nth-child(2n)').addClass('red');
				$('.priceshow  b i:nth-child(2n+1)').removeClass('red');
			} else if ($scope.showtypes == '4') {
				$scope.showtypes = 3;
				$('.priceshow  b i:nth-child(2n)').removeClass('red');
				$('.priceshow  b i:nth-child(2n+1)').addClass('red');
			} else {
				$scope.showtypes = 3;
				$('.onlineshops-serch dd ').children().removeClass('red');
				$('.onlineshops-serch dd a').children().removeClass('red');
				$('.onlineshops-serch dd a b').children().removeClass('red');
				$('.priceshow span').addClass('red');
				$('.priceshow  b i:first').addClass('red');
			}
			Good.getactivegoodsList($stateParams.types, 1, $scope.showtypes, $scope.keywords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodsList = response.data;
					return;
				}
				$scope.empty = false;
				$scope.goodsList = response.data;
			});
		};
		$scope.levleName = {
			1: '',
			2: '品牌店'
		};
		$scope.goodsType = {
			0: '【淘宝】',
			1: '【天猫】',
			2: '【亿民惠】'
		}
		//	 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Good.getactivegoodsList($stateParams.types, $scope.page, $scope.showtypes, $scope.keywords).then(function (response) {
				$scope.page++;
				$scope.goodsList = $scope.goodsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 1) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多订单了！',
						duration: '1200'
					});
				}
			});

		};
	})
	.controller('goodslist-onlineCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Good, User, $ionicLoading) {
		$scope.screentype = '1';
		$scope.keywords = '';
		$scope.goodsList = {};
		Good.getonGoodsList($stateParams.id, $scope.screentype, '').then(function (response) {
			$scope.goodsList = response.data;
		});
		$('#onlineSearchK').val();
		$scope.orderEmpty = false;
		$scope.goSearch = function () {
			$scope.keywords = $('#onlineSearchK').val()
			Good.getonGoodsList($stateParams.id, $scope.screentype, $scope.keywords).then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					//					$scope.goodsList = response.data;
				} else {
					$scope.orderEmpty = false;
					$scope.goodsList = response.data;
				}
			});
			$state.go('my.onlinesearch')
		}
		$scope.active = function (id) {
			$scope.screentype = id;
			Good.getonGoodsList($stateParams.id, $scope.screentype, $scope.keywords).then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodsList = response.data;
				}

			});
		};
		$scope.showPrice = function () {
			if ($scope.screentype == 3 || $scope.screentype == 4) {
				if ($scope.screentype == 3) {
					$scope.screentype = 4
				} else {
					$scope.screentype = 3
				}
			} else {
				$scope.screentype = 3
			}
			Good.getonGoodsList($stateParams.id, $scope.screentype, $scope.keywords).then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodsList = response.data;
				}

			});
		};

		//	 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			Good.getonGoodsList($stateParams.id, $scope.screentype, $scope.keywords, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodsList = $scope.goodsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 1) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});
				}

			});
		};
		$scope.goodsType = {
			0: '【淘宝】',
			1: '【天猫】',
			2: '【亿民惠】'
		}

		// 收藏商品
		$scope.collectGoods = function (goodsType, goodsInfo, $event) {

			$event.stopPropagation();
			if (goodsType == 0 || goodsType == 1) {
				User.taoCollect(goodsInfo.isCollect, goodsInfo.id).then(function (res) {
					goodsInfo.isCollect = res.data
				});
			} else {
				User.getcollect(goodsInfo.isCollect, '', goodsInfo.id).then(function (response) {
					goodsInfo.isCollect = response.data.type_collect;
				})
			}
		}
	})
	.controller('goodslist-cateCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Good, $ionicLoading) {
		console.log($stateParams)
		$scope.title = $stateParams.title;
		$scope.cateindex = 0;
		Home.getHomeRec().then(function (res) {
			console.log(res)
			$scope.recInfo = res.data.goodsCate;
			$scope.navid = res.data.goodsCate[0].id;
			Message.hidden();
			Good.getcateGoodsList($stateParams.type, $scope.navid).then(function (response) {
				$scope.goodsList = response.data;
			});
		});
		$scope.orderEmpty = false;
		$scope.switchNav = function (id, index) {

			console.log(index)
			console.log($scope.recInfo[index].banner)
			$scope.navid = id;
			$scope.cateindex = index;
			
			
			Good.getcateGoodsList($stateParams.type, id).then(function (response) {
				console.log(response)
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodsList = response.data;
					$scope.noMore = true;
					$scope.page = 2;
				}
			});
		};
		//	 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			Good.getcateGoodsList($stateParams.type, $scope.navid, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodsList = $scope.goodsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 1) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});
				}
			});
		};
		$scope.goodsType = {
			0: '【淘宝】',
			1: '【天猫】',
			2: '【亿民惠】'
		}
	})
	.controller('onlineshopsCtrl', function ($rootScope, $scope, Storage, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, User, $ionicActionSheet, $window, $state, $cordovaInAppBrowser, $ionicLoading) {
		$scope.$on("$ionicView.beforeEnter", function () {
			console.log($stateParams);
			$scope.isCollect = 0;
			if ($rootScope.globalInfo.user.uid) {
				Shop.iscollect($stateParams.spid, $rootScope.globalInfo.user.uid).then(function (response) {
					if (response.data == 1) {
						$scope.isCollect = 1;
					}
				})
			}
		})
		$scope.empty = false;
		$scope.gocollect = function () {
			User.getcollect($scope.isCollect, $stateParams.spid).then(function (response) {
				$scope.isCollect = response.data.type_collect;
			})
		}
		$scope.types = '1';
		$scope.keyword = '';
		Home.onlineshopsinfo(1, $stateParams.spid).then(function (response) {
			console.log(response.data);
			if (response.code == 1) {
				Message.show(response.msg);
				return;
			}
			$scope.shopsinfo = response.data;
		});
		$scope.keyword = $('#shopSearchK').val();
		Home.onlineshopgood(1, $stateParams.spid, $scope.types, $scope.keyword, $stateParams.cid).then(function (response) {
			console.log(response.data);
			if (response.code == 1) {
				Message.show(response.msg);
				$scope.empty = true;
				$scope.goodList = response.data.goods;
				return;
			}
			$scope.empty = false;
			$scope.goodList = response.data.goods;
		});

		$scope.showchoo = function (types) {
			$scope.keyword = $('#shopSearchK').val();
			$scope.types = types;
			$('.onlineshops-serch dd ').children().removeClass('red');
			$('.onlineshops-serch dd a').children().removeClass('red');
			$('.onlineshops-serch dd a b').children().removeClass('red');
			$('#' + types).addClass('red');
			Home.onlineshopgood(1, $stateParams.spid, $scope.types, $scope.keyword, $stateParams.cid).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodList = response.data.goods;
					return;
				}
				$scope.empty = false;
				$scope.goodList = response.data.goods;
			});
		};
		$scope.showchoo1 = function () {
			$scope.keyword = $('#shopSearchK').val();
			if ($scope.types == '2') {
				$scope.types = 3;
				$('.priceshow  b i:nth-child(2n)').addClass('red');
				$('.priceshow  b i:nth-child(2n+1)').removeClass('red');
			} else if ($scope.types == '3') {
				$scope.types = 2;
				$('.priceshow  b i:nth-child(2n)').removeClass('red');
				$('.priceshow  b i:nth-child(2n+1)').addClass('red');
			} else {
				$scope.types = 2;
				$('.onlineshops-serch dd ').children().removeClass('red');
				$('.onlineshops-serch dd a').children().removeClass('red');
				$('.onlineshops-serch dd a b').children().removeClass('red');
				$('.priceshow span').addClass('red');
				$('.priceshow  b i:first').addClass('red');
			}
			Home.onlineshopgood(1, $stateParams.spid, $scope.types, $scope.keyword, $stateParams.cid).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodList = response.data.goods;
					return;
				}
				$scope.empty = false;
				$scope.goodList = response.data.goods;
			});
		};
		$scope.showchoo2 = function () {
			$scope.keyword = $('#shopSearchK').val();
			if ($scope.types == '4') {
				$scope.types = 5;
				$('.lovesshow  b i:nth-child(2n)').addClass('red');
				$('.lovesshow  b i:nth-child(2n+1)').removeClass('red');
			} else if ($scope.types == '5') {
				$scope.types = 4;
				$('.lovesshow  b i:last-child').removeClass('red');
				$('.lovesshow  b i:nth-child(2n+1)').addClass('red');
			} else {
				$scope.types = 4;
				$('.onlineshops-serch dd ').children().removeClass('red');
				$('.onlineshops-serch dd a').children().removeClass('red');
				$('.onlineshops-serch dd a b').children().removeClass('red');
				$('.lovesshow span').addClass('red');
				$('.lovesshow  b i:nth-child(2n+1)').addClass('red');
			}

			Home.onlineshopgood(1, $stateParams.spid, $scope.types, $scope.keyword, $stateParams.cid).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodList = response.data.goods;
					return;
				}
				$scope.empty = false;
				$scope.goodList = response.data.goods;
			});
		};
		$scope.levelName = {
			'1': '个人店',
			'2': '品牌店',
		};
		//客服
		$scope.contactserve = function () {
			//				var	qqhtml="<a target='_blank' style='color:#007aff;' href='http://wpa.qq.com/msgrd?v=3&uin="+$scope.goodsdetail.shops.QQ+"&site=qq&menu=yes'>QQ客服</a>";
			//				var	qqhtml='<a target="_blank" style="color:#007aff;"  href="http://wpa.qq.com/msgrd?v=3&uin='+$scope.goodsdetail.shops.QQ+'&site=qq&menu=yes">QQ客服</a>';
			var qqurl = "http://wpa.qq.com/msgrd?v=3&uin=" + $scope.shopsinfo.list.QQ + "&site=qq&menu=yes";
			var buttons = [];
			buttons = [{
				text: $scope.shopsinfo.list.tel,

			}, {
				text: "帮助中心"
			}, {
				text: "在线咨询"
			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.callPhone($scope.shopsinfo.list.tel);
					} else if (index == 1) {
						$state.go('my.helplist');
					} else if (index == 2) {
						$scope.noMore = false;

						$state.go('user.imMessagePerson', {
							username: $scope.shopsinfo.list.userMobile
						})
					}
					return true;
				}
			})
		};
		$scope.getqq = function (qqurl) {
			console.log(qqurl);
			//			 $window.location.href = qqurl;
			document.addEventListener("deviceready", function () {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'
				};
				$cordovaInAppBrowser.open(qqurl, '_system', options)
					.then(function (event) {
						console.log(event)
					})
					.catch(function (event) {
						console.log(event)
					});
			}, false);
		}
		$scope.callPhone = function (mobilePhone) {
			console.log("拨打:" + mobilePhone);
			$window.location.href = "tel:" + mobilePhone;
		};
		$scope.shareinfo = {
			title: '',
			description: '',
			thumb: '',
			sharelink: ''
		};
		//分享
		$scope.sharechats = function (scene, title, desc, url, thumb) {
			console.log($scope.shareinfo);
			Wechat.share({
				message: {
					title: $scope.shareinfo.title,
					description: $scope.shareinfo.description,
					thumb: $scope.shareinfo.thumb,
					//     url: url ?url : "http://baidu.com"
					media: {
						type: Wechat.Type.WEBPAGE,
						webpageUrl: $scope.shareinfo.sharelink
					}
				},
				scene: scene // share to Timeline  
			}, function () {
				//								alert("Success");
			}, function (reason) {
				//								alert("Failed: " + reason);
			});
		};
		$scope.shareLink = function (title, desc, url, thumb) {
			if (Storage.get('user') && Storage.get('user').token) {
				User.sharelink().then(function (response) {
					console.log(response);
					$scope.shareinfo = response;
				});
			} else {
				$scope.shareinfo = {
					title: '亿民惠',
					description: '消费享收益',
					thumb: 'vricon.png',
					sharelink: 'http://app.chinayiminhui.com/app/index.php?i=34&c=auth&a=reg'
				};
			}
			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					'text': '分享给好友'
				},
				{
					'text': '分享到朋友圈'
				}
				],
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.sharechats(0, title, desc, url, thumb);
					} else if (index == 1) {
						$scope.sharechats(1, title, desc, url, thumb);
					}
				}

			});
			$timeout(function () {
				hideSheet();
			}, 2000);
		};
		$scope.goSearch = function () {
			$scope.keyword = $('#shopSearchK').val()
			Home.getShopSR($stateParams.spid, $scope.keyword, $scope.types).then(function (response) {
				//				console.log(response.data);
				if (response.code == 1) {
					Message.show(response.msg);
					$scope.empty = true;
					$scope.goodList = response.data.goods;
					return;
				}
				$scope.empty = false;
				$scope.goodList = response.data.goods;

			})
		}
		//下拉加载
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Home.onlineshopgood($scope.page, $stateParams.spid, $scope.types, $scope.keyword, $stateParams.cid).then(function (response) {
				$scope.page++;
				$scope.goodList = $scope.goodList.concat(response.data.goods);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data.goods == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商品了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}

			});
		};

	})

	.controller('locationCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout) {
		console.log($stateParams);
		$scope.shops = {
			shopsList: ''
		};
		//$scope.pageMsg.titleArr._class={featuredList:''};
		Home.fetchnav().then(function (response) {
			$scope.pageMsg.titleArr._class = response.data; //分类
			console.log($scope.pageMsg.titleArr._class);
			Message.hidden();
		});
		//商家系列
		Shop.getshopRebateType().then(function (response) {
			console.log(response);
			$scope.pageMsg.titleArr._chotype = response.data;
			console.log($scope.pageMsg.titleArr._chotype);
			Message.hidden();
		});
		if ($stateParams.cid) {
			$scope.y = $stateParams;
			console.log($scope.y);
		};
		Home.fetchShops(1, 0, 0, $stateParams.cid).then(function (response) {
			console.log(response.data);
			// console.log("更新商家", data);
			// $scope.ymhPosition.status = 4;
			if (response.code == 1) {
				Message.show(response.msg);
				return;
			}
			$scope.shops.shopsList = response.data;
		});
		$scope.pageInfo = {
			data: {}
		};
		$scope.method = {
			show: {},
			get: {},
			back: null, //返回按钮
			goIndex: null,
			loadMore: null,
			reLoad: null
		}; //页面方法
		/*页面中需要的值*/
		$scope.pageMsg = {
			titleShow: {
				_sort: '排序',
				_class: '分类',
				_city: '附近',
				_chotype: '筛选'
			},
			titleArr: {
				_sort: [{
					id: 1,
					title: '排序'
				}, {
					id: 2,
					title: '好评'
				}, {
					id: 3,
					title: '关注'
				},
				{
					id: 4,
					title: '人气'
				}
				],
				_class: {},
				_city: {},
				//				_city: [{
				//					id: 0,
				//					title: '附近'
				//				}],
				_chotype: {}
			},
			titleId: {
				_sort: 0,
				_class: 0,
				_city: 0,
				_chotype: 0
			},
			bool: {
				_content: true,
				_sort: false,
				_class: false,
				_city: false,
				_chotype: false
			},
			loadMore: true, //下拉请求开关
			loadPage: 1,
			thisPage: -1,
			cityMsg: {},
			cityList: {
				sheng: {},
				shi: {},
				xian: {}
			},
			cityId: {
				sheng: 0,
				shi: 0,
				xian: 0
			},
			cityTitle: {
				sheng: '',
				shi: '',
				xian: ''
			}
		};
		var latLng = {};
		/*首页初始加载*/
		// Shops.shopsList(function (response) {
		//   Message.hidden();
		//   if (response.code != 0) {
		//     Message.show(response.msg);
		//   }
		//   $scope.pageMsg.titleArr._class = response.data.category; //分类
		//   $scope.pageInfo.data = response.data.shop; //列表
		// }, function (error) {
		//   Message.show('通信错误，请检查网络', 2000);
		// }); //申请数据页面加载

		function attrBool(key2, key3) { //循环遍历变成false
			angular.forEach($scope.pageMsg.bool, function (v, k) {
				if ((typeof v).toLowerCase() == 'object') {
					angular.forEach($scope.pageMsg.bool[k], function (val, key) {
						if (key3) {
							if (key == key3) {
								$scope.pageMsg.bool[k][key] = !$scope.pageMsg.bool[k][key];
							} else {
								$scope.pageMsg.bool[k][key] = false;
							}
						} else {
							$scope.pageMsg.bool[k][key] = false;
						}
					})
				} else {
					if ((typeof v).toLowerCase() == 'boolean') {
						if (k == key2) {
							$scope.pageMsg.bool[k] = !$scope.pageMsg.bool[k];
						} else {
							$scope.pageMsg.bool[k] = false;
						}
					}
					if (!key3) {
						$scope.pageMsg.bool['_content'] = true;
					}
				}
			});
		}

		$scope.method.back = function (para) {
			switch (para) {
				case 1:
					attrBool('_content');
					break;
				case 2:
					attrBool('_city', '_s');
					break;
				case 3:
					attrBool('_city', '_c');
					break;
			}
		};

		document.addEventListener("deviceready", function () {
			var posOptions = {
				timeout: 3000,
				enableHighAccuracy: false
			};
			$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {

				latLng.lat = position.coords.latitude;
				latLng.lng = position.coords.longitude;

				getList(); //请求 
				$rootScope.globalInfo.lngLat.lng = position.coords.longitude;
				$rootScope.globalInfo.lngLat.lat = position.coords.latitude;

			}, function () {
				Message.show('定位失败，请开启位置信息');
			});
		});

		/*请求公用方法*/
		function getList(type) {
			$scope.pageMsg.loadMore = false;
			if (type == 1) {
				$scope.pageMsg.loadPage++;
			} else if (type == 77) {

			} else {
				$ionicScrollDelegate.scrollTop(); //返回顶部(取消加载)
			}
			if ($scope.pageMsg.titleShow._city == '城市') {
				$scope.pageMsg.titleId._city = '';
			} else {
				$scope.pageMsg.titleId._city = $scope.pageMsg.titleShow._city;
			}

			var _json = {
				lat: latLng.lat,
				lng: latLng.lng,
				page: $scope.pageMsg.loadPage,
				sort: $scope.pageMsg.titleId._sort,
				cid: $scope.pageMsg.titleId._class,
				province: $scope.pageMsg.cityTitle.sheng,
				city: $scope.pageMsg.cityTitle.shi,
				district: $scope.pageMsg.titleShow._city
			};
			if (type == 77) { //为77时代表下拉刷新
				_json.page = 1;
			}
			Home.fetchShops(1, 0, 0, $stateParams.cid).then(function (response) {
				console.log(response.data);
				//			// console.log("更新商家", data);
				//			// $scope.ymhPosition.status = 4;
				//			if(response.code == 1) {
				//				Message.show(response.msg);
				//				return;
				//			}
				//			$scope.shops.shopsList = response.data;
				//		});
				//			 Shop.shopsList(function (response) {
				Message.hidden();
				if (response.code != 0) {

					$scope.pageMsg.loadPage--;
					if (type) {
						Message.show(response.msg);
						return;
					}
				}

				$scope.$broadcast('scroll.refreshComplete');
				if (type) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.shops.shopsList = response.data;
					//    $scope.pageInfo.data = $scope.pageInfo.data.concat(response.data.shop);
				} else {
					$scope.shops.shopsList = response.data;
					//$scope.pageInfo.data = response.data.shop;
				}

				$timeout(function () {
					$scope.pageMsg.loadMore = true;
				}, 1500);

			}, function (error) {
				Message.show('通信错误，请检查网络', 2000);
			}, _json); //申请数据页面加载
		}

		/*下拉加载*/
		$scope.method.loadMore = function () {
			getList(1);
		};

		/*上拉加载*/
		$scope.method.reLoad = function () {
			getList(77);
		};

		/*点击显示隐藏*/
		$scope.method.show._sort = function () {
			attrBool('_sort');
		};

		$scope.method.show._class = function () {
			attrBool('_class');
		};
		$scope.method.show._chotype = function () {
			attrBool('_chotype');
		};
		$scope.method.show._city = function () {
			attrBool('_city');
		};
		/*点击获取数据并且标题改变*/
		$scope.method.get._sort = function (id, title) {
			$scope.pageMsg.titleShow._sort = title;
			attrBool('_sort');
			$scope.pageMsg.loadPage = 1; //刷新重置成1页
			$scope.pageMsg.titleId._sort = id; //数据排序
			getList();
		};

		$scope.method.get._class = function (id, title) {
			$scope.pageMsg.titleShow._class = title;
			attrBool('_class');
			$scope.pageMsg.loadPage = 1; //刷新重置成1页
			$scope.pageMsg.titleId._class = id; //数据排序
			console.log($scope.pageMsg.titleId._class);
			//		getList();
			$timeout(function () {
				Home.fetchShops(1, 0, 0, id, $scope.pageMsg.titleId._chotype).then(function (response) {
					console.log(response.data);
					// $scope.ymhPosition.status = 4;
					if (response.code == 1) {
						Message.show('该分类下暂无商家');
						return;
					}
					$scope.shops.shopsList = response.data;
				});
			}, 500);
		};
		//筛选类型
		$scope.method.get._chotype = function (id, title) {
			$scope.pageMsg.titleShow._chotype = title;
			attrBool('_chotype');
			$scope.pageMsg.loadPage = 1; //刷新重置成1页
			$scope.pageMsg.titleId._chotype = id; //数据排序
			console.log($scope.pageMsg.titleId._class);
			console.log($scope.pageMsg.titleId._chotype);
			//getList();
			$timeout(function () {
				Home.fetchShops(1, 0, 0, $scope.pageMsg.titleId._class, id).then(function (response) {
					console.log(response.data);
					// $scope.ymhPosition.status = 4;
					if (response.code == 1) {
						Message.show('该分类下暂无商家');
						return;
					}
					$scope.shops.shopsList = response.data;
				});
			}, 500);
		};
		/*点击确定时去首页的操作*/
		$scope.method.goIndex = function (para) {
			switch (para) {
				case 1:
					$scope.pageMsg.titleShow._city = $scope.pageMsg.cityTitle.sheng;
					$scope.pageMsg.thisPage = -1;
					attrBool('_content');
					break;
				case 2:
					$scope.pageMsg.titleShow._city = $scope.pageMsg.cityTitle.shi;
					$scope.pageMsg.thisPage = 1;
					attrBool('_content');
					break;
			}
			$scope.pageMsg.loadPage = 1; //刷新重置成1页
			getList();
		};
		/*去首页*/
		$scope.method.get._index = function (id, title) {
			$scope.pageMsg.titleShow._city = title;
			attrBool('_content');
			if (id) {
				$scope.pageMsg.cityId.xian = id;
			}
			if (title) {
				$scope.pageMsg.cityTitle.xian = title;
			}
			$scope.pageMsg.loadPage = 1; //刷新重置成1页
			getList();
		};

	})
	.controller('noticeCtrl', function ($rootScope, $scope, $ionicHistory, $stateParams, Jpush, $ionicSlideBoxDelegate, $ionicLoading, $state, Message, $anchorScroll, $ionicScrollDelegate, Storage, System, $timeout, Apply, $cordovaBarcodeScanner, Home, Article, $cordovaGeolocation) {
		//		$scope.$on("$ionicView.beforeEnter", function() {
		//			if(window.localStorage.getItem("didIntro") === null) {
		//				$state.go('poorson.introPage');
		//			}
		//			Home.getnounDict();
		//
		//		});
		//		$scope.gotoshoprole=function(){
		//			$state.go('shops.shopsRoleMap',null,{location:'replace'});
		//		}
		$scope.ymhPosition = {
			"status": 1
		};
		$scope.showMsg = function () {
			$rootScope.globalInfo.noticeNum = 0;
			// Storage.set("noticeNum", $rootScope.globalInfo);
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		Home.getnoticelist().then(function (response) {
			$scope.noticelist = response.data;
		})
		Article.getindexActice().then(function (response) {
			$scope.acticeimg = response.data;
		});
		Message.loading()
		var date = new Date()
		var month = date.getMonth() + 1;
		var day = date.getDate()
		month = month < 10 ? '0' + month : month
		day = day < 10 ? '0' + day : day
		$scope.today = month + '月' + day + '日'
		//		$scope.banner = {}
		//		$scope.fmoney = function(s, n) //s:传入的float数字 ，n:希望返回小数点几位 
		//		{
		//			n = n > 0 && n <= 20 ? n : 2;
		//			s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		//			var l = s.split(".")[0].split("").reverse(),
		//				r = s.split(".")[1];
		//			t = "";
		//			for(i = 0; i < l.length; i++) {
		//				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		//			}
		//			return t.split("").reverse().join("") + "." + r;
		//		}
		//		$scope.turnMobile = function(array) {
		//			array.forEach(function(item) {
		//				var mobile = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7);
		//				item.mobile = mobile;
		//			})
		//		}

		//		$scope.turnMoney = function(array) {
		//			array.forEach(function(item) {
		//				item.money = $scope.fmoney(item.money, 2)
		//			})
		//		}
		Home.getbanner().then(function (response) {
			$scope.banner = response.data;
			//				$scope.turnMoney($scope.banner.sale)
			//				$scope.turnMoney($scope.banner.cons)
			//				$scope.banner.index.cons_total = $scope.fmoney($scope.banner.index.cons_total, 2)
			$timeout(function () {
				var mySwiper = new Swiper('.swiper-container', {
					loop: true,
					roundLengths: true,
					// initialSlide:0,
					speed: 600,
					slidesPerView: "auto",
					centeredSlides: true,
					followFinger: true,
					loop: 4
				})
				Message.hidden();
			}, 10);

		})

		// 定位//定位插件参数
		document.addEventListener("deviceready", function () {
			if (Storage.get("ymhPosition") === null) {
				var geolocationOption = {
					timeout: 5000,
					maximumAge: 10000,
					enableHighAccuracy: false
				};
				$scope.ymhPosition.status = 2;
				Message.loading("定位中……");
				$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function (position) {
					$scope.ymhPosition.lat = position.coords.latitude;
					$scope.ymhPosition.lng = position.coords.longitude;
					Lbs.getCity(function (respond) {
						if (respond.code == 0) {
							$scope.ymhPosition.city = respond.data;
							//alert($scope.ymhPosition.city);
							$scope.ymhPosition.status = 3;
							Storage.set("ymhPosition", $scope.ymhPosition);
						} else {
							$scope.ymhPosition.status = 1;
							Message.show(respond.msg);
						}
					}, function () {
						$scope.ymhPosition.status = 1;
						Message.show("定位失败，请手动选择当前城市");
					}, $scope.ymhPosition);
				}, function (err) {
					$scope.ymhPosition.status = 1;
					Message.show('定位失败，请在左上角手动选择当前城市！', 1000);
					return false;
				})
			} else {
				$scope.ymhPosition.status = 3;
				$scope.ymhPosition.city = Storage.get("ymhPosition").city;
				$scope.ymhPosition.lat = Storage.get("ymhPosition").lat;
				$scope.ymhPosition.lng = Storage.get("ymhPosition").lng;
				//校正历史定位
				$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function (position) {
					var newPosition = {};
					newPosition.lat = position.coords.latitude;
					newPosition.lng = position.coords.longitude;
					Lbs.getCity(function (respond) {
						if (respond.code == 0) {
							newPosition.city = respond.data;
							if (newPosition.city !== "" && newPosition.city != $scope.ymhPosition.city) {
								//提示切换位置  弹窗
								$ionicPopup.confirm({
									template: '当前城市为：' + newPosition.city + '是否切换？',
									buttons: [{
										text: '取消',
										onTap: function () {
											return false;
										}
									}, {
										text: '确定',
										type: 'button-calm',
										onTap: function () {
											$scope.ymhPosition.status = 3;
											$scope.ymhPosition.city = newPosition.city;
											$scope.ymhPosition.lat = newPosition.lat;
											$scope.ymhPosition.lng = newPosition.lng;
											Storage.set("ymhPosition", $scope.ymhPosition);
											return true;
										}
									}]
								});
							}
							$scope.ymhPosition.status = 3;
							$scope.ymhPosition.city = newPosition.city;
							$scope.ymhPosition.lat = newPosition.lat;
							$scope.ymhPosition.lng = newPosition.lng;
							Storage.set("ymhPosition", $scope.ymhPosition);
							//						if(Lbs.calcDistance($scope.ymhPosition, newPosition) > 500) {
							//							$scope.ymhPosition.status = 3;
							//							$scope.ymhPosition.city = newPosition.city;
							//							$scope.ymhPosition.lat = newPosition.lat;
							//							$scope.ymhPosition.lng = newPosition.lng;
							//							Storage.set("ymhPosition", $scope.ymhPosition);
							//							$scope.$broadcast('shops.list.update', $scope.ymhPosition);
							//						}
						}
					}, function () {
						console.info(err);
					}, newPosition);
				}, function (err) {
					console.info(err);
					return false;
				});
			}
		})
		$scope.doRefresh = function () {
			Home.getbanner().then(function (response) {
				$scope.banner = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});

			})
		};

	})
	.controller('shoplineorderCtrl', function ($scope, $timeout, $rootScope, Order, Home, $ionicLoading, $stateParams, Message, $ionicSlideBoxDelegate, Storage, $state, User) {
		$scope.ordertype = '0';
		$scope.orderEmpty = false;
		User.shoplineOrder($scope.ordertype).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
				$scope.goodslist = ''
			} else {
				$scope.orderEmpty = false;
				$scope.goodslist = response.data;
			}
		});
		$scope.chooseorder = function (ordertypes) {
			$scope.noMore = false;
			if (ordertypes == '0') {
				$scope.ordertype = '0';
			} else {
				$scope.ordertype = '1';
			}
			User.shoplineOrder($scope.ordertype).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.goodslist = ''
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data;
				}
				$timeout(function () {
					$scope.page = 2;
					$scope.noMore = true;
				}, 1000)
			});

		}
		$scope.cancel = function (orderid, ids) {
			Order.cancelorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.delorder = function (orderid, ids) {
			Order.deleteorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.confirmorder = function (orderid, ids) {
			Order.orderconfirm(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Message.show('收货成功');
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.statusName = {
			'0': '待付款',
			'1': '待发货',
			'2': '待收货',
			'3': '待评价',
			'4': '已完成',
			'-1': '已取消',
			'-2': '申请退款',
			'-3': '申请退款',
			'-4': '已退款'
		};
		$scope.doRefresh = function () {
			$scope.noMore = false;
			User.shoplineOrder($scope.ordertype).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.goodslist = ''
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data;
					console.log(response);
				}
				$timeout(function () {
					$scope.page = 2;
					$scope.noMore = true;
				}, 1000)
				$scope.$broadcast('scroll.refreshComplete');
				//$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			});
		};
		//	 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.shoplineOrder($scope.ordertype, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodslist = $scope.goodslist.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = false;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多订单了！',
							duration: '1200'
						});
					}
				}

			});
		};

	})
	.controller('shoponlineorderCtrl', function ($scope, $timeout, $rootScope, Order, Home, $ionicLoading, $stateParams, Message, $ionicSlideBoxDelegate, Storage, $state, User) {
		$scope.orderEmpty = false;
		$scope.orderStatus = '9';
		User.shoponlineOrder($stateParams.spid, $scope.orderStatus).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
				$scope.goodslist = response.data;
			} else {
				$scope.orderEmpty = false;
				$scope.goodslist = response.data;
			}
		});
		$scope.getNew = function (orderStatus) {
			$scope.orderStatus = orderStatus;
			$('#porder' + orderStatus).siblings().find('span').removeClass('red');
			$('#porder' + orderStatus).find('span').addClass('red');
			User.shoponlineOrder($stateParams.spid, $scope.orderStatus).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.goodslist = response.data;
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data;
				}
			});
		};

		$scope.cancel = function (orderid, ids) {
			Order.cancelorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = response.data;
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.delorder = function (orderid, ids) {
			Order.deleteorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.confirmorder = function (orderid, ids) {
			Order.orderconfirm(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Message.show('收货成功');
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.statusName = {
			'0': '待付款',
			'1': '待发货',
			'2': '待收货',
			'3': '待评价',
			'4': '已完成',
			'-1': '已取消',
			'-2': '申请退款',
			'-3': '申请退款',
			'-4': '已退款'
		};
		$scope.doRefresh = function () {
			$scope.noMore = false;
			User.shoponlineOrder($stateParams.spid, $scope.orderStatus).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.goodslist = response.data;
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data;
					console.log(response);
				}
				$timeout(function () {
					$scope.noMore = true;
					$scope.page = 2;
				}, 1000)
				$scope.$broadcast('scroll.refreshComplete');
				//$scope.$broadcast('shops.list.update', $scope.ymhPosition);
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			});

		};
		//	 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.shoponlineOrder($stateParams.spid, $scope.orderStatus, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodslist = $scope.goodslist.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = false;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多订单了！',
							duration: '1200'
						});
					}
				}

			});

		};

	})
	.controller('myorderCtrl', function ($scope, $rootScope, Order, Home, $ionicLoading, $stateParams, Message, $ionicSlideBoxDelegate, Storage, $state, $http, ENV) {
		$scope.type = 'user';
		$scope.ordertype = '0';
		$scope.orderEmpty = false;
		$scope.orderStatus = '9';
		Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.goodslist = '';
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.goodslist = response.data;
			}
		});
		$scope.chooseorder = function (ordertypes) {
			$scope.noMore = false;
			if (ordertypes == '0') {
				$scope.ordertype = '0';
			} else {
				$scope.ordertype = '1';
			}
			Order.getuserList($scope.type, ordertypes).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.goodslist = '';
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data;
				}
			});
			$scope.noMore = true;
			$scope.page = 2;
		}
		$scope.getNew = function (orderStatus) {
			$scope.orderStatus = orderStatus;
			$('#porder' + orderStatus).siblings().find('span').removeClass('red');
			$('#porder' + orderStatus).find('span').addClass('red');
			Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.goodslist = '';
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data;
				}
			});
		};
		//购买
		$scope.gopay = function (orderId) {
			Order.newpayid(orderId).then(function (respond) {
				if (respond.code == '0') {
					$state.go("goods.onlinepay", {
						payid: respond.data
					});
				} else {
					Message.show(respond.msg);
				}
			})
		}
		//跳转到订单详情
		$scope.filtersT = function (ids) {
			if (ids.ordertype == '0') {
				$state.go('shops.useronlineorderInfo', {
					id: ids.id
				});
			} else if (ids.ordertype == '1') {
				$state.go('shops.userlineorderInfo', {
					id: ids.id
				});
			} else if (ids.ordertype == '2') {
				$state.go('shops.reporderInfo', {
					id: ids.id
				});
			}
		};
		$scope.cancel = function (orderid, ids) {
			Order.cancelorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.delorder = function (orderid, ids) {
			Order.deleteorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.confirmorder = function (orderid, ids) {
			Order.orderconfirm(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Message.show('收货成功');
					Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
							$scope.goodslist = '';
						} else {
							$scope.orderEmpty = false;
							$scope.goodslist = response.data;
						}
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		if ($scope.ordertype == '0') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '待评价',
				'4': '已完成',
				'-1': '已取消',
				'-2': '退款中',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.ordertype == '1') {
			$scope.statusName = {
				'0': '待付款',
				'1': '交易成功',
				'2': '待收货',
				'3': '待评价',
				'4': '已完成',
				'-1': '已取消',
				'-2': '退款中',
				'-3': '申请退款',
				'-4': '已退款'
			};
		};

		$scope.doRefresh = function () {
			$scope.noMore = false;
			Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.goodslist = response.data;
					$scope.orderEmpty = false;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1200'
				});
				$scope.noMore = true;
				$scope.page = 2;
			});
		};
		//下拉加载
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodslist = $scope.goodslist.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};

	})
	.controller('ordertcCtrl', function ($scope, $rootScope, Order, Home, $ionicLoading, $stateParams, Message, $ionicSlideBoxDelegate, Storage, $state) {
		$scope.type = 'user';
		$scope.orderEmpty = false;
		$scope.shopsdetail = {
			slide: '',
			locationUrl: '',
			isFollow: 0,
			followNum: 0,
			goods: '',
			list: ''
		};
		Order.getList($scope.type).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.shopsdetail.list = response.data;
			}
		});
		$scope.getNew = function () {
			$('#needall').find('span').addClass('blue');
			$('#needall').siblings().find('span').removeClass('blue');
			console.log(this);
			$('#needall').find('span').addClass('blue').siblings().removeClass('blue');
			$scope.orderList = [];
			$scope.orderEmpty = false;
			//				Storage.set('shortisComment',$stateParams.isCommentStatus);
			Order.getList($scope.type).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.shopsdetail.list = response.data;
				}
			});
		};
		$scope.getNew0 = function () {
			$('#needmoney').find('span').addClass('blue');
			$('#needmoney').siblings().find('span').removeClass('blue');
			Storage.set('shortStatus', 0);
			$scope.orderList = [];
			$scope.orderEmpty = false;
			Order.getList($scope.type).then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.shopsdetail.list = response.data;
				}
			});
		};
		$scope.getNew1 = function () {
			$('#neednone').find('span').addClass('blue');
			$('#neednone').siblings().find('span').removeClass('blue');
			Storage.set('shortStatus', 1);
			$scope.orderList = [];
			$scope.orderEmpty = false;
			Order.getList($scope.type).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.shopsdetail.list = response.data;
				}
			});
		};
		$scope.getNew2 = function () {
			$('#needzero').find('span').addClass('blue');
			$('#needzero').siblings().find('span').removeClass('blue');
			Storage.set('shortStatus', 2);
			$scope.orderList = [];
			$scope.orderEmpty = false;
			Order.getList($scope.type).then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.shopsdetail.list = response.data;
				}
			});
		};
		$scope.getNeww = function () {
			$('#needeval').find('span').addClass('blue');
			$('#needeval').siblings().find('span').removeClass('blue');
			$scope.orderList = [];
			$scope.orderEmpty = false;
			$rootScope.shortpayStatus = 2;
			$rootScope.shortisComment = 0;
			Storage.set('shortStatus', 2);
			Order.getList($scope.type).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.shopsdetail.list = response.data;
				}
			});
		};
		//订单详情类型判断
		$scope.filtersT = function (id) {
			if (id.ordertype == '0') {
				$state.go('shops.ordersubInfo', {
					id: id.id
				});
			} else if (id.ordertype == '1') {
				$state.go('shops.scanorderInfo', {
					id: id.id
				});
			} else if (id.ordertype == '2') {
				$state.go('shops.reporderInfo', {
					id: id.id
				});
			}
		};

		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		};
		$scope.orderAct = {
			'0': '付款',
			//				'1': '评价'
		}
		$scope.orderTypes = {
			'0': '线上下单',
			'1': '扫码付款',
			'2': '扫码报单'
		}

		//报单状态
		if ($scope.type == 'shops') {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.type == 'user') {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
				'-3': '申请退款',
				'-4': '已退款'
				//				'0' : '待商家确认',
				//				'1' : '待平台确认',
				//				'2' : '已完成',
				//				'-1' : '商家已拒绝',
				//				'-2' : '平台已拒绝'
			};
		};

		$scope.doRefresh = function () {
			Order.getList($scope.type).then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.shopsdetail.list = response.data;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1200'
				});
			});
		};

	})
	.controller('goodsevaluaterListCtrl', function ($scope, User, $stateParams, evaluate, $ionicLoading, $state, $timeout) {
		//评价商品
		evaluate.goodsevaluate($stateParams.goodsid).then(function (response) {
			if (response.data == '' || response.data.length == 0) { } else {
				$scope.evaluategoods = response.data;
			}
		});

		$scope.doRefresh = function () {
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.show({
				noBackdrop: false,
				template: '刷新成功！',
				duration: '1200'
			});
		};

	})
	.controller('evaluateCtrl', function ($scope, User, $stateParams, evaluate, $ionicLoading, $state, $timeout) {
		$scope.orderEmpty = false;
		//评价商品
		evaluate.getEvaluate($stateParams.orderid).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.evaluategoods = response.data;
				$timeout(function () {
					$.fn.raty.defaults.path = 'img';
					$('.default-demo').raty();
					$('#score-demo').raty({
						score: 0
					});
				}, 500)
			}
		});
		//评价提交
		$scope.satrteval = function () {
			var goodsarray = [{}, {}];
			var judgegoods = $('.shop-order-evaluate');
			for (var i = 0; i < judgegoods.length; i++) {
				var judgeid = judgegoods[i].id;
				goodsarray[i] = {};
				goodsarray[i].goodsId = $('#' + judgeid).attr('path');
				goodsarray[i].starNum = $('#' + judgeid + ' .evaluate-head .default-demo input').val();
				goodsarray[i].judgeInfo = $('#' + judgeid + ' .evaluate-content textarea').val();
			}
			evaluate.getEvaluate(goodsarray, 'types', $stateParams.orderid);
		}
		$scope.doRefresh = function () {
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.show({
				noBackdrop: false,
				template: '刷新成功！',
				duration: '1200'
			});
		};

	})
	.controller('teamCtrl', function ($scope, $stateParams, $ionicScrollDelegate, User, $rootScope) {
		$scope.type = 1;
		$scope.orderEmpty = false;
		User.getinvitainfo($scope.type = 1).then(function (response) {
			$scope.teamInfo = response.data;
		})
		$scope.getteamP = function (level) {
			$scope.type = level;
			User.getinvitainfo(level).then(function (response) {
				$scope.teamInfo = response.data;
			})
		}
		$scope.statusName = {
			'0': $rootScope.globalInfo.nounInfo.AXSZ,
			'1': $rootScope.globalInfo.nounInfo.CDDS,
			'2': $rootScope.globalInfo.nounInfo.PTHY,
			'3': $rootScope.globalInfo.nounInfo.CDSZ
		};
	})
	.controller('stockrightdetailCtrl', function ($scope, User, Message, $ionicLoading) {
		$scope.orderEmpty = false;
		User.getstockrechargelist().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				Message.show('暂时没有');
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.stocklist = response.data;
			}
		})
		// 列表下拉刷新
		$scope.doRefresh = function () {
			User.getstockrechargelist().then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					Message.show('暂时没有');
					$scope.orderEmpty = true;
				} else {
					$scope.stocklist = response.data;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			})
		};

	})
	.controller('stockapplyCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, Message, Payment, $state, $timeout, $interval, User, Order) {
		//		$scope.$on("$ionicView.beforeEnter", function() {
		//		})
		User.getstockDetail().then(function (response) {
			$scope.stockinfo = response.data;
		})
		//获取验证码
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.stockapply = {
			nums: '',
			code: '',
			number: 60
		};
		$scope.getCode = function () {
			$scope.stockapply.number = 60;
			User.getbalancecode().then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.stockapply.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.stockapply.number = 60;
					} else {
						$scope.stockapply.number--;
					}
				}, 1000)
			})
		};
		$scope.Confirm = function () {
			if ($scope.orderInfo.ordertypes != '') {
				Payment.creditPay($scope.stockapply);
			} else {
				Payment.creditPay($scope.balancepay, 'order');
			}

		}

	})
	.controller('stockrightCtrl', function ($scope, User, Message, $timeout, $rootScope, $state) {
		$scope.stockapply = {
			nums: '',
			code: '',
			number: 60
		};
		$scope.stockinfo = {};
		$scope.showagree = null;
		User.getstockinfo().then(function (response) {
			$scope.stockinfo = response.data;
		})
		$scope.applystock = function () {
			if ($scope.stockinfo.status == 1) {
				$scope.showagree = 1;
				//			$state.go('my.stockapply');
			} else {
				Message.show($rootScope.globalInfo.nounInfo.LOVE + '不足，不能兑换股权', 1000);
				//				$scope.showagree = 0;
			}
		}
		//充值界面展示
		$scope.rechargeshow = function () {
			if ($scope.showagree == 0) {
				$scope.showagree = null;
			} else {
				$scope.showagree = null;
			}
		}
		$scope.stocksure = function () {
			User.stockapply($scope.stockapply.nums).then(function (response) {
				$scope.stockinfo = response.data;
			})
		}

	})
	.controller('balanceindexCtrl', function ($scope, User, Message, $timeout, $rootScope, Storage, $state) {
		$scope.$on("$ionicView.beforeEnter", function () {
			if ($rootScope.globalInfo.user.isShop != 0) {
				$scope.sureshop = true;
			}
			if ($rootScope.globalInfo.user.isShop == 0) {
				$scope.sureshop = false;
			}
			User.getBalance().then(function (response) {
				$scope.balance = response.data;
				//			isOpen 0关，1开,2微信，3支付宝
				if ($scope.balance.isOpen == '0') {
					$scope.showrecharge = false;
				} else if ($scope.balance.isOpen == '1') {
					$scope.showrecharge = true;
					$scope.showchoose = 'all';
				} else if ($scope.balance.isOpen == '2') {
					$scope.showrecharge = true;
					$scope.showchoose = 'wechat';
				} else if ($scope.balance.isOpen == '3') {
					$scope.showrecharge = true;
					$scope.showchoose = 'alipay';
				}
			});
		})
		$scope.rechargeshows = false;
		$scope.rechargenum = '';
		$scope.showbalice = false;
		//充值界面展示
		$scope.rechargeshow = function () {
			if ($scope.rechargeshows == false) {
				$scope.rechargeshows = true;
			}
		}
		$scope.rechargecreat = function (type, num) {
			User.rechargealance(type, num);
		}
		$scope.showiceinfo = function () {
			if ($scope.showbalice == false) {
				$scope.showbalice = true;
			} else {
				$scope.showbalice = false
			}
		}
		// 去提现
		$scope.goWithdraw = function () {
			Storage.remove('agentInfo');
			$state.go('user.repo')
		}
	})
	.controller('balarechargepageCtrl', function ($scope, Payment, Message, $ionicHistory, $timeout, $rootScope, $stateParams) {
		if ($stateParams.paytype != '') {
			Payment.rechargecode($stateParams.orderid, $stateParams.paytype).then(function (response) {
				$scope.balancepayinfo = response.data;
			});
		} else {
			Payment.rechargecode($stateParams.orderid).then(function (response) {
				$scope.balancepayinfo = response.data;
			});
		}
		$scope.backroad = function () {
			if ($stateParams.paytype != '') {
				$ionicHistory.goBack(-3);
			} else {
				$ionicHistory.goBack();
			}
		}

	})
	.controller('getlovesdetailCtrl', function ($scope, User, Message) {
		User.lovesawardlist().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.awardlist = response.data;
			} else {
				$scope.awardlist = response.data;
			}
		});

	})

	.controller('couponListCtrl', function ($scope, User, Message, $ionicLoading) {
		User.couponList().then(function (response) {
			if (response.code == 0) {
				$scope.loveslist = response.data;
			} else {
				$scope.loveslist = '';
			}
		});
	})
	.controller('lovesdetailCtrl', function ($scope, User, Message, $ionicLoading) {
		var nowtime = '';
		User.getloveslist().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.loveslist = response.data;
			} else {
				$scope.loveslist = response.data;
				angular.forEach(response.data, function (obj) {
					obj.addTime = '';
					if (nowtime == '') {
						var newdate = new Date(obj.createTime * 1000);
						nowtime = newdate.getFullYear() + '.' + (newdate.getMonth() + 1);
						obj.addTime = obj.createTime;
					} else {
						var newdate1 = new Date(obj.createTime * 1000);
						var newdates = newdate1.getFullYear() + '.' + (newdate1.getMonth() + 1);
						if (newdates == nowtime) {
							obj.addTime = '';
						} else {
							nowtime = newdates;
							obj.addTime = obj.createTime;
						}
					}
				});

			}
		});
		// 下拉加载更多商家
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {

			var nowtime = '';
			User.getloveslist($scope.page).then(function (response) {

				$scope.page++;
				$scope.loveslist = $scope.loveslist.concat(response.data);
				angular.forEach($scope.loveslist, function (obj) {
					obj.addTime = '';
					if (nowtime == '') {
						var newdate = new Date(obj.createTime * 1000);
						nowtime = newdate.getFullYear() + '.' + (newdate.getMonth() + 1);
						obj.addTime = obj.createTime;
					} else {
						var newdate1 = new Date(obj.createTime * 1000);
						var newdates = newdate1.getFullYear() + '.' + (newdate1.getMonth() + 1);
						if (newdates == nowtime) {
							obj.addTime = '';
						} else {
							nowtime = newdates;
							obj.addTime = obj.createTime;
						}
					}
				});
				//$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});
					$scope.noMore = true;
				}

			});
		};
	})
	.controller('shopdetailCtrl', function ($scope, User, Message) {
		$scope.info = {
			qq: '',
			serveinfo: ''
		}
		User.saveserveinfo().then(function (response) {
			$scope.info = response.data;
		});
		$scope.saveinfo = function () {
			console.log($scope.info);
			User.saveserveinfo('save', $scope.info).then(function (response) {
				if (response.code == 0) {
					Message.show('修改成功');
				} else {
					console.log(response);
					Message.show(response.msg);
				}
			});
		}
	})
	.controller('shopintroCtrl', function ($scope, User, Message, $cordovaCamera, $ionicActionSheet) {
		$scope.applyInfo = {
			showImg1: '',
			showImg2: ''
		};

		/*上传图片*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};

		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //身份证正面照
						$scope.applyInfo.showImg1 = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 2) { //身份证反面照
						$scope.applyInfo.showImg2 = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
					//	               else if(type == 3) { //营业执照
					//						$scope.applyInfo.businessImg = "data:image/jpeg;base64," + imageURI;
					//						var image3 = document.getElementById('divImg03');
					//						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					//					} 
					//					else if(type == 4) { //商铺封面照
					//						$scope.applyInfo.shopsImg = "data:image/jpeg;base64," + imageURI;
					//						var image4 = document.getElementById('divImg04');
					//						image4.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					//					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};

	})
	.controller('collectionCtrl', function ($scope, User, Message, $timeout, $state) {
		//我的收藏
		$scope.orderEmpty = false;
		$scope.collectgood = true;
		$scope.operate = false;
		$scope.types = 'goods';
		User.getcollectlist($scope.types).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
				$scope.collectList = '';
			} else {
				$scope.orderEmpty = false;
				console.log(response);
				$scope.collectList = response.data;
			}
		});
		$scope.collecttype = function (types) {
			console.log(types);
			if (types == 'goods') {
				$scope.types = types;
				$scope.collectgood = true;
			} else {
				$scope.types = types;
				$scope.collectgood = false;
			}
			$scope.operate = false;
			$('#changeedit').html('编辑');
			User.getcollectlist(types).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.collectList = '';
				} else {
					$scope.orderEmpty = false;
					console.log(response);
					$scope.collectList = response.data;
				}
			});
		}
		$scope.changeedit = function () {
			if ($('#changeedit').html() == '编辑') {
				$('#changeedit').html('取消');
				$scope.operate = true;
				$('.commoncollect em').show();
			} else {
				$('#changeedit').html('编辑');
				$scope.operate = false;
				$('.commoncollect em').hide();
			}
		}
		$scope.changestyle = function (goodsid, spid, $event) {
			$event.stopPropagation()
			console.log(goodsid + spid);
			if ($('#p' + goodsid + ' em').hasClass('chostyle') || $('#p' + spid + ' em').hasClass('chostyle')) {
				$('#p' + goodsid + ' em').removeClass('chostyle');
				$('#p' + spid + ' em').removeClass('chostyle');
			} else {
				$('#p' + goodsid + ' em').addClass('chostyle');
				$('#p' + spid + ' em').addClass('chostyle');
			}

		}
		//删除
		$scope.todel = function (operate) {
			console.log($('.commoncollect a .chostyle'));
			var cholength = $('.commoncollect a .chostyle');

			var ids = [];
			for (var i = 0; i < cholength.length; i++) {

				var obj = {
					id: cholength[i].id,
					type: cholength[i].dataset.type,
				}
				ids.push(obj);
			}
			console.log(ids);
			User.getcollectlist($scope.types, ids, operate).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.collectList = '';
				} else {
					$scope.orderEmpty = false;
					console.log(response);
					$scope.collectList = response.data;
					$timeout(function () {
						$('.commoncollect em').css('display', 'block');
					}, 100)

				}
			});
		}
		//置顶
		$scope.totop = function (operate) {
			$('.commoncollect a .chostyle');
			console.log($('.commoncollect a .chostyle'));
			var cholength = $('.commoncollect a .chostyle');
			var ids = [];
			for (var i = 0; i < cholength.length; i++) {
				console.log(cholength[i].id);
				ids.push(cholength[i].id);
			}
			console.log(ids);
			User.getcollectlist($scope.types, ids, operate).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.collectList = '';
				} else {
					$scope.orderEmpty = false;
					console.log(response);
					$scope.collectList = response.data;
				}
			});
		}

		// 商品过期判断
		$scope.goPage = function (item) {
			if (item.info.lose == 1) {
				Message.show('该商品已下架')
			} else {
				if(item.type!='0'){
					$state.go('goods.taokeGoodsInfo', {
					goodsId: item.goodsId
				})
					
				}else{
					$state.go('goods.onlinegoodsInfo', {
					id: item.goodsId
				})
				}
				
			}
		}
	})
	.controller('consumeCtrl', function ($scope, User, Message) {
		//消费单元
		$scope.orderEmpty = false;
		User.getconsume().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				Message.show('暂时没有');
				$scope.orderEmpty = true;
			} else {
				console.log(response);
				$scope.consumeList = response.data;
			}
		});

	})
	.controller('myorderlistCtrl', function ($scope, User, Order, $ionicLoading, $state, $stateParams, Storage) {
		$scope.orderList = [];
		$scope.orderEmpty = false;
		var userInfo = Storage.get('user');
		console.log(userInfo.token);
		$scope.type = 'user';
		Order.getList($scope.type).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				console.log(response);
				$scope.orderList = response.data;
			}
		});
		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		};
		if ($scope.type == 'shops') {
			$scope.orderAct = {
				'0': '付款',
				'1': '评价'
			};
		} else if ($scope.type == 'user') {
			$scope.orderAct = {
				'0': '付款',
				'1': '评价'
			};
		};
		// 列表下拉刷新
		//		$scope.doRefresh = function() {
		//			Order.getList($scope.type).then(function(response) {
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.orderList = response.data;
		//				}
		//				$scope.$broadcast('scroll.refreshComplete');
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: '刷新成功！',
		//					duration: '3000'
		//				});
		//			});
		//		};

		// 下拉加载更多列表
		//		$scope.noMore = false;
		//		$scope.page = 2;
		//		$scope.loadMore = function() {
		//			Order.getList($scope.type, $scope.page).then(function(response) {
		//				$scope.page += 1;
		//				$scope.orderList = $scope.orderList.concat(response.data);
		//				if(response.code == 0) {
		//					if(response.data.length == 0) {
		//						$scope.noMore = true;
		//						$ionicLoading.show({
		//							noBackdrop: true,
		//							template: '没有更多订单了！',
		//							duration: '1200'
		//						});
		//					}
		//				}
		//				$scope.$broadcast('scroll.infiniteScrollComplete');
		//			})
		//		};

	})
	.controller('aboutvrCtrl', function ($scope, User, aboutUs) {
		aboutUs.usInfo().then(function (response) {
			$scope.getInfo = response.data;
			$('.about-intro').html($scope.getInfo.aboutUs);
		});
		aboutUs.serveInfo().then(function (response) {
			$scope.serveInfo = response.data;
		});

	})
	.controller('bussapplyCtrl', function ($scope, $state, Message, $ionicModal) {
		$scope.agree = true;
		$scope.authAgree = function () {
			$scope.agree = !$scope.agree;
		};
		if (!$scope.agree) {
			Message.show('请勾选会员注册协议');
			return false;
		}
		$ionicModal.fromTemplateUrl('templates/modal/single-page.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.spTitle = '用户注册协议';
			Auth.fetchAgreement().then(function (data) {
				$scope.spContent = data;
			});
		});

		$scope.showAgreement = function ($event) {
			$scope.modal.show();
			$event.stopPropagation(); // 阻止冒泡
		};
	})
	.controller('listCtrl', function ($scope, User, Order, $stateParams, $ionicModal, $ionicSlideBoxDelegate, Message, $cordovaInAppBrowser, ENV, $q, $timeout) {
		$scope.totalInfo = {
			count: '',
			list: '',
			roleInfo: '',
			rebateInfo: '',
			arcData: {}
		};
		$scope.type = $stateParams.type;
		$scope.role = 1;
		$scope.selectRole = function (role) {
			$scope.myVar = !$scope.myVar;
			$scope.role = role;
			User.getLove($scope.role).then(function (data) {
				$scope.totalInfo = data;
				$scope.$broadcast("chart-update", $scope.totalInfo.arcData);
			});
		};

	})
	.controller('tabshopCtrl', function ($scope, $cordovaBarcodeScanner, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, Shop) {

		$scope.$on("$ionicView.beforeEnter", function () {
			Apply.getuserApply().then(function (response) {
				if (response.code == 0) {
					$scope.isshop = false;
				} else if (response.code == 2) {
					$scope.isshop = true;
					var shopApply = Storage.get('user');
					shopApply.isShop = response.data;
					Storage.set('user', shopApply);
					$rootScope.globalInfo.user = shopApply;
					Shop.getShops($rootScope.globalInfo.user.isShop).then(function (response) {
						$scope.shopsInfo = response;
					});
					//		console.log(Storage.get('user'));
				} else if (response.code == 301) {
					//		Message.show(response.msg);
					$state.go('shops.wait');
				} else if (response.code == 302) {
					//		Message.show(response.msg);
					$state.go('shops.shoprefuse');
				} else if (response.code == 303) {
					//		完善资料
					$state.go('shops.shopperfectInfo');
				} else if (response.code == 304) {
					//		上传位置
					$state.go('shops.shopPosition');
				}
			})
			$scope.shopshow = false;

		})

		$scope.changetyps = function (types) {
			if (types == 0) {
				$scope.shopshow = false;
			} else {
				$scope.shopshow = true;
			}
		}
		// 列表下拉刷新
		$scope.doRefresh = function () {
			Shop.getShops($rootScope.globalInfo.user.isShop).then(function (response) {
				$scope.shopsInfo = response;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					pullingIcon: 'ion-android-bicycle',
					refreshingIcon: 'ion-android-bicycle',
					duration: '1000'
				});
			});

		};

	})
	.controller('suregiftCtrl', function ($scope, $cordovaBarcodeScanner, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams) {
		$scope.$on("$ionicView.beforeEnter", function () {
			//		    		console.log($stateParams);
			User.isbuyGilft().then(function (response) {
				//1是要衣服 0不要衣服
				if (response.data.isSend == 1) {
					$scope.showClothes = true;
					$scope.buyClothes = true;
					$scope.buyGoods = response.data.amgoods;
				}
				if (response.data.isSend == 0) {
					$scope.showClothes = false;
					$scope.buyClothes = false;
				}
				if (response.data.isCost == 0) {
					$scope.isCost = false;
				}
				if (response.data.isCost == 1) {
					$scope.isCost = true;
				}
			})
		})
		$scope.id = '';
		console.log($stateParams.id);
		//		$scope.id = $stateParams.id;
		if ($stateParams.id) {
			User.buyambassador($stateParams.id, 'address').then(function (response) {
				$scope.addressinfo = response.data;
				$scope.id = $scope.addressinfo.id;
			})
		} else {
			User.buyambassador().then(function (response) {
				$scope.addressinfo = response.data;
				$scope.id = $scope.addressinfo.id;
			})
		}
		$scope.choGoods = function (id) {
			console.log(id);
			$scope.seleceId = id;
		}
		$scope.submitbuy = function () {
			if ($scope.buyClothes == true) {
				if ($scope.id == '' || $scope.id == undefined) {
					Message.show('请选择收货地址');
					return
				} else if ($scope.seleceId == '') {
					Message.show('请选择商品');
					return
				}
			} else {
				$scope.buyClothes = 'none';
			}
			User.buyambassador($scope.id, $scope.seleceId).then(function (response) {
				if (response.code == 0) {
					if ($scope.isCost == true) {
						$state.go('goods.onlinepay', {
							payid: response.data.orderId,
							ordertypes: 'welfare'
						});
					} else {
						$state.go('tab.tcmytc')
					}
				} else {
					Message.show(response.msg);
				}
			})
		}
	})
	.controller('applyunioninfoCtrl', function ($scope, $cordovaBarcodeScanner, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $timeout) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		$scope.showjobinfo = false;
		$scope.checkjobinfo = false;
		$scope.applyunioninfo = {
			username: '', //账号
			birth: '', //省、区域
			agentTrade: '', //申请行业
			agentJob: '', //申请职位
			railroad: '', //所占股份
			createtime: '', //申请时间
			ids: ''
		}
		//    $stateParams.applytype
		User.applyunion($stateParams.applytype).then(function (response) {
			$scope.applyunioninfo = response.data;
		})
		User.applyunion($stateParams.applytype, 'jobcate').then(function (response) {
			$scope.applyjobinfo = response.data;
			//			 angular.forEach(response.data, function(obj,index) {
			//			 	 console.log(obj);
			//			 	if(!obj.title){
			//			 		console.log(obj);
			//			 		console.log(index);
			//			 		delete response.data.index;
			//			 		$scope.applyjobinfo.splice(index,1);
			//			 	}
			//			 	$scope.applyjobinfo=response.data;
			//			 })
			//			console.log(response.data);

			//			$scope.applyjobinfo=response.data;
		})
		$scope.showinfo = function () {
			$scope.showjobinfo = true;
		}
		//选择职位提交验证申请条件
		$scope.surejob = function () {
			User.checkjobinfo($scope.applyunioninfo.ids).then(function (response) {
				if (response.code == 0) {
					$scope.applyunioninfo.agentJob = response.data.title;
					$scope.applyunioninfo.ids = response.data.id;
					$scope.applyunioninfo.railroad = response.data.Stock;
					//		    		$scope.ischeckjob=response.data;
					//		    		Message.show('条件满足');
					$scope.showjobinfo = false;
				} else {
					$scope.checkjobinfo = true;
					$scope.uncheckjob = response.data;
				}

			});

		}
		$scope.chojob = function (ids) {
			//			console.log(ids);
			$scope.applyunioninfo.ids = ids;
			$('.unionjobtype h4 i').removeClass('sureshow');
			$('.unionjobtype h4 #' + ids).addClass('sureshow');
		}
		$scope.alerthide = function () {
			$scope.checkjobinfo = false;
		}
		//申请提交
		$scope.saveapplyunion = function () {
			User.applyunion($stateParams.applytype, 'save', $scope.applyunioninfo).then(function (response) {
				console.log(response);
				if (response.code == 0) {
					Message.show('申请成功，请等待考核');
					$state.go('tab.tcmytc');
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			});
		};

	})
	.controller('shopMoneyCenterCtrl', function ($scope, Message, Shop, $rootScope) {
		Shop.shopMoney().then(function (response) {
			console.log(response);
			$scope.shopMoney = response.data;
		})
	})
	.controller('shopRepoCtrl', function ($scope, Message, User, Shop, Storage) {
		$scope.showDrop = false;
		$scope.showDropType = "银行卡";
		$scope.selectedType = 2;
		$scope.withType = function (num, title) {
			$scope.showDropType = title;
			$scope.showDrop = false;
			$scope.selectedType = num;
		};

		$scope.agentInfo = {
			agentId: ''
		}
		$scope.repoInfo = {
			price: '', //提现金额
			passwords: '', //密码
			cname: '', //负责人
			mobile: '', //电话
			priceNum: '', //可提金额
			bankInfo: {},
			withType: 2,
			alipayAccount: '',
			alipayName: ''
		};
		if (Storage.get('shoprepoinfo')) {
			$scope.repoInfo.cname = Storage.get('shoprepoinfo').cname;
			$scope.repoInfo.mobile = Storage.get('shoprepoinfo').mobile;
		}
		User.getRepo($scope.agentInfo).then(function (data) {
			console.log(data);
			$scope.repoInfo.bankInfo = data.bank;
			console.log($scope.repoInfo);
		});
		Shop.shopMoney().then(function (response) {
			$scope.shopMoneyInfo = response.data;
			$scope.repoInfo.priceNum = response.data.applyPending;
		})
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			//			if(!$scope.bankInfo.bank) {
			//				Message.show('请添加银行卡！');
			//				return;
			//			}
			if (!$scope.repoInfo.price) {
				Message.show('请输入提现金额！');
				return;
			}
			if ($scope.repoInfo.price < 0) {
				Message.show('提现金额需大于0元');
				return;
			}
			//			if(!r.test($scope.repoInfo.bean)) {
			//				Message.show('请输入100的整数倍！');
			//				return;
			//			}
			//			if($scope.repoInfo.bean > $scope.repoInfo.beanNum) {
			//				Message.show('余额不足！');
			//				return;
			//			}
			//			if(!$scope.repoInfo.passwords) {
			//				Message.show('请输入支付密码！');
			//				return;
			//			}
			console.log($scope.repoInfo);
			Storage.set('shoprepoinfo', $scope.repoInfo)
			Shop.shoprepoApply($scope.repoInfo, $scope.selectedType);
		}
	})
	.controller('addgoodsCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $timeout) {
		User.getunioninfo('shop').then(function (response) {
			console.log(response);
			$scope.shopinfo = response.data;
		});

	})
	.controller('loveunioncenterCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $timeout) {
		User.getunioninfo().then(function (response) {
			console.log(response);
			$scope.unioninfo = response.data;
		});

	})
	.controller('loveunionapplyCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, $stateParams, $timeout) {
		User.unionclassinfo().then(function (response) {
			console.log(response);
			$scope.unionclassinfo = response.data;
		});
		$scope.goapply = function (applytype) {
			User.applyunion(applytype, 'check').then(function (response) {
				if (response.code == 0) {
					Message.show('申请考核中，请等待');
				} else if (response.code == 301) {
					//				Message.show('考核通过');
					$state.go('shops.loveunioncenter');
				} else if (response.code == 2) {
					Message.show('考核未通过，请重新申请');
					$state.go('user.applyunioninfo', {
						applytype: applytype
					});
				} else {
					$state.go('user.applyunioninfo', {
						applytype: applytype
					});
				}
			})

			//						Message.show('申请条件不满足');
		}
	})
	.controller('loveunionCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, $stateParams, $timeout) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		User.applyunioninfo().then(function (response) {
			$scope.unioninfo = response.data;
		});
		$scope.applyambassador = function () {
			Apply.getuserApply().then(function (response) {
				if (response.code == 0) {
					Message.show('你还未开店');
				} else if (response.code == 2) {
					$state.go('user.loveunionapply');
				} else if (response.code == 301) {
					Message.show(response.msg);
					//						$state.go('shops.wait');
				}
			});
		};
		$scope.goapply = function (applytype) {
			User.applyunion(applytype, 'check').then(function (response) {
				if (response.code == 0) {
					Message.show('申请考核中，请等待');
				} else if (response.code == 301) {
					$state.go('shops.loveunioncenter');
				} else if (response.code == 2) {
					Message.show('考核未通过，请重新申请');
					$state.go('user.applyunioninfo', {
						applytype: applytype
					});
				} else {
					$state.go('user.applyunioninfo', {
						applytype: applytype
					});
				}
			})

			//						Message.show('申请条件不满足');
		}
	})
	.controller('shareregsiterCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $ionicActionSheet, $timeout) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		$scope.shareinfo = {};
		User.shareregsiterinfo().then(function (response) {
			$scope.regsiterinfo = response.data;
		});
		$scope.opens = false;
		$scope.changeshow = function () {
			if ($scope.opens == true) {
				$scope.opens = false;
			} else {
				$scope.opens = true;
			}
		}
		User.sharelink().then(function (response) {
			$scope.shareinfo = response;
		});

		//分享
		$scope.sharechats = function (scene, title, desc, url, thumb) {
			Wechat.share({
				message: {
					title: $scope.shareinfo.title,
					description: $scope.shareinfo.description,
					thumb: $scope.shareinfo.thumb,
					//     url: url ?url : "http://baidu.com"
					media: {
						type: Wechat.Type.WEBPAGE,
						webpageUrl: $scope.shareinfo.sharelink
					}
				},
				scene: scene // share to Timeline  
			}, function () {
				$scope.showtype = false;
				//								alert("Success");
			}, function (reason) {
				$scope.showtype = false;
				//								alert("Failed: " + reason);
			});
		};
		$scope.showtype = false;
		$scope.sharefriend = function (title, desc, url, thumb) {
			$scope.showtype = true;
			//			var hideSheet = $ionicActionSheet.show({
			//				buttons: [{
			//						'text': '分享给好友'
			//					},
			//					{
			//						'text': '分享到朋友圈'
			//					}
			//				],
			//				cancelText: '取消',
			//				buttonClicked: function(index) {
			//					if(index == 0) {
			//						$scope.sharechats(0, title, desc, url, thumb);
			//					} else if(index == 1) {
			//						$scope.sharechats(1, title, desc, url, thumb);
			//					}
			//				}
			//
			//			});
			//			$timeout(function() {
			//				hideSheet();
			//			}, 2000);
		};
		$scope.buttontype = function (index) {
			console.log(index)
			if (index == 0) {
				$scope.sharechats(0);

				$scope.showtype = false;
			} else if (index == 1) {

				$scope.sharechats(1);
				$scope.showtype = false;
			} else if (index == 2) {
				$scope.shareQQ(2);
				$scope.showtype = false;
			} else if (index == 3) {
				$scope.shareQQ(3);
				$scope.showtype = false;
			} else if (index == 'none') {
				$scope.showtype = false;
			}

		}
		$scope.shareQQ = function (type) {
			var args = {};
			if (type == 2) {
				args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
			}
			if (type == 3) {
				args.scene = QQSDK.Scene.QQZone; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
			}
			var url = ENV.shareLink + 'goods/onlinegoodsInfo/' + $scope.goodsdetail.id
			args.client = QQSDK.ClientType.QQ; //QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
			args.title = $scope.goodsdetail.goodsName;
			args.description = $scope.goodsdetail.goodsTag;
			args.image = $scope.goodsdetail.thumbs[0];
			QQSDK.shareImage(function () {
				Message.show('分享成功')
			}, function (failReason) {
				Message.show(failReason);
			}, args);
		}
		$scope.levelName = {
			'0': 'vr会员',
			'1': 'vr创客',
			'2': 'vr创导'
		};
	})
	.controller('chuandishizheCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $ionicActionSheet, $timeout) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		User.chuandishizheinfo().then(function (response) {
			$scope.chuandiinfo = response.data;
		});
	})
	.controller('aixinshizeCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $ionicActionSheet, $timeout) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		$scope.shareinfo = {};
		User.aixinshizheinfo().then(function (response) {
			$scope.shizheinfo = response.data;
		});
		User.sharelink().then(function (response) {
			$scope.shareinfo = response.data;
		})
		//分享
		$scope.sharechats = function (scene, title, desc, url, thumb) {
			//        	console.log(scene);
			Wechat.share({
				message: {
					title: $scope.shareinfo.title,
					description: $scope.shareinfo.description,
					thumb: $scope.shareinfo.thumb,
					//      url: url ?url : "http://baidu.com"
					media: {
						type: Wechat.Type.WEBPAGE,
						webpageUrl: $scope.shareinfo.sharelink
						//						webpageUrl: "http://3d.weishang6688.com/app/index.php?i=34&c=auth&a=reg&suid=" + $rootScope.globalInfo.user.uid
					}
				},
				scene: scene // share to Timeline  
			}, function () {
				//				alert("Success");
			}, function (reason) {
				//				alert("Failed: " + reason);
			});
		};
		$scope.sharefriend = function (title, desc, url, thumb) {
			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					'text': '分享给好友'
				},
				{
					'text': '分享到朋友圈'
				}
				],
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.sharechats(0, title, desc, url, thumb);
					} else if (index == 1) {
						$scope.sharechats(1, title, desc, url, thumb);
					}
					//					return true;
				}

			});
			$timeout(function () {
				hideSheet();
			}, 2000);
		};
		$scope.levelName = {
			'0': 'vr会员',
			'1': 'vr创客',
			'2': 'vr创导'
		};
	})
	.controller('ambassadordeliveryCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		User.ambassadorinfo().then(function (response) {
			$scope.ambassador = response.data;
		})
		$scope.applyAmbass = function () {

			$state.go('goods.activegoodslist', {
				types: "direct"
			})

			// User.applyAmbass().then(function (response) {
			// 	console.log(response);
			// 	if (response.code == 0) {
			// 		$state.go('tab.tcmytc');
			// 	}
			// 	if (response.code == 1) {
			// 		$state.go('user.suregift');
			// 	}

			// })

		}
	})

	.controller('shoptypesCtrl', function ($scope, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, $stateParams, $timeout) {
		//    	$scope.$on("$ionicView.beforeEnter", function() {
		//			console.log($stateParams);
		//		if($rootScope.globalInfo.user.isShop=='0') {
		//			$scope.isshop=false;
		//			}else{
		//				$scope.isshop=true;
		//			}
		//		})
		$scope.goapply = function (types) {

			User.ambassadorinfo(types).then(function (response) {
				if (response.code == '0') {
					if (types == 'person') {
						$state.go('user.apply', {
							shoptype: 'person',
							reapply: 'reapply'
						});
					} else {
						$state.go('user.apply', {
							reapply: 'reapply'
						});
					}
				} else if (response.code == '1') {

					$state.go('user.ambassadordelivery');
				}

			})

		};
	})
	.controller('myCtrl', function ($scope, $cordovaBarcodeScanner, aboutUs, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, Home, Good, $ionicActionSheet, $timeout, $cordovaInAppBrowser, $window) {

		//		Mc.getMy().then(function(data) {
		//			$scope.myInfo = data;
		//		});
		User.getuserinfo().then(function (response) {
			$scope.userInfo = response.data;
			var shopApply = Storage.get('user');
			shopApply.isAmbass = response.data.isAmbass;
			shopApply.mostCost = response.data.mostCost;
			shopApply.agenttype = response.data.agenttype;
			shopApply.passtime = response.data.passtime;
			shopApply.isAgent = response.data.isAgent;
			Storage.set('user', shopApply);
			$rootScope.globalInfo.user = shopApply;
			//			console.log(Storage.get('user'));
		});
		$scope.levelName = {
			'0': $rootScope.globalInfo.nounInfo.AXSZ,
			'1': $rootScope.globalInfo.nounInfo.CDDS,
			'2': $rootScope.globalInfo.nounInfo.PTHY,
			'3': $rootScope.globalInfo.nounInfo.CDSZ
		};
		$scope.agentName = {
			'0': '',
			'1': '省级代理',
			'2': '市级代理',
			'3': '县级代理'
		};
		//		$scope.goodisshow = false;
		//		Good.gethotgoodsList().then(function(response) {
		//			$scope.goodsList = response.data;
		//		});
		aboutUs.serveInfo().then(function (response) {
			$scope.serveInfo = response.data;
		});
		//客服
		$scope.mycontactserve = function () {
			//				var	qqhtml="<a target='_blank' style='color:#007aff;' href='http://wpa.qq.com/msgrd?v=3&uin="+$scope.goodsdetail.shops.QQ+"&site=qq&menu=yes'>QQ客服</a>";
			//				var	qqhtml='<a target="_blank" style="color:#007aff;"  href="http://wpa.qq.com/msgrd?v=3&uin='+$scope.goodsdetail.shops.QQ+'&site=qq&menu=yes">QQ客服</a>';
			//			var qqurl = "http://wpa.qq.com/msgrd?v=3&uin=" + $scope.serveInfo.QQ + "&site=qq&menu=yes";
			var qqurl = "mqqwpa://im/chat?chat_type=wpa&uin=" + $scope.serveInfo.QQ + "&src_type=web&web_src=oicqzone.com";
			var buttons = [];
			buttons = [{
				text: $scope.serveInfo.CSH,
			}, {
				text: "平台客服"
			}, {
				text: "帮助中心"
			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.callPhone($scope.serveInfo.CSH);
					} else if (index == 1) {
						$state.go('user.imMessagePerson', {
							username: $scope.serveInfo.QQ
						});
					} else if (index == 2) {
						$state.go('my.helplist');
					}
					return true;
				}
			})
		};
		$scope.getqq = function (qqurl) {
			//			 $window.location.href = qqurl;
			document.addEventListener("deviceready", function () {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'
				};
				$cordovaInAppBrowser.open(qqurl, '_system', options)
					.then(function (event) {
						console.log(event)
					})
					.catch(function (event) {
						console.log(event)
					});
			}, false);
		}
		$scope.callPhone = function (mobilePhone) {
			$window.location.href = "tel:" + mobilePhone;
		};
		// 请求商家经营类型和让利类型
		$scope.toApply = function () {
			Apply.getApply().then(function (data) {
				$state.go('user.apply');
			})
		};
		// 消息是否显示
		$scope.msgNum = false;
		if ($rootScope.globalInfo.noticeNum > 0) {
			$scope.msgNum = true;
		} else {
			$scope.msgNum = false;
		}
		$scope.showMsg = function () {
			$rootScope.globalInfo.noticeNum = 0;
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		// 修改扫码处理
		$scope.myscan = function () {
			cloudSky.zBar.scan({
				text_title: "亿民惠", // Android only
				text_instructions: "请将二维码置于扫描框中间", // Android only
				//				camera: "front" || "back" ,// defaults to "back"
				//				flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
				//				drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
			}, function (barcodeData) {
				$scope.qr = barcodeData;
				var begin = $scope.qr.lastIndexOf('spid=') + 5;
				var num = $scope.qr.substring(begin, $scope.qr.length)
				if (num) {
					var spid = num;
					$state.go('user.linepay', {
						'spid': spid
					});
				} else {
					Message.show('二维码不是平台专用，请核对后再扫！', 2000);
				}
			}, function (error) {
				//				console.log(error);
				Messa.show(error);
				Message.show('扫码失败，请尝试重新扫码！', 2000);
			})
			//			com.jieweifu.plugins.barcode.startScan(function(barcodeData) {
			//				$scope.qr = barcodeData;
			//				var preg = /^http:\/\/.*\/yd\/\d+\/(\d+)$/;
			//				if($scope.qr.match(preg)[1]) {
			//					var spid = $scope.qr.match(preg)[1];
			//					$state.go('user.linepay', {
			//						'spid': spid
			//					});
			//				} else {
			//					Message.show('二维码不是平台专用，请核对后再扫！', 2000);
			//				}
			//
			//			}, function(error) {
			//				console.log(error);
			//				Message.show('扫码失败，请尝试重新扫码！', 2000);
			//			});
		};

		// 代理申请资格检查
		$scope.agentCheck = function () {

			$state.go('user.agentApply')

			// if ($scope.userInfo.isAmbass >= 1) {

			// } else {
			// 	Message.show('您还不是创客')
			// }
		}
		// 列表下拉刷新
		$scope.doRefresh = function () {
			//			$scope.noMore = false;
			//			Good.gethotgoodsList().then(function(response) {
			//				$scope.goodsList = response.data;
			//				$scope.$broadcast('scroll.refreshComplete');
			//				$ionicLoading.show({
			//					noBackdrop: true,
			//					template: '刷新成功！',
			//					pullingIcon: 'ion-android-bicycle',
			//					refreshingIcon: 'ion-android-bicycle',
			//					duration: '1000'
			//				});
			//				$scope.noMore = true;
			//				$scope.page = 2;
			//				$scope.goodisshow = false;
			//			});
			User.getuserinfo().then(function (response) {
				$scope.userinfo = response;
				var shopApply = Storage.get('user');
				//	shopApply = response.data;
				shopApply.isAmbass = response.data.isAmbass;
				shopApply.mostCost = response.data.mostCost;
				shopApply.agenttype = response.data.agenttype;
				shopApply.passtime = response.data.passtime;
				Storage.set('user', shopApply);
				$rootScope.globalInfo.user = shopApply;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					pullingIcon: 'ion-android-bicycle',
					refreshingIcon: 'ion-android-bicycle',
					duration: '1000'
				});
				//			console.log(Storage.get('user'));

			});
			aboutUs.serveInfo().then(function (response) {
				$scope.serveInfo = response.data;
				//			console.log(getInfo);
				//				$scope.shopsdetail.list.length = 3;
			});
		};
		//下拉加载
		//		$scope.noMore = true;
		//		$scope.page = 2;
		//		$scope.loadMoreGoods = function() {
		//			$scope.goodisshow = true;
		//			Good.gethotgoodsList($scope.page).then(function(response) {
		//				$scope.page++;
		//				$scope.goodsList = $scope.goodsList.concat(response.data);
		//				$scope.$broadcast('scroll.infiniteScrollComplete');
		//				if(response.code != 0) {
		//					$ionicLoading.show({
		//						noBackdrop: true,
		//						template: '没有更多商品了！',
		//						duration: '1200'
		//					});
		//					$scope.noMore = false;
		//				}
		//			});
		//		};

	})
	.controller('shoplinepayCtrl', function ($scope, $ionicPlatform, $cordovaCamera, Message, $ionicActionSheet, ENV, Order, Shop, $stateParams, $resource, $state, $timeout, User) {
		//		$(".shopslinepayalllist ul").remove("ul[id!=1]");
		$scope.spid = $stateParams.spid;
		$scope.shoppayinfo = [{},];
		$scope.plusmoney = 0;
		$scope.shopsinfo = {
			shopsGiveRatio: null
		};
		$scope.showremove = false;
		// 获取商家基本信息
		Shop.getUshops($scope.spid).then(function (data) {
			//			console.log(data);
			$scope.shopsinfo = data;
		});

		//手机号获取用户昵称
		$('.shopslinepayalllist').on('keyup', 'ul li:first-child input', function () {
			//			console.log($(this));
			if (ENV.REGULAR_Phone.test($(this).val())) {
				//				console.log($(this).parent().parent().find('li input'));
				var $thisdom = $(this).parent().parent().find('li:nth-child(3n+2) input');
				User.checkuserinfo($(this).val()).then(function (response) {
					//					$scope.userinfo1=response.data;
					//					console.log(response);
					//					console.log($(this).parent().parent().find('li input'));
					//					$(this).parent().parent().find('li input').val(response.data.name);
					$thisdom.val(response.data.name);
				})
				//				console.log($(this).parent().parent().find('li input'));
				//					$(this).parent().parent().find('li:nth-child(3n+2) input').val(response.data.name);
			} else if ($(this).val().length == 11 && !ENV.REGULAR_Phone.test($(this).val())) {
				Message.show('请输入正确的手机号码');
			}
			//			if($(this).val().length==11){
			//				console.log('11');
			//				User.checkuserinfo($(this).val()).then(function(response){
			//					$scope.userinfo1=response.data;
			//					console.log(response);
			//					
			//				})
			//			}
		});
		//消费金额改变计算金额
		$('.shopslinepayalllist').on('keyup', 'ul li:last-child input', function () {
			var datas = ($('ul.shopslinepay-list'));
			$scope.plusmoney = 0;
			for (var i = 0; i < datas.length; i++) {
				var dataone = datas[i].children;
				$scope.plusmoney = Number($scope.plusmoney) + Number(dataone[2].children[1].value);
			}
			var totmoney = $scope.plusmoney * $scope.shopsinfo.shopsGiveRatio / 100;
			$('.shopslinepay-footer div em').html(totmoney);
		})

		//增加行
		$scope.addrow = function () {
			var datas = ($('ul.shopslinepay-list'));
			console.log(datas.length);
			var nn = datas.length + 1;
			//				  console.log(datas[0]);
			if ($('.shopslinepayalllist li img').hasClass('showremove')) {
				$('.shopslinepayalllist').append("<ul class='shopslinepay-list' id=" + nn + ">\
				<li><img src='img/colorremove.png'class='showremove' id=" + nn + " /> \
				<span>用户手机号：</span><input type='text' placeholder='请输入消费手机号' value='' ></li>\
				<li><span>消费者名称：</span><input type='text' placeholder='消费者名称' value=''></li>\
				<li><span>消费金额：</span><input type='text' placeholder='请输入消费金额' value=''></li>\
			             </ul>")

			} else {
				$('.shopslinepayalllist').append("<ul class='shopslinepay-list' id=" + nn + ">\
				<li><img src='img/colorremove.png' id=" + nn + " /> \
				<span>用户手机号：</span><input type='text' placeholder='请输入消费手机号' value=''></li>\
				<li><span>消费者名称：</span><input type='text' placeholder='消费者名称' value=''></li>\
				<li><span>消费金额：</span><input type='text' placeholder='请输入消费金额' value=''></li>\
			             </ul>")
			}
		}
		//删除当前行
		$('.shopslinepayalllist ').on('click', '.shopslinepay-list li img', function () {
			if ($(this).id == 1) { } else {
				$(this).parent().parent().remove();
			}
		});
		//删除行显示
		$scope.removeshow = function () {
			if ($('.shopslinepayalllist li img').hasClass('showremove')) {
				$('.shopslinepayalllist li img').removeClass('showremove');
			} else {
				$('.shopslinepayalllist li img').addClass('showremove');
			}
			var datas = ($('ul.shopslinepay-list'));
			var nn = datas.length - 1;
			var aaa = datas[0];
		}
		//修改比例进行计算金额
		$scope.changebili = function () {
			console.log($scope.plusmoney);
			var totmoney = $scope.plusmoney * $scope.shopsinfo.shopsGiveRatio / 100;
			$('.shopslinepay-footer div em').html(totmoney);
		}

		//购买跳转
		$scope.goodsPay = function () {
			//			console.log($('ul.shopslinepay-list '));
			var datas = ($('ul.shopslinepay-list'));
			for (var i = 0; i < datas.length; i++) {
				var signles = {};
				var dataone = datas[i].children;
				signles.mobile = dataone[0].children[2].value;
				signles.username = dataone[1].children[1].value;
				signles.price = dataone[2].children[1].value;
				$scope.shoppayinfo[i] = signles;
			}
			console.log($scope.shoppayinfo);
			if ($scope.shoppayinfo[0].mobile == '') {
				Message.show('请填商家');

			}
			Order.getshoplinorder($scope.shoppayinfo, $scope.spid, $scope.shopsinfo.shopsGiveRatio).then(function (response) {
				var paybefore = response.data;
				if (response.code == 0) {

				} else {
					Message.show(response.msg);
				}
			});
			//
		};

	})
	.controller('linepayCtrl', function ($scope, $ionicPlatform, $cordovaCamera, Message, $ionicActionSheet, ENV, Order, Shop, $stateParams, $resource, $state, $timeout) {
		//用户线下付款
		$scope.spid = $stateParams.spid;
		$scope.pay = {
			linepaymoney: null
		};
		// 获取商家基本信息
		Shop.getUshops($scope.spid).then(function (data) {
			$scope.shopsinfo = data;
		});
		//购买跳转不判断余额
		$scope.goodsPay = function () {
			if ($scope.pay.linepaymoney < 1) {
				Message.show('支付金额小于最低额度');
				return false;
			}
			Order.userlinepay($scope.spid, $scope.pay.linepaymoney).then(function (response) {
				//				var paybefore = response.e;
			});

		};
	})
	.controller('userPayCtrl', function ($scope, $ionicPlatform, $cordovaCamera, Message, $ionicActionSheet, ENV, Order, Shop, $stateParams, $resource, $state, $timeout) {
		$scope.spid = $stateParams.spid;
		$scope.shopsName = {};
		$scope.correct = '';
		// 获取商家基本信息
		Shop.getUshops($scope.spid).then(function (data) {
			$scope.shopsName = data;
			if ($scope.shopsName.isPay == '0') {
				$scope.correct = 'correct';
			}
		});

		/*上传支付凭证*/
		$scope.payInfo = {
			money: '',
			img: '',
			remark: '',
			orderType: ''
		};
		var selectImages = function (from) {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					$scope.payInfo.img = "data:image/jpeg;base64," + imageURI;
					var image = document.getElementById('divImg');
					image.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
				}, function (error) {
					console.log('失败原因：' + error);
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 弹出选择图片
		$scope.uploadAvatar = function () {
			var buttons = [];
			buttons = [{
				text: "拍一张照片"
			}, {
				text: "从相册选一张"
			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera");
					} else if (index == 1) {
						selectImages();
					}
					return true;
				}
			})
		};
		// 提交
		$scope.sureSubmit = function () {
			if (!$scope.payInfo.money || !ENV.REGULAR_MONEY.test($scope.payInfo.money)) {
				Message.show('请输入正确的金额！');
				return;
			}
			if (!$scope.payInfo.img) {
				Message.show('请上传支付凭证！');
				return;
			}
			if (!$scope.payInfo.remark) {
				Message.show('请输入备注信息！');
				return;
			}
			$scope.payInfo.orderType = '2';
			console.log($scope.payInfo);
			Order.subcreate($scope.payInfo.money, $scope.payInfo.img, $scope.payInfo.remark, $scope.spid, $scope.payInfo.orderType);
		};
		//购买跳转不判断余额
		var resource = $resource(ENV.YD_URL, {
			do: 'order',
			op: '@op'
		});
		$scope.goodsPay = function () {
			//			console.log($scope.orderInfo);
			var _json = {
				op: 'create_offline',
				//	orderId: $scope.orderInfo.orderId,
				payPrice: $scope.payInfo.money,
				spid: $scope.spid,
				orderType: '1'
			};
			resource.save(_json, function (response) {
				console.log(response);
				var paybefore = response.data;
				if (response.code == 0) {
					Message.show(response.msg);
					$state.go('shops.pay', {
						orderId: paybefore.orderId,
						payPrice: paybefore.money,
						spid: paybefore.spid
					});

				} else {
					Message.show(response.msg);
				}
			}, function () {
				Message.show('通信错误，请检查网络!', 1500);
			});

		};
		//购买跳转计算余额
		//		$scope.goodsPay = function() {
		//			console.log($scope.orderInfo);
		//			var orderid = $scope.orderInfo.orderId;
		//			var factprice = $scope.baInfo.factMoney;
		//			console.log(factprice);
		//			var _json = {
		//				op: 'update',
		//				orderId: $scope.orderInfo.orderId,
		//				balanceAll: $scope.baInfo.welBalance,
		//				balanceUse: $scope.baInfo.balanceUse,
		//				payPrice: factprice
		//			};
		//			//不判断余额
		//			//			$state.go('shops.pay',{
		//			//				orderId: orderid,
		//			//				payPrice: $scope.orderInfo.orderPrice,
		//			//				spid:$scope.orderInfo.spid
		//			//			});
		//			console.log(factprice);
		//			if(factprice == '0') {
		//				resource.save(_json, function(response) {
		//					console.log(response);
		//					//			$state.go('shops.credit');
		//					if(response.code == '0') {
		//						console.log(response.code);
		//						$('#showchange').hide();
		//						$('.order-noshow').show();
		//						//				$timeout(function() {
		//						//					Message.show(response.msg);
		//						//				}, 1200);
		//					} else {
		//						Message.show(response.msg);
		//					}
		//				}, function() {
		//					Message.show('通信错误，请检查网络!', 1500);
		//				});
		//				//$state.go('shops.credit');
		//			} else {
		//				resource.save(_json, function(response) {
		//					console.log(response);
		//					var paybefore = response.data;
		//					if(response.code == 0) {
		//						$state.go('shops.pay', {
		//							orderId: paybefore.orderId,
		//							payPrice: paybefore.payPrice,
		//							spid: paybefore.spid
		//						});
		//						//				$timeout(function() {
		//						//					Message.show(response.msg);
		//						//				}, 1200);
		//					} else {
		//						Message.show(response.msg);
		//					}
		//				}, function() {
		//					Message.show('通信错误，请检查网络!', 1500);
		//				});
		//			}
		//		};
	})
	.controller('countCtrl', function ($scope, $ionicSlideBoxDelegate, System) {
		$scope.countInfo = {
			settled: '',
			shopsLove: '',
			userLove: '',
			yesterday: '',
			shopsList: ''
		};
		$scope.curTab = 0;
		$scope.selectTab = function (index) {
			$scope.slectIndex = index;
			$ionicSlideBoxDelegate.slide(index);
		};
		$scope.slideHasChanged = function (index) {
			$scope.curTab = index;
		};
		System.fetchCount().then(function (data) {
			$scope.countInfo = data;
		});
	})
	.controller('shopsRoleMapCtrl', function ($scope, $rootScope, Home, Message, $cordovaInAppBrowser, $timeout, $ionicHistory) {
		//		$scope.$on('$ionicView.beforeEnter',function(){
		//			$scope.add=function(a){
		//		if(a==1){
		//			window.location.reload;
		//		}
		//	}
		//	$timeout(function(){
		//		$scope.add(2);
		//	},50)
		//		})
		$timeout(function () {
			var map = new BMap.Map("shoprolrMap");
			//	    var points = new BMap.Point(116.912494, 36.812038);
			map.centerAndZoom('河南', 5);
			map.enableScrollWheelZoom(true);
			Home.shopsrolelist().then(function (response) {
				//				console.log(response);
				//				$scope.rolelist = response.data;
				if (response.data != '') {
					angular.forEach(response.data, function (objs) {
						$scope.addMarkerloc(objs.birth, objs.count, objs.location);
					})
				}
			});
			$scope.addMarkerloc = function (birth, count, location) {
				var point = new BMap.Point(location.lng, location.lat);
				//				var marker = new BMap.Marker(point);
				var opts = {
					position: point, // 指定文本标注所在的地理位置
					offset: new BMap.Size(-27, -68) //设置文本偏移量
				}
				var label = new BMap.Label("<span>" + birth + "</span><span>" + count + "</span>", opts); // 创建文本标注对象
				label.setStyle({
					color: "red",
					fontSize: "12px",
					height: "auto",
					lineHeight: "20px",
					fontFamily: "微软雅黑"
				});
				map.addOverlay(label);
			}
		}, 50)
		//	$scope.$on("$ionicView.beforeLeave", function() {
		//						console.log('11111');
		//			$ionicHistory.clearCache(['shops.shopsRoleMap']);
		//		});
		//		$scope.$on("$ionicView.afterLeave", function() {
		//			console.log('222');
		//			$ionicHistory.clearCache(['shops.shopsRoleMap']);
		//			
		//		});
		//		var marker = new BMap.Marker(point);
		//		map.addOverlay(marker);
		//			var opts = {
		//			  position : point,    // 指定文本标注所在的地理位置
		//			  offset: new BMap.Size(-27,-68)    //设置文本偏移量
		//			}
		//					var label = new BMap.Label("<span>河南</span><span>11</span>", opts);  // 创建文本标注对象
		//			label.setStyle({
		//				 color : "red",
		//			 fontSize : "12px",
		//			 height : "auto",
		//			 lineHeight : "20px",
		//			 fontFamily:"微软雅黑"
		//			 });
		//		 map.addOverlay(label);

		//	var opts = {
		//	  position : point,    // 指定文本标注所在的地理位置
		//	  offset: new BMap.Size(-30,-80)    //设置文本偏移量
		//	}
		//	var label = new BMap.Label("<span>郑州市</span><span>1100</span>", opts);  // 创建文本标注对象
		//		label.setStyle({
		//			 color : "red",
		//			 fontSize : "12px",
		//			 height : "auto",
		//			 lineHeight : "20px",
		//			 fontFamily:"微软雅黑"
		//		 });
		//		 map.addOverlay(label);
		//	marker.setLabel(label);

	})
	.controller('shopsMapCtrl', function ($scope, $rootScope, Shop, Home, Good, $stateParams, $ionicSlideBoxDelegate, Message, $cordovaInAppBrowser, $timeout, $state) {
		console.log($stateParams);
		$scope.locationInfo = $stateParams;
		console.log($scope.locationInfo.location.lat);
		var map = new BMap.Map("shopMap"); // 创建Map实例
		map.centerAndZoom(new BMap.Point($scope.locationInfo.location.lng, $scope.locationInfo.location.lat), 18);
		map.enableScrollWheelZoom(true);
		//标注点1
		var pt = new BMap.Point($scope.locationInfo.location.lng, $scope.locationInfo.location.lat);
		//		var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(100, 80));
		//		var marker2 = new BMap.Marker(pt, {
		//			icon: myIcon
		//		}); // 创建标注
		var myIcon = new BMap.Icon("img_ad/location.png", new BMap.Size(20, 20));
		var marker = new BMap.Marker(pt, {
			icon: myIcon
		});
		map.addOverlay(marker);
		//		marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		var opts = {
			width: 120, // 信息窗口宽度
			height: 80, // 信息窗口高度
			title: $scope.locationInfo.title, // 信息窗口标题
		}
		var infoWindow = new BMap.InfoWindow("地址:" + $scope.locationInfo.birthInfo + $scope.locationInfo.address, opts);
		map.openInfoWindow(infoWindow, pt);
		//	var output = "从天安门到百度大厦驾车需要";
		//	var searchComplete = function (results){
		//		if (transit.getStatus() != BMAP_STATUS_SUCCESS){
		//			return ;
		//		}
		//		var plan = results.getPlan(0);
		//		output += plan.getDuration(true) + "\n";                //获取时间
		//		output += "总路程为：" ;
		//		output += plan.getDistance(true) + "\n";             //获取距离
		//	}
		//	var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
		//		onSearchComplete: searchComplete,
		//		onPolylinesSet: function(){        
		//			setTimeout(function(){alert(output)},"1000");
		//	}});
		//	 transit.search("天安门", "百度大厦");
		$scope.showAddress = function (url) {
			console.log(url);
			document.addEventListener("deviceready", function () {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'
				};
				$cordovaInAppBrowser.open(url, '_system', options)
					.then(function (event) {
						console.log(event)
					})
					.catch(function (event) {
						// error
						console.log(event)
					});
			}, false);
		};
	})
	.controller('linenearshoplistCtrl', function ($scope, $rootScope, Shop, Home, Good, $stateParams, $ionicSlideBoxDelegate, Message, $cordovaInAppBrowser, $timeout, $state, User, $ionicLoading) {

		$scope.shopsdetail = {
			locationUrl: '',
			isFollow: 0,
			followNum: 0,
			goods: ''
		};
		Shop.lineshopnear('more').then(function (response) {
			console.log(response);
			Message.hidden();
			$scope.lineshopsList = response.data;
		});

		$scope.doRefresh = function () {
			$scope.noMore = false;
			Shop.lineshopnear('more').then(function (response) {
				$scope.lineshopsList = response.data;
				$scope.refreshing = true; //下拉加载时避免上拉触发
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '200'
				});
			});
			$scope.noMore = true;
			$scope.page = 2;
		};
		// 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Shop.lineshopnear('more', $scope.page).then(function (response) {
				$scope.page++;
				$scope.lineshopsList = $scope.lineshopsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
				}

			});
		};

	})
	.controller('shopsInfoCtrl', function ($scope, $rootScope, Shop, Home, Good, $stateParams, $ionicSlideBoxDelegate, Message, $cordovaInAppBrowser, $timeout, $state, User, $ionicModal) {
		$scope.$on("$ionicView.beforeEnter", function () {
			console.log($stateParams);
			$scope.isCollect = 0;
			if ($rootScope.globalInfo.user.uid) {
				Shop.iscollect($stateParams.spid, $rootScope.globalInfo.user.uid).then(function (response) {
					if (response.data == 1) {
						$scope.isCollect = 1;
					}
				})
			}
		})
		$scope.shopsdetail = {
			locationUrl: '',
			isFollow: 0,
			followNum: 0,
			goods: ''
		};
		Shop.getShopsDetail($stateParams.spid).then(function (data) {
			console.log(data);
			Message.hidden();
			$scope.shopsdetail = data;
			$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
		});
		$scope.gocollect = function () {
			User.getcollect($scope.isCollect, $stateParams.spid).then(function (response) {
				$scope.isCollect = response.data.type_collect;
				$('.tit .collectnum').html(response.data.total);

			})
		}
		Shop.lineshopnear().then(function (response) {
			console.log(response);
			Message.hidden();
			$scope.lineshopsList = response.data;
		});

		$timeout(function () {
			if ($scope.shopsdetail.id != '') {
				var t = $(".shopsinfo-bottom .address li:first").height() / $(".shopsinfo-bottom .address li:first p").height();
				$(".shopsinfo-bottom .address li:first p").css({
					lineHeight: t * 16 + "px",
					height: t * $(".shopsinfo-bottom .address li:first p").height(),
				});
			}
		}, 300);
		// 添加银行卡号
		$ionicModal.fromTemplateUrl('templates/modal/singlelicence.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.singlelicence = modal;
		});
		$scope.openModal = function () {
			$scope.singlelicence.show();

		};

		//		$scope.praise = function() {
		//			if($scope.shopsdetail.isFollow == 0) {
		//				Shop.praise($scope.shopsdetail.id).then(function(response) {
		//					if(response.code == 0) {
		//						$scope.shopsdetail.followNum++;
		//						Message.show(response.msg);
		//					} else {
		//						Message.show('您已经赞过');
		//					}
		//				});
		//			} else {
		//				Message.show('您已经赞过');
		//			}
		//		};
		//		$scope.goVR = function(testurl) {
		//			console.log($scope.shopsdetail);
		//			console.log(testurl);
		//			document.addEventListener("deviceready", function() {
		//				var options = {
		//					location: 'no',
		//					clearcache: 'yes',
		//					toolbar: 'yes',
		//					toolbarposition: 'top'
		//				};
		//				$cordovaInAppBrowser.open($scope.shopsdetail.vrUrl, '_blank', options)
		//					.then(function(event) {
		//						console.log(event)
		//					})
		//					.catch(function(event) {
		//						console.log(event)
		//					});
		//			}, false);
		//		}
		$scope.showAddress = function (url) {
			console.log(url);
			document.addEventListener("deviceready", function () {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'

				};
				$cordovaInAppBrowser.open(url, '_system', options)
					.then(function (event) {
						console.log(event)
					})
					.catch(function (event) {
						// error
						console.log(event)
					});
			}, false);
		};

	})
	.controller('onlineorderInfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User, Cart) {
		//		if($stateParams.ordertype=='interim'){
		//			Storage.set('orderinterim','interim')
		//		}

		// 自提商家账号
		$scope.info = {
			selfReceive: ''

		}

		console.log(Storage.get('orderinterim'));
		if (Storage.get('orderinterim')) {
			$scope.ordertype = Storage.get('orderinterim');
		}
		$scope.remarks = [];
		$scope.orderlist = {};
		Cart.showorder($scope.ordertype).then(function (response) {
			$scope.orderlist = response.data;
		});
		$scope.myFunc = function (spid) {
			angular.forEach($scope.orderlist.orderinfo, function (obj) {
				if (obj.spid == spid) {
					var remark = {};
					remark.spid = spid;
					remark.remark = $('#p' + spid + ' textarea').val();
					var remarksinfo = $scope.remarks;
					//					console.log($scope.remarks);
					if (remarksinfo != '') {
						for (var i = 0; i < remarksinfo.length; i++) {
							if (JSON.stringify(remarksinfo).indexOf(JSON.stringify(remark.spid)) != -1) {
								if (remarksinfo[i].spid == spid) {
									remarksinfo[i] = remark;
								}
							} else {
								remarksinfo.push(remark);
							}
						}
					} else {
						remarksinfo.push(remark);
					}
					$scope.remarks = remarksinfo;
					console.log($scope.remarks);
				}
			});
		}

		var resource = $resource(ENV.YD_URL, {
			do: 'order',
			op: '@op'
		});
		//购买跳转
		$scope.cartgoodsPay = function () {
			console.log($scope.remarks);
			if (!$scope.orderlist.addressinfo && !$scope.info.selfReceive) {
				Message.show('请选择收货方式');
				return
			} else {
				if ($scope.ordertype != '') {
					Order.oncreate($scope.remarks, $scope.ordertype, $scope.info.selfReceive);
				} else {
					Order.oncreate($scope.remarks, "", $scope.info.selfReceive);
				}
			}

		}

	})
	.controller('shoponlineorderInfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {
		Order.getInfo($stateParams.id).then(function (response) {
			$scope.orderInfo = response;
		});
		$scope.delorder = function (orderid, ids) {
			Order.deleteorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					$state.go('my.my-order');
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.statusName = {
			'0': '待付款',
			'1': '待发货',
			'2': '待收货',
			'3': '已完成',
			'-1': '已取消',
			'-2': '已删除',
			'-3': '申请退款',
			'-4': '已退款'
		};

	})
	.controller('useronlineorderInfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {
		Order.getInfo($stateParams.id).then(function (response) {
			$scope.orderInfo = response;
		});
		Order.exitApply($stateParams).then(function (response) {
			console.log(response);
			$scope.exitinfo = response.data;
		});
		$scope.cancel = function (orderid, ids) {
			Order.cancelorder(orderid, ids).then(function (repsonse) {
				console.log(repsonse);
				if (repsonse.code == '0') {
					Order.getInfo($stateParams.id).then(function (response) {
						$scope.orderInfo = response;
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.delorder = function (orderid, ids) {
			Order.deleteorder(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					$state.go('my.my-order');
				} else {
					Message.show(repsonse.msg);
				}
			});
		}
		$scope.confirmorder = function (orderid, ids) {
			Order.orderconfirm(orderid, ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Message.show('收货成功');
					Order.getInfo($stateParams.id).then(function (response) {
						$scope.orderInfo = response;
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		};
		$scope.statusName = {
			'0': '待付款',
			'1': '待发货',
			'2': '待收货',
			'3': '待评价',
			'4': '已完成',
			'-1': '已取消',
			'-2': '退款中',
			'-3': '申请退款',
			'-4': '已退款'
		};

	})
	.controller('userlineorderInfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {
		// orderStatus -2: 代表平台拒绝, -1: 商家拒绝， 0： 待商家确认， 1： 商家已确认待平台确认， 2： 平台已确认订单完成
		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '待评价',
				'4': '已完成',
				'-1': '已取消',
				'-2': '申请退款',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '待评价',
				'4': '已完成',
				'-1': '已取消',
				'-2': '申请退款',
				'-3': '申请退款',
				'-4': '已退款'
			};
		}
		$scope.statusName = {
			'0': '待付款',
			'1': '待发货',
			'2': '待收货',
			'3': '待评价',
			'4': '已完成',
			'-1': '已取消',
			'-2': '申请退款',
			'-3': '申请退款',
			'-4': '已退款'
		};
		Order.getInfo($stateParams.id).then(function (data) {
			$scope.orderInfo = data;
			$scope.pos = data.shop.birth;
			Storage.set('goodsid', data.id);
		});
	})
	.controller('shoplineshoporderinfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {
		// orderStatus -2: 代表平台拒绝, -1: 商家拒绝， 0： 待商家确认， 1： 商家已确认待平台确认， 2： 平台已确认订单完成
		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		}
		Order.getInfo($stateParams.id).then(function (data) {
			$scope.goodslist = data;
			$scope.pos = data.shop.birth;
		});

	})
	.controller('shoplineuserorderinfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {
		// orderStatus -2: 代表平台拒绝, -1: 商家拒绝， 0： 待商家确认， 1： 商家已确认待平台确认， 2： 平台已确认订单完成
		$scope.bigImage = false; //初始默认大图是隐藏的  
		$scope.hideBigImage = function () {
			$scope.bigImage = false;
		};
		//点击图片放大  
		$scope.shouBigImage = function () { //传递一个参数（图片的URl）  
			//  $scope.Url = imageName;       //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用  
			$scope.bigImage = true; //显示大图  
		};
		$scope.paybal = '';
		$scope.type = $stateParams.type;
		$scope.orderInfo = {
			orderStatus: '',
			refuseCont: ''
		};
		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			}
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		}
		Order.getInfo($stateParams.id).then(function (data) {
			$scope.goodslist = data;
			$scope.pos = data.shop.birth;
		});
		var resource = $resource(ENV.YD_URL, {
			do: 'order',
			op: '@op'
		});
		//购买跳转
		$scope.goodsPay = function () {
			if (!$scope.orderInfo.addressInfo || $scope.orderInfo.addressInfo == '') {
				Message.show('请选择收货地址');
				return
			}
			var _json = {
				op: 'orderUpdate',
				orderId: $scope.orderInfo.orderId
			}
			resource.save(_json, function (response) {
				console.log(response);
				if (response.code == 0) {
					$state.go('shops.pay', {
						orderId: $scope.orderInfo.orderId,
						payPrice: $scope.orderInfo.payPrice,
						spid: $scope.orderInfo.spid
					});
				} else {
					Message.show(response.msg);
				}
			})

		};
	})
	.controller('shopsOrderInfoCtrl', function ($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {
		// orderStatus -2: 代表平台拒绝, -1: 商家拒绝， 0： 待商家确认， 1： 商家已确认待平台确认， 2： 平台已确认订单完成
		$scope.dcode = {
			code: ''
		};
		$scope.bigImage = false; //初始默认大图是隐藏的  
		$scope.hideBigImage = function () {
			$scope.bigImage = false;
		};
		//点击图片放大  
		$scope.shouBigImage = function () { //传递一个参数（图片的URl）  
			//  $scope.Url = imageName;       //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用  
			$scope.bigImage = true; //显示大图  
		};
		$scope.paybal = '';
		$scope.type = $stateParams.type;
		console.log($stateParams);
		$scope.orderInfo = {
			orderStatus: '',
			refuseCont: ''
		};

		if ($scope.type == 'shops') {
			$scope.orderTypes = {
				'0': '线上下单',
				'1': '扫码付款',
				'2': '扫码报单'
			}
		} else if ($scope.type == 'user') {
			$scope.orderTypes = {
				'0': '线上下单',
				'1': '扫码付款',
				'2': '扫码报单'
			}
		} else {
			$scope.orderTypes = {
				'0': '线上下单',
				'1': '扫码付款',
				'2': '扫码报单'
			}
		}
		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		} else {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
			};
		}
		//报单状态
		if ($scope.type == 'shops') {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
			};
		} else if ($scope.type == 'user') {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
			};
		} else {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
			};
		}
		Order.getInfo($stateParams.id).then(function (data) {
			console.log(data);
			$scope.orderInfo = data;
			$scope.baInfo = data.user;
			$scope.pos = data.shop.birth;
			Storage.set('goodsid', data.id);
		});
		var resource = $resource(ENV.YD_URL, {
			do: 'order',
			op: '@op'
		});
		//购买跳转
		$scope.goodsPay = function () {
			console.log($scope.orderInfo);
			if (!$scope.orderInfo.addressInfo || $scope.orderInfo.addressInfo == '') {
				Message.show('请选择收货地址');
				return
			}
			var _json = {
				op: 'orderUpdate',
				orderId: $scope.orderInfo.orderId
			}
			resource.save(_json, function (response) {
				console.log(response);
				if (response.code == 0) {
					$state.go('shops.pay', {
						orderId: $scope.orderInfo.orderId,
						payPrice: $scope.orderInfo.payPrice,
						spid: $scope.orderInfo.spid
					});
				} else {
					Message.show(response.msg);
				}
			})

		};
		//核销框显示
		if ($scope.orderInfo.orderStatus == '1') {
			$('.bdel').css('display', 'block');
		} else {
			$('.bdel').css('display', 'none');
		}
		//去核销
		$scope.godel = function (code) {
			console.log($scope.orderInfo);
			var order = $scope.orderInfo.orderId;
			console.log(code);
			var _json = {
				op: 'bdel',
				orderId: order,
				code: code.code
			};
			resource.save(_json, function (response) {
				console.log(response);
				if (response.code == 0) {
					$state.go('shops.orderList'({
						type: 'shops',
						orderType: 0
					}));
					$timeout(function () {
						Message.show(response.msg);
					}, 1200);
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			}, function () {
				Message.show('通信错误，请检查网络!', 1500);
			});
		};
		//商家报单支付凭证
		/*上传支付凭证*/
		$scope.payInfo = {
			img: ''
			//			orderType: ''
		};
		var selectImages = function (from) {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					$scope.payInfo.img = "data:image/jpeg;base64," + imageURI;
					var image = document.getElementById('divImg');
					image.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
				}, function (error) {
					console.log('失败原因：' + error);
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 弹出选择图片
		$scope.uploadAvatar = function () {
			var buttons = [];
			buttons = [{
				text: "拍一张照片"
			}, {
				text: "从相册选一张"
			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera");
					} else if (index == 1) {
						selectImages();
					}
					return true;
				}
			})
		};
		$scope.sureSubmit = function (orderid) {
			var _json = {
				op: 'shopConfirm',
				orderId: orderid,
				shopVoucher: $scope.payInfo.img
			};
			if (!$scope.payInfo.img) {
				Message.show('请上传支付凭证！');
				return;
			}
			resource.save(_json, function (response) {
				console.log(response);
				if (response.code == 0) {
					Message.show('提交成功');
					$state.go('shops.reportOrder', {
						type: 'shops',
						orderType: 2
					});
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			}, function () {
				Message.show('通信错误，请检查网络!', 1500);
			});
		};
		// 支付凭证modal
		$ionicModal.fromTemplateUrl('templates/modal/payVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.payVoucher = modal;
		});
		$scope.showVoucher = function () {
			$scope.payVoucher.show()
		};
		// 拒绝原因modal
		$ionicModal.fromTemplateUrl('templates/modal/reject.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.reject = modal;
		});
		$scope.rejectContent = function () {
			$scope.reject.show()
		};
		// 拒绝订单
		$scope.refuse = function () {
			if (!$scope.orderInfo.refuseCont) {
				Message.show('请输入拒绝原因！');
				return;
			}
			Order.refuse($scope.orderInfo.refuseCont, $stateParams.id).then(function (response) {
				Message.hidden();
				if (response.code == 0) {
					$scope.reject.hide();
					$state.go('shops.orderList', {
						'type': 'shops'
					});
					$timeout(function () {
						Message.show('订单拒绝成功！');
					}, 1000);
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			});
		};

	})
	.controller('indexactiveInfoCtrl', function ($scope, Shop, $stateParams, $ionicSlideBoxDelegate, Article, Message, $cordovaInAppBrowser) {

		Article.getactiveinfo($stateParams.cid).then(function (response) {
			console.log(response);
			$scope.articlesdetail = response.data;
			$('.activeadricle').html($scope.articlesdetail.info);
		});
	})

	.controller('articlesInfoCtrl', function ($scope, Shop, $stateParams, $ionicSlideBoxDelegate, Article, Message, $cordovaInAppBrowser) {
		$scope.articlesdetail = {
			article: ''
		};
		Article.getArticlesDetail($stateParams.id).then(function (data) {
			Message.hidden();
			console.log(data);
			$scope.articlesdetail.article = data;
		});
	})

	.controller('onlinegoodsInfoCtrl', function ($rootScope, $scope, $state, Shop, Home, $stateParams, Storage, ENV, $sanitize, $ionicSlideBoxDelegate, Good, Message, $ionicActionSheet, $ionicModal, Cart, User, $window, $cordovaInAppBrowser, $sce) {
		$scope.$on("$ionicView.beforeEnter", function () {
			console.log($stateParams);
			$scope.isCollect = 0;
			if ($rootScope.globalInfo.user.uid) {
				Shop.iscollect($stateParams.spid, $rootScope.globalInfo.user.uid, $stateParams.id).then(function (response) {
					if (response.data == 1) {
						$scope.isCollect = 1;
					}
				})
			}
		})

		$scope.isAcross = $stateParams.isAcross;
		$scope.showCart = false;
		$scope.hideCart = function () {
			$scope.showCart = false;
		}
		$scope.gocollect = function () {
			User.getcollect($scope.isCollect, $stateParams.spid, $stateParams.id).then(function (response) {
				$scope.isCollect = response.data.type_collect;
				$('.goodsinfo-bottom a .collectnum b').html(response.data.total);
			})
		}
		$scope.addtype = false;
		$scope.goodPrice = false;
		$scope.goodsdetail = {};
		$scope.good = {
			price: '',
			count: '',
			spid: '',
			goodsId: '',
			id: '',
			totNum: null
		}
		$scope.goodcart = {
			gooddatas: {},
			goodbute1: '',
			goodbute2: '',
			goodsId: '',
			id: '',
			count: $scope.goodsdetail.total,
			spid: '',
			buyNum: null
		}
		$scope.clickstyle1 = '';
		$scope.clickstyle2 = '';
		$scope.attributetype = false;
		Good.getonGoodsInfo($stateParams.id).then(function (response) {
			Message.hidden();
			console.log(response);
			$scope.goodsdetail = response.data;
			$scope.good.price = $scope.goodsdetail.spe_price;
			$scope.good.count = $scope.goodsdetail.total;
			$scope.goodcart.spid = $scope.goodsdetail.spid;
			$scope.goodcart.goodsId = $scope.goodsdetail.id;
			$scope.goodcart.gooddatas = $scope.goodsdetail.attrdata;
			$scope.goodsdetail.slide = angular.fromJson($scope.goodsdetail.thumbs);
			$scope.goodsdetail.info = $sce.trustAsHtml($scope.goodsdetail.info);
			$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			$ionicSlideBoxDelegate.loop(true);
			angular.forEach($scope.goodsdetail.judgeList, function (i, v) {
				i.mobile = i.mobile.replace(i.mobile.substring(3, 7), "****")
			})
		});

		$scope.buyNum = {
			buynum: 1
		};
		$scope.addNum = function () {
			$scope.buyNum.buynum++;
		};
		$scope.minusNum = function () {
			if ($scope.buyNum.buynum > 1) {
				$scope.buyNum.buynum--;
			}
		};
		$scope.inputNum = function () {
			console.log($scope.buyNum.buynum)
		}
		//客服
		$scope.customerserve = function () {
			//				var	qqhtml="<a target='_blank' style='color:#007aff;' href='http://wpa.qq.com/msgrd?v=3&uin="+$scope.goodsdetail.shops.QQ+"&site=qq&menu=yes'>QQ客服</a>";
			//				var	qqhtml='<a target="_blank" style="color:#007aff;"  href="http://wpa.qq.com/msgrd?v=3&uin='+$scope.goodsdetail.shops.QQ+'&site=qq&menu=yes">QQ客服</a>';
			var qqurl = "http://wpa.qq.com/msgrd?v=3&uin=" + $scope.goodsdetail.shops.QQ + "&site=qq&menu=yes";
			var buttons = [];
			buttons = [{
				text: $scope.goodsdetail.shops.tel
			}, {
				text: "在线咨询",

			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.callPhone($scope.goodsdetail.shops.tel);
					} else if (index == 1) {

						// $scope.getqq(qqurl);
						$state.go('user.imMessagePerson', {
							username: $scope.goodsdetail.shops.userMobile
						});
					}
					return true;
				}
			})
		};

		$scope.callPhone = function (mobilePhone) {
			//console.log("拨打:" + mobilePhone);
			$window.location.href = "tel:" + mobilePhone;
		};

		//qq聊天
		$scope.getqq = function (qqurl) {
			console.log(qqurl);
			//			 $window.location.href = qqurl;
			document.addEventListener("deviceready", function () {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'
				};
				$cordovaInAppBrowser.open(qqurl, '_system', options)
					.then(function (event) {
						console.log(event)
					})
					.catch(function (event) {
						// error
						console.log(event)
					});
			}, false);
		}

		//分享

		$scope.sharegoods = function () {
			$scope.showtype = true;
			//			var hideSheet = $ionicActionSheet.show({
			//				buttons: [{
			//						'text': '分享给好友'
			//					},
			//					{
			//						'text': '分享到朋友圈'
			//					},
			//					{
			//						'text': '分享到QQ'
			//					},
			//					{
			//						'text': '分享到QQ朋友圈'
			//					}
			//				],
			//				cancelText: '取消',
			//				buttonClicked: function(index) {
			//					if(index == 0) {
			//						$scope.sharechats(0);
			//						hideSheet();
			//					} else if(index == 1) {
			//						$scope.sharechats(1);
			//						hideSheet();
			//					} else if(index == 2) {
			//						$scope.shareQQ(2);
			//						hideSheet();
			//					} else if(index == 3) {
			//						$scope.shareQQ(3);
			//						hideSheet();
			//					}
			//				}
			//
			//			});

		};

		$scope.sharechats = function (scene) {

			console.log($scope.goodsdetail);
			var url = ENV.shareLink + 'goods/onlinegoodsInfo/' + $scope.goodsdetail.id
			console.log(url)
			Wechat.share({
				message: {
					title: $scope.goodsdetail.goodsName,
					description: $scope.goodsdetail.goodsTag,
					thumb: $scope.goodsdetail.thumbs[0],
					// url: url ?url : "http://baidu.com"
					media: {
						type: Wechat.Type.WEBPAGE,
						webpageUrl: $scope.goodsdetail.shareLink
					}
				},
				scene: scene // share to Timeline  
			}, function () {
				//								alert("Success");
			}, function (reason) {
				//								alert("Failed: " + reason);
			});
		};

		$scope.buttontype = function (index) {
			if (index == 0) {
				$scope.sharechats(0);
				$scope.showtype = false;
			} else if (index == 1) {
				$scope.sharechats(1);
				$scope.showtype = false;
			} else if (index == 2) {
				$scope.shareQQ(2);
				$scope.showtype = false;
			} else if (index == 3) {
				$scope.shareQQ(3);
				$scope.showtype = false;
			} else if (index == 'none') {
				$scope.showtype = false;
			}
		}
		$scope.shareQQ = function (type) {
			var args = {};
			if (type == 2) {
				args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
			}
			if (type == 3) {
				args.scene = QQSDK.Scene.QQZone; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
			}
			args.url = ENV.shareLink + 'goods/onlinegoodsInfo/' + $scope.goodsdetail.id
			//			args.url='https://cordova.apache.org';
			//			args.url='http://sd2app.weishang6688.com';
			args.client = QQSDK.ClientType.QQ; //QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
			args.title = '来和我一起购物吧';
			args.description = $scope.goodsdetail.goodsName;
			args.image = $scope.goodsdetail.thumb;
			QQSDK.shareNews(function () {
				Message.show('分享成功')
			}, function (failReason) {
				Message.show(failReason);
			}, args);
		}

		// 添加购物车
		//		$ionicModal.fromTemplateUrl('templates/modal/carts.html', {
		//			scope: $scope,
		//			animation: 'slide-in-left'
		//		}).then(function(modal) {
		//			$scope.addCart = modal;
		//		});
		$scope.addCarts = function (buyid) {
			$scope.showCart = true;
			//			$scope.addCart.show();
			$scope.clickstyle1 = '';
			$scope.clickstyle2 = '';
			$scope.good = {
				price: $scope.goodsdetail.spe_price,
				count: $scope.goodsdetail.total,
				spid: '',
				goodsId: '',
				id: '',
				totNum: null
			}
			$scope.goodcart = {
				gooddatas: $scope.goodsdetail.attrdata,
				goodbute1: '',
				goodbute2: '',
				spid: $scope.goodsdetail.spid,
				goodsId: $scope.goodsdetail.id,
				id: '',
				count: $scope.goodsdetail.total,
				totNum: null
			}

			$('.attribute-common li').removeClass('selectstyle');
			$('.attribute-common li').removeClass('unclick');
			if (buyid == 1) {
				$scope.addtype = true;
			} else {
				$scope.addtype = false;
			}
		};
		$scope.changebute1 = function (idnum, item1) {
			//			console.log(item1);
			if ($('.attribute-common #item1' + idnum).css("background-color") == 'rgb(153, 153, 153)') {
				//	alert(false);
				return
			}
			//bute2存在
			if ($scope.goodsdetail.attr[1].data[0] != '') {
				//				console.log('aa');
				//bute2为空
				if ($('.attribute-common #item1' + idnum).hasClass('selectstyle')) {
					//bute1有选中状态，取消选中状态
					$scope.clickstyle1 = '';
					$scope.goodcart.goodbute1 = '';
					$('.attribute2 li').removeClass('unclick');
					$scope.goodPrice = false;
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
					console.log($scope.goodsdetail);
				} else {
					//bute1无选中状态，添加选中状态
					$scope.attributetype = true;
					$scope.clickstyle1 = item1;
					$scope.goodcart.goodbute1 = item1;
					$scope.goodPrice = false;
					//找到当前bute1和bute2组合的商品
					//					console.log($scope.goodcart.goodbute1);
					//					console.log($scope.goodcart.goodbute2);
					//					console.log($scope.goodcart.gooddatas);
					//					console.log($scope.good);
					angular.forEach($scope.goodcart.gooddatas, function (obj) {
						if (obj.field_1 == $scope.goodcart.goodbute1 && obj.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj;
							$scope.goodcart.id = obj.id;
							$scope.good.price = obj.price;
							console.log($scope.good);
							$scope.goodPrice = true;
						}
					});
					console.log($scope.good);
					//利用bute1筛选bute2属性
					var butes2 = $('.attribute2 li');
					for (var j = 0; j < butes2.length; j++) {
						//						console.log(butes2[j]);
						for (var k = 0; k < $scope.goodcart.gooddatas.length; k++) {
							//							$scope.bute2good = objs;
							if (butes2[j].innerHTML == $scope.goodcart.gooddatas[k].field_2 && $scope.goodcart.gooddatas[k].field_1 == $scope.goodcart.goodbute1) {
								$('.attribute2 #' + butes2[j].id).removeClass('unclick');
								//								console.log($scope.goodcart.gooddatas[k]);
								k = $scope.goodcart.gooddatas.length;
							} else {
								$('.attribute2 #' + butes2[j].id).addClass('unclick');
								//								console.log('22');
							}
						}
					}

				}
				//					console.log($scope.goodcart.goodbute1);
			} else {
				//bute2不存在
				$scope.goodPrice = false;
				if ($('.attribute-common #item1' + idnum).hasClass('selectstyle')) {
					$scope.clickstyle1 = '';
					$scope.goodcart.goodbute1 = '';
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
					$scope.attributetype = false;
				} else {
					$scope.attributetype = true;
					$scope.clickstyle1 = item1;
					$scope.goodcart.goodbute1 = item1;
					angular.forEach($scope.goodcart.gooddatas, function (obj) {
						if (obj.field_1 == $scope.goodcart.goodbute1) {
							$scope.good = obj;
							$scope.goodcart.id = obj.id;
							$scope.good.price = obj.price;
							$scope.goodPrice = true;
							console.log($scope.good);
						}
					});
				}

			}
		}

		$scope.changebute2 = function (idnum, item2) {
			if ($('.attribute-common #item2' + idnum).css("background-color") == 'rgb(153, 153, 153)') {
				return
			}
			//bute1不为空
			if ($scope.goodcart.goodbute1 != '') {
				if ($('.attribute-common #item2' + idnum).hasClass('selectstyle')) {
					//bute2有选中状态，取消选中状态
					$scope.clickstyle2 = '';
					$scope.goodcart.goodbute2 = '';
					$('.attribute1 li').removeClass('unclick');
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
					$scope.goodPrice = false;
				} else {
					//bute2无选中状态，添加选中状态
					$scope.attributetype = true;
					$scope.clickstyle2 = item2;
					$scope.goodcart.goodbute2 = item2;
					//找到当前bute1和bute2组合的商品
					angular.forEach($scope.goodcart.gooddatas, function (obj2) {
						if (obj2.field_1 == $scope.goodcart.goodbute1 && obj2.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj2;
							$scope.goodcart.id = obj2.id;
							$scope.good.price = obj2.price;
							console.log($scope.good);
							$scope.goodPrice = true;
						}
					});
					//利用bute2筛选bute1属性
					var butes1 = $('.attribute1 li ');
					for (var j = 0; j < butes1.length; j++) {
						console.log(butes1[j]);
						for (var k = 0; k < $scope.goodcart.gooddatas.length; k++) {
							//							$scope.bute2good = objs;
							if (butes1[j].innerHTML == $scope.goodcart.gooddatas[k].field_1 && $scope.goodcart.gooddatas[k].field_2 == $scope.goodcart.goodbute2) {
								$('.attribute1 #' + butes1[j].id).removeClass('unclick');
								console.log($scope.goodcart.gooddatas[k]);
								k = $scope.goodcart.gooddatas.length;
							} else {
								$('.attribute1 #' + butes1[j].id).addClass('unclick');
							}
						}
					}
				}
				//					console.log($scope.goodcart.goodbute1);
			} else {
				//bute1为空
				console.log(item2);
				$scope.goodPrice = false;
				if ($('.attribute-common #item2' + idnum).hasClass('selectstyle')) {
					//bute2有选择属性
					$scope.clickstyle2 = '';
					$scope.goodcart.goodbute2 = '';
					$scope.attributetype = false;
					$('.attribute1 li').removeClass('unclick');
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
				} else {
					//bute2无选择属性
					$scope.attributetype = true;
					$scope.clickstyle2 = item2;
					$scope.goodcart.goodbute2 = item2;
					//筛选bute1
					var butes1 = $('.attribute1 li');
					for (var j = 0; j < butes1.length; j++) {
						console.log(butes1[j]);
						for (var k = 0; k < $scope.goodcart.gooddatas.length; k++) {
							//							$scope.bute2good = objs;
							if (butes1[j].innerHTML == $scope.goodcart.gooddatas[k].field_1 && $scope.goodcart.gooddatas[k].field_2 == $scope.goodcart.goodbute2) {
								$('.attribute1 #' + butes1[j].id).removeClass('unclick');
								console.log($scope.goodcart.gooddatas[k]);
								k = $scope.goodcart.gooddatas.length;
							} else {
								$('.attribute1 #' + butes1[j].id).addClass('unclick');
								//								console.log('22');
							}
						}
					}
				}

			}
		}
		$scope.addgoods = function () {
			if (!$rootScope.globalInfo.user.uid) {
				$state.go('auth.login');
				return false;
			}
			$scope.good.totNum = $scope.buyNum.buynum;
			$scope.goodcart.totNum = $scope.buyNum.buynum;
			console.log($scope.goodcart);
			console.log($scope.good);
			if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId == "") {
				Message.show('请选择商品规格');
				return
			} else if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId != "") {
				Good.addGoods($scope.good).then(function (response) {
					Message.show('加入购物车成功！');
					$scope.showCart = false;
					$scope.goodsdetail.cartNum = response.data;
					//					$scope.addCart.hide();
				});
			} else {
				Good.addGoods($scope.goodcart).then(function (response) {
					Message.show('加入购物车成功！');
					//					$scope.addCart.hide();
					$scope.showCart = false;
					$scope.goodsdetail.cartNum = response.data;
				});
			}

		};
		$scope.buygoods = function () {
			if (!$rootScope.globalInfo.user.uid) {
				$scope.showCart = false;
				$state.go('auth.login');
				return false;
			}
			$scope.good.totNum = $scope.buyNum.buynum;
			$scope.goodcart.totNum = $scope.buyNum.buynum;
			console.log($scope.goodcart);
			console.log($scope.good);

			if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId == "") {
				Message.show('请选择商品规格');
				return;
			} else if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId != "") {
				if ($scope.good.count == 0) {
					Message.show('该商品售罄，请重新选择');
					return
				}
				Cart.cartSave($scope.good, 'interim').then(function (response) {
					//					$scope.addCart.hide();
					$scope.showCart = false;
				});
			} else {
				if ($scope.goodcart.count == 0) {
					Message.show('该商品售罄，请重新选择');
					return
				}
				Cart.cartSave($scope.goodcart, 'interim').then(function (response) {
					//					$scope.addCart.hide();
					$scope.showCart = false;
				});
			}

		};
		$scope.$on("$ionicView.beforeLeave", function () {
			//			console.log('11111');
			$scope.showCart = false;
			//      if (timer) {
			//          $timeout.cancel(timer);
			//      }
		});
		$scope.$on("$ionicView.afterLeave", function () {
			$scope.showCart = false;
			//      if (timer) {
			//          $timeout.cancel(timer);
			//      }
		});
		// 获取二维码
		Good.getQRCOde().then(function (res) {
			$scope.myQrcode = res.data;
		});

	})
	.controller('goodscartCtrl', function ($scope, User, $stateParams, evaluate, $ionicLoading, $state, $timeout, Good, Storage, Order, Cart, Message, $rootScope) {
		$scope.orderEmpty = false;
		$scope.allMon = Number(0.00);
		$scope.addlist = [];
		$scope.settlement = true;
		Cart.getcartsList().then(function (response) {
			console.log(response);
			if (response.data == '' || response.data.length < 1) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.cartlist = response.data;
			}
		});

		$scope.changeall = function () {
			$timeout(function () {
				if ($('.cart-bottom .allChoose input').prop('checked') == false) {
					$('.cart-bottom .allChoose input').prop('checked', true);
					//寻找并判断其它商家的选中状态
					angular.forEach($scope.cartlist, function (obj) {
						$('#p' + obj.spid + ' input').prop('checked', false);
						$scope.changeshop(obj.spid);
					});

				} else {
					$('.cart-bottom .allChoose input').prop('checked', false);
					angular.forEach($scope.cartlist, function (obj) {
						$('#p' + obj.spid + ' input').prop('checked', true);
						$scope.changeshop(obj.spid);
					});
				}
			}, 100);

		};
		$scope.changeshop = function (spid) {
			$timeout(function () {
				console.log(spid)
				console.log($('#p' + spid + ' input').prop('checked'));
				if ($('#p' + spid + ' input').prop('checked') == false) {
					$('#p' + spid + ' input').prop('checked', true);
					//寻找并判断其它商家的选中状态
					var shops = $('.shopchose input');
					console.log(shops);
					for (var q = 0; q < shops.length; q++) {
						if (shops[q].checked == true) {
							$('.cart-bottom .allChoose input').prop('checked', true);
						} else {
							$('.cart-bottom .allChoose input').prop('checked', false);
							q = shops.length;
						}
					}
					//计算该商家下的商品
					angular.forEach($scope.cartlist, function (obj) {
						if (spid == obj.spid) {
							$scope.choshop = obj.goods;
							console.log($scope.choshop);
							var price1 = $('#p' + spid).siblings(".shopsmon").find('input').val();
							var shopmon = 0;
							console.log(price1);
							$scope.allMon = Number($scope.allMon) - Number(price1);
							for (var i = 0; i < $scope.choshop.length; i++) {
								//                              var signalgood=	$scope.choshop[i];
								$('#p' + $scope.choshop[i].id + ' input').prop('checked', true);
								var goodmon = Number($("#p" + $scope.choshop[i].id + " .carts-num input").val()) * Number($("#p" + $scope.choshop[i].id + " .cart-goodsinfo b").html());
								console.log(goodmon);
								var shopmon = Number(goodmon) + Number(shopmon);
								console.log(shopmon);
								$scope.addlist.push($scope.choshop[i].id);
							}
							console.log(shopmon);
							$('#p' + spid).siblings(".shopsmon").find('input').val(shopmon.toFixed(2));
							console.log($scope.addlist);
							$scope.allMon = Number($scope.allMon) + Number(shopmon);
						}

					})
				} else {
					console.log($('#p' + spid + ' input').prop('checked'));
					$('#p' + spid + ' input').prop('checked', false);
					console.log($('#p' + spid + ' input').prop('checked'));
					$('.cart-bottom .allChoose input').prop('checked', false);
					angular.forEach($scope.cartlist, function (obj) {
						if (spid == obj.spid) {
							$scope.choshop = obj.goods;
							console.log($scope.choshop);
							var price1 = $('#p' + spid).siblings(".shopsmon").find('input').val();
							$scope.allMon = Number($scope.allMon) - Number(price1);
							for (var i = 0; i < $scope.choshop.length; i++) {
								var signalgood = $scope.choshop[i];
								$('#p' + signalgood.id + ' input').prop('checked', false);
								$scope.shopmon = 0;
								for (var j = $scope.addlist.length; j >= 0; j--) {
									if ($scope.addlist[j] == signalgood.id) {
										$scope.addlist.splice(j, 1);
									}
								}
								console.log($scope.addlist);
							}
							$('#p' + spid).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
							//                  console.log($scope.addlist);
							//                  $scope.allMon = Number($scope.allMon)+Number($scope.shopmon);
						}
					})
				}
			}, 200);

		};
		$scope.changegoods = function (id, price) {
			//					if($('#editdel').html() == '编辑') {
			console.log($('#p' + id + ' input').prop('checked'));
			$timeout(function () {
				if ($('#p' + id + ' input').prop('checked') == false) {
					$('#p' + id + ' input').prop('checked', true);
					var other = $('#p' + id).siblings("dd");
					console.log(other);
					if (other.length > 0) {
						for (var i = 0; i < other.length; i++) {
							var goodid = other[i].id;
							if ($('#' + goodid + ' input').prop('checked') == true) {
								$('#p' + id).siblings(".shopchose").find('input').prop('checked', true);
								var shops = $('.shopchose input');
								console.log(shops);
								for (var k = 0; k < shops.length; k++) {
									if (shops[k].checked == true) {
										$('.cart-bottom .allChoose input').prop('checked', true);
									} else {
										$('.cart-bottom .allChoose input').prop('checked', false);
										k = shops.length;
									}
								}
							} else {
								$('#p' + id).siblings(".shopchose").find('input').prop('checked', false);
								$('.cart-bottom .allChoose input').prop('checked', false);
								i = other.length;
							}
						}
					} else {
						$('#p' + id).siblings(".shopchose").find('input').prop('checked', true);
						var shops = $('.shopchose input');
						console.log(shops);
						for (var k = 0; k < shops.length; k++) {
							if (shops[k].checked == true) {
								$('.cart-bottom .allChoose input').prop('checked', true);
							} else {
								$('.cart-bottom .allChoose input').prop('checked', false);
								k = shops.length;
							}
						}
					}

					//获取单个商家金额
					var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
					console.log(Number(price1));
					//当前点击商品金额
					$scope.goodmon = Number($("#p" + id + " .carts-num input").val()) * Number(price);
					console.log($scope.goodmon);
					//计算并填写单个商家金额
					$scope.shopmon = Number(price1) + $scope.goodmon;
					$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					//						$('#p' + id).siblings().find(' input').prop('checked', false);
					$scope.addlist.push(id);
					console.log($scope.addlist);
					//计算并填写总金额
					$scope.allMon = Number($scope.allMon) + Number($scope.goodmon);

				} else {
					$('#p' + id + ' input').prop('checked', false);
					$('#p' + id).siblings(".shopchose").find('input').prop('checked', false);
					$('.cart-bottom .allChoose input').prop('checked', false);
					for (var i = 0; i < $scope.addlist.length; i++) {
						if ($scope.addlist[i] == id) {
							$scope.addlist.splice(i, 1);
						}
					}
					console.log($scope.addlist);
					var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
					$scope.goodmon = Number($("#p" + id + " .carts-num input").val()) * Number(price);
					$scope.shopmon = Number(price1) - $scope.goodmon;
					$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					$scope.addId = '';
					//						$('#p' + id).siblings().find(' input').prop('checked', false);
					//计算并填写总金额
					$scope.allMon = Number($scope.allMon) - Number($scope.goodmon);
				}
			}, 200);
		};

		//加法
		$scope.addNum = function (id, price) {
			$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) + 1;
			//数量更新
			Cart.updateNum(id, $scope.buyNum).then(function (response) {
				if (response.code == 0) {
					Message.hidden();
					//				Message.show('数量修改成功！');
				} else {
					Message.show('数量修改失败，请重新操作');
					return;
				}
			});
			console.log($scope.buyNum);
			$("#p" + id + " .carts-num input").val($scope.buyNum);
			//添加选中状态 计算并更新金额
			if ($('#p' + id + ' input').prop('checked') == true) {
				//				$('#p' + id + ' input').prop('checked', true);
				//				 $scope.addlist.push(id);
				//				 $scope.goodmon=Number($scope.buyNum)*Number(price);
				$scope.goodmon = Number(1) * Number(price);
				//获取单个商家金额
				var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
				console.log(Number(price1));
				//当前点击商品金额
				console.log($scope.goodmon);
				//计算并填写单个商家金额
				$scope.shopmon = Number(price1) + $scope.goodmon;
				$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
				//						$('#p' + id).siblings().find(' input').prop('checked', false);
				console.log($scope.addlist);
				//计算并填写总金额
				$scope.allMon = Number($scope.allMon) + Number($scope.goodmon);
			}

		};
		$scope.showAlertBox = false;
		$scope.changeAlertBox = function (id, spid, num) {
			console.log(num)
			$("#p" + id + " .carts-num input").blur()
			$scope.showAlertBox = true;

			$scope.alertInfo = {
				id: id,
				spid: spid,
				num: $("#p" + id + " .carts-num input").val()
			}

		}
		$scope.hideAlertBox = function () {
			$scope.showAlertBox = false;

		}
		$scope.changebuyNum = function () {
			console.log($scope.alertInfo)

			$scope.buyNum = $(".alertBox-cartsnum  input").val();
			console.log($scope.buyNum)
			Cart.updateNum($scope.alertInfo.id, $scope.buyNum).then(function (response) {
				if (response.code == 0) {
					Message.show('数量修改成功！', 1000);
					$("#p" + $scope.alertInfo.id + " .carts-num input").val($scope.buyNum);
					$("#p" + $scope.alertInfo.id + " .carts-num input").blur()

					if ($('#p' + $scope.alertInfo.id + ' input').prop('checked') == true) {
						//寻找并判断其它商家的选中状态
						var shopMoney = 0;
						var allMoney = 0;
						//					 console.log($scope.cartlist)
						angular.forEach($scope.cartlist, function (obj) {
							//						console.log(obj)
							if (obj.spid == $scope.alertInfo.spid) {
								for (var a = 0; a < obj.goods.length; a++) {
									if (obj.goods[a].id == $scope.alertInfo.id) {
										obj.goods[a].goodsNum = $scope.buyNum
									}
									if ($('#p' + obj.goods[a].id + ' input').prop('checked') == true) {
										shopMoney = shopMoney + Number(obj.goods[a].goodsNum) * Number(obj.goods[a].goodsPrice)
									}
									$('#p' + $scope.alertInfo.id).siblings(".shopsmon").find('input').val(shopMoney.toFixed(2));
								}
							}
							//                                    console.log(Number($('.cart-list #p' + obj.spid).siblings(".shopsmon").find('input').val()))
							allMoney = Number($('.cart-list #p' + obj.spid).siblings(".shopsmon").find('input').val()) + allMoney;
							$scope.allMon = allMoney
						});
					}
				} else {
					Message.show('数量修改失败，请重新操作', 1000, function () {
						$("#p" + $scope.alertInfo.id + " .carts-num input").blur()
						$("#p" + $scope.alertInfo.id + " .carts-num input").val(response.data);
					});
				}
			});
			//隐藏修改框
			$scope.showAlertBox = false;
		}
		$scope.alertAddNum = function () {
			$scope.buyNum = parseInt($(".alertBox-cartsnum  input").val()) + 1;
			$(".alertBox-cartsnum  input").val($scope.buyNum);
		}
		$scope.alertMinusNum = function () {
			if (parseInt($(".alertBox-cartsnum  input").val()) > 1) {
				$scope.buyNum = parseInt($(".alertBox-cartsnum  input").val()) - 1;
				$(".alertBox-cartsnum  input").val($scope.buyNum);
			}

		}
		//减法
		$scope.minusNum = function (id, price) {
			if ($('#p' + id + ' input').prop('checked') == false) {
				//判断并添加选中状态
				//				$('#p' + id + ' input').prop('checked', true);
				if (parseInt($("#p" + id + " .carts-num input").val()) > 1) {
					$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) - 1;
					$("#p" + id + " .carts-num input").val($scope.buyNum);
					Cart.updateNum(id, $scope.buyNum).then(function (response) {
						if (response.code == 0) {
							//				Message.show('数量修改成功！');
							Message.hidden();
							//				 $scope.addlist.push(id);
							//				 $scope.goodmon=Number($scope.buyNum)*Number(price);
							//				 	var price1= $('#p' + id).siblings(".shopsmon").find('input').val();
							//				 $scope.shopmon=Number(price1)+$scope.goodmon;	
							//				 $('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
							//				 $scope.allMon = Number($scope.allMon)+Number($scope.goodmon);

						} else {
							Message.show('数量修改失败，请重新操作');
							$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) + 1;
							return;
						}
					});
				} else {
					Message.show('手下留情，不能再减了');
					//				$scope.buyNum=	parseInt($("#p"+id+" .carts-num input").val());
					//				Message.hidden();
					//				Message.show('数量修改成功！');
					//				 $scope.addlist.push(id);
					//				 $scope.goodmon=Number($scope.buyNum)*Number(price);
					//				 	var price1= $('#p' + id).siblings(".shopsmon").find('input').val();
					//				 $scope.shopmon=Number(price1)+$scope.goodmon;	
					//				 $('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					//				 $scope.allMon = Number($scope.allMon)+Number($scope.goodmon);
				}

			} else {
				//已经选中的情况
				if (parseInt($("#p" + id + " .carts-num input").val()) > 1) {
					$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) - 1;
					$("#p" + id + " .carts-num input").val($scope.buyNum);
					$scope.goodmon = Number(1) * Number(price);
					Cart.updateNum(id, $scope.buyNum).then(function (response) {
						if (response.code == 0) {
							Message.hidden();
							//				Message.show('数量修改成功！');
						} else {
							Message.show('数量修改失败，请重新操作');
							$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) + 1;
							return;
						}
					});
				} else {
					Message.show('手下留情，不能再减了');
					$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val());
					$scope.goodmon = Number(0) * Number(price);
					//				 	 Cart.updateNum(id,$scope.buyNum).then(function(response){
					//			if(response.code==0){
					//				Message.hidden();
					//			}else{
					//				Message.show('数量修改失败，请重新操作');
					//				
					//				return;
					//			}
					//		});
				}
				var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
				$scope.shopmon = Number(price1) - $scope.goodmon;
				$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
				$scope.allMon = Number($scope.allMon) - Number($scope.goodmon);
			}
		}

		//编辑切换
		$scope.editAdel = function () {
			if ($('#editdel').html() == '编辑') {
				$('#editdel').html('完成');
				$scope.cartsnum = true;
				$('.cart-list dd input').prop('checked', false);
				$scope.del = true;
				$scope.settlement = false;
				if ($scope.addlist != '' && $scope.addlist.length > 0) {
					console.log($scope.addlist);
					for (var i = 0; i < $scope.addlist.length; i++) {
						//						var a=$scope.addlist[i];
						$('#p' + $scope.addlist[i] + ' input').prop('checked', true);
					}
				}
			} else {
				$('.cart-list dd input').prop('checked', false);
				$('#editdel').html('编辑');
				$scope.cartsnum = true;
				$scope.del = false;
				$scope.settlement = true;

				if ($scope.addlist != '' && $scope.addlist.length > 0) {
					console.log($scope.addlist);
					for (var i = 0; i < $scope.addlist.length; i++) {
						//						var a=$scope.addlist[i];
						$('#p' + $scope.addlist[i] + ' input').prop('checked', true);
					}
				}

			}
		}
		//结算
		$scope.buyGoods = function () {
			//			angular.forEach($scope.cartlist, function(obj) {
			//				if($scope.addId == obj.id) {
			//					$scope.goodsid = obj.goodsId;
			//					$scope.cartid=obj.id;
			//					$scope.jisuanmoney = obj.goodsInfo.spe_price;
			//				}
			//			})
			console.log($scope.addlist);
			Cart.cartSave($scope.addlist, 'cart');
		}
		//删除购物车商品
		$scope.delGoods = function () {
			Cart.removeCart($scope.addlist).then(function (respone) {
				console.log($scope.addlist);
				for (var i = 0; i < $scope.addlist.length; i++) {
					//						if($scope.addlist[i] == $scope.addlist[i]) {
					//找到此商品价格
					console.log($("#p" + $scope.addlist[i] + " .carts-num  input").val());
					$scope.goodmon = Number($("#p" + $scope.addlist[i] + " .carts-num  input").val()) * Number($("#p" + $scope.addlist[i] + " .cart-goodsinfo b").html());
					//计算商品对应的商家金额
					var price1 = $('#p' + $scope.addlist[i]).siblings(".shopsmon").find('input').val();
					$scope.shopmon = Number(price1) - Number($scope.goodmon);
					//				 $('#p' + $scope.addlist[i]).siblings(".shopsmon").find('input').val($scope.shopmon);
					$('#p' + $scope.addlist[i]).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					$scope.allMon = (Number($scope.allMon) - Number($scope.goodmon)).toFixed(2);
					//						$scope.addlist.splice(i, 1);
					//					}
				}
				$scope.doRefresh();
				$('#editdel').html('完成');
				$scope.addlist.splice(0, $scope.addlist.length);
			});
		};
		$scope.doRefresh = function () {
			Cart.getcartsList().then(function (response) {
				if (response.data == '' || response.data.length < 1) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.cartlist = response.data;
				}
				$scope.refreshing = true; //下拉加载时避免上拉触发
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					//			template: '刷新成功！',
					duration: '200'
				});
			});
		};

	})
	.controller('goodsInfoCtrl', function ($rootScope, $scope, $state, $http, Shop, Order, Home, $stateParams, Storage, $sanitize, $ionicSlideBoxDelegate, Good, Message, $cordovaInAppBrowser) {
		//		商品详情
		Home.getGoodsList($stateParams.spid).then(function (data) {
			console.log(data);
			angular.forEach(data, function (obj) {
				if (obj.id == $stateParams.id) {
					$scope.goodsdetail = obj;
					console.log($scope.goodsdetail);
				}
			});
			// $scope.model=$scope.goodsdetail.info;
			//console.log($scope.goodsdetail);
			Message.hidden();
			$scope.goodsdetail.slide = angular.fromJson($scope.goodsdetail.thumbs);
			$("#goodsinfo-info").html($scope.goodsdetail.info);
			//$scope.goodsdetail.slide = angular.fromJson((data[0].thumbs));

			$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			//存值
			// Storage.set('subinfo',$scope.goodsdetail);
		});
		$scope.buyNum = 1;
		$scope.addNum = function () {
			$scope.buyNum++;
		};
		$scope.minusNum = function () {
			if ($scope.buyNum > 1) {
				$scope.buyNum--;
			}
		};
		$scope.buyGoods = function () {
			console.log($scope.goodsdetail);
			//			Storage.set('subinfo', $scope.goodsdetail);
			$scope.totNum = $scope.buyNum;
			//			Storage.set('subnum', $scope.totNum);
			Message.show('订单提交成功！');
			// $state.go("shops.orderInfo");
			Order.create($scope.goodsdetail, $scope.totNum);
			//    $http.post(ENV.YD_URL, {
			//      do: 'order',
			//      goodsId: "",
			//      op: 'interim',
			//      opt: $scope.attrId,
			//      goodsNum: $scope.buyNum
			//    }, {timeout: 2000}).success(function (respond) {
			//    	alert('aaa');
			//      $scope.popover.hide();
			//      if (respond.code == '301') {
			//        $state.go("checkout", {type: 'interim', goodsInfo: respond.data});
			//      } else {
			//        $ionicLoading.show({
			//          noBackdrop: true,
			//          template: '登陆失效，请重新登陆！',
			//          duration: '1200'
			//        }).then(function () {
			//          $state.go("auth.login");
			//        });
			//      }
			//    }).error(function () {
			//      $scope.popover.hide();
			//      $ionicLoading.show({
			//        noBackdrop: true,
			//        template: '通信超时，请重试！',
			//        duration: '1000'
			//      });
			//    });
		};

	})
	.controller('managegoodsCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Message, Good, User) {
		console.log($stateParams);
		$scope.spid = $stateParams.spid;
		console.log($scope.spid);
		$scope.goodsempty = false;
		$scope.showgoto = true;
		User.managegoods('0', $stateParams.spid).then(function (response) {
			console.log(response);
			if (response.code == 0 && response.data.length > 0) {
				$scope.goodsempty = false;
				$scope.goodslist = response.data;
			} else {
				$scope.goodsempty = true;
			}

		})
		//点击商品列表
		$scope.changetyps = function (types) {
			console.log(types);
			if (types == '0') {
				$scope.showgoto = true;
				$('.managegoodstitle div a').addClass('chooosetype');
				$('#cho0 a').removeClass('chooosetype');
			} else if (types == 1) {
				$scope.showgoto = false;
				$('.managegoodstitle div a').addClass('chooosetype');
				$('#cho1 a').removeClass('chooosetype');
			} else if (types == 2) {
				$scope.showgoto = false;
				$('.managegoodstitle div a').addClass('chooosetype');
				$('#cho2 a').removeClass('chooosetype');
			}
			User.managegoods(types, $stateParams.spid).then(function (response) {
				console.log(response);
				if (response.code == 0 && response.data.length > 0) {
					$scope.goodsempty = false;
					$scope.goodslist = response.data;
				} else {
					$scope.goodsempty = true;
				}

			})
		}

	})
	.controller('goodsListCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Message, Good) {
		console.log($stateParams);
		$scope.spid = $stateParams.spid;

		//	sessionStorage.setItem("spid",$scope.spid);  
		//分类列表getCateList
		Good.getCateList($scope.spid).then(function (response) {
			$scope.classfyList = response.data; //分类
			//$scope.featureds.featuredList=response.data;
			console.log($scope.classfyList);
			Message.hidden();
		});
		//默认商品列表getSgoodsList
		console.log($scope.spid);
		Good.getSgoodsList($scope.spid).then(function (response) {
			console.log(response);
			$scope.goodsList = response.data;
			// $scope.goodsList.length=5;
		});
		//点击商品列表
		$scope.getClassify = function (id) {
			//$scope.cateStyle='false';
			//	console.log(sessionStorage.getItem("spid"));
			console.log(id);
			if (id == '' || id == undefined) {
				$('.goodsList-classify li').removeClass('clickchange');
				$('.goodsList-classify li:first').addClass('clickchange');
				Good.getSgoodsList($scope.spid).then(function (response) {
					$scope.goodsList = response.data;
					// $scope.goodsList.length=5;
				})
			} else {
				$('.goodsList-classify li').removeClass('clickchange');
				$('.goodsList-classify #p' + id.id).addClass('clickchange');
				Good.getSgoodsList($scope.spid, id.id).then(function (response) {
					$scope.goodsList = response.data;
					// $scope.goodsList.length=5;
				})
			}

		};
	})

	.controller('loginCtrl', function ($rootScope, $scope, $ionicModal, Auth, $timeout, $state, Message, $http, $ionicHistory) {

		//		$scope.$on("$ionicView.beforeEnter", function() {
		//			if($rootScope.globalInfo.user.uid) {
		//				$state.go('tab.notice');
		//			}
		//		});

		$scope.goBack = function () {
			if ($ionicHistory.backView()) {
				$ionicHistory.goBack()
			} else {
				$state.go('tab.online')
			}
		}
		$scope.spContent = {
			headimg: '',
			info: ''
		};
		$scope.agree = true;
		$scope.authAgree = function () {
			$scope.agree = !$scope.agree;
		};
		$scope.login = {
			mobile: '',
			password: ''
		};
		$ionicModal.fromTemplateUrl('templates/modal/single-page.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.spTitle = '用户注册协议';
			Auth.fetchAgreement().then(function (data) {
				$scope.spContent = data;
			});
		});
		$scope.showAgreement = function ($event) {
			//			console.log($scope.modal);
			$scope.modal.show();
			$event.stopPropagation(); // 阻止冒泡
		};
		//		 $scope.closeModal = function() {
		//  $scope.modal.hide();
		//};
		$scope.$on('$destroy', function () {
			$scope.modal.remove();
		});
		// 登陆业务逻辑
		$scope.login = function () {
			if (!$scope.agree) {
				Message.show('请勾选会员注册协议');
				return false;
			}
			Auth.login($scope.login.mobile, $scope.login.password);
		};
		//微信登录
		$scope.wechatlogin = function () {
			var state = "_" + (+new Date());
			Wechat.auth("snsapi_userinfo", state, function (response) {
				if (response) {
					$http.post('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxa4b27f62f58ce012&secret=c38f6431d00933b25742e98b2816364a&code=' + response.code + '&grant_type=authorization_code').then(function (response) {
						//				alert(JSON.stringify(response))
						Message.loading('授权中')
						if (response) {
							//							Message.show('授权成功', 100)
							var _json = {
								access_token: response.data.access_token, //接口调用凭证
								expires_in: response.data.expires_in, //接口调用凭证超时时间，单位（秒）
								refresh_token: response.data.refresh_token, //用户刷新access_token
								openid: response.data.openid, //授权用户唯一标识
								scope: response.data.scope
							}
							//							$timeout(function() {
							$http.post('https://api.weixin.qq.com/sns/userinfo', _json).then(function (respond) {
								//					alert(JSON.stringify(response))
								if (respond.data.openid) {
									Auth.otherLogin('wechat', respond.data)
								}
							})
							//							}, 100)
						}
					})
				}
			}, function (error) {
				Message.show(JSON.stringify(error))
			});
		};
	})

	.controller('shopOrderListCtrl', function ($scope, $rootScope, Order, $ionicLoading, $state, $stateParams, Storage) {
		//		$scope.type = 'user';
		console.log($stateParams);
		$scope.type = $stateParams.type;
		$scope.orderType = $stateParams.orderType;
		//		$rootScope.shortpayStatus = $stateParams.payStatus;
		//		$rootScope.shortisComment = $stateParams.isComment;
		//		Storage.set('shortStatus', $stateParams.orderStatus);
		$scope.orderList = [];
		$scope.orderEmpty = false;
		Order.getList($scope.type, $scope.orderType).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderList = response.data;
				console.log(response);
			}
			//			if($stateParams.orderStatus == '0') {
			//				$('#needmoney').find('span').addClass('blue');
			//				$('#needmoney').siblings().find('span').removeClass('blue');
			//			} else if($stateParams.orderStatus == '1') {
			//				$('#neednone').find('span').addClass('blue');
			//				$('#neednone').siblings().find('span').removeClass('blue');
			//			} else if($stateParams.orderStatus == '2' & $stateParams.payStatus == '2') {
			//				$('#needeval').find('span').addClass('blue');
			//				$('#needeval').siblings().find('span').removeClass('blue');
			//			} else {
			//				$('#needzero').find('span').addClass('blue');
			//				$('#needzero').siblings().find('span').removeClass('blue');
			//			}

		});
		//遍历
		//		angular.forEach(data, function(obj) {
		//				if(obj.id == $stateParams.id) {
		//					$scope.goodsdetail = obj;
		//					console.log($scope.goodsdetail);
		//				}
		//			});
		//		$scope.getNew = function() {
		//			$('#needall').find('span').addClass('blue');
		//			$('#needall').siblings().find('span').removeClass('blue');
		//			console.log(this);
		//			$('#needall').find('span').addClass('blue').siblings().removeClass('blue');
		//			$scope.orderList = [];
		//			$scope.orderEmpty = false;
		//			//	 	Storage.set('shortisComment',$stateParams.isCommentStatus);
		//			Order.getList($scope.type).then(function(response) {
		//				console.log(response);
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.orderList = response.data;
		//					//console.log($scope.orderList.length);
		//				}
		//			});
		//		};
		//		$scope.getNew0 = function() {
		//			$('#needmoney').find('span').addClass('blue');
		//			$('#needmoney').siblings().find('span').removeClass('blue');
		//			Storage.set('shortStatus', 0);
		//			$scope.orderList = [];
		//			$scope.orderEmpty = false;
		//			//				Storage.set('shortisComment',$stateParams.isCommentStatus);
		//			Order.getList($scope.type).then(function(response) {
		//				console.log(response);
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.orderList = response.data;
		//					//console.log($scope.orderList.length);
		//				}
		//			});
		//		};
		//		$scope.getNew1 = function() {
		//			$('#neednone').find('span').addClass('blue');
		//			$('#neednone').siblings().find('span').removeClass('blue');
		//			Storage.set('shortStatus', 1);
		//			$scope.orderList = [];
		//			$scope.orderEmpty = false;
		//			//				Storage.set('shortisComment',$stateParams.isCommentStatus);
		//			Order.getList($scope.type).then(function(response) {
		//				console.log(response);
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.orderList = response.data;
		//					//console.log($scope.orderList.length);
		//				}
		//			});
		//		};
		//		$scope.getNew2 = function() {
		//			$('#needzero').find('span').addClass('blue');
		//			$('#needzero').siblings().find('span').removeClass('blue');
		//			Storage.set('shortStatus', 2);
		//			$scope.orderList = [];
		//			$scope.orderEmpty = false;
		//			//				Storage.set('shortisComment',$stateParams.isCommentStatus);
		//			Order.getList($scope.type).then(function(response) {
		//				console.log(response);
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.orderList = response.data;
		//					//console.log($scope.orderList.length);
		//				}
		//			});
		//		};
		//		$scope.getNeww = function() {
		//			$('#needeval').find('span').addClass('blue');
		//			$('#needeval').siblings().find('span').removeClass('blue');
		//			$scope.orderList = [];
		//			$scope.orderEmpty = false;
		//			$rootScope.shortpayStatus = 2;
		//			$rootScope.shortisComment = 0;
		//			Storage.set('shortStatus', 2);
		//			//				Storage.set('shortisComment',$stateParams.isCommentStatus);
		//			Order.getList($scope.type).then(function(response) {
		//				console.log(response);
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.orderList = response.data;
		//					//console.log($scope.orderList.length);
		//				}
		//			});
		//		};
		//报单状态
		if ($scope.type == 'shops') {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
			};
		} else if ($scope.type == 'user') {
			$scope.statusCheck = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家拒绝',
				'-2': '平台拒绝',
			};
		};
		if ($scope.type == 'shops') {
			$scope.orderTypes = {
				'0': '线上下单',
				'1': '扫码付款',
				'2': '扫码报单'
			}
		} else if ($scope.type == 'user') {
			$scope.orderTypes = {
				'0': '线上下单',
				'1': '扫码付款',
				'2': '扫码报单'
			};
		};
		//		$scope.toBack = function() {
		//			$state.go('tab.ordertc', {
		//				type: 'user'
		//			});
		//		};
		if ($scope.type == 'shops') {
			$scope.statusName = {
				'0': '未付款',
				'1': '未核销',
				'2': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
				//				'0' : '已确认',
				//				'1' : '待平台确认',
				//				'2' : '已完成',
				//				'-1' : '商家已拒绝',
				//				'-2' : '平台已拒绝'
			};
		} else if ($scope.type == 'user') {
			$scope.statusName = {
				'0': '未付款',
				'1': '未核销',
				'2': '已完成',
				'-1': '已取消',
				'-2': '已删除',
				'-3': '申请退款',
				'-4': '已退款'
				//				'0' : '待商家确认',
				//				'1' : '待平台确认',
				//				'2' : '已完成',
				//				'-1' : '商家已拒绝',
				//				'-2' : '平台已拒绝'
			};
		};
		if ($scope.type == 'shops') {
			$scope.orderAct = {
				'0': '付款',
				'1': '评价'
			};
		} else if ($scope.type == 'user') {
			$scope.orderAct = {
				'0': '付款',
				'1': '评价'
			};
		};
		// 列表下拉刷新
		$scope.doRefresh = function () {
			Order.getList($scope.type, $scope.orderType).then(function (response) {
				$scope.orderList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};

		// 下拉加载更多列表
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Order.getList($scope.type, $scope.page).then(function (response) {
				$scope.page += 1;
				$scope.orderList = $scope.orderList.concat(response.data);
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多订单了！',
							duration: '1200'
						});
					}
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			})
		};
	})

	.controller('shopQrcodeCtrl', function ($scope, Shop, $rootScope) {
		$scope.shopQrcode = {
			shopInfo: '',
			status: ''
		};
		//console.log($rootScope.globalInfo.user.isShop);$rootScope.globalInfo.user.isShop
		Shop.shopQrcode().then(function (data) {
			$scope.shopQrcode = data;
		});
		Shop.getShops().then(function (response) {
			console.log(response);
			$scope.shopsinfo = response;
		})
	})

	.controller('shopCenterCtrl', function ($scope, Shop, $rootScope) {
		$scope.shopsInfo = {};
		console.log($rootScope.globalInfo.user.isShop);
		Shop.getShops($rootScope.globalInfo.user.isShop).then(function (data) {
			$scope.shopsInfo = data;
		})
	})
	.controller('onlinePayCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, Message, Payment, $state, $timeout, $interval, User, Order) {
		console.log($stateParams);
		$scope.$on("$ionicView.beforeEnter", function () {
			User.getBalance().then(function (response) {
				console.log(response);
				$scope.balance = response.data;
				//			isOpen 0关，1开,2微信，3支付宝
				if ($scope.balance.isOpen == '0') {
					$scope.showrecharge = false;
				} else if ($scope.balance.isOpen == '1') {
					$scope.showrecharge = true;
					$scope.showchoose = 'all';
				} else if ($scope.balance.isOpen == '2') {
					$scope.showrecharge = true;
					$scope.showchoose = 'wechat';
				} else if ($scope.balance.isOpen == '3') {
					$scope.showrecharge = true;
					$scope.showchoose = 'alipay';
				}
			});
		})
		$scope.from = $stateParams.from || "";
		$scope.orderInfo = {
			payid: '',
			ordertypes: ''
		};
		$scope.orderInfo.payid = $stateParams.payid;
		$scope.orderInfo.ordertypes = $stateParams.ordertypes;
		$scope.showbalances = false;
		$scope.disshowbalances = false;
		//获取验证码
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.disgetPsd = true;
		$scope.disgetCaptchaSuccess = false;
		$scope.balancepay = {
			userBalance: '',
			disBalance: '',
			payid: '',
			payPrice: '',
			passwords: '',
			code: '',
			//			number: 60,
			dispasswords: '',
			discode: '',
			disnumber: 60
		};
		$scope.number = 60;
		//获取订单信息和余额
		if ($scope.orderInfo.ordertypes != '') {
			Order.getbalanceInfo($stateParams.payid, 'ambass').then(function (response) {
				console.log(response);
				$scope.balancepay = response;

			});
		} else {
			Order.getbalanceInfo($stateParams.payid, 'order').then(function (response) {
				console.log(response);
				$scope.balancepay = response;
				$scope.defaultPrice = $scope.balancepay.payPrice;
				$scope.orderInfo.paymoney = $scope.balancepay.payPrice;
				$scope.orderInfo.dismoney = $scope.balancepay.disBalance;

				//is_use 0不可用代金券 1可用
				if (response.is_use == 0) {
					$scope.isdisBalance = false;
				}
				if (response.is_use == 1) {
					$scope.isdisBalance = true;
				}
			});
		}
		//判断余额显示
		$timeout(function () {

			$scope.showbalance = function () {
				console.log($scope.balancepay);
				if ($scope.number != 60) {
					Message.show('请等待' + $scope.balancepay.number + 's');
					return
				}
				if ($scope.showbalances == false && $scope.balancepay.userBalance - $scope.balancepay.payPrice < 0) {
					Message.show('可用数量不足');
					return
				} else if ($scope.showbalances == true) {
					$scope.showbalances = false;
				} else {
					$scope.showbalances = true;
					$scope.disshowbalances = false;
					$scope.typeBalance = 'balance';
				}
			}
			//			$scope.disshowbalance = function () {
			//				if ($scope.number != 60) {
			//					Message.show('请等待' + $scope.balancepay.number + 's');
			//					return
			//				}
			//				if ($scope.disshowbalances == false && $scope.balancepay.disBalance - $scope.balancepay.payPrice < 0) {
			//					Message.show('可用数量不足');
			//					return
			//				} else if ($scope.disshowbalances == true) {
			//					$scope.disshowbalances = false;
			//				} else {
			//					$scope.disshowbalances = true;
			//					$scope.showbalances = false;
			//					$scope.typeBalance = 'disbalance';
			//				}
			//			}
		}, 100)

		$scope.getCode = function () {
			$scope.number = 60;
			User.getbalancecode().then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.number = 60;
					} else {
						$scope.number--;
					}
				}, 1000)
			})
		};
		// 选择支付类型
		$scope.payType = 'wechat';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		Message.hidden();
		$ionicModal.fromTemplateUrl('templates/modal/shopsVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.shopsVoucher = modal;
		});
		$scope.balanceConfirm = function () {
			if ($scope.orderInfo.ordertypes != '') {
				Payment.creditPay($scope.balancepay, '', '', $scope.disPay);
			} else {
				if ($scope.typeBalance == 'disbalance') {
					Payment.creditPay($scope.balancepay, 'disBalance', $scope.from, $scope.disPay);
				} else {

					Payment.creditPay($scope.balancepay, 'order', $scope.from, $scope.disPay);
				}

			}

		}
		$scope.orderConfirm = function () {
			if ($scope.payType == 'wechat') {

				if ($scope.orderInfo.ordertypes != '') {
					console.log("welfare")
					Payment.wechatPay('welfare', $scope.orderInfo, '', $scope.from, $scope.disPay);
				} else {
					console.log("online")
					Payment.wechatPay('online', $scope.orderInfo, '', $scope.from, $scope.disPay);
				}
				//				Payment.wechatPay('online', $scope.orderInfo);
			} else if ($scope.payType == 'alipay') {

				if ($scope.orderInfo.ordertypes != '') {
					Payment.alipay('welfare', $scope.orderInfo, '', $scope.from, $scope.disPay);
				} else {
					Payment.alipay('online', $scope.orderInfo, '', $scope.from, $scope.disPay);
				}

			} else if ($scope.payType == 'qrcode') {
				if ($scope.balance.isOpen == '0') {
					$scope.showrecharge = false;
				} else if ($scope.balance.isOpen == '1') {
					$scope.showrecharge = true;
					$scope.showchoose = 'all';
				} else if ($scope.balance.isOpen == '2') {
					$scope.showrecharge = true;
					$scope.showchoose = 'wechat';
				} else if ($scope.balance.isOpen == '3') {
					$scope.showrecharge = true;
					$scope.showchoose = 'alipay';
				}
				if ($scope.showchoose == 'alipay') {
					var showpaycode = [{
						'text': '支付宝码'
					}]
				} else if ($scope.showchoose == 'wechat') {
					var showpaycode = [{
						'text': '微信码'
					}]
				} else if ($scope.showchoose == 'all') {
					var showpaycode = [{
						'text': '微信码'
					},
					{
						'text': '支付宝码'
					}
					]
				}
				var hideSheet = $ionicActionSheet.show({
					buttons: showpaycode,
					cancelText: '取消',
					buttonClicked: function (index) {
						if (index == 0) {
							$state.go('my.balarechargepage', {
								orderid: $scope.orderInfo.payid,
								paytype: 'Z0'
							});
							//						$scope.sharechat(0, title, desc, url, thumb);
						} else if (index == 1) {
							$state.go('my.balarechargepage', {
								orderid: $scope.orderInfo.payid,
								paytype: 'A0'
							});
							//						$scope.sharechat(1, title, desc, url, thumb);
						}
						//					return true;
					}

				});
				$timeout(function () {
					hideSheet();
				}, 2000);

			} else if ($scope.payType == 'ccb') {
				if ($scope.orderInfo.ordertypes != '') {
					console.log("welfare")
					Payment.ccbPay('welfare', $scope.orderInfo, '', $scope.from, $scope.disPay);
				} else {
					console.log("online")
					Payment.ccbPay('online', $scope.orderInfo, '', $scope.from, $scope.disPay);
				}
			}
			//		else if($scope.payType == 'credit') {
			//			$scope.shopsVoucher.show();
			//		}
		};
		// 是否消耗代金券
		$scope.disPay = 0;

		console.log('$scope.defaultPrice1', $scope.defaultPrice)
		$scope.disPayS = function () {

			if ($scope.disPay == 0) {
				$scope.disPay = 1
				$scope.balancepay.payPrice = ($scope.balancepay.payPrice - $scope.balancepay.disBalance).toFixed(2);
				if ($scope.balancepay.payPrice <= 0) {
					$scope.balancepay.payPrice = 0.01
				}
			} else {
				$scope.disPay = 0
				console.log('$scope.defaultPrice2', $scope.defaultPrice)
				$scope.balancepay.payPrice = $scope.defaultPrice
			}

			$scope.orderInfo.paymoney = $scope.balancepay.payPrice;
		}

	})
	.controller('shopPayCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, $cordovaCamera, Message, Payment, $state, $timeout) {
		$scope.orderInfo = {
			orderId: '',
			spid: '',
			payPrice: '',
			voucher: ''
		};
		$scope.orderInfo.orderId = $stateParams.orderId;
		$scope.orderInfo.spid = $stateParams.spid;
		$scope.orderInfo.payPrice = $stateParams.payPrice;
		// 选择支付类型
		$scope.payType = 'wechat';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		$ionicModal.fromTemplateUrl('templates/modal/shopsVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.shopsVoucher = modal;
		});

		$scope.orderConfirm = function () {
			if ($scope.payType == 'wechat') {
				//noinspection JSUnresolvedVariable
				// if (!window.Wechat) {
				// 	alert("暂不支持微信支付！");
				// 	return false;
				// }
				console.log(Payment);
				Payment.wechatPay('welfare', 'orderInfo');
			} else if ($scope.payType == 'alipay') {
				console.log($scope.orderInfo);
				Payment.alipay('welfare', $scope.orderInfo);
				//alert("支付宝！");
			}
			//		else if($scope.payType == 'credit') {
			//			$scope.shopsVoucher.show();
			//		}
		};

		$scope.uploadAvatar = function (type) {
			var buttons = [];
			buttons = [{
				text: "拍一张照片"
			}, {
				text: "从相册选一张"
			}];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.selectImages("camera", type);
					} else if (index == 1) {
						$scope.selectImages('', type);
					}
					return true;
				}
			})

		};
		/*上传凭证*/
		$scope.selectImages = function (from) {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};

			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					var image = document.getElementById('divImg');
					$scope.orderInfo.voucher = "data:image/jpeg;base64," + imageURI;
					image.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
				}, function () {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 提交
		$scope.sureSubmit = function () {
			if (!$scope.orderInfo.voucher) {
				Message.show('请上传支付凭证！');
				return;
			}
			Payment.getOffline($scope.orderInfo.orderId, $scope.orderInfo.voucher).then(function (response) {
				Message.hidden();
				if (response.code == 0) {
					$scope.shopsVoucher.hide();
					$state.go('shops.orderList', {
						'type': 'shops'
					});
					$timeout(function () {
						Message.show('提交成功，请耐心等待');
					}, 1500);
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			});
		}
	})

	.controller('registerCtrl', function ($scope, $ionicModal, Message, ENV, Auth, $interval, $ionicScrollDelegate) {

		$scope.reg = {
			step: 1,
			tMobile: '',
			mobile: '',
			pictureCaptcha: '',
			captcha: '',
			agree: true,
			password: '',
			rePassword: '',
			number: 10,
			bol: false
		};
		// 会员注册协议
		$ionicModal.fromTemplateUrl('templates/modal/single-page.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.spTitle = '用户注册协议';
			Auth.fetchAgreement().then(function (data) {
				$scope.spContent = data;
			});
		});
		$scope.showAgreement = function ($event) {
			$scope.modal.show();
			$event.stopPropagation(); // 阻止冒泡
		};

		//获取短信验证码
		$scope.pictureCaptchaUrl = ENV.YD_URL + '&do=utility&op=getPictureCaptcha';

		$scope.changePic = function () {
			var random = Math.random() * 10
			$scope.pictureCaptchaUrl = ENV.YD_URL + '&do=utility&op=getPictureCaptcha&a=' + random;
		}

		$scope.getSmsCaptcha = function () {
			if ($scope.reg.tMobile) {
				if (!ENV.REGULAR_MOBILE.test($scope.reg.tMobile)) {
					Message.show('请输入正确的推荐人手机号');
					return;
				}
			}
			if (!$scope.reg.mobile || !ENV.REGULAR_MOBILE.test($scope.reg.mobile)) {
				Message.show('请输入正确的手机号');
				return;
			}
			if (!$scope.reg.pictureCaptcha) {
				Message.show('请输入验证码');
				return;
			}
			Auth.getSmsCaptcha('send', $scope.reg.tMobile, $scope.reg.mobile, $scope.reg.pictureCaptcha, "sendAgain").then(function () {
				$ionicScrollDelegate.scrollTop()
				$scope.reg.step = 2;
				$scope.countDown();
			}, function () {
				$scope.changePic() // 更新图片验证码
			});
		};

		// 验证验证码，设置密码
		$scope.next = function () {
			if ($scope.reg.step == 2) {
				Auth.checkCaptain($scope.reg.mobile, $scope.reg.captcha);
			} else if ($scope.reg.step == 3) {
				Auth.setPassword($scope.reg);
			}
		};
		//验证成功后
		$scope.$on("Captcha.success", function () {
			$scope.reg.step = 3;
		});
		//发送验证后倒计时
		$scope.countDown = function () {
			$scope.reg.step = 2;
			$scope.reg.bol = true;
			$scope.reg.number = 60;
			var timer = $interval(function () {
				if ($scope.reg.number <= 1) {
					$interval.cancel(timer);
					$scope.reg.bol = false;
					$scope.reg.number = 60;
				} else {
					$scope.reg.number--;
				}
			}, 1000)
		};
	})

	.controller('resetPsdCtrl', function ($scope, Auth, $interval, Message, $rootScope) {
		$scope.reg = {
			captcha: null,
			mobile: null,
			password: null,
			repassword: null,
			number: 60,
			bol: false
		};
		$scope.showNext = 1;
		//获取短信验证码
		$scope.getCaptcha = function () {
			Auth.getCaptcha(function (response) {
				if (response.code !== 0) {
					Message.show(response.msg);
					return false;
				}
				$rootScope.$broadcast('Captcha.send');
				Message.show(response.msg, 1000);
			}, function () {
				Message.show('通信错误，请检查网络!', 1500);
			}, $scope.reg.mobile);
		};
		// 验证验证码
		$scope.next = function () {
			if ($scope.showNext == 3) {
				Auth.setPassword($scope.reg, 1);
			} else if ($scope.showNext == 1) {
				Auth.checkCaptain($scope.reg.mobile, $scope.reg.captcha, 1);
			}
		};
		//验证成功后
		$scope.$on("Captcha.success", function () {
			$scope.showNext = 3;
		});
		//发送验证后倒计时
		$scope.$on("Captcha.send", function () {
			$scope.reg.bol = true;
			$scope.reg.number = 60;
			var timer = $interval(function () {
				if ($scope.reg.number <= 1) {
					$interval.cancel(timer);
					$scope.reg.bol = false;
					$scope.reg.number = 60;
				} else {
					$scope.reg.number--;
				}
			}, 1000)
		});
	})

	.controller('userCenterCtrl', function ($scope, $rootScope, ENV, $ionicActionSheet, $ionicLoading, $ionicHistory, $timeout, $state, User, $ionicModal, $cordovaCamera, Storage, Message, $resource, System, $cordovaAppVersion) {
		// 退出登录
		$scope.logout = function () {
			$ionicActionSheet.show({
				destructiveText: '退出登录',
				titleText: '确定退出当前登录账号么？',
				cancelText: '取消',
				cancel: function () {
					return true;
				},
				destructiveButtonClicked: function () {
					User.logout();
					$ionicHistory.nextViewOptions({ //退出后清除导航的返回
						disableBack: true
					});
					$ionicLoading.show({
						noBackdrop: true,
						template: '退出成功！',
						duration: '1500'
					});
					$timeout(function () {
						$state.go('tab.notice');
					}, 1200);
					return true;
				}
			});
		};
		//		System.aboutUs(function(response) {
		//			Message.hidden();
		//			$scope.version = response.data;
		//			console.log($scope.version)
		//		}, function(err) {
		//			Message.show(err.msg);
		//		});

		document.addEventListener("deviceready", function () {
			$cordovaAppVersion.getVersionNumber().then(function (version) {
				Message.hidden();
				//						Message.show(version);
				$scope.version = version;
			}, function () {
				Message.show('通讯失败，请检查网络！');
			});
		})

		$scope.getUpdate = function () {
			System.checkUpdate().then(function (response) {
				console.log(response);
				if (response == 'aaa') {
					Message.show("已经是最新版本！", 1500);
				}

			})
		}
		//我的上级
		User.getMysuperior().then(function (repsonse) {
			console.log(repsonse);
			$scope.mysuperiorInfo = repsonse.data;
		});
		//昵称
		$scope.NickName = {
			nickname: ''
		};
		$scope.setNickname = function (nickname) {
			User.setnickname(nickname.nickname).then(function (response) {
				//	console.log(nickname);
				var setNick = Storage.get('user');
				setNick.nickname = nickname.nickname;
				Storage.set('user', setNick);
				$rootScope.globalInfo.user = setNick;
				console.log(Storage.get('user'));

				$timeout(function () {
					Message.show('修改成功');
					$state.go('tab.tcmytc');
				}, 1000);
			})
		};

		$scope.payInfo = {
			img: ''
		};
		var resource = $resource(ENV.YD_URL, {
			do: 'users',
			op: '@op'
		});
		/*上传证件照*/
		$scope.uploadAvatar = function () {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera");
					} else if (index == 1) {
						selectImages("");
					}
					return true;
				}
			})
		};
		var selectImages = function (from) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					$scope.payInfo.img = "data:image/jpeg;base64," + imageURI;
					//										alert($scope.payInfo.img);
					resource.save({
						op: 'changeHead',
						img: $scope.payInfo.img
					}, function (response) {
						// alert('aaaa')
						// alert(JSON.stringify(response));
						if (response.code == '0') {
							var shopApply = Storage.get('user');
							shopApply.avatar = $scope.payInfo.img;
							Storage.set('user', shopApply);
							$rootScope.globalInfo.user = shopApply;
							Message.show('上传成功');
							$state.go('tab.tcmytc');
						} else {
							// alert(JSON.stringify(response))
							Message.show(response.msg);
						}
					});
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 关于我们modal
		$ionicModal.fromTemplateUrl('templates/modal/aboutUs.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.aboutUs = modal;
		});
		$scope.openModal = function () {
			$scope.aboutUs.show()
		}
	})

	.controller('userRealNameCtrl', function ($scope, User, Message, ENV, $interval) {
		$scope.pageData = {
			realname: '',
			gender: 1,
			//			idcard: '',
			//			code: '',
			mobile: ''
		};
		$scope.getCaptchaSuccess = false;
		$scope.personalSuccess = false;
		$scope.reg = {
			number: 60
		};
		$scope.select = function (type) {
			$scope.pageData.gender = type;
		};

		$scope.getRealName = function () {
			var _param = {
				realname: $scope.pageData.realname,
				gender: $scope.pageData.gender,
				idcard: $scope.pageData.idcard,
				code: $scope.pageData.code
			};
			if (!_param.realname || _param.realname.length <= 1) {
				Message.show('请输入真实姓名！');
				return false;
			}
			if (!_param.mobile || _param.mobile.length <= 1) {
				Message.show('手机号！');
				return false;
			}
			//			if(!_param.idcard || !ENV.REGULAR_IDCARD.test(_param.idcard)) {
			//				Message.show('请输入正确的身份证号码！');
			//				return false;
			//			}
			//			User.realNamePwd(_param).then(function() {
			//				$scope.getCaptchaSuccess = true;
			//				var timer = $interval(function() {
			//					if($scope.reg.number <= 1) {
			//						$interval.cancel(timer);
			//						$scope.getCaptchaSuccess = false;
			//						$scope.reg.number = 60;
			//					} else {
			//						$scope.reg.number--;
			//					}
			//				}, 1000)
			//			});
		};
		User.getRealName().then(function (data) {
			console.log(data);
			$scope.pageData = data;
			if ($scope.pageData.realname && $scope.pageData.gender && $scope.pageData.mobile) {
				$scope.personalSuccess = true;
			}
		});

		$scope.submit = function () {
			var _param = {
				realname: $scope.pageData.realname,
				gender: $scope.pageData.gender,
				mobile: $scope.pageData.mobile,
				code: $scope.pageData.code
			};
			if (!$scope.pageData.realname || $scope.pageData.realname.length <= 1) {
				Message.show('请输入真实姓名！');
				return false;
			}
			//			if(!$scope.pageData.idcard || !ENV.REGULAR_IDCARD.test($scope.pageData.idcard)) {
			//				Message.show('请输入正确的身份证号码！');
			//				return false;
			//			}
			//			if(!$scope.pageData.code) {
			//				Message.show('请输入验证码！');
			//				return false;
			//			}
			User.getRealName(_param, 1)
		}
	})

	// 关于我们
	.controller('userAboutUsCtrl', function ($scope, System, Message, aboutUs) {
		//		System.aboutUs(function(response) {
		//			Message.hidden();
		//			$scope.version = response.data;
		//			console.log($scope.version)
		//		}, function(err) {
		//			Message.show(err.msg);
		//		});
		//		$scope.getUpdate = (function() {
		//			var res = System.checkUpdate();
		//			if(res === true) {
		//				Message.show("已经是最新版本！", 1500);
		//			}
		//		})
		aboutUs.serveInfo().then(function (response) {
			$scope.serveInfo = response.data;
		});
	})

	//绑定手机号
	.controller('addMobileCtrl', function ($scope, ENV, $stateParams, Message, Auth, User, $interval) {
		console.log($stateParams)
		$scope.pageData = {
			mobile: '',
			code: '',
			uid: $stateParams.uid
		};
		$scope.reg = {
			number: 60
		};
		Message.hidden();
		$scope.getCaptchaSuccess = false;
		// 获取修改登录或支付验证码
		$scope.getCode = function (mobile) {
			if (!ENV.REGULAR_Phone.test(mobile)) {
				Message.show('请输入正确的号码');
				return;
			}
			Auth.addPhone('send', $scope.pageData);
			var timer = $interval(function () {
				if ($scope.reg.number <= 1) {
					$interval.cancel(timer);
					$scope.getCaptchaSuccess = false;
					$scope.reg.number = 60;
				} else {
					$scope.getCaptchaSuccess = true;
					$scope.reg.number--;
				}
			}, 1000)
		};

		$scope.savePsd = function () {
			Auth.addPhone('check', $scope.pageData, $stateParams.logintype);
		}

	})

	.controller('userLoginPswCtrl', function ($scope, $stateParams, Message, User, $interval) {
		$scope.type = $stateParams.type;
		$scope.getCaptchaSuccess = false;
		$scope.pageData = {
			oldpsd: '',
			code: '',
			newpsd: '',
			respsd: ''
		};
		$scope.reg = {
			number: 60
		};
		// 获取修改登录或支付验证码
		$scope.getCode = function (oldpsd, newpsd, respsd, type) {
			if (oldpsd.length < 6 || newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if (newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			}
			User.getCaptcha(oldpsd, newpsd, respsd, type).then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.reg.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.reg.number = 60;
					} else {
						$scope.reg.number--;
					}
				}, 1000)
			})
		};
		$scope.savePsd = function (oldpsd, code, newpsd, respsd) {
			if (oldpsd.length < 6 || newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if (newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			}
			//		else if(code.length < 4) {
			//			Message.show('请输入正确的验证码');
			//			return;
			//		}
			if ($scope.type == 1) {
				User.changeLoginPsd(oldpsd, code, newpsd, respsd);
			} else if ($scope.type == 2) {
				User.changePayPsd(oldpsd, code, newpsd, respsd);
			}
		}

	})
	.controller('changeMobileCtrl', function ($scope, User, $rootScope, ENV, Message, $interval, Storage, $ionicHistory, $state) {
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.pay = {
			mobile: '',
			code: '',
			psd: '',
			number: 60
		};
		$scope.getCode = function (newpsd, mobile) {
			if (newpsd.length < 6 || mobile.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			}
			User.changeMobile($scope.pay, 'send').then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.pay.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.pay.number = 60;
					} else {
						$scope.pay.number--;
					}
				}, 1000)
			})
		};

		$scope.savePsd = function () {
			User.changeMobile($scope.pay, 'save').then(function (response) {
				Message.show('修改成功，请重新登录', 1000, function () {
					Storage.remove('user');
					$rootScope.globalInfo.user = {
						uid: '',
						isShop: 0
					}
					$ionicHistory.clearCache();
					$ionicHistory.clearHistory();
					$state.go('auth.login')
				})

			})
		}

	})
	.controller('userResetPayWordCtrl', function ($scope, User, ENV, Message, $interval) {

		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.pay = {
			mobile: '',
			code: '',
			newpsd: '',
			respsd: '',
			number: 60
		};
		$scope.getCode = function (newpsd, respsd) {
			if (newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if (newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			}
			User.resetPwd(newpsd, respsd).then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.pay.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.pay.number = 60;
					} else {
						$scope.pay.number--;
					}
				}, 1000)
			})
		};

		$scope.savePsd = function (newpsd, respsd, code) {
			User.resetPayPsd(newpsd, respsd, code);
		}

	})
	// 忘记支付密码
	.controller('userResetPayWordCtrl', function ($scope, User, ENV, Message, $interval) {
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.pay = {
			mobile: '',
			code: '',
			newpsd: '',
			respsd: '',
			number: 60
		};
		$scope.getCode = function (newpsd, respsd) {
			if (newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if (newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			}
			User.resetPwd(newpsd, respsd).then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.pay.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.pay.number = 60;
					} else {
						$scope.pay.number--;
					}
				}, 1000)
			})
		};

		$scope.savePsd = function (newpsd, respsd, code) {
			User.resetPayPsd(newpsd, respsd, code);
		}

	})
	.controller('academydetailCtrl', function ($stateParams, Article, ENV, $rootScope, $ionicActionSheet, $scope, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, Storage) {
		console.log($stateParams);
		$scope.empty = false;
		Article.getArticlesDetail($stateParams.id).then(function (response) {
			console.log(response);
			if (response.code == 0) {
				$scope.details = response.data;
				$('#detailintro').html($scope.details.info);
			}
		});

		//分享
		$scope.sharechats = function (scene, title, desc, url, thumb) {
			console.log($scope.shareinfo);
			Wechat.share({
				message: {
					title: $scope.shareinfo.title,
					description: $scope.shareinfo.description,
					thumb: $scope.shareinfo.thumb,
					//     url: url ?url : "http://baidu.com"
					media: {
						type: Wechat.Type.WEBPAGE,
						webpageUrl: $scope.shareinfo.sharelink
					}
				},
				scene: scene // share to Timeline  
			}, function () {
				//								alert("Success");
			}, function (reason) {
				//								alert("Failed: " + reason);
			});
		};
		$scope.shareArticle = function (title, desc, url, thumb) {
			$scope.shareinfo = {
				title: $scope.details.title,
				description: $scope.details.description,
				thumb: 'vricon.png',
				sharelink: ENV.shareLink + 'user/academydetail/' + $stateParams.id
			};

			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					'text': '分享给好友'
				},
				{
					'text': '分享到朋友圈'
				}
				],
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.sharechats(0, title, desc, url, thumb);
						hideSheet();
					} else if (index == 1) {
						$scope.sharechats(1, title, desc, url, thumb);
						hideSheet();
					}
				}

			});
			//			$timeout(function() {
			//				hideSheet();
			//			}, 2000);
		};

	})
	.controller('newsactiveCtrl', function ($stateParams, Article, $rootScope, $scope, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, Storage) {
		console.log($stateParams);
		$scope.empty = false;
		if ($stateParams.type == 'notice') {
			$scope.titleshows = '平台公告'
		} else {
			$scope.titleshows = '新闻动态'
		}
		$scope.titleshow =
			Article.newsavtive($stateParams.type).then(function (response) {
				console.log(response);
				if (response.code == 0) {
					$scope.empty = false;
					$scope.newslist = response.data;
				} else {
					$scope.empty = true;
					$scope.newslist = response.data;
				}
			});

	})
	.controller('sandeacademyCtrl', function ($stateParams, Article, $rootScope, $scope, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, Storage) {
		$scope.empty = false;
		$scope.showslide = true;

		Article.fetchnav().then(function (response) {
			console.log(response);
			if (response.code == 0) {
				$scope.catelist = response.data;
			}
		});
		Article.fetch($scope.cid).then(function (response) {
			if (response.code == 1) {
				$scope.empty = true;
				$scope.newslist = response.data;
			}
			$scope.empty = false;
			$scope.newslist = response.data;
			if ($scope.newslist.list) {
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
				$ionicSlideBoxDelegate.loop(true);
			}
			$('.sandeshuyuan dl dd:first-child').addClass('red');
		});
		$scope.chooseshow = function (cid) {
			console.log(cid);
			if (!cid) {
				$('.sandeshuyuan dd').removeClass('red');
				$('.sandeshuyuan dd:first-child').addClass('red');
			} else {
				$('.sandeshuyuan dd').removeClass('red');
				$('.sandeshuyuan #' + cid).addClass('red');
			}
			Article.fetch(cid).then(function (response) {
				if (response.code == 1) {
					if (!cid) {
						$scope.showslide = true;
					} else {
						$scope.showslide = false;
					}
					$scope.empty = true;
					$scope.newslist = response.data;
				} else {
					if (!cid) {
						$scope.showslide = true;
					} else {
						$scope.showslide = false;
					}
					$scope.empty = false;
					$scope.newslist = response.data;
					if ($scope.newslist.slide) {
						$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
						$ionicSlideBoxDelegate.loop(true);
					}
				}

			});
		}
	})
	.controller('myserve-newsCtrl', function ($scope, User, $stateParams) {
		$scope.empty = false;
		User.getservenews().then(function (response) {
			if (response.code == 0) {
				$scope.empty = true;
				$scope.newslist = response.data;
			}
			$scope.empty = false;
			$scope.newslist = response.data;
		})
	})
	.controller('userNewsCtrl', function ($scope) {

	})
	// 用户帮助列表详情
	.controller('userNewsDetailsCtrl', function ($scope, User, $stateParams) {
		$scope.boll = false;
		$scope.helpDetail = {
			title: '',
			createtime: '',
			content: ''
		};
		$scope.id = $stateParams.id;
		User.helpInfo($scope.id).then(function (data) {
			$scope.boll = true;
			$scope.helpDetail = data;
		})
	})
	// 用户帮助列表
	.controller('userHelpCtrl', function ($scope, User) {
		$scope.userList = '';
		User.useHelp().then(function (data) {
			$scope.userList = data;
			console.log(data)
		});
	})
	.controller('userRepoCtrl', function ($scope, Message, User, $stateParams, Storage, $state, $timeout) {

		$scope.agentInfo = {
			from: $stateParams.from || "",
			agentId: $stateParams.agentId || ""
		}

		// 取出代理的id
		if (Storage.get('agentInfo')) {
			$scope.agentInfo = {
				from: $stateParams.from || Storage.get('agentInfo').from,
				agentId: $stateParams.agentId || Storage.get('agentInfo').agentId
			}

		} else {
			$scope.agentInfo = {
				from: $stateParams.from || "",
				agentId: $stateParams.agentId || ""
			}
		}

		// 选择银行卡
		$scope.goBank = function () {
			if ($scope.agentInfo.agentId != '' && $scope.agentInfo.from == 'agent') {
				Storage.set('agentInfo', $scope.agentInfo);
				$state.go('user.myBank')
			} else {
				$state.go('user.myBank')
			}

		}

		$scope.showDrop = false;
		$scope.showDropType = "余额";
		$scope.beanType = function (num, title) {
			$scope.showDropType = title;
			$scope.showDrop = false;
		};
		$scope.repoInfo = {
			bean: '',
			passwords: '',
			shopAccount: '',
			selecedType: '',
			bank: ''
		};
		$scope.category = [{
			id: '1',
			title: '当天到账',
		},
		{
			id: '2',
			title: '1-3天到账'
		}
		]
		if ($scope.agentInfo.from == 'agent') {
			User.getRepo($scope.agentInfo).then(function (data) {

				$scope.repoInfo = data;

			});
		} else {

			Storage.remove('agentInfo');
			$scope.agentInfo = {
				from: "",
				agentId: ""
			}
			console.log($scope.agentInfo)
			User.getRepo($scope.agentInfo).then(function (data) {
				console.log(data);
				$scope.repoInfo = data;
				console.log($scope.repoInfo);
			});
		}
		$scope.btnDisabled = false;
		var r = /^[1-9]\d*00$/;
		if ($scope.agentInfo.from == 'agent') {
			$scope.submit = function () {
				if (!$scope.repoInfo.bean) {
					Message.show('请输入提现金额！');
					return;
				}
				if ($scope.repoInfo.bean > $scope.repoInfo.beanNum) {
					Message.show('余额不足！');
					return;
				}
				if (!$scope.repoInfo.passwords) {
					Message.show('请输入支付密码！');
					return;
				}
				$scope.btnDisabled = true;
				User.agentWithDraw($scope.repoInfo, $scope.agentInfo).then(function (res) {
					Message.show(res.msg, 2000);
					$timeout(function () {
						$state.go('user.agentWithDrawList', {
							agentId: $scope.agentInfo.agentId
						})
					}, 2000)
				}, function (res) {
					Message.show(res.msg);
					$scope.btnDisabled = false;

				});
			}
		} else {
			$scope.submit = function () {
				if (!$scope.repoInfo.bean) {
					Message.show('请输入提现金额！');
					return;
				}
				if ($scope.repoInfo.bean > $scope.repoInfo.beanNum) {
					Message.show('余额不足！');
					return;
				}
				if (!$scope.repoInfo.passwords) {
					Message.show('请输入支付密码！');
					return;
				}
				$scope.btnDisabled = true;
				User.getRepo($scope.agentInfo, 'save', $scope.repoInfo).then(function (res) {

				}, function (res) {
					Message.show(res.msg);
					$scope.btnDisabled = false;

				});
			}
		}

	})
	//	.controller('userRepoCtrl', function($scope, Message, User) {
	//		$scope.showDrop = false;
	//		$scope.showDropType = "余额";
	//		$scope.beanType = function(num, title) {
	//			$scope.showDropType = title;
	//			$scope.showDrop = false;
	//		};
	//		$scope.repoInfo = {
	//			bean: '',
	//			passwords: ''
	//		};
	//		User.getRepo().then(function(data) {
	//			console.log(data);
	//			$scope.repoInfo = data;
	//		});
	//
	//		var r = /^[1-9]\d*00$/;
	//		$scope.submit = function() {
	//			if(!$scope.repoInfo.bank) {
	//				Message.show('请添加银行卡！');
	//				return;
	//			}
	//			if(!$scope.repoInfo.bean) {
	//				Message.show('请输入提现金额！');
	//				return;
	//			}
	//			if($scope.repoInfo.bean > $scope.repoInfo.beanNum) {
	//				Message.show('余额不足！');
	//				return;
	//			}
	//			if(!$scope.repoInfo.passwords) {
	//				Message.show('请输入支付密码！');
	//				return;
	//			}
	//			User.getRepo('type', $scope.repoInfo);
	//		}
	//	})

	.controller('baladetailListCtrl', function ($scope, User, $ionicLoading, $stateParams) {
		$scope.type = $stateParams.type;
		$scope.repoList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.baladetailList($scope.select).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
				$scope.repoList = response.data
			} else {
				$scope.orderEmpty = false;
				$scope.repoList = response.data
			}
		});

		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = false;
			User.baladetailList(id).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.repoList = response.data
				} else {
					$scope.orderEmpty = false;
					$scope.repoList = response.data
				}
			});
			$scope.page = 2;
		};

		// 下拉刷新
		//		$scope.doRefresh = function() {
		//			User.baladetailList($scope.select).then(function(response) {
		//				$scope.repoList = response.data;
		//				$scope.$broadcast('scroll.refreshComplete');
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: '刷新成功！',
		//					duration: '3000'
		//				});
		//			});
		//		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.baladetailList($scope.select, $scope.page).then(function (response) {
				$scope.page++;
				$scope.repoList = $scope.repoList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})
	.controller('icebalanceCtrl', function ($scope, User, $ionicLoading, $stateParams) {
		$scope.type = $stateParams.type;
		$scope.repoList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.getRepoList($scope.select).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.repoList = response.data
			}
		});

		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = false;
			User.getRepoList(id).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.repoList = response.data
				}
			});
			$scope.noMore = false;
			$scope.page = 2;
		};

		// 下拉刷新
		//		$scope.doRefresh = function() {
		//			User.getRepoList($scope.select).then(function(response) {
		//				$scope.repoList = response.data;
		//				$scope.$broadcast('scroll.refreshComplete');
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: '刷新成功！',
		//					duration: '3000'
		//				});
		//			});
		//		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.getRepoList($scope.select, $scope.page).then(function (response) {
				$scope.page++;
				//				$scope.repoList = $scope.repoList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})
	.controller('userRepoListCtrl', function ($scope, User, $ionicLoading, $stateParams) {
		$scope.from = $stateParams.from;
		$scope.type = $stateParams.type;
		$scope.repoList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.getRepoList($scope.select).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.repoList = response.data
			}
		});

		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = false;
			User.getRepoList(id).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.repoList = response.data
				}
			});
			$scope.noMore = false;
			$scope.page = 2;
		};

		// 下拉刷新
		//		$scope.doRefresh = function() {
		//			User.getRepoList($scope.select).then(function(response) {
		//				$scope.repoList = response.data;
		//				$scope.$broadcast('scroll.refreshComplete');
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: '刷新成功！',
		//					duration: '3000'
		//				});
		//			});
		//		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.getRepoList($scope.select, $scope.page).then(function (response) {
				$scope.page++;
				//				$scope.repoList = $scope.repoList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userRepoInfoCtrl', function ($scope, Message, User, $stateParams) {
		$scope.id = $stateParams.id;
		$scope.repoInfo = {};
		$scope.orderEmpty = false;
		User.getRepoInfo($scope.id).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.repoInfo = response.data;
			}
		});
	})
	.controller('giftAddressCtrl', function ($scope, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout, $state) {
		$scope.isDefault = '';
		$scope.addressInfo = {
			userName: '',
			bankName: '',
			idCard: '',
			bankCard: '',
			mobile: ''
		};
		$scope.showBank = false;
		//		$scope.bankType = function(num, title) {
		//			$scope.bankInfo.bankName = title;
		//			$scope.showBank = false;
		//		};
		User.getaddresslist().then(function (data) {
			console.log(data);
			angular.forEach(data, function (x, y) {
				if (x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.addressList = data;
		});
		// 选择银行卡
		$scope.selectAddress = function (id) {
			$scope.isDefault = id;
		};
		//删除地址
		//		$scope.removeAddress = function(id) {
		//			User.getaddresslist('delete', id).then(function(response) {
		//				if(response.code == 0) {
		//					$timeout(function() {
		//						Message.show('删除成功！');
		//					}, 1000);
		//					$scope.isDefault = '';
		//					User.getaddresslist().then(function(data) {
		//						angular.forEach(data, function(x) {
		//							if(x.isDefault == 1) {
		//								$scope.isDefault = x.id;
		//							}
		//						});
		//						$scope.addressList = data;
		//					});
		//				}
		//			})
		//		};
		$scope.submitAddressType = function () {
			if (!$scope.isDefault) {
				Message.show('请先添加地址！');
				return;
			}
			$state.go('user.suregift', {
				id: $scope.isDefault
			});
			//			User.getaddresslist('order', $scope.isDefault);
		}

	})
	.controller('orderAddressCtrl', function ($scope, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout, $state) {
		$scope.isDefault = '';
		$scope.addressInfo = {
			userName: '',
			bankName: '',
			idCard: '',
			bankCard: '',
			mobile: ''
		};
		$scope.showBank = false;
		//		$scope.bankType = function(num, title) {
		//			$scope.bankInfo.bankName = title;
		//			$scope.showBank = false;
		//		};
		User.getaddresslist().then(function (data) {
			console.log(data);
			angular.forEach(data, function (x, y) {
				if (x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.addressList = data;
		});
		// 选择银行卡
		$scope.selectAddress = function (id) {
			$scope.isDefault = id;
		};
		//删除地址
		//		$scope.removeAddress = function(id) {
		//			User.getaddresslist('delete', id).then(function(response) {
		//				if(response.code == 0) {
		//					$timeout(function() {
		//						Message.show('删除成功！');
		//					}, 1000);
		//					$scope.isDefault = '';
		//					User.getaddresslist().then(function(data) {
		//						angular.forEach(data, function(x) {
		//							if(x.isDefault == 1) {
		//								$scope.isDefault = x.id;
		//							}
		//						});
		//						$scope.addressList = data;
		//					});
		//				}
		//			})
		//		};
		$scope.submitAddressType = function () {
			if (!$scope.isDefault) {
				Message.show('请先添加地址！');
				return;
			}
			User.getaddresslist('order', $scope.isDefault);
		}

	})
	.controller('myaddressCtrl', function ($scope, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout, $state) {
		$scope.bankList = {};
		$scope.isDefault = '';
		$scope.addressInfo = {
			userName: '',
			bankName: '',
			idCard: '',
			bankCard: '',
			mobile: ''
		};
		$scope.showBank = false;
		$scope.bankType = function (num, title) {
			$scope.bankInfo.bankName = title;
			$scope.showBank = false;
		};
		User.getaddresslist().then(function (data) {
			console.log(data);
			angular.forEach(data, function (x, y) {
				if (x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.addressList = data;
		});
		// 选择银行卡
		$scope.selectAddress = function (id) {
			$scope.isDefault = id;
		};
		//删除银行卡
		$scope.removeAddress = function (id) {
			User.getaddresslist('delete', id).then(function (response) {
				if (response.code == 0) {
					$timeout(function () {
						Message.show('删除成功！');
					}, 1000);
					$scope.isDefault = '';
					User.getaddresslist().then(function (data) {
						angular.forEach(data, function (x) {
							if (x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.addressList = data;
					});
				}
			})
		};
		$scope.submitAddressType = function () {
			if (!$scope.isDefault) {
				Message.show('请先添加地址！');
				return;
			}
			User.getaddresslist('select', $scope.isDefault);
		}

	})
	.controller('userMyBankCtrl', function ($scope, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout, $stateParams) {
		console.log($stateParams);
		$scope.bankList = {};
		$scope.isDefault = '';
		$scope.bankInfo = {
			userName: '',
			bankName: '',
			bankDown: '',
			idCard: '',
			bankCard: '',
			mobile: ''
		};
		$scope.showBank = false;
		$scope.bankType = function (num, title) {
			$scope.bankInfo.bankName = title;
			$scope.showBank = false;
		};

		User.getBank().then(function (data) {
			angular.forEach(data, function (x, y) {
				if (x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.bankList = data;
		});
		if ($stateParams.button == 'hidden') {
			$scope.buttonshow = false;
		} else {
			$scope.buttonshow = true;
		}
		// 提交添加银行卡资料
		$scope.submitData = function () {
			if (!$scope.bankInfo.userName) {
				Message.show('请输入开户姓名！');
				return;
			}
			if (!$scope.bankInfo.bankName) {
				Message.show('请选择转入银行的名称！');
				return;
			}
			if (!$scope.bankInfo.idCard || !ENV.REGULAR_IDCARD.test($scope.bankInfo.idCard)) {
				Message.show('请输入正确的身份证号！');
				return;
			}
			if (!$scope.bankInfo.bankCard || $scope.bankInfo.bankCard.length <= 5) {
				Message.show('请输入正确的银行卡号！');
				return;
			}
			if (!$scope.bankInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.bankInfo.mobile)) {
				Message.show('请输入正确的手机号！');
				return;
			}
			User.getBankInfo('type', $scope.bankInfo).then(function (response) {
				if (response.code == 0) {
					$scope.addBank.hide();
					$scope.bankInfo = {
						userName: '',
						bankName: '',
						idCard: '',
						bankCard: '',
						mobile: ''
					};
					$timeout(function () {
						Message.show('添加成功！');
					}, 1000);
					User.getBank().then(function (data) {
						angular.forEach(data, function (x, y) {
							if (x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.bankList = data;
					});
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			});
		};
		// 添加银行卡号
		$ionicModal.fromTemplateUrl('templates/modal/addBank.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.addBank = modal;
		});
		$scope.openModal = function () {
			$scope.addBank.show();
			User.getBankInfo().then(function (response) {
				$scope.bankInfo = response.data;
			});
		};
		// 选择银行卡
		$scope.selectBank = function (id) {
			$scope.isDefault = id;
		};
		//删除银行卡
		$scope.removeBank = function (id) {
			User.getBank('delete', id).then(function (response) {
				if (response.code == 0) {
					$timeout(function () {
						Message.show('删除成功！');
					}, 500);
					$scope.isDefault = '';
					User.getBank().then(function (data) {
						angular.forEach(data, function (x) {
							if (x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.bankList = data;
					});
				}
			})
		};
		$scope.submitBankType = function () {
			if (!$scope.isDefault) {
				Message.show('请先添加银行卡！');
				return;
			}
			User.getBank('select', $scope.isDefault, $stateParams.from);
		}

	})

	.controller('userGiveCtrl', function ($scope, User, Message, ENV) {
		$scope.giveInfo = {
			userId: '',
			giveBeanNum: '',
			payPassword: '',
			beanNum: ''
		};
		User.getGive().then(function (data) {
			$scope.giveInfo = data;
		});
		$scope.submit = function () {
			if (!$scope.giveInfo.userId) {
				Message.show('请输入获赠人ID');
				return;
			}
			if (!$scope.giveInfo.giveBeanNum || !ENV.REGULAR_MONEY.test($scope.giveInfo.giveBeanNum)) {
				Message.show('请输入转赠数量');
				return;
			}
			if ($scope.giveInfo.giveBeanNum > $scope.giveInfo.beanNum) {
				Message.show('数量不足');
				return;
			}
			if (!$scope.giveInfo.payPassword) {
				Message.show('请输入支付密码');
				return;
			}
			User.getGive('type', $scope.giveInfo);
		}
	})

	.controller('userRecommendCtrl', function ($scope, User, Message) {
		$scope.myQrcode = {};
		User.recomCode().then(function (data) {
			console.log(data);
			$scope.myQrcode = data;
		});
		$scope.developing = function () {
			Message.show('开发中...');
		}
	})

	.controller('userRecommendHistoryCtrl', function ($scope, User, $ionicLoading) {
		$scope.recommendList = {};
		$scope.orderEmpty = false;
		$scope.select = 1;
		User.recommendList($scope.select).then(function (response) {
			$scope.recommendList = response.data;
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.recommendList = response.data
			}
		});

		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = false;
			User.recommendList(id).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.recommendList = response.data
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function () {
			User.recommendList().then(function (response) {
				$scope.recommendList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.recommendList($scope.page).then(function (response) {
				$scope.page++;
				$scope.recommendList = $scope.recommendList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userMyMessageCtrl', function ($scope, $timeout, Notice, $ionicModal, $state, $ionicLoading) {
		$scope.select = 1;
		$scope.orderEmpty = false;
		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = false;
			Notice.getList(id).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.allNotice = response.data;
				}
				$timeout(function () {
					$scope.noMore = true;
					$scope.page = 2;
				}, 1000)
			});
		};
		$scope.onSwipe = function (a) {
			if (a == 'l') {
				$scope.select++;
				if ($scope.select <= 4) {
					Notice.getList($scope.select).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
							$scope.allNotice = response.data;
						}
					});
				}
				$scope.select = Math.min(4, $scope.select);
			} else {
				$scope.select--;
				if ($scope.select > 0) {
					Notice.getList($scope.select).then(function (response) {
						if (response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
							$scope.allNotice = response.data;
						}
					});
				}
				$scope.select = Math.max(1, $scope.select);
			}
		}
		$scope.statusName = {
			'1': '未读',
			'2': '已读'
		};
		$scope.allNotice = {};
		Notice.getList().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.allNotice = response.data;
			}
		});
		// 跳转
		$scope.toUrl = function (id, type) {
			$state.go('user.notice', {
				id: id
			});
			//			Notice.getInfo(id, type).then(function(data) {
			//				if(data.linkUrl.url == 'shops.orderInfo') {
			//					$state.go(data.linkUrl.url, {
			//						id: data.linkUrl.param.id,
			//						type: data.linkUrl.param.type
			//					});
			//				} else if(data.linkUrl.url == 'user.notice') {
			//					$state.go(data.linkUrl.url, {
			//						id: data.linkUrl.param.id
			//					});
			//				}
			//			});
		};
		// 下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			Notice.getList($scope.select).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
					$scope.allNotice = response.data;
				} else {
					$scope.orderEmpty = false;
					$scope.allNotice = response.data;
				}
				$timeout(function () {
					$scope.noMore = true;
					$scope.page = 2;
				}, 1000)
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Notice.getList($scope.select, $scope.page).then(function (response) {
				$scope.page++;
				$scope.allNotice = $scope.allNotice.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多消息了！',
						duration: '1200'
					});
				}
			});
		};
	})
	.controller('orderaddaddressCtrl', function ($scope, $ionicModal, Area, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, User) {
		$scope.addaddress = {
			userName: '',
			address: '',
			mobile: ''
		};
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function () {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		// 提交商家申请信息
		$scope.submit = function () {
			if (!$scope.addaddress.userName) {
				Message.show("收货人不能为空！");
				return false;
			}
			if (!$scope.addaddress.mobile || !ENV.REGULAR_MOBILE.test($scope.addaddress.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if (!$scope.up.userInfo.area) {
				Message.show("请选择地址！");
				return false;
			}
			if (!$scope.addaddress.address) {
				Message.show("请输入您的详细地址！");
				return false;
			}

			User.addAddress($scope.addaddress, $scope.up.userInfo.area).then(function (response) {
				if (response.code == 0) {
					$state.go('goods.orderAddress');
				}

			});
		}
	})
	.controller('myaddressinfoCtrl', function ($scope, $ionicModal, Area, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, User, $stateParams) {
		console.log($stateParams);
		$scope.addaddress = {
			username: '',
			address: '',
			mobile: '',
			isDefault: null
		};
		User.getaddresslist('edit', $stateParams.id).then(function (response) {
			console.log(response);
			//			angular.forEach(data, function(x, y) {
			//				if(x.isDefault == 1) {
			//					$scope.isDefault = x.id;
			//				}
			//			});
			$scope.addaddress = response.data;
			$scope.up.userInfo.area = response.data.birth;
		});
		$scope.choisDefault = function (nums) {
			console.log(nums);
			if (nums == '0') {
				$scope.addaddress.isDefault = 1;
			} else {
				$scope.addaddress.isDefault = 0;
			}
		}
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function () {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		// 提交商家申请信息
		$scope.submit = function (id) {
			if (!$scope.addaddress.username) {
				Message.show("收货人不能为空！");
				return false;
			}
			if (!$scope.addaddress.mobile || !ENV.REGULAR_MOBILE.test($scope.addaddress.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if (!$scope.up.userInfo.area) {
				Message.show("请选择地址！");
				return false;
			}
			if (!$scope.addaddress.address) {
				Message.show("请输入您的详细地址！");
				return false;
			}
			User.getaddresslist('edit', id, $scope.addaddress, $scope.up.userInfo.area).then(function (response) {
				if (response.code == 0) {
					$state.go('user.myaddress');
				} else {
					Message.show(response.msg);
				}

			});
		}
	})
	.controller('addaddressCtrl', function ($scope, $ionicModal, Area, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, User) {
		$scope.addaddress = {
			userName: '',
			address: '',
			mobile: '',
			isDefault: 0
		};
		$scope.choisDefault = function (nums) {
			console.log(nums);
			if (nums == '0') {
				$scope.addaddress.isDefault = 1;
			} else {
				$scope.addaddress.isDefault = 0;
			}
		}
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function () {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		// 提交商家申请信息
		$scope.submit = function () {
			if (!$scope.addaddress.userName) {
				Message.show("收货人不能为空！");
				return false;
			}
			if (!$scope.addaddress.mobile || !ENV.REGULAR_MOBILE.test($scope.addaddress.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if (!$scope.up.userInfo.area) {
				Message.show("请选择地址！");
				return false;
			}
			if (!$scope.addaddress.address) {
				Message.show("请输入您的详细地址！");
				return false;
			}

			User.addAddress($scope.addaddress, $scope.up.userInfo.area).then(function (response) {
				if (response.code == 0) {
					$state.go('user.myaddress');
				}

			});
		}
	})
	.controller('shoplicencesCtrl', function ($scope, $ionicModal, Area, Apply, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, aboutUs, $stateParams, User) {
		$scope.$on("$ionicView.beforeEnter", function () {
			console.log($stateParams);
			if ($stateParams.showcontent == 'info') {
				$scope.showcontent = 'info';
			} else {
				$scope.showcontent = 'images';
			}
		})
		$scope.shoptypes = $stateParams.shoptypes;
		$scope.applyInfo = {
			title: '',
			address: '',
			tel: '',
			cid: '',
			shopsGiveRatio: '',
			idCardThumbA: '',
			idCardThumbB: '',
			businessImg: '',
			shopsImg: '',
			leve: '',
			street: '',
			branch: '',
			logo: '',
			photo: '',
			businessLicence: '',
			birthInfo: '',
			category: [],
			holdCard: '',
			hygieneCard: '', //卫生许可证
			//			foodExchangeCard:'',//食品流通证
			goodFaithCard: '', //诚信承诺证
			legalPersonCard: '', //法人委托照
		};
		User.getShopsDetail($stateParams.showcontent).then(function (response) {
			console.log(response);
			$scope.applyInfo = response.data;
			$scope.up.userInfo.area = $scope.applyInfo.birthInfo;
			//			if($scope.showcontent == 'images') {
			//				if($scope.shoptypes == '个人') {
			//					var image1 = document.getElementById('divImg01');
			//						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
			//			var image1 = document.getElementById('divImg01');
			//						image1.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.photo + ")";
			//					var image2 = document.getElementById('divImg02');
			//					image2.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.logo + ")";
			//					var image3 = document.getElementById('divImg03');
			//						image3.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.idCardThumbA + ")";
			//						image3.style.backgroundImage = "url("+response.data.idCardThumbA+")";
			//					var image4 = document.getElementById('divImg04');
			//					image4.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.idCardThumbB + ")";
			//					image4.style.backgroundImage = "url("+response.data.idCardThumbB+")";
			//				} else{
			//					var image1 = document.getElementById('divImg01');
			//						image1.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.photo + ")";
			//					var image2 = document.getElementById('divImg02');
			//					image2.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.logo + ")";

			//					var imageg = document.getElementById('divImg05');
			//					image5.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.businessLicence + ")";
			//                imageg.style.backgroundImage = "url("+response.data.businessLicence+")";

			//				}
			//				var image1 = document.getElementById('divImg01');
			//					image1.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.photo + ")";
			//            image1.style.backgroundImage = "url("+response.data.photo+")";
			//					var image2 = document.getElementById('divImg02');
			//					image2.style.backgroundImage = "url("+response.data.logo+")";
			//					image2.style.backgroundImage = "url(data:image/jpeg;base64,"+response.data.logo + ")";

			//			} else if($scope.showcontent == 'info') {
			//				$scope.applyInfo = response.data;
			//				$scope.up.userInfo.area = response.data.birthInfo;
			//			}

		});
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function () {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				//				$scope.up.userInfo.pro=$scope.areaData[pid].title;
				//				$scope.up.userInfo.city=$scope.areaData[pid]['cities'][cid].title;
				//				$scope.up.userInfo.xian=$scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					//					$scope.up.userInfo.pro=$scope.areaData[pid].title;
					//				$scope.up.userInfo.city=$scope.areaData[pid]['cities'][cid].title;
					//				$scope.up.userInfo.xian=$scope.areaData[pid]['cities'][cid]['districts'][id];
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		/*上传证件照*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};

		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //店照
						$scope.applyInfo.photo = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 2) { //logo
						$scope.applyInfo.logo = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 3) { //正面
						$scope.applyInfo.idCardThumbA = "data:image/jpeg;base64," + imageURI;
						var image3 = document.getElementById('divImg03');
						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 4) { //反面
						$scope.applyInfo.idCardThumbB = "data:image/jpeg;base64," + imageURI;
						var image4 = document.getElementById('divImg04');
						image4.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 5) { //证照
						$scope.applyInfo.businessLicence = "data:image/jpeg;base64," + imageURI;
						var image5 = document.getElementById('divImg05');
						image5.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 5) { //手持证照
						$scope.applyInfo.holdCard = "data:image/jpeg;base64," + imageURI;
						var image11 = document.getElementById('divImg11');
						image11.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 21) { //卫生
						$scope.applyInfo.hygieneCard = "data:image/jpeg;base64," + imageURI;
						var image21 = document.getElementById('divImg21');
						image21.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 22) { //诚信
						$scope.applyInfo.goodFaithCard = "data:image/jpeg;base64," + imageURI;
						var image22 = document.getElementById('divImg22');
						image22.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 23) { //法人委托
						$scope.applyInfo.goodFaithCard = "data:image/jpeg;base64," + imageURI;
						var image23 = document.getElementById('divImg23');
						image23.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 提交商家申请信息
		$scope.apply = function () {
			if ($scope.showcontent == 'images') {

			} else {
				if (!$scope.applyInfo.title) {
					Message.show("店铺名称不能为空！");
					return false;
				}
				if (!$scope.up.userInfo.area) {
					Message.show("请选择地址！");
					return false;
				}
				if (!$scope.applyInfo.street) {
					Message.show("请填写所属街道！");
					return false;
				}
				if (!$scope.applyInfo.address) {
					Message.show("请输入您的详细地址！");
					return false;
				}
				if (!$scope.applyInfo.tel || !ENV.REGULAR_MOBILE.test($scope.applyInfo.tel)) {
					Message.show("请输入正确的联系方式！");
					return false;
				}
				//			if(!$scope.applyInfo.selecedType) {
				//				Message.show("请选择商户经营类型！");
				//				return false;
				//			}

				if ($scope.applyInfo.shopsGiveRatio < 2 || $scope.applyInfo.shopsGiveRatio > 40) {
					Message.show("店铺让利范围是2%~40%");
					return false;
				}

			}

			//			if(!$scope.applyInfo.corrImg) {
			//				Message.show("请上传您的法人身份证正面照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.falImg) {
			//				Message.show("请上传您的法人身份证反面照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.businessImg) {
			//				Message.show("请上传您的营业执照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.shopsImg) {
			//				Message.show("请上传您的商铺封面照！");
			//				return false;
			//			}
			$scope.applyInfo.birthInfo = $scope.up.userInfo.area;
			User.getShopsDetail($stateParams.showcontent, $scope.applyInfo, 'operate').then(function (data) {
				Message.show('修改成功');
				$state.go('shops.shop');
			});
		}
	})

	.controller('exitapplyCtrl', function ($scope, $ionicModal, Area, Order, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, aboutUs, $stateParams) {
		console.log($stateParams);
		$scope.showchos = false;
		$scope.applyInfo = {
			id: $stateParams.id,
			reason: '',
			corrImg: '',
			exitType: '',
			money: $stateParams.money,
			exitId: ''
		};
		$scope.exitTypes = [{
			type: '仅退款',
			id: 1
		},
		{
			type: '仅退货',
			id: 2
		}, {
			type: '退款退货',
			id: 3
		}
		];
		$scope.typesName = {
			1: '仅退款',
			2: '仅退货',
			3: '退款退货'
		}
		$scope.statusName = {
			1: '已申请',
			2: '商家已同意',
			3: '平台同意'
		}
		$scope.showtypes = function () {
			$scope.showchos = true;
			console.log($scope.showchos);
		}
		$scope.choseType = function (id, title) {
			console.log(id, title)
			$scope.applyInfo.exitType = title;
			$scope.applyInfo.exitId = id;
			$scope.showchos = false;
		};
		Order.exitApply($scope.applyInfo).then(function (response) {
			console.log(response);
			if (response.data == '') {
				$scope.applyShow = false;
			} else {
				$scope.applyShow = true;
				$scope.info = response.data;
				console.log($scope.info);
			}

		});
		// 提交退款申请
		$scope.apply = function () {
			console.log($scope.applyInfo)
			if ($scope.applyInfo.exitType == '') {
				Message.show("请选择方式！");
				return false;
			}
			if (!$scope.applyInfo.reason) {
				Message.show("请填写原因！");
				return false;
			}
			Order.exitApply($scope.applyInfo, 'submit').then(function (response) {
				$state.go('shops.useronlineorderInfo', {
					id: $stateParams.id
				});
			});
		}

		/*上传证件照*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};
		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //身份证正面照
						$scope.applyInfo.corrImg = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 2) { //身份证反面照
						$scope.applyInfo.falImg = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 3) { //营业执照
						$scope.applyInfo.businessImg = "data:image/jpeg;base64," + imageURI;
						var image3 = document.getElementById('divImg03');
						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
					//					else if(type == 4) { //商铺封面照
					//						$scope.applyInfo.shopsImg = "data:image/jpeg;base64," + imageURI;
					//						var image4 = document.getElementById('divImg04');
					//						image4.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					//					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};

	})
	.controller('userApplyCtrl', function ($scope, $ionicModal, Area, Apply, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, aboutUs, $stateParams) {
		console.log($stateParams);
		$scope.applyInfo = {
			//			userName: '',
			shopName: '',
			//			cName: '',
			//			shopPer: '',
			address: '',
			mobile: '',
			//			shopDescrip: '',
			selecedType: '',
			selectedBili: '',
			corrImg: '',
			falImg: '',
			businessImg: '',
			shopsImg: '',
			shoptype: '',
			street: '',
			branch: '',
			holdCard: '',
			hygieneCard: '', //卫生许可证
			//			foodExchangeCard:'',//食品流通证
			goodFaithCard: '', //诚信承诺证
			legalPersonCard: '', //法人委托照

		};
		$scope.applyInfo.shoptype = $stateParams.shoptype;
		$scope.selectType = {};
		$scope.applyBol = true;
		$scope.showShopDesc = function () {
			$scope.applyBol = !$scope.applyBol;
		};
		$scope.shopsagreement = '';
		aboutUs.agreement('shops').then(function (response) {
			$scope.shopsagreement = response.data;
		});
		// 商家协议
		$ionicModal.fromTemplateUrl('templates/modal/shopAgreement.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.shopAgreement = modal;
		});
		$scope.showShopAgreement = function () {
			$scope.shopAgreement.show();
			$('#shopagree').html($scope.shopsagreement);
		};
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function () {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};

		/*上传证件照*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};

		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //身份证正面照
						$scope.applyInfo.corrImg = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 2) { //身份证反面照
						$scope.applyInfo.falImg = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 3) { //营业执照
						$scope.applyInfo.businessImg = "data:image/jpeg;base64," + imageURI;
						var image3 = document.getElementById('divImg03');
						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 4) { //卫生许可或食品流通证
						$scope.applyInfo.hygieneCard = "data:image/jpeg;base64," + imageURI;
						var image4 = document.getElementById('divImg04');
						image4.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 5) { //诚信承诺
						$scope.applyInfo.goodFaithCard = "data:image/jpeg;base64," + imageURI;
						var image5 = document.getElementById('divImg05');
						image5.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 6) { //法人委托
						$scope.applyInfo.legalPersonCard = "data:image/jpeg;base64," + imageURI;
						var image6 = document.getElementById('divImg06');
						image6.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 11) { //手持身份证照
						$scope.applyInfo.holdCard = "data:image/jpeg;base64," + imageURI;
						var image11 = document.getElementById('divImg11');
						image11.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 获取商家经营类型
		// 获取商家经营类型
		if ($stateParams.reapply) {
			Apply.getApplyType('reapply').then(function (data) {
				console.log(data);
				$scope.selectType = data;
			});
		} else {
			Apply.getApplyType().then(function (data) {
				console.log(data);
				$scope.selectType = data;
			});
		}

		// 提交商家申请信息
		$scope.apply = function () {

			//			if(!$scope.applyInfo.userName) {
			//				Message.show("商家账号不能为空！");
			//				return false;
			//			}
			if (!$scope.applyInfo.shopName) {
				Message.show("店铺名称不能为空！");
				return false;
			}

			//			if(!$scope.applyInfo.cName) {
			//				Message.show("请输入商家负责人名字！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.shopPer) {
			//				Message.show("请输入商家推荐人名字！");
			//				return false;
			//			}
			if (!$scope.up.userInfo.area) {
				Message.show("请选择地址！");
				return false;
			}
			if (!$scope.applyInfo.street) {
				Message.show("请填写所属街道！");
				return false;
			}
			if ($scope.applyInfo.street.length > 6) {
				Message.show("街道名字最长6个字！");
				return false;
			}
			if (!$scope.applyInfo.address) {
				Message.show("请输入您的详细地址！");
				return false;
			}
			if (!$scope.applyInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.applyInfo.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			//			if(!$scope.applyInfo.shopDescrip) {
			//				Message.show("请输入您的商家描述信息！");
			//				return false;
			//			}
			if (!$scope.applyInfo.selecedType) {
				Message.show("请选择店铺经营类型！");
				return false;
			}
			if (!$scope.applyInfo.selectedBili) {
				Message.show("请选择店铺让利类型！");

				return false;
			}
			if ($scope.applyInfo.selectedBili < 2 || $scope.applyInfo.selectedBili > 40) {
				Message.show("店铺让利范围是2%—40%");
				return false;
			}

			//			if(!$scope.applyInfo.corrImg) {
			//				Message.show("请上传您的法人身份证正面照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.falImg) {
			//				Message.show("请上传您的法人身份证反面照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.businessImg) {
			//				Message.show("请上传您的营业执照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.shopsImg) {
			//				Message.show("请上传您的商铺封面照！");
			//				return false;
			//			}
			Apply.subApply($scope.applyInfo, $scope.up.userInfo.area, $scope.applyInfo.shoptype, '', $stateParams.reapply).then(function (data) {
				$state.go('tab.tcmytc');
			});
		}
	})
	.controller('agentApplyCtrl', function ($scope, User, $ionicModal, Area, Apply, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, aboutUs, $stateParams) {
		$scope.areaInfo = {
			userName: '',
			idcard: '',
			agentArea: '',
			address: '',
			mobile: '',
			myDescrip: '',
			qq: '',
			queryResult: '',
			rec_mobile: ''
		};
		$scope.areaId = '';
		$scope.citytype = '';
		$scope.queryResult = false;

		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function (type) {
			if (type != 'province' && $scope.areaId == '') {
				Message.show('请先选择省级区域');
				return
			}
			if (type == 'area' && $scope.areaId.substr(2, 4) == 0) {
				Message.show('请先选择市级区域');
				return
			}
			console.log($scope.areaId);
			$scope.citytype = type;
			if (type == 'province') {
				Area.getList(function (data) {
					$scope.areaList = $scope.areaData = data;
				});
			}
			if (type == 'city') {
				var ids = $scope.areaId;
				var pid = ids.substr(0, 2) + "0000";
				var cid = ids.substr(0, 4) + "00";
				Area.getList(function (data) {
					$scope.areaData = data;
					$scope.areaList = $scope.areaData[pid]['cities'];
				});
			}
			if (type == 'area') {
				var ids = $scope.areaId;
				var pid = ids.substr(0, 2) + "0000";
				var cid = ids.substr(0, 4) + "00";
				Area.getList(function (data) {
					$scope.areaData = data;
					$scope.areaList = $scope.areaData[pid]['cities'][ids]['districts'];
				});
			}
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if ($scope.citytype == 'area') {
				if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
					$scope.areaId = '';
					$scope.area.hide();
					return true;
				}
			}
			if ($scope.citytype == 'city') {
				if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title;
					$scope.area.hide();
					$scope.areaId = id;
					return true;
				}
			}
			if ($scope.citytype == 'province') {
				if (id.substr(0, 2) != "00") {
					$scope.up.userInfo.area = $scope.areaData[pid].title;
					$scope.areaId = id;
					$scope.area.hide();
					return true;
				}
			}

			//			if(id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
			//				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
			//				$scope.area.hide();
			//				return true;
			//			}
			//			if(id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
			//				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
			//				if($scope.areaList.length <= 0) {
			//					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
			//					$scope.area.hide();
			//				}
			//				return true;
			//			}
			//			if(id.substr(0, 2) != "00") {
			//				$scope.areaList = $scope.areaData[pid]['cities'];
			//				return true;
			//			}
		};
		$scope.agentquery = function () {
			console.log($scope.up.userInfo.area);
			if ($scope.up.userInfo.area == '') {
				Message.show('请填写查询区域');
				return
			}
			User.agentQuery($scope.up.userInfo.area).then(function (response) {
				$scope.queryResult = true;
				if (response.data == '') {
					$scope.areaInfo.queryResult = '此区域' + '' + response.msg;

				} else {
					$scope.areaInfo.queryResult = response.data;
				}

			})
			//			alert('qqq');
		}
		// 提交商家申请信息
		$scope.apply = function () {
			if (!$scope.areaInfo.userName) {
				Message.show("商家账号不能为空！");
				return false;
			}
			if ($scope.up.userInfo.area == '') {
				Message.show("申请区域不能为空！");
				return false;
			}
			//			if(!$scope.up.userInfo.area) {
			//				Message.show("请选择地址！");
			//				return false;
			//			}
			if (!$scope.areaInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.areaInfo.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if (!$scope.areaInfo.myDescrip) {
				Message.show("请输入您的商家描述信息！");
				return false;
			}
			User.areaApply($scope.areaInfo, $scope.up.userInfo.area);
		}
	})
	.controller('agentApplyresultCtrl', function ($scope, User, $ionicLoading, $stateParams) {
		$scope.orderEmpty = false;
		User.agentapplyResult().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
				$scope.resultList = response.data
			} else {
				$scope.orderEmpty = false;
				$scope.resultList = response.data
			}
		});
	})
	.controller('agentCenterCtrl', function ($scope, Shop, $rootScope, User) {
		// User.baladetailList(7).then(function (response) {
		// 	console.log(response)
		// 	$scope.agentproInfo = response.data
		// });
		$scope.levelName = {
			'1': '区代',
			'2': '市代',
			'3': '省代',

		}

		$scope.list = [{
			name: '河南省',
			id: '123',
			balance: '100',
			heart: "200"
		},
		{
			name: '河南省郑州市',
			id: '250',
			balance: '100',
			heart: "200"
		},
		]
		User.getAgentCenterInfo().then(function (res) {
			$scope.list = res.data
		})
	})
	.controller('agentProListCtrl', function ($scope, User, $ionicLoading, $stateParams) {
		$scope.orderEmpty = false;
		User.baladetailList(7).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
				$scope.repoList = response.data.list;
			} else {
				$scope.orderEmpty = false;
				$scope.repoList = response.data.list;
			}
		});
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.baladetailList(7, $scope.page).then(function (response) {
				$scope.page++;
				$scope.repoList = $scope.repoList.concat(response.data.list);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data.list.length == 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})
	// 商家申请审核等待提示页
	.controller('shopsWaitCtrl', function ($scope, Apply, $ionicModal) {
		$scope.checks = function () {
			Apply.refreshApply();
		}
	})
	// 商家申请拒绝页
	.controller('shoprefuseCtrl', function ($scope, Apply, $ionicModal) {
		Apply.refuseApply().then(function (response) {
			if (response.code == 0) {
				$scope.info = response.data;
			} else {
				Message.show('加载失败，请稍候重试');
			}
		})

	})
	.controller('userNoticeCtrl', function ($scope, $stateParams, Notice) {
		$scope.orderInfo = {};
		Notice.getInfo($stateParams.id).then(function (data) {
			$scope.orderInfo = data;
			console.log($scope.orderInfo);
		})
	})

	.controller('userMyBeanCtrl', function ($scope, User) {
		$scope.myBean = {};
		User.myBean().then(function (data) {
			$scope.myBean = data;
		})
	})

	.controller('userGiveListCtrl', function ($scope, User, $ionicLoading, $stateParams) {
		$scope.type = $stateParams.type;
		$scope.giveList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.giveList($scope.select).then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.giveList = response.data
			}
		});

		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = false;
			User.giveList(id).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.giveList = response.data
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function () {
			User.giveList($scope.select).then(function (response) {
				$scope.giveList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.giveList($scope.select, $scope.page).then(function (response) {
				$scope.page++;
				$scope.giveList = $scope.giveList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userTotalBeanCtrl', function ($scope, User, $stateParams, $ionicLoading) {
		$scope.type = $stateParams.type;
		$scope.orderEmpty = false;
		$scope.selected = 1; //比例
		$scope.role = 1; //角色
		$scope.myVar = false;
		$scope.totalBean = {
			all_price: '',
			list: '',
			rebateInfo: ''
		};
		User.recommendBean($scope.type, $scope.selected, 1, $scope.role).then(function (response) {
			$scope.totalBean = response.data;
			if (response.data.list == '' || response.data.list.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
		});
		$scope.toggle = function () {
			$scope.myVar = !$scope.myVar;
		};

		$scope.selectRole = function (role) {
			$scope.myVar = !$scope.myVar;
			$scope.role = role;
			User.recommendBean($scope.type, $scope.selected, 1, $scope.role).then(function (response) {
				$scope.totalBean = response.data;
				if (response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
		};

		$scope.selectBili = function (id) {
			$scope.selected = id;
			$scope.noMore = false;
			User.recommendBean($scope.type, id, 1, $scope.role).then(function (response) {
				$scope.totalBean = response.data;
				if (response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function () {
			User.recommendBean($scope.type, $scope.selected, $scope.page, $scope.role).then(function (response) {
				$scope.totalBean.list = response.data.list;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.recommendBean($scope.type, $scope.selected, $scope.page, $scope.role).then(function (response) {
				$scope.page++;
				$scope.totalBean.list = $scope.totalBean.list.concat(response.data.list);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.data.list.length == 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})
	.controller('userLoveInfoCtrl', function ($scope, User, $ionicLoading, $ionicSlideBoxDelegate) {
		$scope.myVar = false;
		$scope.orderEmpty = false;
		$scope.role = 1;
		$scope.type = 1;
		$scope.loveInfo = {
			list: '',
			rebateInfo: '',
			roleInfo: '',
			loveNum: ''
		};
		User.loveInfo($scope.role, $scope.type).then(function (response) {
			$scope.loveInfo = response.data;
			if (response.data.list == '' || response.data.list.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
		});
		$scope.select = function (role) {
			$scope.myVar = !$scope.myVar;
			$scope.role = role;
			User.loveInfo($scope.role, $scope.type).then(function (response) {
				$scope.loveInfo = response.data;
				if (response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
		};

		$scope.selectTab = function (type) {
			$scope.type = type;
			$scope.noMore = false;
			User.loveInfo($scope.role, $scope.type).then(function (response) {
				$scope.loveInfo = response.data;
				if (response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
			$ionicSlideBoxDelegate.slide(type);
		};
		// 侧滑
		$scope.onSwipe = function (a) {
			if (a == 'r') {
				$scope.type++;
				if ($scope.type <= 3) {
					User.loveInfo($scope.role, $scope.type).then(function (response) {
						$scope.loveInfo = response.data;
						if (response.data.list == '' || response.data.list.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
						}
					});
				}
				$scope.type = Math.min(3, $scope.type);
			} else {
				$scope.type--;
				if ($scope.type > 0) {
					User.loveInfo($scope.role, $scope.type).then(function (response) {
						$scope.loveInfo = response.data;
						if (response.data.list == '' || response.data.list.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
						}
					});
				}
				$scope.type = Math.max(1, $scope.type);
			}
		};

		// 下拉刷新
		$scope.doRefresh = function () {
			User.loveInfo($scope.role, $scope.type).then(function (response) {
				$scope.loveInfo.list = response.data.list;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.loveInfo($scope.role, $scope.type, $scope.page).then(function (response) {
				$scope.page++;
				$scope.loveInfo.list = $scope.loveInfo.list.concat(response.data.list);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.data.list.length == 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};

	})
	.controller('userHelpListCtrl', function ($scope, User, $ionicLoading, $timeout) {
		$scope.type = 1;
		$scope.active = 1;
		$scope.orderEmpty = false;

		$scope.show = function (id) {
			$scope.list.forEach(function (item) {
				console.log(item.open)
				if (item.id == id)
					item.open = !item.open
			})
		}

		$scope.active = function (id) {
			$scope.type = id;

			User.useHelp($scope.type).then(function (response) {
				$scope.list = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.list = response.data;
					console.log($scope.list);
					$timeout(function () {
						$scope.list.forEach(function (index, item) {
							$('.list_item #' + index.id).html(index.content);
						})
					}, 100)

				}

			})
		}

		User.useHelp($scope.type).then(function (response) {
			$scope.list = response.data
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.list = response.data;
				$timeout(function () {
					$scope.list.forEach(function (index, item) {
						$('.list_item #' + index.id).html(index.content);
					})
				}, 100)
			}

		})
		// 下拉刷新
		$scope.doRefresh = function () {

			User.useHelp($scope.type).then(function (response) {
				$scope.list = response.data;
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.list = response.data;
					$timeout(function () {
						$scope.list.forEach(function (index, item) {
							$('.list_item #' + index.id).html(index.content);
						})
					}, 100)
				}
				$scope.$broadcast('scroll.refreshComplete');

				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});

			})
		};

		//		$scope.noMore = false;
		//		$scope.page = 2;
		//		$scope.loadMore = function() {
		//			User.useHelp($scope.type, $scope.page).then(function(response) {
		//				$scope.page++;
		//				$scope.list = $scope.list.concat(response.data);
		//				$timeout(function(){
		//						$scope.list.forEach(function(index, item) {
		//						$('.list_item #'+index.id).html(index.content);
		//					})},100)
		//				$scope.$broadcast('scroll.infiniteScrollComplete');
		//				if(response.code == 0) {
		//					if(response.data.length == 0) {
		//						$scope.noMore = true;
		//						$ionicLoading.show({
		//							noBackdrop: true,
		//							template: '没有更多了！',
		//							duration: '1200'
		//						});
		//					}
		//				}
		//			});
		//		};

	})

	.controller('bannerRankCtrl', function ($scope, $rootScope, User, $stateParams, Home, $timeout, $ionicLoading) {
		$scope.type = $stateParams.type
		$scope.total = $stateParams.total
		if ($scope.type == 'heart') {
			$scope.title = '拥有' + $rootScope.globalInfo.nounInfo.LOVE + '排行TOP200'
		} else if ($scope.type == 'sale') {
			$scope.title = '地区销售额排行榜TOP50'
		}

		Home.getbannerdetail($scope.type, $scope.total).then(function (response) {
			$scope.list = response.data;
		})

		$scope.doRefresh = function () {
			$scope.noMore = true;
			Home.getbannerdetail($scope.type, $scope.total).then(function (response) {
				$scope.list = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)

				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			})
		};

		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Home.getbannerdetail($scope.type, $scope.total, $scope.page).then(function (response) {
				$scope.page++;
				$scope.list = $scope.list.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了！',
							duration: '1200'
						});
					}
				}
			});
		};

	})
	.controller('onlineSearchCtrl', function ($scope, $state, Storage) {
		$scope.keyword = '';
		$scope.record = [];
		$scope.isShow = false;
		$scope.showRecord = function () {
			if (Storage.get('searchonlineRecord')) {
				$scope.isShow = true;
				console.log($scope.record);
				console.log(Storage.get('searchonlineRecord'))
				$scope.record = Storage.get('searchonlineRecord')
			}
		}
		$scope.goSearch = function (values) {
			$scope.keyword = values;
			$scope.isShow = false;
			console.log($scope.keyword);
			console.log($scope.record.indexOf($scope.keyword));
			if ($scope.record.indexOf($scope.keyword) == -1) {
				console.log($scope.keyword);
				$scope.record.push($scope.keyword)
			}
			if ($scope.record.length > 10) {
				$scope.record.shift();
			}
			Storage.set('searchonlineRecord', $scope.record)
			$state.go('my.onlineSearchRes', {
				"keyword": $scope.keyword
			})
		}

	})
	.controller('onlineSearchResCtrl', function ($scope, $stateParams, Home, $timeout, $ionicLoading, $state) {
		$scope.keyword = $stateParams.keyword;
		console.log($scope.keyword)
		$('#onlineSearchK').val($scope.keyword)
		$scope.type = 1;
		$scope.orderEmpty = false;
		$scope.goSearch = function () {
			// $scope.keyword = $('#onlineSearchK').val()
			// Home.getOnlineSR($scope.keyword, $scope.type).then(function (response) {
			// 	$scope.goodList = response.data
			// 	if (response.data == '' || response.data.length == 0) {
			// 		$scope.orderEmpty = true;
			// 	} else {
			// 		$scope.orderEmpty = false;
			// 		$scope.goodList = response.data
			// 	}

			// })
			$state.go('my.onlinesearch')
		}
		Home.getOnlineSR($scope.keyword, $scope.type).then(function (response) {
			console.log(response);
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.goodList = response.data;
			}

		})
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Home.getOnlineSR($scope.keyword, $scope.type).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodList = response.data;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 1000)
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});

			})
		}
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Home.getOnlineSR($scope.keyword, $scope.type, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodList = $scope.goodList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data.length == 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});

				}
			});
		};
		$scope.active = function (id) {
			if ($scope.type == 6) {
				$scope.page = 2;
				console.log($scope.page);
			}
			$scope.type = id;
			Home.getOnlineSR($scope.keyword, $scope.type).then(function (response) {
				$scope.goodList = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodList = response.data;
				}
				if (id == 6) {
					$timeout(function () {
						$scope.noMore = false;
						$scope.page = 2;
					}, 1000)
				}
			})
		}
		$scope.showPrice = function () {
			if ($scope.type == 3 || $scope.type == 4) {
				if ($scope.type == 3) {
					$scope.type = 4
				} else {
					$scope.type = 3
				}
			} else {
				$scope.type = 3
			}
			Home.getOnlineSR($scope.keyword, $scope.type).then(function (response) {
				$scope.goodList = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodList = response.data
				}

			})
		}
		$scope.goodsType = {
			0: '【淘宝】',
			1: '【天猫】',
			2: '【亿民惠】'
		}
	})

	.controller('offlineSearchCtrl', function ($scope, $state, $rootScope, Storage) {
		$scope.keyword = ''
		$scope.isShow = false;
		$scope.record = [];
		$scope.showRecord = function () {
			if (Storage.get('searchlineRecord')) {
				$scope.isShow = true;
				console.log(Storage.get('searchlineRecord'))
				$scope.record = Storage.get('searchlineRecord');
			}
		}
		$scope.goSearch = function (values) {
			$scope.keyword = values;
			$scope.isShow = false;
			if ($scope.record.indexOf($scope.keyword) == -1) {
				$scope.record.push($scope.keyword)
			}
			if ($scope.record.length > 10) {
				$scope.record.shift();
			}
			Storage.set('searchlineRecord', $scope.record)
			$state.go('my.offlineSearchRes', {
				"keyword": $scope.keyword
			})
		}
	})

	.controller('offlineSearchResCtrl', function ($scope, $ionicModal, Area, Storage, $cordovaGeolocation, Lbs, Home, $stateParams, $ionicLoading, $timeout, $state) {
		$scope.keyword = $stateParams.keyword;
		$('#offlineSearchK').val($scope.keyword)
		$scope.shopsList = {}
		$scope.orderEmpty = false;
		Home.getOfflineSR($scope.keyword).then(function (response) {
			console.log(response);
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.shopsList = response.data
			}

		})
		$scope.goSearch = function () {
			// $scope.keyword = $('#offlineSearchK').val()
			// Home.getOfflineSR($scope.keyword).then(function (response) {
			// 	$scope.shopsList = response.data
			// 	if (response.data == '' || response.data.length == 0) {
			// 		$scope.orderEmpty = true;
			// 	} else {
			// 		$scope.orderEmpty = false;
			// 		$scope.shopsList = response.data
			// 	}

			// })
			$state.go('my.offlinesearch')
		}
		//下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Home.getOfflineSR($scope.keyword).then(function (response) {
				$scope.shopsList = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.shopsList = response.data
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)

				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			})
		}
		//上拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Home.getOfflineSR($scope.keyword, $scope.page).then(function (response) {
				$scope.page++;
				$scope.shopsList = $scope.shopsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了！',
							duration: '1200'
						});
					}
				}
			});
		};

	})
	.controller('poorHomeCtrl', function ($scope, $timeout, Storage, Poor, $state, Home, $stateParams, $ionicHistory) {
		console.log($stateParams);
		$scope.img = [{
			thumb: 'http://img.zcool.cn/community/01bfb8573e687c6ac7253f9a34c78a.png'
		},
		{
			thumb: 'http://img.zcool.cn/community/01723057c152280000018c1b155a59.jpg'
		},
		]
		$scope.goDetail = function (id) {
			console.log(id)
			$state.go('poorson.detail', {
				'id': id
			})
		}
		$scope.toback = function () {
			if ($stateParams.from == "my") {
				$ionicHistory.goBack();
			} else {
				$state.go("tab.online");
			}
		};
		//请求首页数据
		Poor.getHome().then(function (response) {
			console.log(response)
			$scope.info = response.data;
			angular.forEach($scope.info.recipients, function (i, v) {
				i.tMobile = i.tMobile.replace(i.tMobile.substring(3, 7), "****")
				console.log(i)
			})

			$timeout(function () {
				console.log(response)
				var mySwiper = new Swiper('.swiper-container', {
					loop: true,
					pagination: '.swiper-pagination',

				})

			}, 0)

		})
		//请求首页公告
		Poor.getnoticelist().then(function (response) {
			console.log(response);
			$scope.noticelist = response.data;
		})

		//向Ta捐物
		$scope.donateGood = function ($event, id, name, mobile) {
			$event.stopPropagation()
			var recipientG = {}
			recipientG.id = id
			recipientG.name = name
			recipientG.mobile = mobile
			Storage.set('recipientG', recipientG);
			$state.go('poor.shop')
		}
		//向Ta捐款
		$scope.donateMoney = function ($event, id, name, account) {
			$event.stopPropagation()
			var recipientM = {}
			recipientM.id = id
			recipientM.name = name
			recipientM.account = account
			Storage.set('recipientM', recipientM);
			$state.go('poor.donate')
		}

	})
	.controller("poorShopCtrl", function ($scope, Storage, Poor, $timeout, Message, $ionicLoading, $rootScope) {
		$scope.orderEmpty = false;
		//是否选择受助人
		$scope.reciName = '';
		$scope.reciMobile = '';
		if (Storage.get('recipientG')) {
			$scope.reciName = Storage.get('recipientG').name
			$scope.reciMobile = Storage.get('recipientG').mobile
		}
		//轮播图 
		$timeout(function () {
			var mySwiper = new Swiper('.swiper-container', {
				loop: true,
				pagination: '.swiper-pagination',

			})

		}, 0)
		//请求数据
		Poor.getPoorGoodList().then(function (response) {
			$scope.info = response.data
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.info = response.data
			}
		})
		//下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Poor.getPoorGoodList().then(function (response) {
				$scope.info = response.data;
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.info = response.data
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 1000)
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1200'
				});
			});
		};
		//上拉加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			$scope.refreshing = false;
			Poor.getPoorGoodList($scope.page).then(function (response) {
				$scope.page++;
				$scope.info = $scope.info.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了！',
							duration: '1200'
						});
					}
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

	})
	.controller('poorDonateCtrl', function ($scope, Storage, Message, Poor, $state) {
		$scope.info = {
			money: '',
			leaveMes: ''
		}
		$scope.donateModal = false;
		$scope.way = '';
		$scope.typeText = '';
		//捐助方式  
		$scope.donateWay = [{
			id: 1,
			title: '方式一:捐款获5倍爱心',
			cnt: '受助人获得捐助金额x5倍爱心价值；捐助人获得捐助金额*2倍爱心价值'
		},
		{
			id: 2,
			title: '方式二:直接捐助',
			cnt: '捐助款直接进入基金会账户，由基金会拨款至受助人账户'
		},

		]
		//是否选择受助人
		$scope.reciName = '';
		$scope.reciAccount = '';
		if (Storage.get('recipientM')) {
			$scope.reciName = Storage.get('recipientM').name
			$scope.reciAccount = Storage.get('recipientM').account
		}
		//是否显示捐助方式选择框
		$scope.showDonate = function (id) {
			id = id || 1
			$scope.donateModal = !$scope.donateModal
			if (id == 2) {
				$scope.typeText = $scope.donateWay[($scope.way - 1)].title.substr(4)
			}

		}
		$scope.active = function (type) {
			$scope.way = type;

		}
		//受助人与您的关系
		$scope.relation = [

			{
				id: '1',
				title: '平台爱心人士'
			},
			{
				id: '2',
				title: '家人'
			},
			{
				id: '3',
				title: '社会人士'
			}
		]
		$scope.showRelation = false;
		$scope.relationInfo = {}
		$scope.relationType = function (id, title) {
			$scope.relationInfo.id = id;
			$scope.relationInfo.title = title;
			$scope.showRelation = false;
		}
		//下一步，捐款
		$scope.next = function () {
			if (!Storage.get('recipientM').id) {
				Message.show('尚未选择受助人');
				return false;
			}
			if (!$scope.info.money) {
				Message.show('请输入捐助金额');
				return false;
			}
			//			console.log($scope.info.money.toString().split(".")[1].length);
			if ($scope.info.money.toString().split(".")[1] && $scope.info.money.toString().split(".")[1].length > 2) {
				Message.show('捐助金额最多支持两位小数');
				return false;
			}

			if (!$scope.way) {
				Message.show('请选择捐助方式');
				return false;
			}
			if (!$scope.relationInfo.id) {
				Message.show('请选择您与受助人的关系');
				return false;
			}
			if (!$scope.info.leaveMes) {
				Message.show('请输入备注');
				return false;
			}
			console.log($scope.info.money)
			Poor.giveMoney(Storage.get('recipientM').id, $scope.info.money, $scope.way, $scope.relationInfo.id, $scope.info.leaveMes).then(function (response) {
				$state.go('poorson.donatepay', {
					'fromPage': 'donate',
					'way': $scope.way,
					'money': $scope.info.money,
					'relation': $scope.relationInfo.id,
					'leaveMsg': $scope.info.leaveMes,
					'info': response.data
				})
			})
		}
	})
	.controller('poorDonatePayCtrl', function ($scope, $stateParams, Poor, $timeout, $interval, Message) {
		$scope.fromPage = $stateParams.fromPage || 'donate'
		if ($scope.fromPage == 'recDonate') {
			$scope.donateInfo = {
				way: $stateParams.way,
				money: $stateParams.money,
				info: $stateParams.info,
				leaveMsg: $stateParams.leaveMsg
			}
		} else if ($scope.fromPage == 'donate') {
			$scope.donateInfo = {
				way: $stateParams.way,
				money: $stateParams.money,
				relation: $stateParams.relation,
				info: $stateParams.info,
				leaveMsg: $stateParams.leaveMsg
			}
		}
		console.log($scope.donateInfo)
		$scope.donateWay = {
			'1': '获得5倍爱心',
			'2': '直接捐助'
		}
		$scope.showbalances = false;
		//获取验证码
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.balancepay = {
			userBalance: '',
			passwords: '',
			code: '',
			number: 60
		};
		Poor.getbalanceInfo('', 'poor').then(function (response) {
			console.log(response);
			$scope.balancepay.userBalance = response.balance || 0;
		});
		//点击余额和判断
		$timeout(function () {
			$scope.showbalance = function () {
				if ($scope.showbalances == false && ($scope.balancepay.userBalance - $scope.donateInfo.money) <= 0) {
					Message.show('余额不足');
					return
				} else if ($scope.showbalances == true) {
					$scope.showbalances = false;
				} else {
					$scope.showbalances = true;
				}

			}
		}, 100)
		//余额支付获取验证码
		$scope.getCode = function () {
			$scope.balancepay.number = 60;
			Poor.getbalancecode().then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.balancepay.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.balancepay.number = 60;
					} else {
						$scope.balancepay.number--;
					}
				}, 1000)
			})

		}
		$scope.payType = 'alipay';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		//余额支付
		$scope.balanceConfirm = function () {
			if (!$scope.balancepay.code) {
				Message.show('请输入验证码');
				return false;
			}
			if (!$scope.balancepay.passwords) {
				Message.show('请输入支付密码');
				return false;
			}
			var obj = Object.assign($scope.donateInfo, {
				code: $scope.balancepay.code,
				password: $scope.balancepay.passwords
			})
			console.log(obj)
			if ($scope.fromPage == 'donate') {
				Poor.creditPay(obj, 'donateMoney');
			} else if ($scope.fromPage == 'recDonate') {
				Poor.creditPay(obj, 'RecDonateMoney');
			}

		}

		//微信或者支付宝支付
		$scope.orderConfirm = function () {
			if ($scope.fromPage == 'donate') {
				if ($scope.payType == 'wechat') {
					Poor.wechatPay('donateMoney', $scope.donateInfo);
				} else if ($scope.payType == 'alipay') {
					Poor.alipay('donateMoney', $scope.donateInfo);
				}
			} else if ($scope.fromPage == 'recDonate') {
				if ($scope.payType == 'wechat') {
					Poor.wechatPay('RecDonateMoney', $scope.donateInfo);
				} else if ($scope.payType == 'alipay') {
					Poor.alipay('RecDonateMoney', $scope.donateInfo);
				}
			}

		};
	})
	.controller('poorIntroCtrl', function ($scope, $timeout, Poor) {
		$timeout(function () {
			var swiper = new Swiper('.swiper-container')
		}, 0)

		Poor.getPoorIntro().then(function (response) {
			$('.pi-cnt').html(response.data);
			//			$scope.info= response.data

		})

	})
	.controller('poorListCtrl', function ($scope, $timeout, Storage, $state, $stateParams, Poor, $ionicLoading, Message) {
		$scope.showReason = false;
		$scope.reasonId = 0; //致贫原因id
		$scope.chooseId = 2; //个人或企业
		$scope.orderEmpty = false;
		$scope.fromPage = $stateParams.fromPage || 'both';
		//选择致贫原因
		// $scope.sPReason = function () {
		// 	$scope.showReason = !$scope.showReason
		// 	$scope.select = 1;
		// }
		//选择tab (个人或群体)
		$scope.choose = function (id) {
			$scope.noMore = true;
			$scope.chooseId = id;
			Poor.getPoorList($scope.chooseId, $scope.reasonId).then(function (response) {
				$scope.noMore = false;
				$scope.info = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.info = response.data
				}

			})
		}
		$scope.goDetail = function (id) {
			console.log(id)
			$state.go('poorson.detail', {
				'id': id
			})
		}
		//向Ta捐物
		$scope.donateGood = function ($event, id, name, mobile) {
			$event.stopPropagation();
			console.log('donagtefoood')
			var recipientG = {}
			recipientG.id = id
			recipientG.name = name
			recipientG.mobile = mobile
			Storage.set('recipientG', recipientG);
			if ($scope.fromPage == 'goodInfo') {
				$state.go('poorson.gooddetail', {
					id: $stateParams.goodId
				})
			} else if ($scope.fromPage == 'goodInfo') {
				$state.go('poor.shop')
			} else if ($scope.fromPage == 'cart') {
				$state.go('poorson.cart')
			} else {
				$state.go('poor.shop')
			}

		}
		//向Ta捐款
		$scope.donateMoney = function ($event, id, name, identity) {
			$event.stopPropagation();
			var recipientM = {}
			recipientM.id = id
			recipientM.name = name
			recipientM.account = identity
			Storage.set('recipientM', recipientM);
			console.log(Storage.get('recipientM'))
			$state.go('poor.donate')
		}
		//选择致贫原因
		$scope.reasonTypeS = function (id) {
			$scope.noMore = true;
			$scope.reasonId = id;
			Poor.getPoorList($scope.chooseId, $scope.reasonId).then(function (response) {
				$scope.noMore = false;
				$scope.info = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.info = response.data
				}

			})
		}
		//
		angular.element(document).ready(function () {
			//请求数据
			Poor.getPoorList($scope.chooseId, $scope.reasonId).then(function (response) {
				$scope.info = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.info = response.data

				}

			})
		})

		//下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Poor.getPoorList($scope.chooseId, $scope.reasonId).then(function (response) {
				$scope.info = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.info = response.data
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 1000)
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1200'
				});
			});
		};
		//上拉加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			$scope.refreshing = false;
			Poor.getPoorList($scope.chooseId, $scope.reasonId, $scope.page).then(function (response) {
				$scope.page++;
				$scope.info = $scope.info.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了！',
							duration: '1200'
						});
					}
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

	})
	.controller('poorDetailCtrl', function ($scope, $rootScope, Storage, $state, $ionicActionSheet, $timeout, $stateParams, Poor, Message) {
		console.log($stateParams)
		$scope.id = $stateParams.id
		// console.log($scope.id)
		$scope.relationType = {
			'1': '平台爱心人士',
			'2': '朋友',
			'3': '亲人',
			'4': '发起人',
		}
		$scope.show = false;
		$scope.showPic = false;
		$scope.img = [{
			thumb: 'http://img.zcool.cn/community/01bfb8573e687c6ac7253f9a34c78a.png'
		},
		{
			thumb: 'http://img.zcool.cn/community/01723057c152280000018c1b155a59.jpg'
		},

		]
		//是否展示全部基本信息
		$scope.showAll = function () {
			$scope.show = !$scope.show
		}
		//向Ta捐物
		$scope.donateGood = function (id, name, mobile) {
			var recipientG = {}
			recipientG.id = id
			recipientG.name = name
			recipientG.mobile = mobile
			Storage.set('recipientG', recipientG);
			$state.go('poor.shop')
		}
		//向Ta捐款
		$scope.donateMoney = function (id, name, account) {
			var recipientM = {}
			recipientM.id = id
			recipientM.name = name
			recipientM.account = account
			Storage.set('recipientM', recipientM);
			$state.go('poor.donate')
		}
		//分享
		//		$scope.sharechat = function(scene, title, desc, url, thumb) {
		//			Wechat.share({
		//				message: {
		//					title: title,
		//					description: desc,
		//					thumb: thumb,
		//					//      url: url ?url : "http://baidu.com"
		//					media: {
		//						type: Wechat.Type.WEBPAGE,
		//						webpageUrl: "http://www.cnblogs.com/gongdy/"
		//					}
		//				},
		//				scene: scene // share to Timeline  
		//			}, function() {
		//				//				alert("Success");
		//			}, function(reason) {
		//				//				alert("Failed: " + reason);
		//			});
		//		};
		$scope.shareLink = function (title, desc, url, thumb) {
			Message.show('正在开发,敬请期待')
			// var hideSheet = $ionicActionSheet.show({
			// 	buttons: [{
			// 		'text': '分享给好友'
			// 	},
			// 	{
			// 		'text': '分享到朋友圈'
			// 	}
			// 	],
			// 	cancelText: '取消',
			// 	buttonClicked: function (index) {
			// 		if (index == 0) {
			// 			$scope.sharechat(0, title, desc, url, thumb);
			// 		} else if (index == 1) {
			// 			$scope.sharechat(1, title, desc, url, thumb);
			// 		}
			// 		//					return true;
			// 	}

			// });

		};
		//关注
		$scope.gocollect = function () {
			Message.show('正在开发,敬请期待')
		}
		//打开图片预览
		$scope.openPic = function (index) {
			$scope.showPic = !$scope.showPic;
			console.log(index)
			$timeout(function () {
				var mySwiper = new Swiper('.swiper-container', {
					loop: true,
					roundLengths: true,
					// initialSlide:0,
					speed: 600,
					slidesPerView: "auto",
					centeredSlides: true,
					followFinger: true,

				})

			}, 0)
		}
		//图片
		$timeout(function () {
			var mySwiper = new Swiper('.swiper-container', {
				loop: true,
				roundLengths: true,
				// initialSlide:0,
				speed: 600,
				slidesPerView: "auto",
				centeredSlides: 'auto',
				followFinger: true,

			})

		}, 0)
		//请求受助者详情
		Poor.getPoorDetail($scope.id).then(function (response) {
			$scope.info = response.data;
		})

	})
	.controller('poorGoodDetailCtrl', function ($scope, $ionicModal, $stateParams, Poor, Message, $ionicSlideBoxDelegate, Storage, $state, $ionicActionSheet, $ionicHistory, $rootScope) {
		$scope.id = $stateParams.id;
		$scope.showCart = false;
		$scope.hideCart = function () {
			$scope.showCart = false;
		}

		//请求客服 
		Poor.getunioninfo('shop').then(function (response) {
			$scope.tel = response.data.mobile;
		})
		//客服
		$scope.contact = function () {
			var buttons = [{
				text: "客服电话" + $scope.tel
			}];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {

					} else if (index == 1) {
						window.location.href = "tel:" + $scope.tel;
					}
					return true;
				}
			})
		}
		//客服
		$scope.customerserve = function () {
			var qqurl = "http://wpa.qq.com/msgrd?v=3&uin=" + 763999408 + "&site=qq&menu=yes";
			var buttons = [];
			buttons = [{
				text: $scope.tel
			}, {
				text: 'QQ客服'
			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.callPhone($scope.tel);
					} else if (index == 1) {
						$scope.getqq(qqurl);
						//						$state.go('my.helplist');
					}
					return true;
				}
			})
		};

		$scope.callPhone = function (mobilePhone) {
			$window.location.href = "tel:" + mobilePhone;
		};

		//qq聊天
		$scope.getqq = function (qqurl) {
			$window.location.href = qqurl;
		}

		//请求商品详情数据
		$scope.addtype = false;
		$scope.goodPrice = false;
		$scope.goodsdetail = {};
		$scope.good = {
			price: '', //价格
			count: '', //数量
			spid: '', //商家id
			goodsId: '', //商品id
			id: '',
			totNum: null //总共几件
		}
		$scope.goodcart = {
			gooddatas: {},
			goodbute1: '',
			goodbute2: '',
			goodsId: '',
			id: '',
			count: $scope.goodsdetail.total,
			spid: '',
			buyNum: null
		}
		$scope.clickstyle1 = ''
		$scope.clickstyle2 = '';
		$scope.attributetype = false;
		Poor.getonGoodsInfo($stateParams.id).then(function (response) {
			Message.hidden();
			console.log(response);
			$scope.goodsdetail = response.data;
			$scope.good.price = $scope.goodsdetail.spe_price;
			$scope.good.count = $scope.goodsdetail.total;
			$scope.goodcart.spid = $scope.goodsdetail.spid;
			$scope.goodcart.goodsId = $scope.goodsdetail.id;
			$scope.goodcart.gooddatas = $scope.goodsdetail.attrdata;
			$scope.goodsdetail.slide = angular.fromJson($scope.goodsdetail.thumbs);
			$('#goodsinfo-info').html($scope.goodsdetail.info);
			$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			$ionicSlideBoxDelegate.loop(true);
		});

		$scope.buyNum = 1;
		$scope.addNum = function () {
			$scope.buyNum++;
		};
		$scope.minusNum = function () {
			if ($scope.buyNum > 1) {
				$scope.buyNum--;
			}
		};
		// 添加购物车
		//		$ionicModal.fromTemplateUrl('templates/poor/cartModal.html', {
		//			scope: $scope,
		//			animation: 'slide-in-left'
		//		}).then(function(modal) {
		//			$scope.addCart = modal;
		//		});
		$scope.addCarts = function (buyid) {
			$scope.showCart = true;
			//是否选择受助人
			if (Storage.get('recipientG')) {
				$scope.reciId = Storage.get('recipientG').id
				$scope.reciName = Storage.get('recipientG').name
				$scope.reciMobile = Storage.get('recipientG').mobile
			} else {
				//				$scope.addCart.hide();
				$scope.showCart = false;
				new Confirm('您还未选择受助人', function () {
					$state.go('poorson.list', {
						"fromPage": "goodInfo",
						"goodId": $scope.id
					})
				}, function () {
					$ionicHistory.goBack();
				}, '前去选择受助人', '暂时关闭').show()
				return false;
			}
			//显示属性选择框
			//			$scope.addCart.show();
			$scope.clickstyle1 = '';
			$scope.clickstyle2 = '';
			$scope.good = {
				price: '',
				count: $scope.goodsdetail.total,
				spid: '',
				goodsId: '',
				id: '',
				totNum: null
			}
			$scope.goodcart = {
				gooddatas: $scope.goodsdetail.attrdata,
				goodbute1: '',
				goodbute2: '',
				spid: $scope.goodsdetail.spid,
				goodsId: $scope.goodsdetail.id,
				id: '',
				count: $scope.goodsdetail.total,
				totNum: null
			}

			$('.attribute-common li').removeClass('selectstyle');
			$('.attribute-common li').removeClass('unclick');
			if (buyid == 1) {
				$scope.addtype = true;
			} else {
				$scope.addtype = false;
			}
		};
		$scope.changebute1 = function (item1) {
			if ($('.attribute-common #' + item1).css("background-color") == 'rgb(153, 153, 153)') {
				//						alert(false);
				return
			}
			//bute2存在
			if ($scope.goodsdetail.attr[1] != '') {
				//bute2为空
				if ($('.attribute-common #' + item1).hasClass('selectstyle')) {
					//bute1有选中状态，取消选中状态
					$scope.clickstyle1 = '';
					$scope.goodcart.goodbute1 = '';
					$('.attribute2 li').removeClass('unclick');
					$scope.goodPrice = false;
					console.log($scope.goodsdetail);
				} else {
					//bute1无选中状态，添加选中状态
					$scope.attributetype = true;
					$scope.clickstyle1 = item1;
					$scope.goodcart.goodbute1 = item1;
					//找到当前bute1和bute2组合的商品
					angular.forEach($scope.goodcart.gooddatas, function (obj) {
						if (obj.field_1 == $scope.goodcart.goodbute1 && obj.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj;
							$scope.goodcart.id = obj.id;
							$scope.good.price = obj.price;
							console.log($scope.good);
							$scope.goodPrice = true;
						}
					});
					console.log($scope.good);
					//利用bute1筛选bute2属性
					//			$('.attribute2 li ').removeClass('unclick');
					angular.forEach($scope.goodcart.gooddatas, function (objs) {
						if (objs.field_1 == $scope.goodcart.goodbute1) {
							$scope.bute2good = objs;
							var butes2 = $('.attribute2 li');
							for (var j = 0; j < butes2.length; j++) {
								if (butes2[j].innerHTML == $scope.bute2good.field_2) {
									$('.attribute2 #' + butes2[j].id).removeClass('unclick');
								} else {
									$('.attribute2 #' + butes2[j].id).addClass('unclick');
								}
							}
						}
					});
				}
				//					console.log($scope.goodcart.goodbute1);
			} else {
				//bute2不存在
				$scope.goodPrice = false;
				if ($('.attribute-common #' + item1).hasClass('selectstyle')) {
					$scope.clickstyle1 = '';
					$scope.goodcart.goodbute1 = '';
					$scope.attributetype = false;
				} else {
					$scope.attributetype = true;
					$scope.clickstyle1 = item1;
					$scope.goodcart.goodbute1 = item1;
					angular.forEach($scope.goodcart.gooddatas, function (obj) {
						if (obj.field_1 == $scope.goodcart.goodbute1) {
							$scope.good = obj;
							$scope.goodcart.id = obj.id;
							$scope.good.price = obj.price;
							console.log($scope.good);
						}
					});
				}

			}
		}

		$scope.changebute2 = function (item2) {
			if ($('.attribute-common #' + item2).css("background-color") == 'rgb(153, 153, 153)') {
				return
			}
			//bute1不为空
			if ($scope.goodcart.goodbute1 != '') {
				if ($('.attribute-common #' + item2).hasClass('selectstyle')) {
					//bute2有选中状态，取消选中状态
					$scope.clickstyle2 = '';
					$scope.goodcart.goodbute2 = '';
					$('.attribute1 li').removeClass('unclick');
					$scope.goodPrice = false;
				} else {
					//bute2无选中状态，添加选中状态
					$scope.attributetype = true;
					$scope.clickstyle2 = item2;
					$scope.goodcart.goodbute2 = item2;
					//找到当前bute1和bute2组合的商品
					angular.forEach($scope.goodcart.gooddatas, function (obj2) {
						if (obj2.field_1 == $scope.goodcart.goodbute1 && obj2.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj2;
							$scope.goodcart.id = obj2.id;
							$scope.good.price = obj2.price;
							console.log($scope.good);
							$scope.goodPrice = true;
						}
					});
					//利用bute2筛选bute1属性
					angular.forEach($scope.goodcart.gooddatas, function (objs) {
						if (objs.field_2 == $scope.goodcart.goodbute2) {
							$scope.bute1good = objs;
							var butes1 = $('.attribute1 li ');
							for (var j = 0; j < butes1.length; j++) {
								if (butes1[j].innerHTML == $scope.bute1good.field_1) {
									console.log(butes1[j].id);
									$('.attribute1 #' + butes1[j].id).removeClass('unclick');
								} else {
									$('.attribute1 #' + butes1[j].id).addClass('unclick');
								}
							}
						}
					});
				}
				//					console.log($scope.goodcart.goodbute1);
			} else {
				//bute1为空
				console.log(item2);
				$scope.goodPrice = false;
				if ($('.attribute-common #' + item2).hasClass('selectstyle')) {
					$scope.clickstyle2 = '';
					$scope.goodcart.goodbute2 = '';
					$scope.attributetype = false;
					$('.attribute1 li').removeClass('unclick');
					angular.forEach($scope.goodcart.gooddatas, function (obj2) {
						if (obj2.field_1 == $scope.goodcart.goodbute1 && obj2.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj2;
							$scope.goodcart.id = obj2.id;
							$scope.good.price = obj2.price;
							console.log($scope.good);
						}
					});
				} else {
					$scope.attributetype = true;
					$scope.clickstyle2 = item2;
					$scope.goodcart.goodbute2 = item2;
					angular.forEach($scope.goodcart.gooddatas, function (obj2) {
						if (obj2.field_1 == $scope.goodcart.goodbute1 && obj2.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj2;
							$scope.goodcart.id = obj2.id;
							$scope.good.price = obj2.price;
							console.log($scope.good);
						}
					});
					angular.forEach($scope.goodcart.gooddatas, function (objs) {
						if (objs.field_2 == $scope.goodcart.goodbute2) {
							$scope.bute1good = objs;
							var butes1 = $('.attribute1 li');
							for (var j = 0; j < butes1.length; j++) {
								if (butes1[j].innerHTML == $scope.bute1good.field_1) {
									$('.attribute1 #' + butes1[j].id).removeClass('unclick');
								} else {
									$('.attribute1 #' + butes1[j].id).addClass('unclick');
								}
							}
						}
					});
				}

			}
		}
		$scope.addgoods = function () {
			if (!$rootScope.globalInfo.user.uid) {
				//				$scope.addCart.hide();
				$scope.showCart = false;
				$state.go('auth.login');
				return false;
			}
			$scope.good.totNum = $scope.buyNum;
			$scope.goodcart.totNum = $scope.buyNum;
			console.log($scope.goodcart);
			console.log($scope.good);
			if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId == "") {
				Message.show('请选择商品属性');
				return
			} else if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId != "") {
				Poor.addGoods($scope.good).then(function (response) {
					Message.show('加入购物车成功！');
					//					$scope.addCart.hide();
					$scope.showCart = false;
				});
			} else {
				Poor.addGoods($scope.goodcart, $scope.reciId).then(function (response) {
					Message.show('加入购物车成功！');
					//					$scope.addCart.hide();
					$scope.showCart = false;
				});
			}

		};
		$scope.buygoods = function () {
			if (!$rootScope.globalInfo.user.uid) {
				$scope.showCart = false;
				$state.go('auth.login');
				return false;
			}
			$scope.good.totNum = $scope.buyNum;
			$scope.goodcart.totNum = $scope.buyNum;
			console.log($scope.goodcart);
			console.log($scope.good);

			if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId == "") {
				Message.show('请选择商品属性');
				return
			} else if ($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId != "") {
				if ($scope.good.count == 0) {
					Message.show('该商品售罄，请重新选择');

					return
				}
				Poor.cartSave($scope.good, 'interim').then(function (response) {
					//					$scope.addCart.hide();
					$scope.showCart = false;
				});
			} else {
				if ($scope.goodcart.count == 0) {
					Message.show('该商品售罄，请重新选择');
					return
				}
				Poor.cartSave($scope.goodcart, 'interim').then(function (response) {
					$scope.showCart = false;
				});
			}

		};

	})
	.controller('poorGoodCateCtrl', function ($rootScope, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Poor) {
		console.log($stateParams);
		//$scope.pageMsg.titleArr._class={featuredList:''};
		//		Home.fetchnav().then(function(response) {
		//			$scope.pageMsg.titleArr._class = response.data; //分类
		//			console.log($scope.pageMsg.titleArr._class);
		//			Message.hidden();
		//		});
		$scope.recom = true;
		$scope.goodsremCate = {};
		console.log($stateParams);
		//		Good.getrecomCate().then(function(response){
		//			console.log(response);
		//			$scope.recomList=response.data;
		//		});
		$scope.getrecom = function () {
			$scope.recom = true;
			$('.goodsList-classify li').removeClass('clickchange');
			$('.goodsList-classify li:first').addClass('clickchange');
			//			$scope.recomList=$scope.goodsremCate;
		};
		$scope.goodsCate = {};
		Poor.getCateList().then(function (response) {
			console.log(response);
			$scope.recomList = response.data.rec;
			$scope.goodsCate = response.data.cate;
		})
		//点击商品列表
		$scope.getClassify = function (id) {
			$scope.recom = false;
			console.log(id);
			$('.goodsList-classify li').removeClass('clickchange');
			$('.goodsList-classify #p' + id).addClass('clickchange');
			if (id == '' || id == null) {
				$('.goodsList-classify li:first').addClass('clickchange');
			}
			angular.forEach($scope.goodsCate, function (obj) {
				if (id == obj.id) {
					$scope.goodstwocate = obj.son;
					console.log($scope.goodstwocate);
				}
			})
			$('.goodsList-classify li').removeClass('clickchange');
			$('.goodsList-classify #p' + id).addClass('clickchange');
			if (id == '' || id == null) {
				$('.goodsList-classify li:first').addClass('clickchange');
			}
		};
	})
	.controller('poorGoodSearCtrl', function ($scope, $state, $stateParams) {
		// $scope.keywords = $stateParams.keywords;
		$scope.keywords = '';
		$scope.goSearch = function () {
			$scope.keywords = $('#onlineSearchK').val()
			$state.go('poorson.goodsearres', {
				"keywords": $scope.keywords
			})
		}

	})
	.controller('poorGoodSearResCtrl', function ($scope, $stateParams, Home, $timeout, $ionicLoading, $state, Poor) {
		console.log($stateParams.keywords)
		$scope.keywords = '';
		$scope.cateId = ''
		if (!$stateParams.keywords) {
			$scope.keywords = '';
		} else {
			$scope.keywords = $stateParams.keywords
		}
		if (!$scope.cateId) {
			$scope.cateId = ''
		} else {
			$scope.cateId = $stateParams.id
		}

		console.log($scope.cateId)

		$('#onlineSearch').val($scope.keywords)
		$scope.type = 1;
		$scope.orderEmpty = false;
		$scope.goSearch = function () {
			// $scope.keyword = $('#onlineSearchK').val()
			// Home.getOnlineSR($scope.keyword, $scope.type).then(function (response) {
			// 	$scope.goodList = response.data
			// 	if (response.data == '' || response.data.length == 0) {
			// 		$scope.orderEmpty = true;
			// 	} else {
			// 		$scope.orderEmpty = false;
			// 		$scope.goodList = response.data
			// 	}

			// })
			$state.go('poorson.goodsear')
		}

		Poor.getonGoodsList($scope.cateId, $scope.type, $scope.keywords).then(function (response) {
			console.log(response);
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.goodList = response.data
			}

		})
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Poor.getonGoodsList($scope.cateId, $scope.type, $scope.keywords).then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodList = response.data
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 1000)

				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});

			})
		}
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Poor.getonGoodsList($scope.cateId, $scope.type, $scope.keywords, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodList = $scope.goodList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了！',
							duration: '1200'
						});
					}
				}
			});
		};

		$scope.active = function (id) {
			$scope.type = id;
			Poor.getonGoodsList($scope.cateId, $scope.type, $scope.keywords).then(function (response) {
				$scope.goodList = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodList = response.data
				}

			})
		}
		$scope.showPrice = function () {
			if ($scope.type == 3 || $scope.type == 4) {
				if ($scope.type == 3) {
					$scope.type = 4
				} else {
					$scope.type = 3
				}
			} else {
				$scope.type = 3
			}
			Poor.getonGoodsList($scope.cateId, $scope.type, $scope.keywords).then(function (response) {
				$scope.goodList = response.data
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodList = response.data
				}

			})
		}
	})
	.controller('poorRecKnowCtrl', function ($scope, $stateParams) {
		$scope.fromPage = $stateParams.fromPage || 'both'
		$scope.clientSideList = [{
			text: "Backbone",
			value: "bb"
		},
		{
			text: "Angular",
			value: "ng"
		},
		];

	})
	.controller('poorRecFormCtrl', function ($scope, $stateParams, $ionicModal, Area, $ionicScrollDelegate, ENV, Message, $cordovaCamera, $state, $ionicActionSheet, Poor) {
		$scope.applyInfo = {
			username: '',
			mobile: '',
			IDCard: '',
			because: 1, //致贫原因
			choose: 2,
			identity: '',
			home_birth: '',
			home_address: '',
			receive_birth: '',
			receive_address: '',
			info: '',
			thumb: '', //id身份证
			thumbs: [] //其他图片
		}; //申请信息  
		$scope.thumbs = []
		$scope.applyInfo.thumbs = new Array();
		$scope.agree = true; //是否同意发起人承诺书
		$scope.applyInfo.because = $stateParams.type; //致贫原因类型
		$scope.applyInfo.choose = 2; //推荐人类型，个人还是群体，默认个人
		$scope.areaList = {}; //省市列表	
		//致贫原因
		$scope.poorReason = {
			'1': '大病救助',
			'2': '灾难救助',
			'3': '公益助学',
			'4': '孤独儿童老人求助',
			'5': '其他爱心求助'
		}
		//选择地址	
		$ionicModal.fromTemplateUrl('templates/poor/poor-area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function (addressTypee) {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
				$scope.addressType = addressTypee
				console.log($scope.areaList);
			});
			$scope.area.show();
		};
		//选择家庭住址
		$scope.selectArea1 = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.applyInfo.home_birth = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.applyInfo.home_birth = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		//选择收货地址
		$scope.selectArea2 = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.applyInfo.receive_birth = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.applyInfo.receive_birth = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		//是否同意发起人承诺书
		$scope.authAgree = function () {
			$scope.agree = !$scope.agree;
		};
		angular.element(document).ready(function () {

		})
		//上传图片
		/*上传证件照*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};
		var selectImages = function (from, type) {
			if (type == 1) {
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					allowEdit: true,
					targetWidth: 500,
					targetHeight: 500,
					correctOrientation: true,
					cameraDirection: 0
				};
			} else if (type == 2) {
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					allowEdit: false,
					targetWidth: 500,
					targetHeight: 500,
					correctOrientation: true,
					cameraDirection: 0
				};
			}
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {

				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //上传身份证
						Poor.uploadPic(imageURI).then(function (response) {
							$scope.applyInfo.thumb = response.data
							angular.element(document).ready(function () {
								var IDCardImg = document.getElementById('divImg02');
								IDCardImg.style.backgroundImage = "url(" + response.data + ")";
							})

						})
					} else if (type == 2) { //上传其他图片
						Poor.uploadPic(imageURI).then(function (response) {
							$scope.applyInfo.thumbs.push(response.data)
						})
					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		//删除照片
		$scope.deletePic = function (index) {
			var img = $scope.applyInfo.thumbs[index]
			Poor.deletePic(img).then(function (response) {

				$scope.applyInfo.thumbs.splice(index, 1)
			})

		}
		//发出申请 
		$scope.apply = function () {
			if (!$scope.applyInfo.username) {
				Message.show("真实姓名不能为空");
				return false;
			}
			if (!$scope.applyInfo.identity || !ENV.REGULAR_MOBILE.test($scope.applyInfo.identity)) {
				Message.show("请输入正确的联系方式");
				return false;
			}
			if (!$scope.applyInfo.IDCard || !ENV.REGULAR_IDCARD.test($scope.applyInfo.IDCard)) {
				Message.show("请输入正确的身份证号码！");
				return false;
			}
			if (!$scope.applyInfo.home_birth) {
				Message.show("请选择家庭住址/居住地址！");
				return false;
			}
			if (!$scope.applyInfo.home_address) {
				Message.show("请输入详细家庭住址/居住地址！");
				return false;
			}
			if (!$scope.applyInfo.receive_birth) {
				Message.show("请选择收货地址！");
				return false;
			}
			if (!$scope.applyInfo.receive_address) {
				Message.show("请选择详细收货地址！");
				return false;
			}
			if (!$scope.applyInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.applyInfo.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if (!$scope.applyInfo.info) {
				Message.show("请描述受赠者的家庭情况！");
				return false;
			}
			$state.go('poorson.recpay', {
				"applyInfo": $scope.applyInfo
			})

		}
	})
	.controller('poorRecPayCtrl', function ($scope, $state, $stateParams, Poor, Message) {
		$scope.moneyMust = 1000;
		$scope.applyInfo = '';
		$scope.applyInfo = $stateParams.applyInfo;
		$scope.donateModal = false; //捐助方式选择框
		$scope.way = ''; //捐款方式
		$scope.showRelation = false;
		//捐助方式
		$scope.donateWay = [{
			id: 1,
			title: '方式一:捐款获5倍爱心',
			cnt: '受助人获得捐助金额x5倍爱心价值；捐助人获得捐助金额*2倍爱心价值'
		},
		{
			id: 2,
			title: '方式二:直接捐助',
			cnt: '捐助款直接进入基金会账户，由基金会拨款至受助人账户'
		},

		]
		//是否显示捐助方式选择框
		$scope.showDonate = function (id) {
			id = id || 1
			$scope.donateModal = !$scope.donateModal
			if (id == 2) {
				$scope.typeText = $scope.donateWay[($scope.way - 1)].title.substr(4)
			}

		}
		//选择捐助方式
		$scope.active = function (way) {
			$scope.way = way;
		}
		//提交申请
		$scope.apply = function () {
			if (!$scope.way) {
				Message.show('请选择捐助方式');
				return false;
			}
			Poor.poorApply($scope.applyInfo, $scope.way).then(function (response) {
				var info = Object.assign(response.data, {
					username: $scope.applyInfo.username,
					identity: $scope.applyInfo.identity
				})
				$state.go('poorson.donatepay', {
					'way': $scope.way,
					'fromPage': 'recDonate',
					'info': info,
					'money': $scope.moneyMust
				})
			})
		}

	})
	.controller('poorCartCtrl', function ($scope, User, $stateParams, evaluate, $ionicLoading, $state, $timeout, Good, Storage, Order, Cart, Message, $rootScope, Poor) {
		//是否选择受助人
		$scope.reciName = '';
		$scope.reciMobile = '';
		if (Storage.get('recipientG')) {
			$scope.reciName = Storage.get('recipientG').name
			$scope.reciMobile = Storage.get('recipientG').mobile
		}
		$scope.orderEmpty = false;
		$scope.allMon = Number(0.00);
		$scope.addlist = [];
		$scope.settlement = true;
		Poor.getcartsList('poor').then(function (response) {
			console.log(response);
			if (response.data == '' || response.data.length < 1) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.cartlist = response.data;
			}
		});

		$scope.changeall = function () {
			$timeout(function () {
				if ($('.cart-bottom .allChoose input').prop('checked') == false) {
					$('.cart-bottom .allChoose input').prop('checked', true);
					//寻找并判断其它商家的选中状态
					angular.forEach($scope.cartlist, function (obj) {
						$('#p' + obj.spid + ' input').prop('checked', false);
						$scope.changeshop(obj.spid);
					});

				} else {
					$('.cart-bottom .allChoose input').prop('checked', false);
					angular.forEach($scope.cartlist, function (obj) {
						$('#p' + obj.spid + ' input').prop('checked', true);
						$scope.changeshop(obj.spid);
					});
				}
			}, 100);

		};
		$scope.changeshop = function (spid) {
			$timeout(function () {
				console.log(spid)
				console.log($('#p' + spid + ' input').prop('checked'));
				if ($('#p' + spid + ' input').prop('checked') == false) {
					$('#p' + spid + ' input').prop('checked', true);
					//寻找并判断其它商家的选中状态
					var shops = $('.shopchose input');
					console.log(shops);
					for (var q = 0; q < shops.length; q++) {
						if (shops[q].checked == true) {
							$('.cart-bottom .allChoose input').prop('checked', true);
						} else {
							$('.cart-bottom .allChoose input').prop('checked', false);
							q = shops.length;
						}
					}
					//计算该商家下的商品
					angular.forEach($scope.cartlist, function (obj) {
						if (spid == obj.spid) {
							$scope.choshop = obj.goods;
							console.log($scope.choshop);
							var price1 = $('#p' + spid).siblings(".shopsmon").find('input').val();
							var shopmon = 0;
							console.log(price1);
							$scope.allMon = Number($scope.allMon) - Number(price1);
							for (var i = 0; i < $scope.choshop.length; i++) {
								//                              var signalgood=	$scope.choshop[i];
								$('#p' + $scope.choshop[i].id + ' input').prop('checked', true);
								var goodmon = Number($("#p" + $scope.choshop[i].id + " .carts-num input").val()) * Number($("#p" + $scope.choshop[i].id + " .cart-goodsinfo b").html());
								console.log(goodmon);
								var shopmon = Number(goodmon) + Number(shopmon);
								console.log(shopmon);
								$scope.addlist.push($scope.choshop[i].id);
							}
							console.log(shopmon);
							$('#p' + spid).siblings(".shopsmon").find('input').val(shopmon.toFixed(2));
							console.log($scope.addlist);
							$scope.allMon = Number($scope.allMon) + Number(shopmon);
						}

					})
				} else {
					console.log($('#p' + spid + ' input').prop('checked'));
					$('#p' + spid + ' input').prop('checked', false);
					console.log($('#p' + spid + ' input').prop('checked'));
					$('.cart-bottom .allChoose input').prop('checked', false);
					angular.forEach($scope.cartlist, function (obj) {
						if (spid == obj.spid) {
							$scope.choshop = obj.goods;
							console.log($scope.choshop);
							var price1 = $('#p' + spid).siblings(".shopsmon").find('input').val();
							$scope.allMon = Number($scope.allMon) - Number(price1);
							for (var i = 0; i < $scope.choshop.length; i++) {
								var signalgood = $scope.choshop[i];
								$('#p' + signalgood.id + ' input').prop('checked', false);
								$scope.shopmon = 0;
								for (var j = $scope.addlist.length; j >= 0; j--) {
									if ($scope.addlist[j] == signalgood.id) {
										$scope.addlist.splice(j, 1);
									}
								}
								console.log($scope.addlist);
							}
							$('#p' + spid).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
							//                  console.log($scope.addlist);
							//                  $scope.allMon = Number($scope.allMon)+Number($scope.shopmon);
						}
					})
				}
			}, 200);

		};
		$scope.changegoods = function (id, price) {
			//					if($('#editdel').html() == '编辑') {
			console.log($('#p' + id + ' input').prop('checked'));
			$timeout(function () {
				if ($('#p' + id + ' input').prop('checked') == false) {
					$('#p' + id + ' input').prop('checked', true);
					var other = $('#p' + id).siblings("dd");
					console.log(other);
					if (other.length > 0) {
						for (var i = 0; i < other.length; i++) {
							var goodid = other[i].id;
							if ($('#' + goodid + ' input').prop('checked') == true) {
								$('#p' + id).siblings(".shopchose").find('input').prop('checked', true);
								var shops = $('.shopchose input');
								console.log(shops);
								for (var k = 0; k < shops.length; k++) {
									if (shops[k].checked == true) {
										$('.cart-bottom .allChoose input').prop('checked', true);
									} else {
										$('.cart-bottom .allChoose input').prop('checked', false);
										k = shops.length;
									}
								}
							} else {
								$('#p' + id).siblings(".shopchose").find('input').prop('checked', false);
								$('.cart-bottom .allChoose input').prop('checked', false);
								i = other.length;
							}
						}
					} else {
						$('#p' + id).siblings(".shopchose").find('input').prop('checked', true);
						var shops = $('.shopchose input');
						console.log(shops);
						for (var k = 0; k < shops.length; k++) {
							if (shops[k].checked == true) {
								$('.cart-bottom .allChoose input').prop('checked', true);
							} else {
								$('.cart-bottom .allChoose input').prop('checked', false);
								k = shops.length;
							}
						}
					}

					//获取单个商家金额
					var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
					console.log(Number(price1));
					//当前点击商品金额
					$scope.goodmon = Number($("#p" + id + " .carts-num input").val()) * Number(price);
					console.log($scope.goodmon);
					//计算并填写单个商家金额
					$scope.shopmon = Number(price1) + $scope.goodmon;
					$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					//						$('#p' + id).siblings().find(' input').prop('checked', false);
					$scope.addlist.push(id);
					console.log($scope.addlist);
					//计算并填写总金额
					$scope.allMon = Number($scope.allMon) + Number($scope.goodmon);

				} else {
					$('#p' + id + ' input').prop('checked', false);
					$('#p' + id).siblings(".shopchose").find('input').prop('checked', false);
					$('.cart-bottom .allChoose input').prop('checked', false);
					for (var i = 0; i < $scope.addlist.length; i++) {
						if ($scope.addlist[i] == id) {
							$scope.addlist.splice(i, 1);
						}
					}
					console.log($scope.addlist);
					var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
					$scope.goodmon = Number($("#p" + id + " .carts-num input").val()) * Number(price);
					$scope.shopmon = Number(price1) - $scope.goodmon;
					$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					$scope.addId = '';
					//						$('#p' + id).siblings().find(' input').prop('checked', false);
					//计算并填写总金额
					$scope.allMon = Number($scope.allMon) - Number($scope.goodmon);
				}
			}, 200);

			// }else if($('#editdel').html() == '完成') {				
			//				$timeout(function() {
			//					
			//					if($('#p' + id + ' input').prop('checked') == false) {
			//						$('#p' + id + ' input').prop('checked', true);
			//						$scope.addlist.push(id);
			//						console.log($scope.addlist);
			//						//					$('#p'+id).siblings().find(' input'). prop('checked',false);
			//					} else {
			//						$('#p' + id + ' input').prop('checked', false);
			//						console.log($scope.addlist);
			//						for(var i = 0; i < $scope.addlist.length; i++) {
			//							if($scope.addlist[i] == id) {
			//								$scope.addlist.splice(i, 1);
			//							}
			//						}
			//						console.log($scope.addlist);
			//					}
			//				}, 200)
			//
			//			
			//		};
		};

		//加法
		$scope.addNum = function (id, price) {
			$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) + 1;
			//数量更新
			Cart.updateNum(id, $scope.buyNum).then(function (response) {
				if (response.code == 0) {
					Message.hidden();
					//				Message.show('数量修改成功！');
				} else {
					Message.show('数量修改失败，请重新操作');
					return;
				}
			});
			console.log($scope.buyNum);
			$("#p" + id + " .carts-num input").val($scope.buyNum);
			//添加选中状态 计算并更新金额
			if ($('#p' + id + ' input').prop('checked') == true) {
				//				$('#p' + id + ' input').prop('checked', true);
				//				 $scope.addlist.push(id);
				//				 $scope.goodmon=Number($scope.buyNum)*Number(price);
				$scope.goodmon = Number(1) * Number(price);
				//获取单个商家金额
				var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
				console.log(Number(price1));
				//当前点击商品金额
				console.log($scope.goodmon);
				//计算并填写单个商家金额
				$scope.shopmon = Number(price1) + $scope.goodmon;
				$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
				//						$('#p' + id).siblings().find(' input').prop('checked', false);
				console.log($scope.addlist);
				//计算并填写总金额
				$scope.allMon = Number($scope.allMon) + Number($scope.goodmon);
			}

		};
		//减法
		$scope.minusNum = function (id, price) {
			if ($('#p' + id + ' input').prop('checked') == false) {
				//判断并添加选中状态
				//				$('#p' + id + ' input').prop('checked', true);
				if (parseInt($("#p" + id + " .carts-num input").val()) > 1) {
					$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) - 1;
					$("#p" + id + " .carts-num input").val($scope.buyNum);
					Cart.updateNum(id, $scope.buyNum).then(function (response) {
						if (response.code == 0) {
							//				Message.show('数量修改成功！');
							Message.hidden();
							//				 $scope.addlist.push(id);
							//				 $scope.goodmon=Number($scope.buyNum)*Number(price);
							//				 	var price1= $('#p' + id).siblings(".shopsmon").find('input').val();
							//				 $scope.shopmon=Number(price1)+$scope.goodmon;	
							//				 $('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
							//				 $scope.allMon = Number($scope.allMon)+Number($scope.goodmon);

						} else {
							Message.show('数量修改失败，请重新操作');
							$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) + 1;
							return;
						}
					});
				} else {
					Message.show('手下留情，不能再减了');
					//				$scope.buyNum=	parseInt($("#p"+id+" .carts-num input").val());
					//				Message.hidden();
					//				Message.show('数量修改成功！');
					//				 $scope.addlist.push(id);
					//				 $scope.goodmon=Number($scope.buyNum)*Number(price);
					//				 	var price1= $('#p' + id).siblings(".shopsmon").find('input').val();
					//				 $scope.shopmon=Number(price1)+$scope.goodmon;	
					//				 $('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					//				 $scope.allMon = Number($scope.allMon)+Number($scope.goodmon);
				}

			} else {
				//已经选中的情况
				if (parseInt($("#p" + id + " .carts-num input").val()) > 1) {
					$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) - 1;
					$("#p" + id + " .carts-num input").val($scope.buyNum);
					$scope.goodmon = Number(1) * Number(price);
					Cart.updateNum(id, $scope.buyNum).then(function (response) {
						if (response.code == 0) {
							Message.hidden();
							//				Message.show('数量修改成功！');
						} else {
							Message.show('数量修改失败，请重新操作');
							$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val()) + 1;
							return;
						}
					});
				} else {
					Message.show('手下留情，不能再减了');
					$scope.buyNum = parseInt($("#p" + id + " .carts-num input").val());
					$scope.goodmon = Number(0) * Number(price);
					//				 	 Cart.updateNum(id,$scope.buyNum).then(function(response){
					//			if(response.code==0){
					//				Message.hidden();
					//			}else{
					//				Message.show('数量修改失败，请重新操作');
					//				
					//				return;
					//			}
					//		});
				}
				var price1 = $('#p' + id).siblings(".shopsmon").find('input').val();
				$scope.shopmon = Number(price1) - $scope.goodmon;
				$('#p' + id).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
				$scope.allMon = Number($scope.allMon) - Number($scope.goodmon);
			}
		}

		//编辑切换
		$scope.editAdel = function () {
			if ($('#editdel').html() == '编辑') {
				$('#editdel').html('完成');
				$scope.cartsnum = true;
				$('.cart-list dd input').prop('checked', false);
				$scope.del = true;
				$scope.settlement = false;
				if ($scope.addlist != '' && $scope.addlist.length > 0) {
					console.log($scope.addlist);
					for (var i = 0; i < $scope.addlist.length; i++) {
						//						var a=$scope.addlist[i];
						$('#p' + $scope.addlist[i] + ' input').prop('checked', true);
					}
				}
			} else {
				$('.cart-list dd input').prop('checked', false);
				$('#editdel').html('编辑');
				$scope.cartsnum = true;
				$scope.del = false;
				$scope.settlement = true;

				if ($scope.addlist != '' && $scope.addlist.length > 0) {
					console.log($scope.addlist);
					for (var i = 0; i < $scope.addlist.length; i++) {
						//						var a=$scope.addlist[i];
						$('#p' + $scope.addlist[i] + ' input').prop('checked', true);
					}
				}

			}
		}
		//结算
		$scope.buyGoods = function () {
			//是否选择受助人
			if (Storage.get('recipientG')) {
				$scope.reciId = Storage.get('recipientG').id
				$scope.reciName = Storage.get('recipientG').name
				$scope.reciMobile = Storage.get('recipientG').mobile
			} else {
				new Confirm('您还未选择受助人', function () {
					$state.go('poorson.list', {
						"fromPage": "cart"
					})
				}, function () {

				}, '前去选择受助人', '暂时关闭').show()
				return false;
			}
			//			angular.forEach($scope.cartlist, function(obj) {
			//				if($scope.addId == obj.id) {
			//					$scope.goodsid = obj.goodsId;
			//					$scope.cartid=obj.id;
			//					$scope.jisuanmoney = obj.goodsInfo.spe_price;
			//				}
			//			})

			Poor.cartSave($scope.addlist, 'cart');
		}
		//删除购物车商品
		$scope.delGoods = function () {
			Cart.removeCart($scope.addlist).then(function (respone) {
				console.log($scope.addlist);
				for (var i = 0; i < $scope.addlist.length; i++) {
					//						if($scope.addlist[i] == $scope.addlist[i]) {
					//找到此商品价格
					console.log($("#p" + $scope.addlist[i] + " .carts-num  input").val());
					$scope.goodmon = Number($("#p" + $scope.addlist[i] + " .carts-num  input").val()) * Number($("#p" + $scope.addlist[i] + " .cart-goodsinfo b").html());
					//计算商品对应的商家金额
					var price1 = $('#p' + $scope.addlist[i]).siblings(".shopsmon").find('input').val();
					$scope.shopmon = Number(price1) - Number($scope.goodmon);
					//				 $('#p' + $scope.addlist[i]).siblings(".shopsmon").find('input').val($scope.shopmon);
					$('#p' + $scope.addlist[i]).siblings(".shopsmon").find('input').val($scope.shopmon.toFixed(2));
					$scope.allMon = (Number($scope.allMon) - Number($scope.goodmon)).toFixed(2);
					//						$scope.addlist.splice(i, 1);
					//					}
				}
				$scope.doRefresh();
				$('#editdel').html('完成');
				$scope.addlist.splice(0, $scope.addlist.length);
			});
		};
		$scope.doRefresh = function () {
			Poor.getcartsList('poor').then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length < 1) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.cartlist = response.data;
				}
			});
			Poor.getcartsList('poor').then(function (response) {
				console.log(response);
				if (response.data == '' || response.data.length < 1) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.cartlist = response.data;
				}
				$scope.refreshing = true; //下拉加载时避免上拉触发
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					//			template: '刷新成功！',
					duration: '200'
				});
			});
		};
	})
	.controller('poorOrderSureCtrl', function ($scope, Poor, Message, Storage, $ionicModal) {

		$scope.hide = '1';
		$scope.remarks = '';
		$scope.poor = {};
		$scope.poor.leaveMes = ''
		$scope.addressArray = {
			provice: '',
			city: '',
			district: '',
			address: '',
		}
		//受助人与您的关系
		$scope.relation = [{
			id: '1',
			title: '平台爱心人士'
		},
		{
			id: '2',
			title: '朋友'
		},
		{
			id: 3,
			title: '亲人'
		}
		]
		$scope.showRelation = false;
		$scope.relationInfo = {}
		$scope.relationType = function (id, title) {
			$scope.relationInfo.id = id;
			$scope.relationInfo.title = title;
			$scope.showRelation = false;
		}
		//是否匿名购买，初始匿名 , hide=true;
		$scope.isHide = function () {
			if ($scope.hide == 1) {
				$scope.hide = 0;
			} else if ($scope.hide == 0) {
				$scope.hide = 1
			}
			// $scope.hide == 1 ? '0' : '1';
			console.log($scope.hide)
		}
		//查看商品模态框
		$ionicModal.fromTemplateUrl('templates/poor/poor-goodbuy.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.checkGood = modal;
		});
		$scope.openCheck = function () {
			$scope.checkGood.show()
		}

		if (Storage.get('orderinterim')) {
			$scope.ordertype = Storage.get('orderinterim');
		}
		Poor.showorder($scope.ordertype).then(function (response) {
			$scope.info = response.data;
			$scope.goodNum = 0
			if ($scope.info) {
				var addressArray = $scope.info.addressinfo.address.split(' ');
				$scope.addressArray = {
					province: addressArray[0],
					city: addressArray[1],
					district: addressArray[2],
					address: addressArray[3],
				}
			}
			//总共几件商品
			$.each($scope.info.orderinfo, function (index, ele) {
				$scope.goodNum += ele.goods.length
			})

			//留言
			//				angular.forEach($scope.orderlist.orderinfo, function(obj) {
			//			  for(var i=0;i<$scope.orderlist.orderinfo.length;i++){
			//			     var spids=	$scope.orderlist.orderinfo[i].spid;
			//			     console.log(spids);
			//			  }  
			//		});
		});

		//支付
		//购买跳转
		$scope.cartgoodsPay = function () {
			if (!$scope.relationInfo.id) {
				Message.show('请选择您与受助人的关系');
				return false;
			}
			if ($scope.ordertype != '') {
				Poor.oncreate($scope.remarks, $scope.ordertype, $scope.hide, $scope.relationInfo.id, $scope.poor.leaveMes, $scope.info, $scope.addressArray);
			} else {
				Poor.oncreate($scope.remarks, '', $scope.hide, $scope.relationInfo.id, $scope.poor.leaveMes, $scope.info, $scope.addressArray);
			}

		}

	})
	.controller('poorPayCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, Message, Payment, $state, $timeout, Poor, $interval) {
		$scope.money = $stateParams.money
		$scope.orderInfo = {
			payid: '',
			ordertypes: ''
		};
		$scope.orderInfo.payid = $stateParams.payid;
		$scope.orderInfo.ordertypes = $stateParams.ordertypes;
		$scope.showbalances = false;
		//获取验证码
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.balancepay = {
			userBalance: '',
			payid: '',
			payPrice: '',
			passwords: '',
			code: '',
			number: 60
		};
		Poor.getbalanceInfo($stateParams.payid).then(function (response) {
			console.log(response);
			$scope.balancepay = response;
		});
		//点击余额和判断
		$timeout(function () {
			$scope.showbalance = function () {
				if ($scope.showbalances == false && ($scope.balancepay.userBalance - $scope.money) < 0) {
					Message.show('余额不足');
					return
				} else if ($scope.showbalances == true) {
					$scope.showbalances = false;
				} else {
					$scope.showbalances = true;
				}

			}
		}, 100)
		//余额支付获取验证码
		$scope.getCode = function () {
			$scope.balancepay.number = 60;
			Poor.getbalancecode().then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.balancepay.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.balancepay.number = 60;
					} else {
						$scope.balancepay.number--;
					}
				}, 1000)
			})

		}

		// 选择支付类型
		$scope.payType = 'wechat';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		Message.hidden();
		//余额支付
		$scope.balanceConfirm = function () {
			Poor.creditPay($scope.balancepay);
		}
		//支付宝或者微信支付
		$scope.orderConfirm = function () {
			if ($scope.payType == 'wechat') {
				Payment.wechatPay('online', $scope.orderInfo);
			} else if ($scope.payType == 'alipay') {
				Poor.alipay('poorGoodPay', $scope.orderInfo)

			}
		};

	})
	.controller('poorDonateRankCtrl', function ($scope, Poor, $timeout, $ionicLoading, Message) {
		$scope.orderEmpty = false;
		//页面请求 
		Poor.getDonateRank().then(function (response) {
			$scope.rank = response.data;
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.rank = response.data
			}
		})
		//下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Poor.getDonateRank().then(function (response) {
				$scope.rank = response.data;
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.rank = response.data
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 0)
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功',
					duration: "1200"
				})
			})
		}
		//上啦加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Poor.getDonateRank($scope.page).then(function (response) {
				$scope.page++;
				$scope.rank = $scope.rank.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了!',
							duration: '1200'
						})
					}
				}
			})
		}
	})
	.controller('poorDonateDetailCtrl', function ($scope, $timeout, $ionicLoading, Poor, Message) {
		// $scope.type = 1; 
		// $scope.active = function (type) {
		// 	$scope.type = type;
		// }
		$scope.orderEmpty = false;
		//首次请求
		Poor.getDonateDetail().then(function (response) {
			$scope.info = response.data;
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.info = response.data;
				$scope.orderEmpty = false;
			}
		})
		//下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Poor.getDonateDetail().then(function (response) {
				$scope.noMore = true;
				$scope.info = response.data;
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.info = response.data;
					$scope.orderEmpty = false;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 0)
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功',
					duration: '1200'
				})
			})
		}
		//上啦加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Poor.getDonateDetail($scope.page).then(function (response) {
				$scope.page++;
				$scope.info = $scope.info.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了!',
							duration: "1200"
						})

					}
				}
			})
		}

	})
	.controller('poorDetailRecCtrl', function ($scope, $timeout, $ionicLoading, Poor, $stateParams) {
		$scope.orderEmpty = false;
		$scope.reuid = $stateParams.reuid;
		$scope.relationType = {
			'1': '平台爱心人士',
			'2': '朋友',
			'3': '亲人',
			'4': '发起人',
		}
		//首次请求
		Poor.getDetailRec($scope.reuid).then(function (response) {
			$scope.info = response.data;
			if (response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.info = response.data;
				$scope.orderEmpty = false;
			}
		})
		//下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			Poor.getDetailRec($scope.reuid).then(function (response) {
				$scope.noMore = true;
				$scope.info = response.data;
				if (response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.info = response.data;
					$scope.orderEmpty = false;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function () {
					$scope.noMore = false;
					$scope.page = 2;
				}, 0)
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功',
					duration: '1200'
				})
			})
		}
		//上啦加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			Poor.getDetailRec($scope.reuid, $scope.page).then(function (response) {
				$scope.page++;
				$scope.info = $scope.info.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0) {
					if (response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多了!',
							duration: "1200"
						})

					}
				}
			})
		}

	})
	.controller('poorIntroPageCtrl', function ($scope, Storage, $state, Poor, Message, $ionicSlideBoxDelegate, $injector) {
		console.log('test')
		$scope.$on("$ionicView.beforeEnter", function () {
			//if(window.localStorage.getItem("didIntro")=== null){
			//			Poor.getFirstBanner().then(function(response) {
			//			$scope.info = response.data;
			//			if($scope.info) {
			//				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			//				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(false);
			//				Message.hidden();
			//			}
			//		})
			//window.localStorage.setItem("didIntro", "seen");
			// }else{
			// 		$state.go('tab.online');
			// }
			console.log('llalall')
			window.localStorage.setItem("didIntro", "seen");
			Poor.getFirstBanner().then(function (response) {
				Message.hidden();
				$scope.info = response.data;
				//			if($scope.info) {
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(false);
				//			}
				var history = $injector.get('$ionicHistory')
				history.clearCache(['tab.online']);
			})

		});

		//		Poor.getFirstBanner().then(function(response) {
		//			$scope.info = response.data;
		//			if($scope.info) {
		//				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
		//				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(false);
		//				Message.hidden();
		//			}
		//		})

		//$scope.slideChanged = function(index) {  
		//      $scope.slideIndex = index;  
		//      if ( ($ionicSlideBoxDelegate.count() -1 ) == index ) {  
		//          $timeout(function(){  
		//              $ionicSlideBoxDelegate.slide(0);  
		//          },3000);  
		//      }  
		//  };

		//      $scope.goindexHome=function(){
		//      	$state.go('tab.online');
		//      }
	})
	.controller("rankCtrl", function ($scope, Home, $rootScope, User) {
		console.log($rootScope.globalInfo);
		if ($rootScope.globalInfo.user.uid && $rootScope.globalInfo.user.uid != '') {
			User.getbanner().then(function (response) {
				$scope.banner = response.data;
			});
		} else {
			Home.getbanner().then(function (response) {
				$scope.banner = response.data;
			});
		}
		Home.getnoticelist().then(function (response) {
			$scope.noticelist = response.data;
		});
	})
	// 注意lovesCtrl冲突
	.controller("lovesCtrl", function ($scope, User) {
		$scope.lovesinfo = {};
		$scope.lovesinfo.open_merge = 1;
		User.getloves().then(function (response) {
			if (response.data == "" || response.data.length == 0) {
				$scope.lovesinfo = "";
			} else {
				$scope.lovesinfo = response.data;
				//现有
				$scope.possess = Number($scope.lovesinfo.nowheartnum_shop) + Number($scope.lovesinfo.nowheartnum_user);
				//可激励
				$scope.rest = parseInt($scope.possess);
				//当前总
				$scope.total = Number($scope.lovesinfo.totheartnum_shop) + Number($scope.lovesinfo.totheartnum_user);
				//已激励总金额
				$scope.totalAward = Number($scope.lovesinfo.alreadyaward_user) + Number($scope.lovesinfo.alreadyaward_shop);
			}
		});
	})
	.controller('roleCtrl', function ($scope, User, $timeout) {
		//	$scope.add=function(a){
		//		if(a==1){
		//			window.location.reload;
		//		}
		//	}
		//	$timeout(function(){
		//		$scope.add(2);
		//	},50)
	})
	.controller('costBalanceCtrl', function ($scope, User, Message) {
		User.getBalance().then(function (response) {
			if (response.code == 0) {
				$scope.costBalance = response.data
			} else {
				Message.show(response.msg)
			}
		})
	})
	.controller('costBalanceListCtrl', function ($scope, User, $ionicLoading, $stateParams, Message, Order) {
		$scope.repoList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.getCostBalanceList($scope.select).then(function (response) {
			if (response.code == 0) {
				$scope.orderEmpty = false;
				$scope.costBalanceList = response.data
			} else {
				$scope.orderEmpty = true;
				Message.show(response.msg)
			}
		})
		$scope.active = function (id) {
			$scope.select = id;
			$scope.noMore = true;
			if ($scope.select == 3) {
				Order.getRedPacketRec().then(function (response) {
					if (response.data == '' || response.data.length == 0) {
						$scope.orderEmpty = true;
						$scope.costBalanceList = response.data
					} else {
						$scope.orderEmpty = false;
						$scope.costBalanceList = response.data
					}
					$scope.noMore = false;
				})
			} else {
				User.getCostBalanceList(id).then(function (response) {
					if (response.data == '' || response.data.length == 0) {
						$scope.orderEmpty = true;
						$scope.costBalanceList = response.data
					} else {
						$scope.orderEmpty = false;
						$scope.costBalanceList = response.data
					}
					$scope.noMore = false;
				});
			}

			$scope.page = 2;
		};
		// 下拉刷新
		//		$scope.doRefresh = function() {
		//			User.baladetailList($scope.select).then(function(response) {
		//				$scope.repoList = response.data;
		//				$scope.$broadcast('scroll.refreshComplete');
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: '刷新成功！',
		//					duration: '3000'
		//				});
		//			});
		//		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			if ($scope.select == 3) {
				Order.getRedPacketRec($scope.page).then(function (response) {
					$scope.page++;
					$scope.costBalanceList = $scope.costBalanceList.concat(response.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if (response.code == 0 && response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多记录了！',
							duration: '1200'
						});
					}
				})
			} else {
				User.getCostBalanceList($scope.select, $scope.page).then(function (response) {
					$scope.page++;
					$scope.costBalanceList = $scope.costBalanceList.concat(response.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if (response.code != 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多记录了！',
							duration: '1200'
						});
					}
				});
			}

		};
	})
	.controller('identifynameCtrl', function ($scope, $ionicModal, User, $state, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, aboutUs, $stateParams, ENV) {
		console.log($stateParams);
		$scope.applyInfo = {
			frontImg: '', //正面
			turnImg: '', //反面
			handImg: '', //手持身份证
			userName: '', //姓名
			idNumber: '' //身份证号
		};
		$scope.isupload = '0';
		User.identifyName().then(function (response) {
			//0没上传1在审核2实名过
			console.log(response);
			if (response.code == 0) {
				$scope.isupload = '0';
			} else if (response.code == 1) {
				$scope.isupload = 1;
				$scope.applyInfo = response.data;
			} else if (response.code == 2) {
				$scope.isupload = 2;
				$scope.applyInfo = response.data;
			} else if (response.code == 3) {
				$scope.isupload = 3;
				$scope.applyInfo = response.data;
			}
		});
		/*上传证件照*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			}
				//			,
				//				{
				//					text: "从相册选一张"
				//				}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};

		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //身份证正面照
						$scope.applyInfo.frontImg = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 2) { //身份证正面照
						$scope.applyInfo.turnImg = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 3) { //身份证正面照
						$scope.applyInfo.handImg = "data:image/jpeg;base64," + imageURI;
						var image3 = document.getElementById('divImg03');
						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};

		// 提交商家申请信息
		$scope.apply = function () {
			//			if(!$scope.applyInfo.corrImg) {
			//				Message.show("请上传您的法人身份证正面照！");
			//				return false;
			//			}
			if (!$scope.applyInfo.idNumber || !ENV.REGULAR_IDCARD.test($scope.applyInfo.idNumber)) {
				Message.show('请输入正确的身份证号！');
				return;
			}
			User.identifyName('save', $scope.applyInfo).then(function (response) {
				if (response.code == 0) {
					$state.go('tab.tcmytc');
				} else {
					Message.show(response.msg);
				}
			});
		};
		$scope.satusName = {
			0: '请实名认证',
			1: '审核中',
			2: '已实名',
			3: '拒绝,请重新认证'
		}
	})
	.controller('inteMallHomeCtrl', function ($rootScope, $scope, User, $ionicSlideBoxDelegate, Home, integralMall, $ionicLoading, $ionicModal, $state, Good, Message, $location, $anchorScroll, $ionicScrollDelegate, $ionicPopup, Storage, System) {
		$scope.keywords = '';
		// 加载首页幻灯和导航
		$scope.lovesinfo = {}
		Message.loading('加载中……');
		User.getloves().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.lovesinfo = '';
			} else {
				$scope.lovesinfo = response.data;
				$scope.lovesshow = response.data.heartVoucherControl;
				$scope.lovesinfo.lovesnum = Number(response.data.nowheartnum_user) + Number(response.data.nowheartnum_shop);
				$scope.lovesinfo.loveVoucher = Number(response.data.haert_voucher);
			}
			console.log($scope.lovesinfo);
		});
		integralMall.getHome().then(function (data) {
			console.log(data);
			var i = 0;
			var navList = [];
			navList[i] = [];
			angular.forEach(data.data.category, function (item, index) {
				if (navList[i]) {
					if (navList[i].length < 10) {
						navList[i].push(item);
					} else {
						i++;
						navList[i] = [];
						navList[i].push(item);
					}
				} else {
					navList[i].push(item);
				}
			})
			$scope.pageData = {
				focusListData: data.data.slide,
				navList: navList
			};
			if ($scope.pageData.focusListData) {
				//					$ionicSlideBoxDelegate.update();
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
				$ionicSlideBoxDelegate.$getByHandle("nav").update();
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
			}
			Message.hidden();
		});
		integralMall.getHome('type', 1).then(function (response) {
			console.log(response);
			$scope.goodsList = response.data.goodsList;
			$scope.remGoodsList = response.data.recGoods;
		});
		$scope.seemore = function () {
			$state.go('integralMall.goods');
		}
		$scope.showMsg = function () {
			$rootScope.globalInfo.noticeNum = 0;
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		// 首页搜索功能
		$scope.goSearch = function () {
			$state.go('my.offlinesearch')
		}
		// 列表下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			integralMall.getHome().then(function (data) {
				console.log(data);
				var i = 0;
				var navList = [];
				navList[i] = [];
				angular.forEach(data.data.category, function (item, index) {
					if (navList[i]) {
						if (navList[i].length < 10) {
							navList[i].push(item);
						} else {
							i++;
							navList[i] = [];
							navList[i].push(item);
						}
					} else {
						navList[i].push(item);
					}
				})
				$scope.pageData = {
					focusListData: data.data.slide,
					navList: navList
				};
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
				if ($scope.pageData.focusListData) {
					//					$ionicSlideBoxDelegate.update();
					$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
					$ionicSlideBoxDelegate.$getByHandle("nav").update();
					$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
				}
			});
			User.getloves().then(function (response) {
				if (response.data == '' || response.data.length == 0) {
					$scope.lovesinfo = '';
				} else {
					$scope.lovesinfo = response.data;
					$scope.lovesshow = response.data.heartVoucherControl;
					$scope.lovesinfo.lovesnum = Number(response.data.nowheartnum_user) + Number(response.data.nowheartnum_shop);
					$scope.lovesinfo.loveVoucher = Number(response.data.haert_voucher);
				}
				console.log($scope.lovesinfo);
			});
			$scope.noMore = true;
			$scope.page = 2;
		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			integralMall.getHome('type', $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodsList = $scope.goodsList.concat(response.data.goodsList);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data.goodsList == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商品了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};
	})
	.controller('integralMallGoodsCtrl', function ($rootScope, $scope, $stateParams, integralMall, $ionicLoading, $ionicScrollDelegate, Good, Shop, Message, $timeout, Home) {
		$scope.keyeords = '';
		//		Home.fetchnav().then(function(response) {
		//			$scope.pageMsg.titleArr._class = response.data; //分类
		//			console.log($scope.pageMsg.titleArr._class);
		//			Message.hidden();
		//		});
		//商家系列
		//		integralMall.getGoodsListType().then(function(response) {
		//			$scope.pageMsg.titleArr._chotype = response.data;
		//			Message.hidden();
		//		});
		$scope.orderEmpty = false;
		integralMall.getGoodsList('', '', '').then(function (response) {
			if (response.code == 1) {
				$scope.orderEmpty = true;
				Message.show(response.msg);
				return;
			}
			$scope.orderEmpty = false;
			$scope.goodsList = response.data;
		});
		$scope.method = {
			show: {},
			get: {},
			back: null //返回按钮
		}; //页面方法
		/*页面中需要的值*/
		$scope.pageMsg = {
			titleShow: {
				_class: '分类',
				_chotype: '兑换方式'
			},
			titleArr: {
				_class: [],
				_chotype: [{
					id: '1',
					title: '固定组合'
				},
				{
					id: '2',
					title: '自由组合'
				}
				]
			},
			titleId: {
				_class: 0,
				_chotype: 0
			},
			bool: {
				_content: true,
				_class: false,
				_chotype: false
			}
		};
		integralMall.getHome().then(function (response) {
			$scope.pageMsg.titleArr._class = response.data.category;
		})

		function attrBool(key2, key3) { //循环遍历变成false
			angular.forEach($scope.pageMsg.bool, function (v, k) {
				if ((typeof v).toLowerCase() == 'object') {
					angular.forEach($scope.pageMsg.bool[k], function (val, key) {
						if (key3) {
							if (key == key3) {
								$scope.pageMsg.bool[k][key] = !$scope.pageMsg.bool[k][key];
							} else {
								$scope.pageMsg.bool[k][key] = false;
							}
						} else {
							$scope.pageMsg.bool[k][key] = false;
						}
					})
				} else {
					if ((typeof v).toLowerCase() == 'boolean') {
						if (k == key2) {
							$scope.pageMsg.bool[k] = !$scope.pageMsg.bool[k];
						} else {
							$scope.pageMsg.bool[k] = false;
						}
					}
					if (!key3) {
						$scope.pageMsg.bool['_content'] = true;
					}
				}
			});
		}
		$scope.goSearch = function () {
			console.log($scope.keyeords);
			integralMall.getGoodsList($scope.pageMsg.titleId._class, $scope.pageMsg.titleId._chotype, $scope.keyeords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.orderEmpty = true;
					Message.show('该分类下暂无商家');
					return;
				}
				$scope.orderEmpty = false;
				$scope.goodsList = response.data;
			});
		}
		$scope.method.back = function (para) {
			switch (para) {
				case 1:
					attrBool('_content');
					break;
				case 2:
					attrBool('_city', '_s');
					break;
				case 3:
					attrBool('_city', '_c');
					break;
			}
		};

		/*点击显示隐藏*/
		$scope.method.show._class = function () {
			attrBool('_class');
		};
		$scope.method.show._chotype = function () {
			attrBool('_chotype');
		};
		/*点击获取数据并且标题改变*/
		$scope.method.get._class = function (id, title) {
			$scope.pageMsg.titleShow._class = title;
			attrBool('_class');
			$scope.page = 2; //刷新重置成1页
			$scope.pageMsg.titleId._class = id; //数据排序
			console.log($scope.pageMsg.titleId._class);
			$timeout(function () {
				integralMall.getGoodsList(id, $scope.pageMsg.titleId._chotype, $scope.keyeords).then(function (response) {
					console.log(response.data);
					// $scope.ymhPosition.status = 4;
					if (response.code == 1) {
						Message.show('该分类下暂无商家');
						return;
					}
					$scope.goodsList = response.data;
				});
			}, 500);
		};
		//筛选类型
		$scope.method.get._chotype = function (id, title) {
			$scope.pageMsg.titleShow._chotype = title;
			attrBool('_chotype');
			$scope.page = 2; //刷新重置成1页
			$scope.pageMsg.titleId._chotype = id; //数据排序
			console.log($scope.pageMsg.titleId._class);
			console.log($scope.pageMsg.titleId._chotype);
			$timeout(function () {
				integralMall.getGoodsList($scope.pageMsg.titleId._class, id, $scope.keyeords).then(function (response) {
					console.log(response.data);
					if (response.code == 1) {
						Message.show('该分类下暂无商家');
						$scope.orderEmpty = true;
						return;
					}
					$scope.goodsList = response.data;
					$scope.orderEmpty = false;
				});
			}, 500);
		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			integralMall.getGoodsList($scope.pageMsg.titleId._class, $scope.pageMsg.titleId._chotype, $scope.keyeords, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodsList = $scope.goodsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商品了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};
	})
	.controller('integralMallListsCtrl', function ($scope, $stateParams, integralMall, $ionicScrollDelegate, User, $rootScope) {
		$scope.type = 1;
		$scope.orderEmpty = false;
		$scope.record = '';
		$scope.recordInfo = [];
		integralMall.getRecord($scope.type).then(function (response) {
			if (response.code == 0 && response.data == '') {
				$scope.orderEmpty = true;
				return
			}
			$scope.orderEmpty = false;
			$scope.record = response.data;
			angular.forEach(response.data, function (item, index) {
				//				console.log(item);
				item.userHeart = Number(item.userHeart);
				item.shopHeart = Number(item.shopHeart);
				if ($scope.type == item.status) {
					$scope.recordInfo.push(item);
				}
			})
			if ($scope.recordInfo == '') {
				$scope.orderEmpty = true;
			}
		})
		$scope.getteamP = function (level) {
			$scope.type = level;
			$scope.recordInfo = [];
			//			integralMall.getRecord().then(function(response) {
			//				if(response.code == 0 && response.data == '') {
			//					$scope.orderEmpty = true;
			//					return
			//				}
			//				$scope.orderEmpty = false;
			//				$scope.recordInfo = response.data;
			angular.forEach($scope.record, function (item, index) {
				//				console.log(item);
				if ($scope.type == 2) {
					if (3 == item.status) {
						$scope.recordInfo.push(item);
					}
				}
				if ($scope.type == 0) {
					if (0 == item.status) {
						$scope.recordInfo.push(item);
					}
				}
				if ($scope.type == 1) {
					if (1 == item.status || item.status == 2) {
						$scope.recordInfo.push(item);
					}
				}

			})
			if ($scope.recordInfo == '') {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
			//			})
		}
		$scope.statusName = {
			'0': '待兑换',
			'1': '待发货',
			'2': '待收货',
			'3': '已兑换'
		};
	})
	.controller('integralMallRecordInfoCtrl', function ($scope, Shop, integralMall, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {

		integralMall.getRecordInfo($stateParams.id).then(function (response) {
			console.log(response);
			$scope.recordInfo = response.data;

		});
		$scope.confirmRecord = function (ids) {
			integralMall.confirmRecord(ids).then(function (repsonse) {
				if (repsonse.code == '0') {
					Message.show('收货成功');
					integralMall.getRecordInfo($stateParams.id).then(function (response) {
						$scope.recordInfo = response.data;
					});
				} else {
					Message.show(repsonse.msg);
				}
			});
		};
		$scope.statusName = {
			'0': '待兑换',
			'1': '待发货',
			'2': '待收货',
			'3': '已兑换'

		};

	})
	.controller('integralMallluckdrawCtrl', function ($scope, Shop, integralMall, $stateParams, Game, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User) {

		//		integralMall.getRecordInfo($stateParams.id).then(function(response) {
		//			console.log(response);
		//			$scope.recordInfo = response.data;
		//
		//		});

		$scope.$on("$ionicView.afterEnter", function () {
			$scope.prizes = {}
			$scope.choosenPrice = {}
			$scope.choosenIndex = ''
			console.log('$destroy');
			Game.getGameInfo('2').then(function (res) {
				$scope.prizes = res.data.list;
				console.log(res);
				$scope.num = $scope.prizes.length;
				$scope.times = res.data.times;
				$scope.config = res.data.config
				if ($scope.config.thumb) {
					$('.luckdraw').css('background-image', "url('" + $scope.config.thumb + "')")
				}
				if ($scope.config.info) {
					$('#luckdraw_intro').html($scope.config.info)
				}
			})
			var lottery = {
				index: -1, //当前转动到哪个位置，起点位置
				count: 0, //总共有多少个位置
				timer: 0, //setTimeout的ID，用clearTimeout清除
				speed: 20, //初始转动速度
				times: 0, //转动次数
				cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
				prize: -1, //中奖位置
				init: function (id) {
					if ($("#" + id).find(".lottery-unit").length > 0) {
						$lottery = $("#" + id);
						$units = $lottery.find(".lottery-unit");
						this.obj = $lottery;
						this.count = $units.length;
						$lottery.find(".lottery-unit-" + this.index).addClass("active");
					};
				},
				roll: function () {

					var index = this.index;
					var count = this.count;
					var lottery = this.obj;
					console.log(lottery);
					$(lottery).find(".lottery-unit-" + index).removeClass("active");
					index += 1;
					if (index > count - 1) {
						index = 0;
					};
					console.log($(lottery).find(".lottery-unit-" + index));
					$(lottery).find(".lottery-unit-" + index).addClass("active");
					this.index = index;
					return false;
				},
				stop: function (index) {
					this.prize = index;
					return false;
				}
			};

			function roll() {
				lottery.times += 1;
				lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化
				if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
					clearTimeout(lottery.timer);
					lottery.prize = -1;
					lottery.times = 0;
					click = false;
				} else {
					if (lottery.times < lottery.cycle) {
						lottery.speed -= 10;
					} else if (lottery.times == lottery.cycle) {
						//						var index = Math.random() * (lottery.count) | 0; //中奖物品通过一个随机数生成
						//						lottery.prize = index;
						//                   console.log($scope.choosenIndex);
						lottery.prize = Number($scope.choosenIndex)

					} else {
						if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
							lottery.speed += 110;
						} else {
							lottery.speed += 20;
						}
					}
					if (lottery.speed < 40) {
						lottery.speed = 40;
					};
					//console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
					lottery.timer = setTimeout(roll, lottery.speed); //循环调用
				}
				return false;
			}
			var click = false;

			//			window.onload = function() {
			$timeout(function () {
				lottery.init('lottery');
				$("#lottery a").click(function () {
					Game.turntableDraw('2').then(function (res) {
						$scope.prizes.forEach(function (ele, index) {
							if (ele.id == res.data) {
								console.log(index)
								console.log(ele)
								$scope.choosenPrice = ele
								$scope.choosenIndex = parseInt(index);

							}
						})
						if (click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
							return false;
						} else {
							lottery.speed = 100;
							roll(); //转圈过程不响应click事件，会将click置为false
							click = true; //一次抽奖完成后，设置click为true，可继续抽奖
							return false;
						}
					})

				});
				//			};
			})
		}, 10)

	})
	.controller('integralMallGoodsInfoCtrl', function ($rootScope, $scope, $ionicHistory, integralMall, $state, Shop, Home, $stateParams, Storage, $sanitize, $ionicSlideBoxDelegate, Good, Message, $ionicActionSheet, $ionicModal, Cart, User, $window, $cordovaInAppBrowser, $sce) {
		//		$scope.$on("$ionicView.beforeEnter", function() {
		//			
		//		})
		$scope.showCart = false;
		$scope.hideCart = function () {
			$scope.showCart = false;
		}
		$scope.addtype = false;
		$scope.goodPrice = false;
		$scope.goodsdetail = {};
		$scope.good = {
			price: '',
			count: '',
			spid: '',
			goodsId: '',
			id: '',
			totNum: null
		}
		$scope.goodcart = {
			gooddatas: {},
			goodbute1: '',
			goodbute2: '',
			goodsId: '',
			id: '',
			count: $scope.goodsdetail.total,
			spid: '',
			buyNum: null
		}
		$scope.backto = function () {
			if ($ionicHistory.backView()) {
				$ionicHistory.goBack()
			} else {
				$state.go('integralMall.home');
			}

		}
		$scope.clickstyle1 = '';
		$scope.clickstyle2 = '';
		$scope.attributetype = false;
		integralMall.getGoodsInfo($stateParams.goodsId).then(function (response) {
			Message.hidden();
			$scope.goodsdetail = response.data;
			$scope.good.price = $scope.goodsdetail.spe_price;
			$scope.good.count = $scope.goodsdetail.total;
			$scope.goodcart.spid = $scope.goodsdetail.spid;
			$scope.goodcart.goodsId = $scope.goodsdetail.id;
			$scope.goodcart.gooddatas = $scope.goodsdetail.attrdata;
			$scope.goodsdetail.slide = angular.fromJson($scope.goodsdetail.thumbs);
			$scope.goodsdetail.info = $sce.trustAsHtml($scope.goodsdetail.info);
			//		$('#goodsinfo-info').html($scope.goodsdetail.info);
			$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			$ionicSlideBoxDelegate.loop(true);
			$scope.exchange = {
				mode: $scope.goodsdetail.mode,
				credit: $scope.goodsdetail.credit,
				memberday: $scope.goodsdetail.memberday,
				chanceday: $scope.goodsdetail.chanceday,
				money: $scope.goodsdetail.money,
				payPrice: $scope.goodsdetail.spe_price,
				price: $scope.goodsdetail.price,
				heartVoucher: $scope.goodsdetail.heart_voucher
			}
		});
		$scope.buyNum = 1;
		$scope.addNum = function () {
			$scope.buyNum++;
		};
		$scope.minusNum = function () {
			if ($scope.buyNum > 1) {
				$scope.buyNum--;
			}
		};
		$scope.callPhone = function (mobilePhone) {
			//console.log("拨打:" + mobilePhone);
			$window.location.href = "tel:" + mobilePhone;
		};
		// 添加购物车
		$scope.addCarts = function () {
			$scope.showCart = true;
			$scope.clickstyle1 = '';
			$scope.clickstyle2 = '';
			$scope.good = {
				price: $scope.goodsdetail.spe_price,
				count: $scope.goodsdetail.total,
				spid: '',
				goodsId: '',
				id: '',
				totNum: null
			}
			$scope.goodcart = {
				gooddatas: $scope.goodsdetail.attrdata,
				goodbute1: '',
				goodbute2: '',
				spid: $scope.goodsdetail.spid,
				goodsId: $scope.goodsdetail.id,
				id: '',
				count: $scope.goodsdetail.total,
				totNum: null
			}

			$('.attribute-common li').removeClass('selectstyle');
			$('.attribute-common li').removeClass('unclick');
		};
		$scope.changebute1 = function (idnum, item1) {
			if ($('.attribute-common #item1' + idnum).css("background-color") == 'rgb(153, 153, 153)') {
				return
			}
			//bute2存在
			if ($scope.goodsdetail.attr[1].data[0] != '') {
				//bute2为空
				if ($('.attribute-common #item1' + idnum).hasClass('selectstyle')) {
					//bute1有选中状态，取消选中状态
					$scope.clickstyle1 = '';
					$scope.goodcart.goodbute1 = '';
					$('.attribute2 li').removeClass('unclick');
					$scope.goodPrice = false;
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
				} else {
					//bute1无选中状态，添加选中状态
					$scope.attributetype = true;
					$scope.clickstyle1 = item1;
					$scope.goodcart.goodbute1 = item1;
					$scope.goodPrice = false;
					//找到当前bute1和bute2组合的商品
					angular.forEach($scope.goodcart.gooddatas, function (obj) {
						if (obj.field_1 == $scope.goodcart.goodbute1 && obj.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj;
							$scope.goodcart.id = obj.id;
							$scope.good.price = obj.price;
							$scope.goodPrice = true;
						}
					});
					//利用bute1筛选bute2属性
					var butes2 = $('.attribute2 li');
					for (var j = 0; j < butes2.length; j++) {
						//						console.log(butes2[j]);
						for (var k = 0; k < $scope.goodcart.gooddatas.length; k++) {
							//							$scope.bute2good = objs;
							if (butes2[j].innerHTML == $scope.goodcart.gooddatas[k].field_2 && $scope.goodcart.gooddatas[k].field_1 == $scope.goodcart.goodbute1) {
								$('.attribute2 #' + butes2[j].id).removeClass('unclick');
								//								console.log($scope.goodcart.gooddatas[k]);
								k = $scope.goodcart.gooddatas.length;
							} else {
								$('.attribute2 #' + butes2[j].id).addClass('unclick');
							}
						}
					}

				}
			} else {
				//bute2不存在
				$scope.goodPrice = false;
				if ($('.attribute-common #item1' + idnum).hasClass('selectstyle')) {
					$scope.clickstyle1 = '';
					$scope.goodcart.goodbute1 = '';
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
					$scope.attributetype = false;
				} else {
					$scope.attributetype = true;
					$scope.clickstyle1 = item1;
					$scope.goodcart.goodbute1 = item1;
					angular.forEach($scope.goodcart.gooddatas, function (obj) {
						if (obj.field_1 == $scope.goodcart.goodbute1) {
							$scope.good = obj;
							$scope.goodcart.id = obj.id;
							$scope.good.price = obj.price;
							$scope.goodPrice = true;
						}
					});
				}

			}
		}
		$scope.changebute2 = function (idnum, item2) {
			if ($('.attribute-common #item2' + idnum).css("background-color") == 'rgb(153, 153, 153)') {
				return
			}
			//bute1不为空
			if ($scope.goodcart.goodbute1 != '') {
				if ($('.attribute-common #item2' + idnum).hasClass('selectstyle')) {
					//bute2有选中状态，取消选中状态
					$scope.clickstyle2 = '';
					$scope.goodcart.goodbute2 = '';
					$('.attribute1 li').removeClass('unclick');
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
					$scope.goodPrice = false;
				} else {
					//bute2无选中状态，添加选中状态
					$scope.attributetype = true;
					$scope.clickstyle2 = item2;
					$scope.goodcart.goodbute2 = item2;
					//找到当前bute1和bute2组合的商品
					angular.forEach($scope.goodcart.gooddatas, function (obj2) {
						if (obj2.field_1 == $scope.goodcart.goodbute1 && obj2.field_2 == $scope.goodcart.goodbute2) {
							$scope.good = obj2;
							$scope.goodcart.id = obj2.id;
							$scope.good.price = obj2.price;
							$scope.goodPrice = true;
						}
					});
					//利用bute2筛选bute1属性
					var butes1 = $('.attribute1 li ');
					for (var j = 0; j < butes1.length; j++) {
						for (var k = 0; k < $scope.goodcart.gooddatas.length; k++) {
							//							$scope.bute2good = objs;
							if (butes1[j].innerHTML == $scope.goodcart.gooddatas[k].field_1 && $scope.goodcart.gooddatas[k].field_2 == $scope.goodcart.goodbute2) {
								$('.attribute1 #' + butes1[j].id).removeClass('unclick');
								k = $scope.goodcart.gooddatas.length;
							} else {
								$('.attribute1 #' + butes1[j].id).addClass('unclick');
							}
						}
					}
				}
			} else {
				//bute1为空
				console.log(item2);
				$scope.goodPrice = false;
				if ($('.attribute-common #item2' + idnum).hasClass('selectstyle')) {
					//bute2有选择属性
					$scope.clickstyle2 = '';
					$scope.goodcart.goodbute2 = '';
					$scope.attributetype = false;
					$('.attribute1 li').removeClass('unclick');
					$scope.good = {
						price: $scope.goodsdetail.spe_price,
						count: $scope.goodsdetail.total,
						spid: '',
						goodsId: '',
						id: '',
						totNum: null
					}
				} else {
					//bute2无选择属性
					$scope.attributetype = true;
					$scope.clickstyle2 = item2;
					$scope.goodcart.goodbute2 = item2;
					//筛选bute1
					var butes1 = $('.attribute1 li');
					for (var j = 0; j < butes1.length; j++) {
						console.log(butes1[j]);
						for (var k = 0; k < $scope.goodcart.gooddatas.length; k++) {
							if (butes1[j].innerHTML == $scope.goodcart.gooddatas[k].field_1 && $scope.goodcart.gooddatas[k].field_2 == $scope.goodcart.goodbute2) {
								$('.attribute1 #' + butes1[j].id).removeClass('unclick');
								console.log($scope.goodcart.gooddatas[k]);
								k = $scope.goodcart.gooddatas.length;
							} else {
								$('.attribute1 #' + butes1[j].id).addClass('unclick');
							}
						}
					}
				}

			}
		}
		$scope.buygoods = function () {
			$state.go('integral.checkOrder', {
				id: $scope.goodsdetail.id,
				types: $scope.exchange
			});
			//			console.log();
			//			integralMall.createRecord($scope.goodsdetail.id,$scope.exchange).then(function(response){
			//				console.log('ss');
			//			})
		}
		//		$scope.buygoods = function() {
		//			if(!$rootScope.globalInfo.user.uid) {
		//				$scope.showCart = false;
		//				$state.go('auth.login');
		//				return false;
		//			}
		//			$scope.good.totNum = $scope.buyNum;
		//			$scope.goodcart.totNum = $scope.buyNum;
		//			if($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId == "") {
		//				Message.show('请选择商品规格');
		//				return
		//			} else if($scope.goodsdetail.attrdata.length > 0 && $scope.good.goodsId != "") {
		//				if($scope.good.count == 0) {
		//					Message.show('该商品售罄，请重新选择');
		//					return
		//				}
		//				Cart.cartSave($scope.good, 'interim').then(function(response) {
		//					//	$scope.addCart.hide();
		//					$scope.showCart = false;
		//				});
		//			} else {
		//				if($scope.goodcart.count == 0) {
		//					Message.show('该商品售罄，请重新选择');
		//					return
		//				}
		//				Cart.cartSave($scope.goodcart, 'interim').then(function(response) {
		//					$scope.showCart = false;
		//				});
		//			}
		//		};
		$scope.$on("$ionicView.beforeLeave", function () {
			$scope.showCart = false;
		});
		$scope.$on("$ionicView.afterLeave", function () {
			$scope.showCart = false;
		});

	})
	.controller('integralMallCheckOrderCtrl', function ($scope, Shop, integralMall, $stateParams, $ionicModal, Message, Order, $state, Storage, $timeout, $resource, ENV, $ionicActionSheet, $cordovaCamera, $ionicPlatform, User, Cart) {
		console.log($stateParams);
		console.log(Storage.get('inteAddress'));
		if (Storage.get('inteAddress')) {
			$scope.addressInfo = Storage.get('inteAddress');
		}
		//获取验证码
		if ($stateParams.types.mode == 1) {
			$scope.exchange = {
				goodsId: $stateParams.id,
				userBalance: $scope.balance,
				payPrice: $stateParams.types.payPrice,
				passwords: '',
				chanceday: $stateParams.types.chanceday,
				//			credit:$stateParams.types.credit,
				memberday: $stateParams.types.memberday,
				//			money:$stateParams.types.money,
				mode: $stateParams.types.mode,
				loveNum: $stateParams.types.credit,
				loves: '',
				bili: '',
				loveVoucher: '',
				price: $stateParams.types.price,
				factMoney: $stateParams.types.money,
				useLove: '',
			};
		} else if ($stateParams.types.mode == 2) {
			$scope.exchange = {
				goodsId: $stateParams.id,
				//			userBalance: $scope.balance,
				payPrice: $stateParams.types.payPrice,
				passwords: '',
				chanceday: $stateParams.types.chanceday,
				credit: $stateParams.types.credit,
				memberday: $stateParams.types.memberday,
				money: $stateParams.types.money,
				mode: $stateParams.types.mode,
				loveNum: '',
				loves: '',
				bili: '',
				loveVoucher: '',
				price: $stateParams.types.price,
				factMoney: $stateParams.types.price,
				useLove: '',
			};
		} else if ($stateParams.types.mode == 3) {
			$scope.exchange = {
				goodsId: $stateParams.id,
				userBalance: $scope.balance,
				payPrice: $stateParams.types.payPrice,
				passwords: '',
				chanceday: $stateParams.types.chanceday,
				memberday: $stateParams.types.memberday,
				mode: $stateParams.types.mode,
				loveNum: $stateParams.types.credit,
				loveVoucher: '',
				loves: '',
				bili: '',
				price: $stateParams.types.price,
				factMoney: $stateParams.types.money,
				heartVoucher: $stateParams.types.heartVoucher,
			};
		}
		User.getloves().then(function (response) {
			console.log(response);
			if (response.data == '' || response.data.length == 0) {
				$scope.lovesinfo = '';
			} else {
				$scope.lovesinfo = response.data;
				$scope.exchange.loveVoucher = response.data.haert_voucher;
				$scope.exchange.loves = Number(response.data.nowheartnum_user) + Number(response.data.nowheartnum_shop);
				$scope.exchange.bili = response.data.proportion;
				$scope.exchange.useLove = $stateParams.types.price / Number(response.data.proportion);
			}
			console.log($scope.exchange);
		});
		$scope.judgeLove = function () {
			console.log($scope.exchange.loveNum);
			if ($scope.exchange.loveNum.toString().split(".")[1] && $scope.exchange.loveNum.toString().split(".")[1].length > 4) {
				Message.show('最多四位小数，请重新输入');
				$scope.exchange.loveNum = 0;
				$scope.exchange.factMoney = $scope.exchange.price;
				return
			}
			if ($scope.exchange.loveNum > $scope.exchange.loves) {
				Message.show('超过可使用数量，重新输入');
				$scope.exchange.loveNum = 0;
				$scope.exchange.factMoney = $scope.exchange.price - $scope.exchange.loveNum * $scope.exchange.bili;
				return
			}
			if ($scope.exchange.loveNum > $scope.exchange.useLove) {
				$scope.exchange.loveNum = $scope.exchange.useLove;
				$scope.exchange.factMoney = $scope.exchange.price - $scope.exchange.loveNum * $scope.exchange.bili;
			}
			$scope.exchange.factMoney = $scope.exchange.price - $scope.exchange.loveNum * $scope.exchange.bili;
		}

		$scope.vouchPay = function () {
			console.log($scope.exchange);
			if ($scope.exchange.loves < $scope.exchange.heartVoucher) {
				Message.show('可用券数量不足');
				return
			}
			console.log($scope.addressInfo);
			if (!$scope.addressInfo) {
				Message.show('请选择收货地址');
				return
			}
			integralMall.intePay($scope.exchange, $scope.addressInfo, 'voucher').then(function (response) {
				console.log(response);
			})

		}
		//购买跳转
		$scope.goodsPay = function () {
			console.log($scope.exchange);
			if ($scope.exchange.loveNum == '') {
				Message.show('请输入使用数量');
				return
			}

			if ($scope.exchange.chanceday > 0) {
				if ($scope.exchange.memberday == 0) {
					Message.show('当日兑换次数已用完');
					return
				}
			}
			// if ($scope.exchange.loveNum > $scope.exchange.loves) {
			// 	Message.show('可用数量不足');
			// 	return
			// }

			if ($scope.exchange.loveNum > ($scope.lovesinfo.red_integral + $scope.lovesinfo.white_integral)) {
				Message.show('可用数量不足');
				return
			}

			if (!$scope.addressInfo) {
				Message.show('请选择收货地址');
				return
			}
			if ($scope.exchange.factMoney == 0) {
				//				console.log($scope.addressInfo.birth);
				//				$scope.addressInfo.birth=$scope.addressInfo.birth.split(' ');
				//				console.log($scope.addressInfo.birth.split(' '));

				integralMall.intePay($scope.exchange, $scope.addressInfo, 'integral').then(function (response) {
					console.log(response);
				})
			} else {
				$state.go('integral.pay', {
					payInfo: $scope.exchange,
					addressInfo: $scope.addressInfo
				});
			}

		}

	})
	.controller('integralMallAddressListCtrl', function ($scope, $ionicHistory, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout, $state, Storage) {
		$scope.isDefault = '';
		$scope.addressInfo = {
			userName: '',
			bankName: '',
			idCard: '',
			bankCard: '',
			mobile: ''
		};
		$scope.showBank = false;
		User.getaddresslist().then(function (data) {
			console.log(data);
			angular.forEach(data, function (x, y) {
				if (x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.addressList = data;
		});
		// 选择收货地址
		$scope.selectAddress = function (item) {
			console.log(item);
			Storage.set('inteAddress', item);
			//			$scope.isDefault = id;
			$ionicHistory.goBack();
		};
		//		$scope.submit = function() {
		//			if(!$scope.isDefault) {
		//				Message.show('请先添加地址！');
		//				return;
		//			}
		//			User.getaddresslist('order', $scope.isDefault);
		//		}

	})
	.controller('integralMallAddaddressCtrl', function ($scope, $ionicModal, $ionicHistory, Area, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, User) {
		$scope.addaddress = {
			userName: '',
			address: '',
			mobile: ''
		};
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function () {
			Area.getList(function (data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function (id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if (id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if ($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if (id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};
		// 提交商家申请信息
		$scope.submit = function () {
			if (!$scope.addaddress.userName) {
				Message.show("收货人不能为空！");
				return false;
			}
			if (!$scope.addaddress.mobile || !ENV.REGULAR_MOBILE.test($scope.addaddress.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if (!$scope.up.userInfo.area) {
				Message.show("请选择地址！");
				return false;
			}
			if (!$scope.addaddress.address) {
				Message.show("请输入您的详细地址！");
				return false;
			}
			User.addAddress($scope.addaddress, $scope.up.userInfo.area).then(function (response) {
				if (response.code == 0) {
					$ionicHistory.goBack();
					//					$state.go('goods.orderAddress');
				}

			});
		}
	})
	.controller('integralMallPayCtrl', function ($scope, $stateParams, integralMall, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, Message, Payment, $state, $timeout, $interval, User, Order) {
		//		$scope.$on("$ionicView.beforeEnter", function() {
		//			User.getBalance().then(function(response) {
		//				console.log(response);
		//				$scope.balance = response.data;
		//			});
		//			User.getloves().then(function(response) {
		//				console.log(response);
		//			if(response.data == '' || response.data.length == 0) {
		//				$scope.lovesinfo = '';
		//			} else {
		//				$scope.lovesinfo = response.data;
		//				$scope.exchange.loves=response.data.
		//			}
		//		});
		//		})
		console.log($stateParams);
		$scope.showbalances = 'pay';
		//获取验证码
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.exchange = $stateParams.payInfo;
		$scope.exchange = {
			goodsId: $stateParams.payInfo.goodsId,
			userBalance: $scope.balance,
			payPrice: $stateParams.payInfo.payPrice,
			passwords: '',
			chanceday: $stateParams.payInfo.chanceday,
			credit: $stateParams.payInfo.credit,
			memberday: $stateParams.payInfo.memberday,
			money: $stateParams.payInfo.money,
			mode: $stateParams.payInfo.mode,
			code: '',
			number: 60,
			loveNum: $stateParams.payInfo.loveNum,
			loves: '',
			bili: '',
			price: $stateParams.payInfo.price,
			factMoney: Number($stateParams.payInfo.factMoney).toFixed(2),
			useLove: ''
		};
		User.getBalance().then(function (response) {
			console.log(response);
			$scope.balance = response.data;
			$scope.exchange.userBalance = response.data.balance;
		});
		//判断余额显示
		$timeout(function () {
			$scope.showbalance = function () {
				if ($scope.showbalances != 'bala' && $scope.exchange.userBalance - $scope.exchange.factMoney < 0) {
					Message.show('余额不足');
					return
				} else if ($scope.showbalances == 'bala') {
					$scope.showbalances = 'pay';
				} else {
					$scope.showbalances = 'bala';
				}

			}
		}, 100)

		$scope.getCode = function () {
			$scope.exchange.number = 60;
			User.getbalancecode().then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.exchange.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.exchange.number = 60;
					} else {
						$scope.exchange.number--;
					}
				}, 1000)
			})
		};
		// 选择支付类型
		$scope.payType = 'wechat';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		$ionicModal.fromTemplateUrl('templates/modal/shopsVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.shopsVoucher = modal;
		});
		$scope.balanceConfirm = function () {
			console.log($scope.exchange);
			integralMall.intePay($scope.exchange, $stateParams.addressInfo, 'balance');
			//			integralMall.creditPay($scope.exchange);
		}
		$scope.orderConfirm = function () {
			if ($scope.exchange.loveNum == '') {
				Message.show('请输入使用数量');
				return
			}
			// if ($scope.exchange.memberday == 0) {
			// 	Message.show('今天兑换次数用完');
			// 	return
			// }
			// if ($scope.exchange.chanceday == 0) {
			// 	Message.show('该商品已被兑换完');
			// 	return
			// }
			if ($scope.payType == 'wechat') {
				//noinspection JSUnresolvedVariable
				// if (!window.Wechat) {
				// 	alert("暂不支持微信支付！");
				// 	return false;
				// }
				console.log($scope.exchange);
				integralMall.intePay($scope.exchange, $stateParams.addressInfo, 'wechat');
				//					integralMall.wechatPay($scope.exchange);
			} else if ($scope.payType == 'alipay') {
				console.log($scope.exchange);
				integralMall.intePay($scope.exchange, $stateParams.addressInfo, 'alipay');
				//					integralMall.alipay($scope.exchange);
			}
		};
	})
	.controller('integralMallvoucherListCtrl', function ($scope, integralMall, Message, $stateParams, $ionicLoading) {
		console.log($stateParams)
		$scope.issplit = $stateParams.issplit;
		integralMall.getvoucherlist().then(function (response) {
			if (response.data == '' || response.data.length == 0) {
				$scope.loveslist = response.data;
			} else {
				$scope.loveslist = response.data;
			}
		});
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function () {
			integralMall.getvoucherlist($scope.page).then(function (response) {
				$scope.page++;
				$scope.loveslist = $scope.loveslist.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}

			});

		};

	})
	//众筹
	//众筹
	.controller('cf-homeCtrl', function ($scope, $stateParams, $ionicLoading, $ionicScrollDelegate, $ionicSlideBoxDelegate, User, $rootScope, crowdF) {
		$scope.type = 1;
		//轮播图
		crowdF.getindexSlide().then(function (response) {
			$scope.indextop = response.data;
			if ($scope.indextop) {
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
				$ionicSlideBoxDelegate.loop(true);
			}
		})
		//展示项目
		crowdF.getindexItem('home').then(function (response) {
			console.log(response);
			$scope.indexItem = response.data;
		})
		//		$scope.getteamP=function(types){
		//			$scope.type=types;
		//			crowdF.getindexItem('dream').then(function(response) {
		//			  console.log(response);
		//			$scope.indexItem = response.data;
		//		})
		//		}
		$scope.statusName = {
			'0': $rootScope.globalInfo.nounInfo.AXSZ,
			'1': $rootScope.globalInfo.nounInfo.CDDS,
			'2': $rootScope.globalInfo.nounInfo.PTHY,
			'3': $rootScope.globalInfo.nounInfo.CDSZ
		};
		// 列表下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			crowdF.getindexSlide().then(function (response) {
				$scope.indextop = response.data;
				if ($scope.indextop) {
					$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
					$ionicSlideBoxDelegate.loop(true);
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					//					pullingIcon: 'ion-android-bicycle',
					//					refreshingIcon: 'ion-android-bicycle',
					duration: '1200'
				});
			})
			crowdF.getindexItem('home').then(function (response) {
				console.log(response);
				$scope.indexItem = response.data;

				$scope.noMore = true;
				$scope.page = 2;
			})

		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			crowdF.getindexItem($scope.type, $scope.page).then(function (data) {
				$scope.page++;
				$scope.indexItem = $scope.indexItem.concat(data.data);
				//$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (data.code == 1) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};

	})
	.controller('cfprojectapplyCtrl', function ($scope, $stateParams, $ionicScrollDelegate, User, $rootScope, crowdF, $sce, $ionicPopup, $cordovaCamera, $ionicActionSheet) {
		$scope.applyInfo = {
			money: null, //目标金额
			purpose: '', //用途
			days: '', //时间
			title: '', //标题
			desc: '', //描述
			imgs: [],
			time: '', //截止时间
			starttime: ''
		}
		$scope.showDesc = true;
		//时间日期的处理
		$scope.newTimes = new Date();
		$scope.applyInfo.starttime = $scope.newTimes;
		console.log($scope.applyInfo);
		$scope.changeDays = function () {
			console.log($scope.applyInfo.days);
			var nowtime = new Date();
			console.log(nowtime)
			console.log(nowtime.getDate());
			var addTime = Number($scope.applyInfo.days) + nowtime.getDate()
			console.log(addTime);
			nowtime.setDate(addTime)
			console.log(nowtime)
			$scope.applyInfo.time = nowtime;
			console.log($scope.applyInfo.time);
		}
		//众筹说明
		$scope.itemDesc = '';
		crowdF.applyItem().then(function (response) {
			$scope.itemDesc = $sce.trustAsHtml(response.data);
		});
		$scope.statusName = {
			'0': $rootScope.globalInfo.nounInfo.AXSZ,
			'1': $rootScope.globalInfo.nounInfo.CDDS,
			'2': $rootScope.globalInfo.nounInfo.PTHY,
			'3': $rootScope.globalInfo.nounInfo.CDSZ
		};
		$scope.showdesc = function () {
			if ($scope.showDesc == true) {
				$scope.showDesc = false
			} else {
				$scope.showDesc = true
			}
			//  $ionicPopup.alert({
			//     title: '众筹说明',
			//     template:'$scope.itemDesc'
			//   }).then(function(res) {
			//     console.log('Thank you for not eating my delicious ice cream cone');
			//   });
		}
		//删除图片
		$scope.deleteimg = function (index) {
			console.log(index);
			$scope.applyInfo.imgs.splice(index, 1)
		}
		/*上传图片*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
						return true;
					} else if (index == 1) {
						selectImages("", type);
						return true;
					}
					return true;
				}
			})
		};

		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					//						$scope.applyInfo.corrImg = "data:image/jpeg;base64," + imageURI;
					$scope.applyInfo.imgs.push("data:image/jpeg;base64," + imageURI)
					//						var image1 = document.getElementById('divImg01');
					//						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";

				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		//发起申请
		$scope.apply = function () {
			console.log($scope.applyInfo);
			crowdF.applyItem('apply', $scope.applyInfo);
		}

	})
	.controller('cfmyCtrl', function ($scope, $cordovaBarcodeScanner, aboutUs, $ionicLoading, User, $state, Message, Mc, Apply, $rootScope, Storage, Auth, Home, Good, $ionicActionSheet, $timeout, $cordovaInAppBrowser, crowdF) {
		User.getuserinfo().then(function (response) {
			$scope.userInfo = response.data;
			var shopApply = Storage.get('user');
			shopApply.isAmbass = response.data.isAmbass;
			shopApply.mostCost = response.data.mostCost;
			shopApply.agenttype = response.data.agenttype;
			shopApply.passtime = response.data.passtime;
			Storage.set('user', shopApply);
			$rootScope.globalInfo.user = shopApply;
			//			console.log(Storage.get('user'));
		});
		$scope.levelName = {
			'0': $rootScope.globalInfo.nounInfo.AXSZ,
			'1': $rootScope.globalInfo.nounInfo.CDDS,
			'2': $rootScope.globalInfo.nounInfo.PTHY,
			'3': $rootScope.globalInfo.nounInfo.CDSZ
		};
		crowdF.getmyinfo().then(function (response) {
			console.log(response);
			$scope.showInfo = response.data;
		})
		$scope.agentName = {
			'0': '',
			'1': '省级代理',
			'2': '市级代理',
			'3': '县级代理'
		};
		aboutUs.serveInfo().then(function (response) {
			$scope.serveInfo = response.data;
		});
		//客服
		$scope.mycontactserve = function () {
			//				var	qqhtml="<a target='_blank' style='color:#007aff;' href='http://wpa.qq.com/msgrd?v=3&uin="+$scope.goodsdetail.shops.QQ+"&site=qq&menu=yes'>QQ客服</a>";
			//				var	qqhtml='<a target="_blank" style="color:#007aff;"  href="http://wpa.qq.com/msgrd?v=3&uin='+$scope.goodsdetail.shops.QQ+'&site=qq&menu=yes">QQ客服</a>';
			var qqurl = "http://wpa.qq.com/msgrd?v=3&uin=" + $scope.serveInfo.QQ + "&site=qq&menu=yes";
			var buttons = [];
			buttons = [{
				text: $scope.serveInfo.CSH,
			}, {
				text: "QQ客服"
			}, {
				text: "帮助中心"
			}]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						$scope.callPhone($scope.serveInfo.CSH);
					} else if (index == 1) {
						$scope.getqq(qqurl);
					} else if (index == 2) {
						$state.go('my.helplist');
					}
					return true;
				}
			})
		};
		$scope.getqq = function (qqurl) {
			//			 $window.location.href = qqurl;
			document.addEventListener("deviceready", function () {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'
				};
				$cordovaInAppBrowser.open(qqurl, '_system', options)
					.then(function (event) {
						console.log(event)
					})
					.catch(function (event) {
						console.log(event)
					});
			}, false);
		}
		$scope.callPhone = function (mobilePhone) {
			$window.location.href = "tel:" + mobilePhone;
		};
		// 消息是否显示
		$scope.msgNum = false;
		if ($rootScope.globalInfo.noticeNum > 0) {
			$scope.msgNum = true;
		} else {
			$scope.msgNum = false;
		}
		$scope.showMsg = function () {
			$rootScope.globalInfo.noticeNum = 0;
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		// 修改扫码处理
		$scope.scan = function () {
			cloudSky.zBar.scan({
				text_title: "亿民惠", // Android only
				text_instructions: "请将二维码置于扫描框中间", // Android only
				//				camera: "front" || "back" ,// defaults to "back"
				//				flash: "on" || "off" || "auto", // defaults to "auto". See Quirks
				//				drawSight: true || false //defaults to true, create a red sight/line in the center of the scanner view.
			}, function (barcodeData) {
				$scope.qr = barcodeData;
				Message.show($scope.qr);
				var preg = /^http:\/\/.*\/yd\/\d+\/(\d+)$/;
				if ($scope.qr.match(preg)[1]) {
					var spid = $scope.qr.match(preg)[1];
					Message.show(spid);
					$state.go('user.linepay', {
						'spid': spid
					});
				} else {
					Message.show('二维码不是平台专用，请核对后再扫！', 2000);
				}
			}, function (error) {
				//				console.log(error);
				Messa.show(error);
				Message.show('扫码失败，请尝试重新扫码！', 2000);
			})
			//			com.jieweifu.plugins.barcode.startScan(function(barcodeData) {
			//				$scope.qr = barcodeData;
			//				var preg = /^http:\/\/.*\/yd\/\d+\/(\d+)$/;
			//				if($scope.qr.match(preg)[1]) {
			//					var spid = $scope.qr.match(preg)[1];
			//					$state.go('user.linepay', {
			//						'spid': spid
			//					});
			//				} else {
			//					Message.show('二维码不是平台专用，请核对后再扫！', 2000);
			//				}
			//			}, function(error) {
			//				console.log(error);
			//				Message.show('扫码失败，请尝试重新扫码！', 2000);
			//			});
		};
		// 列表下拉刷新
		$scope.doRefresh = function () {
			$scope.noMore = false;
			Good.gethotgoodsList().then(function (response) {
				$scope.goodsList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					pullingIcon: 'ion-android-bicycle',
					refreshingIcon: 'ion-android-bicycle',
					duration: '1000'
				});
				$scope.noMore = true;
				$scope.page = 2;
				$scope.goodisshow = false;
			});
			User.getuserinfo().then(function (response) {
				$scope.userinfo = response;
				var shopApply = Storage.get('user');
				//	shopApply = response.data;
				shopApply.isAmbass = response.data.isAmbass;
				shopApply.mostCost = response.data.mostCost;
				shopApply.agenttype = response.data.agenttype;
				shopApply.passtime = response.data.passtime;
				Storage.set('user', shopApply);
				$rootScope.globalInfo.user = shopApply;
				//			console.log(Storage.get('user'));

			});
			aboutUs.serveInfo().then(function (response) {
				$scope.serveInfo = response.data;

			});
		};

	})
	.controller('cfmyprojectlistCtrl', function ($scope, $stateParams, $ionicScrollDelegate, User, $rootScope, crowdF, $ionicLoading) {
		console.log($stateParams);
		//status 0申请筹款 1申请成功 2筹款成功 -4失败 -2拒绝
		$scope.type = 'ing';
		$scope.empty = false;
		$scope.relation = $stateParams.relation;
		crowdF.getitemList($scope.type, $scope.relation).then(function (response) {
			console.log(response);
			if (response.code == 0) {
				$scope.empty = false;
				$scope.itemList = response.data;
			} else {
				$scope.empty = true;
				$scope.itemList = response.data;
			}
		})
		$scope.getteamP = function (level) {
			$scope.type = level;
			crowdF.getitemList($scope.type, $scope.relation).then(function (response) {
				console.log(response);
				if (response.code == 0) {
					$scope.empty = false;
					$scope.itemList = response.data;
				} else {
					$scope.empty = true;
					$scope.itemList = response.data;
				}

			})
		}
		//status 0申请筹款 1申请成功 2筹款成功 -4失败 -2拒绝
		$scope.statusName = {
			'0': '审核中',
			'1': '通过',
			'2': '筹款成功',
			'-2': '拒绝',
			'-4': '失败'
		};
		//加载更多
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			crowdF.getitemList($scope.type, $scope.relation, $scope.page).then(function (response) {
				$scope.page++;
				$scope.itemList = $scope.itemList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 1) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});
				}
			});

		};
	})
	.controller('cfmycenterCtrl', function ($scope, $rootScope, ENV, $ionicActionSheet, $ionicLoading, $ionicHistory, $timeout, $state, User, $ionicModal, $cordovaCamera, Storage, $resource, System, Message, $cordovaAppVersion) {
		// 退出登录
		$scope.logout = function () {
			$ionicActionSheet.show({
				destructiveText: '退出登录',
				titleText: '确定退出当前登录账号么？',
				cancelText: '取消',
				cancel: function () {
					return true;
				},
				destructiveButtonClicked: function () {
					User.logout();
					$ionicHistory.nextViewOptions({ //退出后清除导航的返回
						disableBack: true
					});
					$ionicLoading.show({
						noBackdrop: true,
						template: '退出成功！',
						duration: '1500'
					});
					$timeout(function () {
						$state.go('tab.notice');
					}, 1200);
					return true;
				}
			});
		};
		//昵称
		$scope.NickName = {
			nickname: ''
		};
		$scope.setNickname = function (nickname) {
			User.setnickname(nickname.nickname).then(function (response) {
				//	console.log(nickname);
				var setNick = Storage.get('user');
				setNick.nickname = nickname.nickname;
				Storage.set('user', setNick);
				$rootScope.globalInfo.user = setNick;
				console.log(Storage.get('user'));

				$timeout(function () {
					Message.show('修改成功');
					$state.go('tab.tcmytc');
				}, 1000);
			})
		};
		//修改头像
		$scope.head = {
			img: ''
		};
		var resource = $resource(ENV.YD_URL, {
			do: 'users',
			op: '@op'
		});
		/*上传证件照*/
		$scope.uploadAvatar = function () {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera");
					} else if (index == 1) {
						selectImages("");
					}
					return true;
				}
			})
		};
		var selectImages = function (from) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					$scope.head.img = "data:image/jpeg;base64," + imageURI;
					resource.save({
						op: 'changeHead',
						img: $scope.head.img
					}, function (response) {

						if (response.code == '0') {
							var shopApply = Storage.get('user');
							shopApply.avatar = $scope.head.img;
							Storage.set('user', shopApply);
							$rootScope.globalInfo.user = shopApply;
							Message.show('上传成功');
							$state.go('cf.my');
						} else {

							Message.show(response.msg);
						}
					});
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
	})
	.controller('cfbankListCtrl', function ($scope, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout, $stateParams) {
		console.log($stateParams);
		$scope.bankList = {};
		$scope.isDefault = '';
		$scope.bankInfo = {
			userName: '',
			bankName: '',
			bankDown: '',
			idCard: '',
			bankCard: '',
			mobile: ''
		};
		$scope.showBank = false;
		$scope.bankType = function (num, title) {
			$scope.bankInfo.bankName = title;
			$scope.showBank = false;
		};

		User.getBank().then(function (data) {
			angular.forEach(data, function (x, y) {
				if (x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.bankList = data;
		});
		if ($stateParams.button == 'hidden') {
			$scope.buttonshow = false;
		} else {
			$scope.buttonshow = true;
		}
		// 提交添加银行卡资料
		$scope.submitData = function () {
			if (!$scope.bankInfo.userName) {
				Message.show('请输入开户姓名！');
				return;
			}
			if (!$scope.bankInfo.bankName) {
				Message.show('请选择转入银行的名称！');
				return;
			}
			if (!$scope.bankInfo.idCard || !ENV.REGULAR_IDCARD.test($scope.bankInfo.idCard)) {
				Message.show('请输入正确的身份证号！');
				return;
			}
			if (!$scope.bankInfo.bankCard || $scope.bankInfo.bankCard.length <= 5) {
				Message.show('请输入正确的银行卡号！');
				return;
			}
			if (!$scope.bankInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.bankInfo.mobile)) {
				Message.show('请输入正确的手机号！');
				return;
			}
			User.getBankInfo('type', $scope.bankInfo).then(function (response) {
				if (response.code == 0) {
					$scope.addBank.hide();
					$scope.bankInfo = {
						userName: '',
						bankName: '',
						idCard: '',
						bankCard: '',
						mobile: ''
					};
					//					$timeout(function() {
					//						Message.show('添加成功！');
					//					}, 1000);
					User.getBank().then(function (data) {
						angular.forEach(data, function (x, y) {
							if (x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.bankList = data;
					});
				} else if (response.code == 1) {
					Message.show(response.msg);
				}
			});
		};
		// 添加银行卡号
		$ionicModal.fromTemplateUrl('templates/modal/addBank.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.addBank = modal;
		});
		$scope.openModal = function () {
			$scope.addBank.show();
			User.getBankInfo().then(function (response) {
				$scope.bankInfo = response.data;
			});
		};
		// 选择银行卡
		$scope.selectBank = function (id) {
			$scope.isDefault = id;
		};
		//删除银行卡
		$scope.removeBank = function (id) {
			User.getBank('delete', id).then(function (response) {
				if (response.code == 0) {
					$timeout(function () {
						Message.show('删除成功！');
					}, 500);
					$scope.isDefault = '';
					User.getBank().then(function (data) {
						angular.forEach(data, function (x) {
							if (x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.bankList = data;
					});
				}
			})
		};
		$scope.submitBankType = function () {
			if (!$scope.isDefault) {
				Message.show('请先添加银行卡！');
				return;
			}
			User.getBank('select', $scope.isDefault);
		}

	})
	.controller('cfmyprojectInfoCtrl', function ($scope, $stateParams, Message, $ionicScrollDelegate, User, $rootScope, crowdF, $ionicLoading) {
		console.log($stateParams);
		$scope.showpay = false;
		$scope.bigImage = false;
		$scope.info = {
			money: '',
			name: '',
			id: $stateParams.itemId
		}
		$scope.iteminfo = {}
		crowdF.getitemInfo($stateParams.itemId).then(function (response) {
			$scope.iteminfo = response.data;
			console.log(response)
		})
		$scope.hideBigImage = function () {
			$scope.bigImage = false;
		}
		$scope.showimg = function (num) {
			//		console.log(num);
			$scope.showimgNum = num;
			$scope.bigImage = true;
		}
		$scope.fill = function () {
			if ($scope.showpay == true) {
				$scope.showpay = false;
			} else {
				$scope.showpay = true;
			}

		}
		$scope.cfsubmit = function () {
			console.log($scope.info);
			crowdF.createOrder($scope.info).then(function () {
				$scope.showpay = false;
			})
		};
		//点击关注
		$scope.followItem = function (id, value) {
			console.log(value);
			crowdF.followItem(id).then(function (response) {
				if (response.code == 0) {
					$scope.iteminfo.isAttention = response.data.atten;
					$scope.iteminfo.attention = response.data.num;
				} else {
					Message.show(response.msg);
				}
				console.log(response);
			})
		}
	})
	.controller('cfpayCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, Message, Payment, $state, $timeout, $interval, User, Order, crowdF) {
		console.log($stateParams);
		$scope.$on("$ionicView.beforeEnter", function () {
			User.getBalance().then(function (response) {
				console.log(response);
				$scope.balance = response.data;
				//			isOpen 0关，1开,2微信，3支付宝
				if ($scope.balance.isOpen == '0') {
					$scope.showrecharge = false;
				} else if ($scope.balance.isOpen == '1') {
					$scope.showrecharge = true;
					$scope.showchoose = 'all';
				} else if ($scope.balance.isOpen == '2') {
					$scope.showrecharge = true;
					$scope.showchoose = 'wechat';
				} else if ($scope.balance.isOpen == '3') {
					$scope.showrecharge = true;
					$scope.showchoose = 'alipay';
				}
			});
		})
		$scope.orderInfo = {
			payid: $stateParams.payid,
			money: $stateParams.money
		}
		$scope.showbalances = false;
		$scope.disshowbalances = false;
		//获取验证码
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.disgetPsd = true;
		$scope.disgetCaptchaSuccess = false;
		$scope.balancepay = {
			userBalance: '',
			disBalance: '',
			payid: '',
			payPrice: '',
			passwords: '',
			code: '',
			//			number: 60,
			dispasswords: '',
			discode: '',
			disnumber: 60
		};
		$scope.number = 60;
		//获取订单信息和余额
		//			crowdF.getpayInfo($stateParams.payid).then(function(response) {
		//				console.log(response);
		//				$scope.balancepay = response;
		//			});
		//判断余额显示
		$timeout(function () {
			$scope.showbalance = function () {
				console.log($scope.balancepay);
				if ($scope.number != 60) {
					Message.show('请等待' + $scope.balancepay.number + 's');
					return
				}
				if ($scope.showbalances == false && $scope.balancepay.userBalance - $scope.balancepay.payPrice < 0) {
					Message.show('可用数量不足');
					return
				} else if ($scope.showbalances == true) {
					$scope.showbalances = false;
				} else {
					$scope.showbalances = true;
					$scope.disshowbalances = false;
					$scope.typeBalance = 'balance';
				}
			}
		}, 100)
		$scope.getCode = function () {
			$scope.number = 60;
			User.getbalancecode().then(function (data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function () {
					if ($scope.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.number = 60;
					} else {
						$scope.number--;
					}
				}, 1000)
			})
		};
		// 选择支付类型
		$scope.payType = 'wechat';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		Message.hidden();
		$ionicModal.fromTemplateUrl('templates/modal/shopsVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function (modal) {
			$scope.shopsVoucher = modal;
		});
		$scope.balanceConfirm = function () {
			Payment.creditPay($scope.balancepay);
		}
		$scope.orderConfirm = function () {
			if ($scope.payType == 'wechat') {
				//noinspection JSUnresolvedVariable
				// if (!window.Wechat) {
				// 	alert("暂不支持微信支付！");
				// 	return false;
				// }
				console.log($scope.orderInfo);
				Payment.wechatPay('welfare', $scope.orderInfo);
			} else if ($scope.payType == 'alipay') {
				console.log($scope.orderInfo);
				crowdF.alipay($stateParams.payid);
			}
		};

	})
	.controller('cfmoneyCtrl', function ($scope, $stateParams, $ionicScrollDelegate, User, $rootScope, crowdF, $ionicLoading) {
		console.log($stateParams);
		//status 0申请筹款 1申请成功 2筹款成功 -4失败
		$scope.relation = $stateParams.relation;
		crowdF.getmoneyList().then(function (response) {
			console.log(response);
			$scope.moneynum = response.data.bala;
			$scope.moneyInfo = response.data.support.concat(response.data.withdraw);
			console.log($scope.moneyInfo);
		})
		$scope.getteamP = function (level) {
			$scope.type = level;
			crowdF.getitemList($scope.type, $scope.relation).then(function (response) {
				console.log(response);
				if (response.code == 0) {
					$scope.empty = false;
					$scope.moneyInfo = response.data.support.concat(response.data.withdraw);
					console.log($scope.itemList);
				} else {
					$scope.empty = true;
					$scope.moneyInfo = response.data.support.concat(response.data.withdraw);
					console.log($scope.itemList);
				}

			})
		}
		//加载更多
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			crowdF.getitemList($scope.type, $scope.relation, $scope.page).then(function (response) {
				$scope.page++;
				var zanshi = response.data.support.concat(response.data.withdraw);
				$scope.moneyInfo = $scope.moneyInfo.concat(zanshi);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 1) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多了！',
						duration: '1200'
					});
				}
			});
		};
	})
	.controller('cfrepoCtrl', function ($scope, Message, User, crowdF, $state, $ionicPopup) {
		$scope.repoInfo = {
			money: '',
			bankid: '',
			num: ''
		};
		crowdF.repolist().then(function (response) {
			console.log(response);
			$scope.repoInfo.money = response.data;
		})
		User.getRepo().then(function (data) {
			$scope.bankinfo = data.bank;
			$scope.repoInfo.bankid = data.bank.id;
			console.log($scope.bankinfo);
		});
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			if (!$scope.repoInfo.num) {
				Message.show('请输入提现金额！');
				return;
			}
			//			if($scope.repoInfo.bean > $scope.repoInfo.beanNum) {
			//				Message.show('余额不足！');
			//				return;
			//			}
			console.log($scope.repoInfo);
			crowdF.repolist('type', $scope.repoInfo).then(function (response) {
				if (response.code == 0) {
					$state.go('cdF.cf-money');
				} else if (response.code == 1) {
					var confirmPopup = $ionicPopup.confirm({
						ftitle: '提示',
						template: '您还没有实名，请前去认证',
						okText: '去认证',
						cancelText: '取消'
					});
					confirmPopup.then(function (res) {
						if (res) {
							$state.go('user.identifyname');
						} else {
							$ionicHistory.goBack()
						}
					});
				} else {
					Message.show(response.msg);
				}
			});
		}
	})
	// 夺宝
	.controller("dbHomeCtrl", function ($scope, $timeout, DB, Message, $interval) {
		$scope.timestamp = Date.parse(new Date());
		$scope.info = {
			banner: "",
			cate: "",
			goodsList: "",
			jiexiao: ''
		};

		$scope.countdown = function (revealArr) {
			$interval(function () {
				revealArr.forEach(function (ele) {

					var nowTime = new Date();
					var endTime = new Date(ele.endtime * 1000);

					ele.shijiancha = endTime.getTime() - nowTime.getTime();
					//   console.log('ele.shijiancha: ', ele.shijiancha);

					ele.hour = Math.floor(ele.shijiancha / 1000 / 60 / 60 % 24);
					ele.min = Math.floor(ele.shijiancha / 1000 / 60 % 60);
					ele.sec = Math.floor(ele.shijiancha / 1000 % 60);

					if (ele.hour < 10) {
						ele.hour = "0" + ele.hour;
					}
					if (ele.min < 10) {
						ele.min = "0" + ele.min;
					}
					if (ele.sec < 10) {
						ele.sec = "0" + ele.sec;
					}

				})

			}, 1000)
		}
		$scope.type = "fast";
		$scope.active = function (type) {
			$scope.type = type;
			$scope.page = 2;
			$scope.noMore = true;
			DB.getHomeList($scope.type, '', '').then(function (res) {
				$scope.info.goodsList = res.data.goodses;

				$timeout(function () {
					$scope.noMore = false;
				}, 1000);
			});
		};

		$scope.submit = function (type, period_number) {
			DB.buy(period_number, type).then(function (res) {
				if (type == "buy") {
					$state.go("db.cart");
				} else if (type == "add") {
					Message.show(res.msg);
				}
			});
		};
		DB.homeFirst();
		DB.getHome().then(function (res) {
			$scope.info.banner = res.data.advs;
			$scope.info.cate = res.data.navs;
			$scope.info.jiexiao = res.data.jiexiao;
			console.log('$scope.info.jiexiao: ', $scope.info.jiexiao);

			if ($scope.info.banner) {
				$timeout(function () {
					var swiper = new Swiper(".swiper-container1", {
						autoplay: 4000,
						loop: true,
						followFinger: false,
						pagination: ".swiper-pagination"
					});
				}, 0);
			}
			if ($scope.info.jiexiao.length > 0) {
				$scope.countdown($scope.info.jiexiao)

			}

		});
		DB.getHomeList($scope.type, '', '').then(function (res) {
			$scope.info.goodsList = res.data.goodses;
		});
	})
	.controller("dbGoodsListCtrl", function ($scope, DB, $timeout, $ionicLoading, Message, $stateParams) {
		console.log($stateParams.cateId)
		$scope.cateId = $stateParams.cateId || ""
		$scope.search = {
			keywords: ''
		}
		$scope.info = {
			goodsList: '',
			categorys: ''
		}
		$scope.type = "fast";
		$scope.active = function (type) {
			$scope.type = type;
			$scope.page = 2;
			$scope.noMore = true;
			DB.getHomeList($scope.type, $scope.type, $scope.cateId, $scope.search.keywords).then(function (res) {
				$timeout(function () {
					$scope.noMore = false;
				}, 1000);
			});
		};
		$scope.getCate = function (id) {
			$scope.cateId = id;
			$scope.page = 2;
			$scope.noMore = true;
			DB.getHomeList($scope.type, $scope.cateId, $scope.search.keywords).then(function (res) {
				$scope.info.goodsList = res.data.goodses;
				$timeout(function () {
					$scope.noMore = false;
				}, 1000);
			});
		}
		$scope.goSearch = function () {
			$scope.cateId = ''
			DB.getHomeList($scope.type, $scope.cateId, $scope.search.keywords).then(function (res) {
				$scope.info.goodsList = res.data.goodses;
				$timeout(function () {
					$scope.noMore = false;
				}, 1000);
			});
		}
		$scope.submit = function (type, period_number) {
			DB.buy(period_number, type).then(function (res) {
				if (type == "buy") {
					$state.go("db.cart");
				} else if (type == "add") {
					Message.show(res.msg);
				}
			});
		};
		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;
			DB.getHomeList($scope.type, $scope.cateId, $scope.search.keywords).then(function (res) {
				$scope.info.goodsList = res.data.goodses;
				$scope.info.categorys = res.data.categorys;
				$scope.$broadcast('scroll.refreshComplete')
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功!',
					duration: '2000'
				})
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})
		}
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			DB.getHomeList($scope.type, $scope.cateId, $scope.search.keywords, $scope.page).then(function (res) {
				$scope.page++;
				$scope.info.goodsList = $scope.info.goodsList.concat(res.data.goodses)
				// $scope.info.=$scope.list.concat(res.data);
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了！",
						duration: "1200"
					});
					$scope.noMore = true;
				}
			});
		};
		DB.getHomeList($scope.type, $scope.cateId, $scope.search.keywords).then(function (res) {
			$scope.info.goodsList = res.data.goodses;
			$scope.info.categorys = res.data.categorys;
			console.log(' $scope.info.categorys: ', $scope.info.categorys);
			console.log($scope.info.categorys)
		});

	})
	.controller("dbLastRevealCtrl", function ($scope, $stateParams, DB, $ionicLoading, Message, $timeout) {
		$scope.orderEmpty = false;
		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;
			DB.getLastReveal().then(function (res) {
				$scope.list = res.data;
				if (res.data.length == 0 || res.data == '') {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
				$scope.$broadcast('scroll.refreshComplete')
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功!',
					duration: '2000'
				})
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})
		}
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			DB.getLastReveal($scope.page).then(function (res) {
				$scope.page++;
				$scope.list = $scope.list.concat(res.data);
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了！",
						duration: "1200"
					});
					$scope.noMore = true;
				}
			});
		};

		DB.getLastReveal().then(function (res) {
			$scope.list = res.data;
			if (res.data.length == 0 || res.data == '') {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
		})

	})
	.controller("dbUserCenterCtrl", function ($scope, DB, $ionicLoading, Message) {

		$scope.doRefresh = function () {
			DB.getUserCenter().then(function (res) {
				$scope.info = res.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新完成!',
					duration: '2000'
				})
			})
		}

		DB.getUserCenter().then(function (res) {
			$scope.info = res.data;
		})

	})
	.controller("dbGoodsInfoCtrl", function (
		$scope,
		$stateParams,
		DB,
		$state,
		$timeout,
		Message
	) {
		$scope.goodsId = $stateParams.goodsId;
		$scope.info = {};
		$scope.submit = function (type) {
			DB.buy($scope.info.periodInfo.period_number, type).then(function (res) {
				if (type == "buy") {
					$state.go("db.cart");
				} else if (type == "add") {
					Message.show(res.msg, 1500);
				}
			});
		};
		DB.goodsDetail($scope.goodsId).then(function (res) {
			$scope.info = res.data;
			console.log($scope.info.periodInfo.status);
			$scope.info.finalCode = ''
			$scope.info.myallcodes.forEach(function (ele) {
				$scope.info.finalCode += (ele + ' ')

			})

			console.log('$scope.info.finalCode: ', $scope.info.finalCode);
		});
	})
	.controller("dbGoodsDetailCtrl", function ($scope, $stateParams, DB) {
		$scope.goodsId = $stateParams.goodsId;
		$scope.info = {};
		DB.goodsDetail($scope.goodsId).then(function (res) {
			$scope.info = res.data;
		});
	})
	.controller("dbCartCtrl", function ($scope, DB, Message, $ionicPopup, $ionicLoading, $state) {
		$scope.list = "";

		$scope.getTotal = function () {
			$scope.totalPrice = 0;
			$scope.list.forEach(function (ele, index) {

				$scope.totalPrice += ele.onePrice * ele.num;
			});
		};
		$scope.edit = function (id, type, index, num) {
			if (type == "up") {
				DB.cartEdit(id, type).then(function (res) {
					$scope.list[index].num++;
					$scope.getTotal();
				});
			} else if (type == "down") {
				DB.cartEdit(id, type).then(function (res) {
					$scope.list[index].num--;
					$scope.getTotal();
				});
			} else if (type == "input") {
				if (num) {
					if (num <= 0) {
						Message.show("最少买一件");
						num = 1;
						DB.cartEdit(id, type, num).then(
							function (res) {
								$scope.list[index].num = num;
								$scope.getTotal();
							},
							function (res) {
								$scope.list[index].num = num;
								$scope.getTotal();
							}
						);
					} else if (num > $scope.list[index].shengyu) {
						num = $scope.list[index].shengyu;
						DB.cartEdit(id, type, num).then(
							function (res) {
								$scope.list[index].num = num;
								$scope.getTotal();
							},
							function () {
								$scope.list[index].num = num;
								$scope.getTotal();
							}
						);
					}
					DB.cartEdit(id, type, num).then(
						function (res) {
							$scope.list[index].num = num;
							$scope.getTotal();
						},
						function (res) {
							$scope.list[index].num = num;
							$scope.getTotal();
						}
					);
				} else {
					num = 1;
					DB.cartEdit(id, type, num).then(
						function (res) {
							$scope.list[index].num = num;
							$scope.getTotal();
						},
						function (res) {
							$scope.list[index].num = num;
							$scope.getTotal();
						}
					);
				}
			}
		};
		$scope.delCart = function (id) {
			$ionicPopup.confirm({
				template: "确定删除该商品吗？",
				buttons: [{
					text: "取消",
					onTap: function () {
						return false;
					}
				},
				{
					text: "确定",
					type: "button-calm",
					onTap: function () {
						DB.delCart(id).then(function (res) {
							DB.cartList().then(function (res) {
								$scope.list = res.data.list;
								$scope.totalPrice = res.data.totalPrice;
								$scope.totalGoods = res.data.totalGoods;
							});
						});
					}
				}
				]
			});
		};
		$scope.submit = function () {
			DB.subCart().then(function (res) {
				$state.go('dbson.createOrder', {
					list: res.data.list,
					payid: res.data.payid,
					totalPrice: $scope.totalPrice,
					balance: res.data.balance
				})
			})
		}
		$scope.doRefresh = function () {
			DB.cartList().then(function (res) {
				$scope.list = res.data.list;
				$scope.totalPrice = res.data.totalPrice;
				$scope.totalGoods = res.data.totalGoods;
				$scope.$broadcast('scroll.refreshComplete')
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功',
					duration: '1500'
				})
			});
		}
		DB.cartList().then(function (res) {
			$scope.list = res.data.list;
			$scope.totalPrice = res.data.totalPrice;
			$scope.totalGoods = res.data.totalGoods;
		});
	})
	.controller("dbCreateOrderCtrl", function ($scope, $stateParams, DB) {
		$scope.info = {
			list: '',
			payid: '',
			balance: ''
		}
		$scope.info.list = $stateParams.list;
		$scope.info.balance = $stateParams.balance
		$scope.info.payid = $stateParams.payid
		$scope.payWay = "balance";
		$scope.totalPrice = $stateParams.totalPrice
		console.log(' $scope.info ', $scope.info);

		// $scope.info.list.forEach(function(ele,index){
		//   console.log(ele)
		//   $scope.totalPrice += ele.num * ele.onePrice
		//   console.log('ele.num * ele.onePrice: ', ele.num * ele.onePrice);

		// })
		$scope.active = function (payWay) {
			console.log('active')
			$scope.payWay = payWay;
		};

		$scope.submit = function () {
			if ($scope.payWay == 'weChat') {
				DB.payWeChat($scope.info.payid, $scope.totalPrice).then(function (res) { })
			} else if ($scope.payWay == 'balance') {
				DB.payBalance($scope.info.payid, $scope.totalPrice).then(function (res) { })
			}
		}
	})
	.controller('dbPaySuccessCtrl', function ($scope) {

	})
	.controller('dbUserRecCtrl', function ($scope, DB, $ionicLoading, Message, $timeout) {
		$scope.status = '0'
		$scope.orderEmpty = false;
		$scope.timestamp = Date.parse(new Date());
		console.log('$scope.timestamp: ', $scope.timestamp);
		$scope.myCode = function (count, finalCode, title) {

			layer.open({
				title: '我的号码',
				content: '<div>' + title + '</div><div>参与夺宝<span style="color:red">' + count + '</span>人次，我的号码</div><div style="width:60vw">' + finalCode + '</div>'
			});
			// layer.open({
			//   type: 1, 
			//   content: '传入任意的文本或html' //这里content是一个普通的String
			// });
		}

		$scope.active = function (status) {
			$scope.status = status;
			$scope.noMore = true;
			$scope.page = 2;
			DB.getUserDBRec($scope.status).then(function (res) {
				$scope.list = res.data;
				if (res.data.length == 0 || res.data == '') {
					$scope.orderEmpty = true;
				} else {
					$scope.list.forEach(function (ele1, index) {
						ele1.finalCode = ''
						ele1.mycode.forEach(function (ele2, item) {
							ele1.finalCode += (ele2 + ' ')
						})
					})
					$scope.orderEmpty = false;
				}
			})
		}
		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;
			DB.getUserDBRec($scope.status).then(function (res) {
				$scope.list = res.data;
				if (res.data.length == 0 || res.data == '') {
					$scope.orderEmpty = true;
				} else {
					$scope.list.forEach(function (ele1, index) {
						ele1.finalCode = ''
						ele1.mycode.forEach(function (ele2, item) {
							ele1.finalCode += (ele2 + ' ')
						})
					})
					$scope.orderEmpty = false;
				}
				$scope.$broadcast('scroll.refreshComplete')
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功!',
					duration: '2000'
				})
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})
		}
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			DB.getUserDBRec($scope.status, $scope.page).then(function (res) {
				$scope.page++;
				$scope.list = $scope.list.concat(res.data);
				$scope.list.forEach(function (ele1, index) {
					ele1.finalCode = ''
					ele1.mycode.forEach(function (ele2, item) {
						ele1.finalCode += (ele2 + ' ')
					})
				})
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了！",
						duration: "1200"
					});
					$scope.noMore = true;
				}
			});
		};

		DB.getUserDBRec($scope.status).then(function (res) {
			$scope.list = res.data;
			if (res.data.length == 0 || res.data == '') {
				$scope.orderEmpty = true;
			} else {
				$scope.list.forEach(function (ele1, index) {
					ele1.finalCode = ''
					ele1.mycode.forEach(function (ele2, item) {
						ele1.finalCode += (ele2 + ' ')
					})
				})
				$scope.orderEmpty = false;
			}
		})
	})
	.controller('dbAwardRecCtrl', function ($scope, DB, $ionicLoading, Message, $timeout, $state) {
		$scope.orderEmpty = false;
		$scope.awardStatus = {
			'3': '待确认收货地址',
			'4': '待发货',
			'5': '待收货',
			'6': '已完成'
		}
		$scope.goGoodsInfo = function (goodsId, $event) {
			console.log('goodsId: ', goodsId);

			$event.stopPropagation();

			$state.go('dbson.goodsInfo', {
				goodsId: goodsId
			})
		}
		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;
			DB.getAwardRec().then(function (res) {
				$scope.list = res.data;
				if (res.data.length == 0 || res.data == '') {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
				$scope.$broadcast('scroll.refreshComplete')
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功!',
					duration: '2000'
				})
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})
		}
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			DB.getAwardRec()($scope.page).then(function (res) {
				$scope.page++;
				$scope.list = $scope.list.concat(res.data);
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了！",
						duration: "1200"
					});
					$scope.noMore = true;
				}
			});
		};

		DB.getAwardRec().then(function (res) {
			$scope.list = res.data;
			if (res.data.length == 0 || res.data == '') {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
		})
	})
	.controller('dbAwardRecDCtrl', function ($scope, DB, $ionicLoading, Message, $timeout, $stateParams, Storage, $state) {
		$scope.id = $stateParams.id;
		$scope.selectedAdd = $stateParams.selectedAdd;
		console.log('  $scope.selectedAdd : ', $scope.selectedAdd);
		$scope.awardStatus = {
			'3': '待确认收货地址',
			'4': '待发货',
			'5': '待收货',
			'6': '已完成'
		}
		$scope.info = {
			defaultAddress: {},
			goods: '',
			info: ''
		}
		if (!$scope.id) {
			$scope.id = Storage.get('awardId')
		}

		$scope.chooseAdd = function () {

			Storage.set('awardId', $scope.id);
			$state.go('goods.orderAddress', {
				from: 'db'
			})
		}
		$scope.sureAddress = function () {
			DB.sureAddress($scope.id, $scope.info).then(function (res) {

				Message.show(res.msg, 1500)
				$timeout(function () {
					$state.go('dbson.awardRec')
				}, 1500)

			})
		}
		$scope.sureReceive = function () {
			DB.sureReceive($scope.id).then(function (res) {
				Message.show(res.msg, 1500)
				$timeout(function () {
					$state.go('dbson.awardRec')
				}, 1500)
			})
		}

		DB.getAwardRecD($scope.id).then(function (res) {
			$scope.info.defaultAddress = res.data.defaultAddress || {};
			$scope.info.goods = res.data.goods;
			$scope.info.info = res.data.info;

			if ($scope.selectedAdd) {
				$scope.info.defaultAddress.username = $scope.selectedAdd.username
				console.log(' $scope.info.defaultAddress.username: ', $scope.info.defaultAddress.username);
				$scope.info.defaultAddress.mobile = $scope.selectedAdd.mobile
				$scope.info.defaultAddress.birth = $scope.selectedAdd.birth
				$scope.info.defaultAddress.address = $scope.selectedAdd.address;
				console.log('$scope.info.defaultAddress: ', $scope.info.defaultAddress);

			}

		})

	})

	.controller("dbLastRevealDCtrl", function (
		$scope,
		$stateParams,
		DB,
		$state,
		$timeout,
		Message
	) {
		$scope.periodId = $stateParams.periodId;
		console.log('$scope.periodId: ', $scope.periodId);
		$scope.info = {};
		$scope.submit = function (type) {
			DB.buy($scope.info.periodInfo.period_number, type).then(function (res) {
				if (type == "buy") {
					$state.go("db.cart");
				} else if (type == "add") {
					Message.show(res.msg, 1500);
				}
			});
		};
		DB.goodsDetail($scope.periodId, 'reveal').then(function (res) {
			$scope.info = res.data;
			$scope.info.finalCode = ''
			$scope.info.myallcodes.forEach(function (ele) {
				$scope.info.finalCode += (ele + ' ')

			})

			console.log('$scope.info.finalCode: ', $scope.info.finalCode);
		});
	})

	.controller('turntableCtrl', function ($scope, $rootScope, Message, Game, $timeout, $state) {

		var opts;
		var container;
		var btn;
		$scope.deg = 0;
		$scope.prizes = ''
		$scope.num;
		angular.element(document).ready(function () {
			btn = $('#gb-turntable-btn');
			container = $('#gb-turntable-container');

			$scope.prizes = ['1元红包', '2元红包', '3元红包', '4元红包', '5元红包', '6元红包'];

			console.log('$scope.num : ', $scope.num);

			container.bind("transitionend", function () {

				$scope.times--
				Message.show('恭喜您获得' + $scope.choosenPrice.title);
				if ($scope.times > 0 || $scope.times < 0) {
					btn.removeClass('disabled');
				} else if ($scope.times == 0) {
					btn.addClass('disabled');
				}

				$state.go('user.turntableAward')

			})

			// btn.addEventListener('transitionend',  function () {
			// 	console.log('我转弯了')
			// }, false);

			$scope.draw = function (opts) {
				var opts = opts || {};

				var ele = $('#turntable'),

					rotateDeg = 360 / $scope.num / 2 + 90, // 扇形回转角度
					ctx,
					prizeItems = document.createElement('ul'), // 奖项容器
					turnNum = 1 / $scope.num, // 文字旋转 turn 值
					html = []; // 奖项

				var canvas = document.getElementById("myCanvas");
				var ctx = canvas.getContext("2d");
				var container = $('.gb-turntable-container')[0];
				var btn = $('.gb-turntable-btn');
				if (!canvas.getContext) {
					Message.show('抱歉！该手机不支持。');
					return;
				}

				for (var i = 0; i < $scope.num; i++) {

					// 保存当前状态
					ctx.save();
					// 开始一条新路径
					ctx.beginPath();
					// 位移到圆心，下面需要围绕圆心旋转
					ctx.translate(150, 150);
					// 从(0, 0)坐标开始定义一条新的子路径
					ctx.moveTo(0, 0);
					// 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
					ctx.rotate((360 / $scope.num * i - rotateDeg) * Math.PI / 180);
					// 绘制圆弧
					ctx.arc(0, 0, 150, 0, 2 * Math.PI / $scope.num, false);

					// 颜色间隔
					if (i % 2 == 0) {
						ctx.fillStyle = '#ffb820';
					} else {
						ctx.fillStyle = '#ffcb3f';
					}

					// 填充扇形
					ctx.fill();
					// 绘制边框
					ctx.lineWidth = 0.5;
					ctx.strokeStyle = '#e4370e';
					ctx.stroke();

					// 恢复前一个状态
					ctx.restore();

					console.log('prize', $scope.prizes)
					// 奖项列表
					html.push('<li class="gb-turntable-item"> <span style="transform: rotate(' + i * turnNum + 'turn)"><i>' + $scope.prizes[i].title + '<i><br/><img src="' + $scope.prizes[i].thumb + '" style="width:50px;height:50px;"></span> </li>');
					if ((i + 1) === $scope.num) {
						prizeItems.className = 'gb-turntalbe-list';
						container.appendChild(prizeItems);
						prizeItems.innerHTML = html.join('');
					}

				}

			}

		})

		$scope.getPrize = function () {
			Game.turntableDraw().then(function (res) {
				$scope.priceId = res.data;
				$scope.prizes.forEach(function (ele, index) {
					if (ele.id == $scope.priceId) {
						$scope.choosenPrice = ele
						$scope.choosenIndex = parseInt(index);
						console.log('$scope.choosenIndex: ', $scope.choosenIndex);

						btn.addClass('disabled');
						$scope.deg = $scope.deg || 0;
						$scope.deg = $scope.deg + (360 - $scope.deg % 360) + (360 * 10 - $scope.choosenIndex * (360 / $scope.num))
						$scope.runRotate($scope.deg);
					}
				})
			})

		}
		$scope.runRotate = function (deg) {
			console.log('deg: ', deg);
			container = $('#gb-turntable-container');
			console.log('container: ', container);
			// container.style[transform] = 'rotate(' + deg + 'deg)';
			container.css("transform", "rotate(" + deg + "deg)")

		}

		Game.getGameInfo().then(function (res) {
			$scope.prizes = res.data.list;
			console.log('$scope.prizes: ', $scope.prizes);
			$scope.num = $scope.prizes.length;
			$scope.times = res.data.times;
			$scope.config = res.data.config
			if ($scope.config.thumb) {
				$('.turntable_wrapper').css('background-image', "url('" + $scope.config.thumb + "')")
			}
			if ($scope.config.info) {
				$('#turntable_intro').html($scope.config.info)
			}
			$timeout(function () {
				$scope.draw(opts);
			})

		})

	})

	.controller('turntableAwardCtrl', function ($scope, $rootScope, Message, Game, $timeout, $ionicLoading) {
		$scope.orderEmpty = false;
		Game.turntableAward().then(function (res) {
			$scope.list = res.data
			console.log('res.data.length: ', res.data.length);
			if (res.data.length == 0) {
				$scope.orderEmpty = true
			} else {
				$scope.orderEmpty = false;
			}
		})

		$scope.doRefresh = function () {
			$scope.page = 2;
			$scope.noMore = true;
			Game.turntableAward().then(function (res) {
				$scope.list = res.data

				if (res.data.length == 0) {

					$scope.orderEmpty = true
				} else {
					$scope.orderEmpty = false;
				}
				$scope.$broadcast("scroll.refreshComplete");
				$ionicLoading.show({
					noBackdrop: true,
					template: "刷新成功",
					duration: "1500"
				});
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})

			$scope.page = 2
			$scope.loadMore = function () {
				Game.turntableAward().then(function (res) {

					$scope.page++;
					$scope.list = $scope.list.concat(res.data)

					$scope.$broadcast("scroll.infiniteScrollComplete");
					if (res.code == 0 && res.data.length == 0) {
						$ionicLoading.show({
							noBackdrop: true,
							template: "没有更多了",
							duration: "1500"
						});
						$scope.noMore = true;
					}

				})
			}
		}
	})
	.controller('qianDaoCtrl', function ($scope, User, $rootScope, Storage, Message, $timeout, $ionicHistory, $state) {
		$scope.dateArr = []
		console.log($rootScope.globalInfo.user);
		User.qianDaoDate(Storage.get('user').uid).then(function (res) {
			$scope.list = res.data;

			$scope.list.forEach(function (ele, index) {
				var obj = {};
				obj["signDay"] = ele.create_time;
				$scope.dateArr.push(obj)

			})
			// angular.element(document).ready(function () {
			// $scope.$on('$ionicView.afterEnter',function(){
			// 	console.log('sss')
			$timeout(function () {
				var token = Storage.get('user').token
				var signList = $scope.dateArr;
				calUtil.init(signList, '', {
					'token': token,
					'uid': Storage.get('user').uid
				}, function (res) {
					Message.show(res.msg, 2000)
				}, function (res) {
					console.log(res.msg)
					Message.show(res.msg, 2000)
				});
			}, 0)

			// })
			// })
		})
		//			 $scope.$on('$ionicView.loaded',function(){
		//			 		$scope.dateArr = []
		//		User.qianDaoDate().then(function (res) {
		//			$scope.list = res.data;
		//
		//			$scope.list.forEach(function (ele, index) {
		//				var obj = {};
		//				obj["signDay"] = ele.create_time;
		//				$scope.dateArr.push(obj)
		//
		//			})
		//
		//				$timeout(function(){
		//                     var token = Storage.get('user').token
		//				var signList = $scope.dateArr;
		//				calUtil.init(signList, '', token, function (res) {
		//					Message.show(res.msg, 2000)
		//				}, function (res) {
		//					console.log(res.msg)
		//					Message.show(res.msg, 2000)
		//				});
		//				},0)
		//		
		//		})
		//			 	})
		//		 $scope.$on("$ionicView.beforeEnter", function(){
		//		 	console.log('456'+$state.current.name)
		//		 	
		//		 	$ionicHistory.clearCache([$state.current.name])
		//
		//		 })

	})
	.controller('redPacketCtrl', function ($scope, Order, $stateParams, Message, $timeout, $state) {
		$scope.payid = $stateParams.payid;
		$scope.sum = ''
		Order.getRedPacket($scope.payid).then(function (res) {
			$scope.sum = res.data
		})

		$scope.submit = function () {
			Order.getRedPacket($scope.payid, 'save').then(function (res) {

				Message.show(res.msg, 2000)
				$timeout(function () {
					$state.go('tab.tcmytc')
				}, 2000)
			})
		}

	})

	// 跨镜电商商品列表
	.controller('acrossGoodsListCtrl', function ($rootScope, $ionicLoading, $scope, $stateParams, $cordovaGeolocation, $ionicScrollDelegate, Home, Shop, Message, $timeout, Good) {
		console.log($stateParams);
		$scope.goodsList = {};
		$scope.types = $stateParams.types;
		$scope.showtypes = '1';
		$scope.keywords = '';
		$scope.empty = false;
		Good.getAcrossGoodsList($scope.showtypes, $scope.keywords).then(function (response) {
			console.log(response);
			if (response.code == 1) {
				$scope.empty = true;
				return
			}
			$scope.goodsList = response.data;
		});
		$scope.searchgoods = function () {
			$scope.keywords = $('.onlineshops-serch input').val();
			console.log($scope.keywords);
			Good.getAcrossGoodsList($scope.showtypes, $scope.keywords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodsList = response.data;
					return;
				}
				$scope.empty = false;
				$scope.goodsList = response.data;
			});
		};
		$scope.showchoo = function (showtypes) {
			$scope.showtypes = showtypes;
			$('.onlineshops-serch dd ').children().removeClass('red');
			$('.onlineshops-serch dd a').children().removeClass('red');
			$('.onlineshops-serch dd a b').children().removeClass('red');
			$('#' + showtypes).addClass('red');
			Good.getAcrossGoodsList($scope.showtypes, $scope.keywords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodsList = response.data;
					return;
				}
				$scope.empty = false;
				$scope.goodsList = response.data;
			});
		};
		$scope.showchoo1 = function () {
			if ($scope.showtypes == '3') {
				$scope.showtypes = 4;
				$('.priceshow  b i:nth-child(2n)').addClass('red');
				$('.priceshow  b i:nth-child(2n+1)').removeClass('red');
			} else if ($scope.showtypes == '4') {
				$scope.showtypes = 3;
				$('.priceshow  b i:nth-child(2n)').removeClass('red');
				$('.priceshow  b i:nth-child(2n+1)').addClass('red');
			} else {
				$scope.showtypes = 3;
				$('.onlineshops-serch dd ').children().removeClass('red');
				$('.onlineshops-serch dd a').children().removeClass('red');
				$('.onlineshops-serch dd a b').children().removeClass('red');
				$('.priceshow span').addClass('red');
				$('.priceshow  b i:first').addClass('red');
			}
			Good.getAcrossGoodsList($scope.showtypes, $scope.keywords).then(function (response) {
				console.log(response.data);
				if (response.code == 1) {
					$scope.empty = true;
					$scope.goodsList = response.data;
					return;
				}
				$scope.empty = false;
				$scope.goodsList = response.data;
			});
		};
		$scope.levleName = {
			1: '',
			2: '品牌店'
		};
		//	 下拉加载更多列表
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Good.getAcrossGoodsList($scope.showtypes, $scope.keywords, $scope.page).then(function (response) {
				$scope.page++;
				$scope.goodsList = $scope.goodsList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 1) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多订单了！',
						duration: '1200'
					});
				}
			});

		};
	})
	// 赠品券
	.controller('whiteIntegralCtrl', function ($scope, User, Message, $ionicLoading, $timeout) {

		$scope.info = ''
		User.getWhiteIntegral().then(function (res) {
			$scope.info = res.data
		})
		// 刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;

			User.getWhiteIntegral().then(function (res) {
				$scope.info = res.data
				$scope.$broadcast("scroll.refreshComplete");
				$ionicLoading.show({
					noBackdrop: true,
					template: "刷新成功",
					duration: "1500"
				});
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})
		}
		// 加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.getWhiteIntegral($scope.page).then(function (res) {
				$scope.info.list = $scope.info.list.concat(res.data.list)
				$scope.page++;
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.code == 0 && res.data.list.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})
		}
	})

	// 历史数据

	.controller('historyDataCtrl', function ($scope, User, Message) {
		$scope.list = {}
		User.getHistoryData().then(function (res) {

			$scope.list = res.data

			$scope.list.forEach(function (ele, index, arr) {
				if (index == 0) {
					$scope.info = ele
				}
			})

			$scope.list = res.data
		})

	})

	.controller('historyDataDCtrl', function ($scope, User, Message, $stateParams) {
		$scope.list = '';
		$scope.title = $stateParams.title;
		$scope.type = $stateParams.type;
		console.log($scope.type)
		User.getHistoryData().then(function (res) {

			$scope.list = res.data

		})
	})
	// 代理余额明细和代理优惠券明细
	.controller('agentBalanceListCtrl', function ($scope, User, Message, $stateParams) {

		$scope.level = $stateParams.level;
		$scope.agentId = $stateParams.agentId;
		$scope.levelClass = $stateParams.levelClass;
		User.getAgentBalanceList($scope.agentId, $scope.levelClass).then(function (res) {
			$scope.list = res.data
		})

		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;
			User.getAgentBalanceList($scope.agentId, $scope.levelClass).then(function (res) {
				$scope.list = res.data
				$scope.$broadcast("scroll.refreshComplete");
				$ionicLoading.show({
					noBackdrop: true,
					template: "刷新成功",
					duration: "1500"
				});
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)
			})

		}

		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {

			User.getAgentBalanceList($scope.agentId, $scope.levelClass, $scope.page).then(function (res) {
				$scope.list = $scope.list.concat(res.data)
				$scope.page++;
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.code == 0 && res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})

		}

	})
	// 代理提现记录
	.controller('agentWithDrawListCtrl', function ($scope, User, Message, $stateParams, $ionicLoading, $timeout) {

		$scope.select = '1'
		$scope.agentId = $stateParams.agentId;
		$scope.selectS = function (select) {
			$scope.select = select;
			User.agentWithDrawList($scope.select, $scope.agentId).then(function (res) {
				$scope.list = res.data
			})
		}
		// 解冻
		$scope.release = function (id) {
			User.agentWithDrawRelease(id).then(function (res) {
				$scope.selectS('1')
			})
		}

		// 刷新
		$scope.doRefresh = function () {
			$scope.noMore = true;
			$scope.page = 2;
			User.agentWithDrawList($scope.select, $scope.agentId).then(function (res) {
				$scope.list = res.data

				$scope.$broadcast("scroll.refreshComplete");
				$ionicLoading.show({
					noBackdrop: true,
					template: "刷新成功",
					duration: "1500"
				});
				$timeout(function () {
					$scope.noMore = false;
				}, 1000)

			})

		}
		// 加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {

			User.agentWithDrawList($scope.select, $scope.agentId, $scope.page).then(function (res) {
				$scope.page++;
				$scope.list = $scope.lis.concat(res.data)

				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.code == 0 && res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})

		}

		User.agentWithDrawList($scope.select, $scope.agentId).then(function (res) {
			$scope.list = res.data
		})

	})
	.controller('balanceOutCtrl', function ($scope, Message, User) {
		$scope.info = {
			//				passwords: '',
			userMobile: '',
			num: '',
			userBalance: '',
			fee_rate: ''
		};
		User.balanceOut().then(function (data) {
			$scope.info.userBalance = data.userBalance;
			$scope.info.fee_rate = data.fee_rate;
			console.log($scope.info);
		});
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			if (!$scope.info.userMobile) {
				Message.show('请输入对方账户！');
				return;
			}
			//				if($scope.info.bean > $scope.info.num) {
			//					Message.show('余额不足！');
			//					return;
			//				}
			if (!$scope.info.num) {
				Message.show('请输入转账金额！');
				return;
			}
			User.balanceOut($scope.info, 'type');
		}
	})
	.controller('balanceOutRecordCtrl', function ($scope, User, Message, $ionicLoading, $timeout) {

		$scope.info = ''
		User.balanceExList().then(function (res) {
			console.log(res)
			$scope.info = res.data
		})
		// 刷新
		//		$scope.doRefresh = function() {
		//			$scope.noMore = true;
		//			$scope.page = 2;
		//
		//			User.balanceExList().then(function(res) {
		//				$scope.info = res.data
		//				$scope.$broadcast("scroll.refreshComplete");
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: "刷新成功",
		//					duration: "1500"
		//				});
		//				$timeout(function() {
		//					$scope.noMore = false;
		//				}, 1000)
		//			})
		//
		//		}

		// 加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {

			User.balanceExList($scope.page).then(function (res) {
				$scope.info = $scope.info.concat(res.data)
				$scope.page++;
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.code == 1 && res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})

		}

	})

	.controller('costbalanceRechargeCtrl', function ($scope, Message, Payment, $ionicActionSheet) {
		$scope.info = {
			num: ''
		};
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			if (!$scope.info.num) {
				Message.show('请输入数量！');
				return;
			}

			$ionicActionSheet.show({
				buttons: [{
					text: '支付宝',

				}, {
					text: "微信"
				}],
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						Payment.voucherRecharge($scope.info, 'alipay');
					} else if (index == 1) {
						Payment.voucherRecharge($scope.info, 'wechatpay');
					}
					return true;
				}
			})

		}
	})

	.controller('voucherUsefulListCtrl', function ($scope, Message, User) {
		User.usefulVoucherList().then(function (res) {
			if (res.code == 0) {
				$scope.info = res.data;
			} else {
				Message.show(res.msg)
			}

		});
	})
	.controller('costbalanceOutCtrl', function ($scope, Message, User) {
		$scope.info = {
			//				passwords: '',
			userMobile: '',
			num: '',
			disBalance: '',
			fee_rate: ''
		};
		User.disDalanceOut().then(function (data) {
			$scope.info.disBalance = data.disBalance;
			$scope.info.fee_rate = data.fee_rate;
			console.log($scope.info);
		});
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			if (!$scope.info.userMobile) {
				Message.show('请输入对方账户！');
				return;
			}
			//				if($scope.info.bean > $scope.info.num) {
			//					Message.show('余额不足！');
			//					return;
			//				}
			if (!$scope.info.num) {
				Message.show('请输入转账金额！');
				return;
			}
			User.disDalanceOut($scope.info, 'type');
		}
	})
	.controller('costbalanceOutRecordCtrl', function ($scope, User, Message, $ionicLoading, $timeout) {

		$scope.info = ''
		User.disBalanceExList().then(function (res) {
			$scope.info = res.data
		})

		// 加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {

			User.disBalanceExList($scope.page).then(function (res) {
				$scope.info = $scope.info.concat(res.data)
				$scope.page++;
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.code == 1 && res.data == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})

		}

	})
	.controller('redIntegralOutCtrl', function ($scope, Message, User) {
		$scope.info = {
			//				passwords: '',
			userMobile: '',
			num: '',
			redIntegral: '',
			fee_rate: ''
		};
		User.redIntegralOut().then(function (data) {
			$scope.info.redIntegral = data.redIntegral;
			$scope.info.fee_rate = data.fee_rate;
			console.log($scope.info);
		});
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			if (!$scope.info.userMobile) {
				Message.show('请输入对方账户！');
				return;
			}
			//				if($scope.info.bean > $scope.info.num) {
			//					Message.show('余额不足！');
			//					return;
			//				}
			if (!$scope.info.num) {
				Message.show('请输入转账金额！');
				return;
			}
			User.redIntegralOut($scope.info, 'type');
		}
	})
	.controller('redIntegralOutRecordCtrl', function ($scope, User, Message, $ionicLoading, $timeout) {

		$scope.info = ''
		User.redIntegralExList().then(function (res) {
			$scope.info = res.data
		})
		// 刷新
		//		$scope.doRefresh = function() {
		//			$scope.noMore = true;
		//			$scope.page = 2;
		//
		//			User.getWhiteIntegral().then(function(res) {
		//				$scope.info = res.data
		//				$scope.$broadcast("scroll.refreshComplete");
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: "刷新成功",
		//					duration: "1500"
		//				});
		//				$timeout(function() {
		//					$scope.noMore = false;
		//				}, 1000)
		//			})
		//
		//		}

		// 加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.redIntegralExList($scope.page).then(function (res) {
				$scope.info = $scope.info.concat(res.data)
				$scope.page++;
				$scope.$broadcast("scroll.infiniteScrollComplete");
				if (res.code == 1 && res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})

		}

	})
	.controller('whiteIntegralOutCtrl', function ($scope, Message, User) {
		$scope.info = {
			//				passwords: '',
			userMobile: '',
			num: '',
			integral: '',
			exType: 1,
			exTitle: '转出到优惠券'
		};
		User.whiteIntegralOut().then(function (data) {
			//				console.log(data);
			$scope.info.selffee = data.self_fee_rate;
			$scope.info.otherfee = data.other_fee_rate;
			$scope.info.integral = data.integral;
			//				$scope.repoInfo = data;
		});
		$scope.choType = function (type, title) {
			$scope.info.exType = type;
			$scope.info.exTitle = title;

		}
		var r = /^[1-9]\d*00$/;
		$scope.submit = function () {
			if ($scope.info.exType == 2) {
				if (!$scope.info.userMobile) {
					Message.show('请输入对方账户！');
					return;
				}
			}

			//				if($scope.info.bean > $scope.info.num) {
			//					Message.show('余额不足！');
			//					return;
			//				}
			if (!$scope.info.num) {
				Message.show('请输入转出数量！');
				return;
			}
			if ($scope.info.exType == 1) {
				User.whiteIntegralOut($scope.info, 'self');

			} else {
				User.whiteIntegralOut($scope.info, 'other');

			}

		}
	})
	.controller('whiteIntegralOutRecordCtrl', function ($scope, User, Message, $ionicLoading, $timeout) {
		$scope.info = ''
		User.whiteIntegralExList().then(function (res) {
			$scope.info = res.data
		})
		// 刷新
		//		$scope.doRefresh = function() {
		//			$scope.noMore = true;
		//			$scope.page = 2;
		//
		//			User.getWhiteIntegral().then(function(res) {
		//				$scope.info = res.data
		//				$scope.$broadcast("scroll.refreshComplete");
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: "刷新成功",
		//					duration: "1500"
		//				});
		//				$timeout(function() {
		//					$scope.noMore = false;
		//				}, 1000)
		//			})
		//
		//		}

		// 加载更多
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function () {
			User.whiteIntegralExList($scope.page).then(function (res) {
				$scope.page++;
				$scope.$broadcast("scroll.infiniteScrollComplete");
				$scope.info = $scope.info.concat(res.data)
				if (res.code == 1 && res.data.length == 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: "没有更多了",
						duration: "1500"
					});
					$scope.noMore = true;
				}
			})

		}

	})
	.controller('transferPayCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, Message, Payment, $state, $timeout, $interval, User, Order) {

		$scope.orderInfo = {
			payId: $stateParams.payId,
			payMoney: $stateParams.payMoney
		};
		// 选择支付类型
		$scope.payType = 'wechat';
		$scope.selectPayType = function (type) {
			$scope.payType = type;
		};
		$scope.orderConfirm = function () {
			if ($scope.payType == 'wechat') {
				console.log("welfare")
				Payment.exchangeWechatPay($scope.orderInfo);
				//				Payment.wechatPay('online', $scope.orderInfo);
			} else if ($scope.payType == 'alipay') {
				Payment.exchangeAlipay($scope.orderInfo);
			} else if ($scope.payType == 'ccb') {
				if ($scope.orderInfo.ordertypes != '') {
					console.log("welfare")
					Payment.ccbPay('welfare', $scope.orderInfo, '', $scope.from, $scope.disPay);
				} else {
					console.log("online")
					Payment.ccbPay('online', $scope.orderInfo, '', $scope.from, $scope.disPay);
				}
			}
		};

	})
	.controller('shopperfectInfoCtrl', function ($scope, $ionicModal, Area, Apply, $state, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message, aboutUs, $stateParams, User) {
		$scope.applyInfo = {
			logo: '',
			photo: '',
			businessLicence: '',
			birthInfo: '',
			holdCard: '',
			hygieneCard: '', //卫生许可证
			//			foodExchangeCard:'',//食品流通证
			goodFaithCard: '', //诚信承诺证
			legalPersonCard: '', //法人委托照
		};
		Message.hidden();
		/*上传证件照*/
		$scope.uploadAvatar = function (type) {
			var buttons = [{
				text: "拍一张照片"
			},
			{
				text: "从相册选一张"
			}
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function (index) {
					if (index == 0) {
						selectImages("camera", type);
					} else if (index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};

		var selectImages = function (from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if (from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function () {
				$cordovaCamera.getPicture(options).then(function (imageURI) {
					if (type == 1) { //店照
						$scope.applyInfo.photo = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 2) { //logo
						$scope.applyInfo.logo = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 3) { //正面
						$scope.applyInfo.idCardThumbA = "data:image/jpeg;base64," + imageURI;
						var image3 = document.getElementById('divImg03');
						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 4) { //反面
						$scope.applyInfo.idCardThumbB = "data:image/jpeg;base64," + imageURI;
						var image4 = document.getElementById('divImg04');
						image4.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 5) { //证照
						$scope.applyInfo.businessLicence = "data:image/jpeg;base64," + imageURI;
						var image5 = document.getElementById('divImg05');
						image5.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 11) { //手持证照
						$scope.applyInfo.holdCard = "data:image/jpeg;base64," + imageURI;
						var image11 = document.getElementById('divImg11');
						image11.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 21) { //卫生
						$scope.applyInfo.hygieneCard = "data:image/jpeg;base64," + imageURI;
						var image21 = document.getElementById('divImg21');
						image21.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 22) { //诚信
						$scope.applyInfo.goodFaithCard = "data:image/jpeg;base64," + imageURI;
						var image22 = document.getElementById('divImg22');
						image22.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if (type == 23) { //法人委托
						$scope.applyInfo.goodFaithCard = "data:image/jpeg;base64," + imageURI;
						var image23 = document.getElementById('divImg23');
						image23.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
				}, function (error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 提交商家申请信息
		$scope.apply = function () {
			User.checkShop($scope.applyInfo)
		}
	})
	.controller('shopPositionCtrl', function ($scope, Storage, $rootScope, Shop, User, $stateParams, $ionicSlideBoxDelegate, Message, $cordovaInAppBrowser, $timeout, $state) {

		$scope.ymhPosition = {
			lng: '',
			lat: '',
			city: '',
			address: ''
		}
		//		if(Storage.get("ymhPosition") == null||Storage.get("ymhPosition").lat==''){
		//			   document.addEventListener("deviceready", function() {
		//				$scope.ymhPosition.status = 2;
		//				Message.loading("获取定位中……");
		//				baidumap_location.getCurrentPosition(function(result) {
		//				Message.hidden();
		//					$scope.ymhPosition.lat = result.latitude;
		//					$scope.ymhPosition.lng = result.longitude;
		//					$scope.ymhPosition.city = result.city;
		//					$scope.ymhPosition.status = 3;
		//					Storage.set("ymhPosition", $scope.ymhPosition);
		//				}, function(error) {
		//					Message.show('定位失败。请手动选择城市')
		//				});
		//		}, false)
		//		}else{
		if (Storage.get("ymhPosition") == null) {
			Message.show('定位获取失败', 700, function () {
				$state.go('tab.my')
			})
		}

		console.log(Storage.get("ymhPosition"));
		$scope.ymhPosition = {
			lng: Storage.get("ymhPosition").lng,
			lat: Storage.get("ymhPosition").lat,
			city: Storage.get("ymhPosition").city,
			address: ''
		}

		//		}
		$timeout(function () {
			var shopmap = new BMap.Map("shopPickPosition"); // 创建Map实例

			shopmap.centerAndZoom(new BMap.Point($scope.ymhPosition.lng, $scope.ymhPosition.lat), 18);
			shopmap.enableScrollWheelZoom(true);
			var geo = new BMap.Geocoder();
			var modalobj = $('#shopPickPosition');
			//标注点1
			var pt = new BMap.Point($scope.ymhPosition.lng, $scope.ymhPosition.lat);
			geo.getLocation(pt, function (address) {
				console.log(address)
				$scope.ymhPosition.address = address.address;
			});
			var myIcon = new BMap.Icon("img_ad/locationRed.png", new BMap.Size(25, 25));
			var marker = new BMap.Marker(pt, {
				icon: myIcon
			});
			shopmap.addOverlay(marker);
			marker.enableDragging();
			marker.addEventListener('dragend', function (e) {
				var point = marker.getPosition();
				console.log(point)
				$scope.ymhPosition.lng = point.lng
				$scope.ymhPosition.lat = point.lat
				geo.getLocation(point, function (address) {
					console.log(address)
					$scope.ymhPosition.address = address.address;
				});
			});

			$scope.searchAddress = function (address) {
				geo.getPoint(address, function (point) {
					console.log(point)
					shopmap.panTo(point);
					marker.setPosition(point);
					marker.setAnimation(BMAP_ANIMATION_BOUNCE);
					$timeout(function () {
						marker.setAnimation(null)
					}, 3000)
				});
			}
			$scope.sureAddress = function (address) {
				console.log($scope.ymhPosition)
				User.checkShop($scope.ymhPosition)
			}
		}, 100)

	})
	.controller('profitRatioCtrl', function ($scope, $stateParams) {
		console.log($stateParams)
		$scope.ratioList = $stateParams.list;
		console.log($scope.ratioList)
	})
	.controller('taokeGoodsInfoCtrl', function ($scope, Good, Order, $cordovaInAppBrowser, $stateParams, User) {
		$scope.info = {
			goodsId: $stateParams.goodsId,
			id: $stateParams.id
		}
		Good.getonTaoGoodsInfo($stateParams.goodsId).then(function (res) {
			$scope.goodsInfo = res.data.info;
		})
		Order.getTaoCommond($scope.info).then(function (res) {
			$scope.linkInfo = res.data.info;
			$scope.taoLink = decodeURI(res.data.share_text)
		})
		Order.getCommission($scope.info).then(function (res) {
			$scope.linkUrl = res.data.long_coupon_click_url
		})
		//		var settings = {
		//			forceH5: false,
		//			syncForTaoke: false,
		//			taokeParams: false,
		//			channel: ['', ''],
		//			ISVCode: '',
		//			ISVVersion: '',
		//		}
		//		document.addEventListener("deviceready", function() {
		//			Baichuan.setting(settings, function() {
		//				alert('success')
		//			}, function() {
		//				alert('fail')
		//			});
		//		}, false);
		var taokeArgs = {
			pid: '',
			adzoneid: '',
			subPid: '',
			unionId: '',
			key: ''
		}
		var showArgs = {
			openType: 'H5', // 打开页面的方式
			backUrl: '', // 指定手淘回跳的地址
			//			nativeFailMode: 'NONE', // 跳手淘/天猫失败后的处理策略

			// Android
			//         clientType: '',
			//         pageClose: false,
			//         proxyWebview: true,
			//         showTitleBar: true,
			//         title: '',
			// IOS
			//         linkKey: '',    // applink使用，优先拉起的linkKey，手淘：@"taobao_scheme"
		}
		$scope.goBuy1 = function () {
			$scope.openLink($scope.linkUrl)
			//			$scope.openUlr($scope.linkInfo.shortUrl)
		}
		$scope.goBuy = function () {
			$scope.openLink($scope.taoLink)
			//			$scope.openUlr($scope.linkInfo.shortUrl)
		}
		$scope.openLink = function (url) {
			console.log(url)
			if (url) {
				var pageArgs = {
					type: 'page',
					itemId: '',
					shopId: '',
					allOrder: true,
					url: url,
					status: 0, // 所要展示订单的订单状态
				}
				document.addEventListener("deviceready", function () {
					Baichuan.showPage(pageArgs, [taokeArgs, showArgs, {}], function (success) {
						alert('success17909' + success)
					}, function (error) {
						alert('fail17911' + error)
					});
				}, false);
			}
		}
		$scope.openUlr = function (url) {
			console.log(url)
			document.addEventListener("deviceready", function () {
				$cordovaInAppBrowser.open(url, '_system')
					.then(function (event) {
						//						alert('2865'+JSON.stringify(event))
					})
					.catch(function (event) {
						//						alert('2870'+JSON.stringify(event))
					});
			}, false);
		}

		// 收藏

		$scope.collectGoods = function (goodsInfo, $event) {
			$event.stopPropagation();
			User.taoCollect(goodsInfo.isCollect, goodsInfo.id).then(function (res) {
				goodsInfo.isCollect = res.data
			});
		}

	})
	.controller('taoCommondCtrl', function ($scope, Order, $cordovaInAppBrowser, $stateParams, $timeout, Message) {
		console.log($stateParams);
		$scope.info = {
			goodsId: $stateParams.goodsId,
			id: $stateParams.id
		}
		Order.getTaoCommond($scope.info).then(function (res) {
			console.log(res)
			//				$scope.list = res.data;
			$scope.linkInfo = res.data.info;
			$scope.linkInfo.tao_str = decodeURI($scope.linkInfo.tao_str)
			$scope.taoLink = decodeURI(res.data.share_text)
			console.log($scope.taoLink)
		})
		$scope.copyLink = function () {
			document.addEventListener("deviceready", function () {
				cordova.plugins.clipboard.copy($scope.taoLink)
				$timeout(function () {
					Message.show('复制成功');
				}, 100)
			}, false);
		}
		var taokeArgs = {
			pid: '',
			adzoneid: '',
			subPid: '',
			unionId: '',
			key: ''
		}
		var showArgs = {
			openType: 'H5', // 打开页面的方式
			backUrl: '', // 指定手淘回跳的地址
			nativeFailMode: 'NONE', // 跳手淘/天猫失败后的处理策略
			// Android
			//         clientType: '',
			//         pageClose: false,
			//         proxyWebview: true,
			//         showTitleBar: true,
			//         title: '',
			// IOS
			//         linkKey: '',    // applink使用，优先拉起的linkKey，手淘：@"taobao_scheme"
		}
		$scope.goBuy = function () {
			$scope.openLink($scope.taoLink)
			//$scope.openUlr($scope.linkInfo.shortUrl)
		}

		$scope.openUlr = function (url) {
			document.addEventListener("deviceready", function () {
				$cordovaInAppBrowser.open(url, '_blank', options)
					.then(function (event) {
						// success
					})
					.catch(function (event) {
						// error
					});

			}, false);
		}
		$scope.openLink = function (url) {
			if (url) {
				var pageArgs = {
					type: 'page',
					itemId: '',
					shopId: '',
					allOrder: true,
					url: url,
					status: 0, // 所要展示订单的订单状态
				}
				document.addEventListener("deviceready", function () {
					Baichuan.showPage(pageArgs, [taokeArgs, showArgs, {}], function (success) {
						//	alert('success'+success)
					}, function (error) {
						//	alert('fail'+error)
					});
				}, false);
			}
		}
	})
	.controller('taoOrderCtrl', function ($scope, $rootScope, Order, Home, $ionicLoading, $stateParams, Message, $ionicSlideBoxDelegate, Storage, $state, $http, ENV) {
		$scope.orderEmpty = false;
		$scope.orderStatus = '0';
		Order.gettaoList($scope.orderStatus).then(function (response) {
			console.log(response)
			if (response.data == '' || response.data.length == 0) {
				$scope.goodslist = '';
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.goodslist = response.data.info;
			}
		});
		$scope.getNew = function (orderStatus) {
			$scope.noMore = true;
			$scope.page = 2;
			$scope.orderStatus = orderStatus;
			$('#porder' + orderStatus).siblings().find('span').removeClass('red');
			$('#porder' + orderStatus).find('span').addClass('red');
			Order.gettaoList($scope.orderStatus).then(function (response) {
				console.log(response)
				if (response.data == '' || response.data.length == 0) {
					$scope.goodslist = '';
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.goodslist = response.data.info;
				}
			});
		};
		$scope.copy = function (orderNum) {
			document.addEventListener("deviceready", function () {
				cordova.plugins.clipboard.copy(orderNum)
				$timeout(function () {
					Message.show('复制成功');
				}, 100)
			}, false);
		}
		if ($scope.ordertype == '0') {
			$scope.statusName = {
				'0': '待付款',
				'1': '待发货',
				'2': '待收货',
				'3': '待评价',
				'4': '已完成',
				'-1': '已取消',
				'-2': '退款中',
				'-3': '申请退款',
				'-4': '已退款'
			};
		}
		//		$scope.doRefresh = function() {
		//			$scope.noMore = false;
		//			Order.getuserList($scope.type, $scope.ordertype, $scope.orderStatus).then(function(response) {
		//				if(response.data == '' || response.data.length == 0) {
		//					$scope.orderEmpty = true;
		//				} else {
		//					$scope.goodslist = response.data;
		//					$scope.orderEmpty = false;
		//				}
		//				$scope.$broadcast('scroll.refreshComplete');
		//				$ionicLoading.show({
		//					noBackdrop: true,
		//					template: '刷新成功！',
		//					duration: '1200'
		//				});
		//				$scope.noMore = true;
		//				$scope.page = 2;
		//			});
		//		};
		//下拉加载
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function () {
			Order.gettaoList($scope.orderStatus, $scope.page).then(function (response) {
				console.log(response)
				$scope.page++;
				$scope.goodslist = $scope.goodslist.concat(response.data.info);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if (response.code == 0 && response.data.info == '') {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1000'
					});
					$scope.noMore = false;
				}
			});
		};

	})
	//	.controller('taoOrderCtrl', function($scope, Order, $cordovaInAppBrowser, $stateParams, $timeout, Message) {
	//		console.log($stateParams);
	//		$scope.info = {
	//			goodsId: $stateParams.goodsId,
	//			id: $stateParams.id
	//		}
	////		Order.getTaoCommond($scope.info).then(function(res) {
	////			console.log(res)
	////			$scope.linkInfo = res.data.info;
	////			$scope.linkInfo.tao_str = decodeURI($scope.linkInfo.tao_str)
	////			$scope.taoLink = decodeURI(res.data.share_text)
	////			console.log($scope.taoLink)
	////		})
	//		$scope.copyLink = function() {
	//			document.addEventListener("deviceready", function() {
	//				cordova.plugins.clipboard.copy($scope.taoLink)
	//				$timeout(function() {
	//					Message.show('复制成功');
	//				}, 100)
	//			}, false);
	//		}
	//		var taokeArgs = {
	//			pid: '',
	//			adzoneid: '',
	//			subPid: '',
	//			unionId: '',
	//			key: ''
	//		}
	//		var showArgs = {
	//			openType: 'H5', // 打开页面的方式
	//			backUrl: '', // 指定手淘回跳的地址
	//			nativeFailMode: 'NONE', // 跳手淘/天猫失败后的处理策略
	//		}
	//		$scope.goBuy = function() {
	//			$scope.openLink($scope.taoLink)
	//			//$scope.openUlr($scope.linkInfo.shortUrl)
	//		}
	//
	//		$scope.openUlr = function(url) {
	//			document.addEventListener("deviceready", function() {
	//				$cordovaInAppBrowser.open(url, '_blank', options)
	//					.then(function(event) {
	//						// success
	//					})
	//					.catch(function(event) {
	//						// error
	//					});
	//
	//			}, false);
	//		}
	//		$scope.openLink = function(url) {
	//			if(url) {
	//				var pageArgs = {
	//					type: 'page',
	//					itemId: '',
	//					shopId: '',
	//					allOrder: true,
	//					url: url,
	//					status: 0, // 所要展示订单的订单状态
	//				}
	//				document.addEventListener("deviceready", function() {
	//					Baichuan.showPage(pageArgs, [taokeArgs, showArgs, {}], function(success) {
	//						//	alert('success'+success)
	//					}, function(error) {
	//						//	alert('fail'+error)
	//					});
	//				}, false);
	//			}
	//		}
	//	})
	.controller('taoProfitCtrl', function ($scope, Order, Message, $timeout, $rootScope, Storage, $state) {
		Order.getTaokeInput().then(function (response) {
			console.log(response)
			$scope.info = response.data.info;
		});
	})