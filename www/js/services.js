angular.module('starter.services', [])
	.factory('Storage', function() {
		return {
			set: function(key, data) {
				return window.localStorage.setItem(key, window.JSON.stringify(data));
			},
			get: function(key) {
				return window.JSON.parse(window.localStorage.getItem(key));
			},
			remove: function(key) {
				return window.localStorage.removeItem(key);
			}
		};
	})

	.factory('Jpush', function(Storage, $state, Message, $rootScope, $q, ENV, $location) {
		return {
			initIm: function(username, password, nickname) {
				//极光IM初始化
				JMessage.init({
					isOpenMessageRoaming: true
				})
				JMessage.setDebugMode({
					enable: true
				}) //设置是否开启 debug 模式，推荐在应用对外发布时关闭。	 
				JMessage.register({
						username: username,
						password: password,
						nickname: nickname || '未设置',
						gender: 'unknown'
					},
					function(success) {
						// do something.
						//alert("reg"+JSON.stringify(success));
					},
					function(error) {
						var code = error.code
						var desc = error.description
						//  alert('errorReg'+code+'|'+desc)
					})
			},
			loginIm: function(mobile) {
				JMessage.init({
					isOpenMessageRoaming: true
				})
				JMessage.setDebugMode({
					enable: true
				}) //设置是否开启 debug 模式，推荐在应用对外发布时关闭。
				JMessage.login({
						username: mobile || Storage.get('user').mobile,
						password: mobile || Storage.get('user').mobile
					},
					function(success) {
						//alert("log"+JSON.stringify(success));
						//this.iMaddReceiveMessageListener()
					},
					function(error) {
						var code = error.code
						var desc = error.description
						//   alert('errorLog'+code+'|'+desc)
					})
			},
			iMaddReceiveMessageListener: function() {

				JMessage.addReceiveMessageListener(function(msg) {
					//	alert(JSON.stringify(msg))
					//	alert('path'+$location.path())
					if($location.path() != '/user/imMessagePerson') {
						$state.go('user.imMessagePerson', {
							username: msg.from.username
						});
					} else {
						$rootScope.$broadcast('imReceiveMessage', msg)
					}
				})
			},
			iMLoginStatusListener: function() {

				JMessage.addReceiveMessageListener(function(event) {
					if(event.type == 'user_password_change' || event.type == 'user_deleted') {
						Message.show('用户信息修改，联系管理员');
					}
					// if(event.type='user_logout'){
					// 	Message.show('账号在其它设备登录');
					// }
				})
			},
			//			testfunction:function(){
			//	if($location.path()!='user/imMessagePerson'){
			//		$state.go('user.imMessagePerson',{username:'aaa'});
			//	}else{
			//		$rootScope.$broadcast('imReceiveMessage','ss')
			//	} 
			//
			//			},
			setNickname: function(nickname) {
				JMessage.updateMyInfo({
						nickname: nickname
					},
					function() {
						// do something.

					},
					function(error) {
						var code = error.code
						var desc = error.description
					})
			},

			//创建会话
			creatIm: function(username) {
				Message.loading('连接中..')
				var deferred = $q.defer();
				JMessage.getUserInfo({
						username: username,
						appKey: ENV.appkey
					},
					function(userInfo) {
						Message.hidden()
						// do something.
						JMessage.createConversation({
								type: 'single',
								username: username,
								appKey: ENV.appkey
							},
							function(conversation) {
								//  alert('creat50'+JSON.stringify(conversation))
								deferred.resolve(conversation);
							},
							function(errors) {
								var code = errors.code
								var desc = errors.description
								//  alert('create'+code+'|'+desc)
							})
					},
					function(error) {
						Message.hidden()
						var code = error.code
						var desc = error.description

						// alert(code+'infoerror'+desc)

						Message.show('用户未开通聊天功能')
					})
				return deferred.promise;
			},
			sendIm: function(username, text) {
				Message.loading('发送中')
				var deferred = $q.defer();
				JMessage.sendTextMessage({
						type: 'single',
						username: username,
						appKey: ENV.appkey,
						text: text,
						messageSendingOptions: JMessage.messageSendingOptions
					},
					function(msg) {
						// do something.
						Message.hidden()

						deferred.resolve(msg);
						//  alert(JSON.stringify(msg))
						//  Message.show(JSON.stringify(msg))
					},
					function(error) {
						var code = error.code
						var desc = error.description
						//   alert('senderror'+code+'|'+desc)
						Message.hidden()
						if(code == 898002 || code == 899002) {
							Message.show('你还未注册聊天功能')
						}

					})
				return deferred.promise;
			},
			getsignMessage: function(username) {
				var deferred = $q.defer();
				JMessage.getHistoryMessages({
						type: 'single',
						username: username,
						appKey: ENV.appkey,
						from: 0,
						limit: -1
					},
					function(msgArr) { // 以参数形式返回消息对象数组
						// do something.
						deferred.resolve(msgArr);
					},
					function(error) {
						var code = error.code
						var desc = error.description
					})
				return deferred.promise;
			},
			getMessageList: function() {
				var deferred = $q.defer();
				JMessage.getConversations(function(conArr) { // conArr: 会话数组。
					// do something.
					deferred.resolve(conArr);
				}, function(error) {
					var code = error.code
					var desc = error.description
					//   alert('geterror'+code+'|'+desc)
				})
				return deferred.promise;
			},
			getpersonList: function(username) {
				var deferred = $q.defer();
				JMessage.getConversation({
						type: 'single',
						username: username,
						appKey: ENV.appkey
					},
					function(conversation) {
						// do something.
						deferred.resolve(conversation);
					},
					function(error) {
						var code = error.code
						var desc = error.description
					}
				)
				return deferred.promise;
			},
			resetPersonMessage: function(username) {
				var deferred = $q.defer();
				JMessage.resetUnreadMessageCount({
						type: 'single',
						username: username,
						appKey: ENV.appkey
					},
					function(conversation) {
						// do something.

					},
					function(error) {
						var code = error.code
						var desc = error.description
					}
				)
				return deferred.promise;
			},

			//jpush推送
			init: function() {
				try {
					window.plugins.jPushPlugin.init();
					//调试
					//					window.plugins.jPushPlugin.setDebugMode(true);
				} catch(exception) {
					console.info(exception);
				}
				document.addEventListener("jpush.setTagsWithAlias", this.onTagsWithAlias, false); //设置别名与标签
				document.addEventListener("jpush.onOpenNotification", this.onOpenNotification, false); //点击通知进入应用程序时会出发该事件
				document.addEventListener("jpush.receiveMessage", this.onreceiveNotification, false); //接受消息会触发该事件
			},
			getRegistrationID: function() {
				window.plugins.jPushPlugin.getRegistrationID(function(data) {
					//					alert(data);
					var JPushData = {
						registerId: data
					};
					try {
						console.info(JPushData);
						//						Storage.set('JPush', JPushData);
					} catch(exception) {
						console.info(exception);
					}
				});
			},
			setTagsWithAlias: function(tags, alias) {
				if(Storage.get('user')) {
					var usertags = Storage.get('user').uid;
				}
				try {
					window.plugins.jPushPlugin.setTagsWithAlias(tags, usertags);
				} catch(exception) {
					console.info(exception);
				}
			},
			onTagsWithAlias: function(event) {
				try {
					console.info(event);
				} catch(exception) {
					console.info(exception);
					//					alert(exception);
				}
			},
			onOpenNotification: function(event) {

				try {
					//					alert('0');
					if(device.platform == "Android") {
						//						alert(JSON.stringify(event.extras));
						var extras = event.extras;
						//						if(extras.type == 'shopOrderNotice') {
						//							console.info('shopOrderNotice', extras);
						//							$state.go('shop.OrderDetails', {
						//								id: extras.orderId
						//							});
						//						}
						if(extras.type) {
							//							alert('type');
							console.info('shopOrderNotice', extras);
							$state.go('user.myMessage');
							//							$state.go('user.myMessage', {
							//								id: extras.orderId
							//							});
						}
					} else {
						alertContent = event.aps.alert;
					}
				} catch(exception) {
					//					alert('00');
					//					alert(JSON.stringify(exception));
					console.info("JPushPlugin:onOpenNotification" + exception);
				}
			},
			//			OpenNotification: function(event) {
			//				
			//				try {
			//					alert('0');
			//					if(device.platform == "Android") {
			//						alert(JSON.stringify(event.extras));
			//						var extras = event.extras;
			//						if(extras.type == 'shopOrderNotice') {
			//							console.info('shopOrderNotice', extras);
			//							$state.go('shop.OrderDetails', {
			//								id: extras.orderId
			//							});
			//						}
			////           
			//						
			//					} else {
			//						alertContent = event.aps.alert;
			//					}
			//				} catch(exception) {
			//					console.info("JPushPlugin:onOpenNotification" + exception);
			//				}
			//			},
			onreceiveNotification: function(event) {
				try {
					//					alert('1');
					var message;
					//					alert(JSON.stringify(event.extras));
					if(device.platform == "Android") {
						//						alert(JSON.stringify(event.extras));
						var extras = event.extras;
						if(extras.type) {
							console.info('shopOrderNotice', extras);
							//							$state.go('user.myMessage');
							//							$state.go('user.myMessage', {
							//								id: extras.orderId
							//							});
						}
					} else {
						alertContent = event.aps.alert;
					}
				} catch(exception) {
					//					alert('11');
					//					alert(JSON.stringify(exception));
					console.info("JPushPlugin:onreceiveNotification" + exception);
				}
			},
		}
	})
	.factory('System', function($rootScope, $http, $q, $timeout, $ionicLoading, $resource, $ionicPopup, $cordovaInAppBrowser, $cordovaAppVersion, Message, ENV) {
		var verInfo;
		var resource = $resource(ENV.YD_URL, {
			do: 'config'
		});
		return {
			aboutUs: function(success, error) {
				Message.loading();
				resource.get({
					op: 'getVersion'
				}, success, error);
			},
			//			checkUpdate: function() {
			//				var deferred = $q.defer();
			//				Message.loading();
			//				$http.get(ENV.YD_URL + '&do=config&op=getVersion').then(function(response) {
			//					console.log(response);
			//					if(response.data.code != 0) {
			//						return;
			//					}
			//					verInfo = response.data.data; //服务器 版本
			//					console.log(verInfo);
			//					$cordovaAppVersion.getVersionNumber().then(function(version) {
			//						Message.hidden();
			//						if(version < verInfo.version) {
			//							var confirmPopup = $ionicPopup.confirm({
			//								template: '发现新版本，是否更新版本',
			//								buttons: [{
			//									text: '取消',
			//									type: 'button-default'
			//								}, {
			//									text: '更新',
			//									type: 'button-positive',
			//									onTap: function() {
			//										$cordovaInAppBrowser.open(verInfo.downloadUrl, '_system');
			//									}
			//								}]
			//							});
			//						} else {
			//							deferred.resolve('aaa');
			//							//							return true;
			//						}
			//					}, function() {
			//						Message.show('通讯失败，请检查网络！');
			//					});
			//				}, false);
			//				return deferred.promise;
			//			},
			checkUpdate: function() {
				var deferred = $q.defer();
				Message.loading();
				$http.get(ENV.YD_URL + '&do=config&op=getVersion').then(function(response) {
					console.log(response);
					if(response.data.code != 0) {
						return;
					}
					verInfo = response.data.data; //服务器 版本
					console.log(verInfo);
					$cordovaAppVersion.getVersionNumber().then(function(version) {
						Message.hidden();
						if(version < verInfo.version) {
							var confirmPopup = $ionicPopup.confirm({
								template: '发现新版本，是否更新版本',
								buttons: [{
									text: '取消',
									type: 'button-default'
								}, {
									text: '更新',
									type: 'button-positive',
									onTap: function() {
										$cordovaInAppBrowser.open(verInfo.downloadUrl, '_system');
									}
								}]
							});
						} else {
							deferred.resolve('aaa');
							//							return true;
						}
					}, function() {
						Message.show('通讯失败，请检查网络！');
					});
				}, false);
				return deferred.promise;
			},
			getNotice: function() {
				// document.getElementById("noticeMp3").play();
				$rootScope.globalInfo.noticeNum++;
				console.log('接受消息');
				// resource.get({op: 'notice'}, function (response) {
				// 	$rootScope.globalInfo.noticeNum++;
				// 	console.log('接受消息');
				// });
			},
			fetchCount: function() {
				var deferred = $q.defer();
				resource.get({
					op: 'count'
				}, function(response) {
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			}
		}
	})

	.factory('Notice', function($rootScope, $http, $q, $timeout, $ionicLoading, $resource, $ionicPopup, $cordovaInAppBrowser, $cordovaAppVersion, Message, ENV) {
		var resource = $resource(ENV.YD_URL, {
			do: 'message'
		});
		return {
			getNotice: function() {
				resource.get({
					op: 'notice'
				}, function(response) {
					if(response.code == 0) {
						//	alert(JSON.stringify(response));
						if(response.data.length > 0) {
							$rootScope.globalInfo.noticeNum = response.data.length;
							document.getElementById("noticeMp3").play();
						}
					}
				});
			},
			getList: function(type, page) {
				var deferred = $q.defer();
				var page = page || 1;
				Message.loading();
				resource.save({
					op: 'getList',
					types: type,
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getInfo: function(id) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getInfo',
					id: id
				}, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			}
		}
	})

	.factory('Message', function($ionicLoading) {
		return {
			show: function() {
				var text = arguments[0] ? arguments[0] : 'Hi，出现了一些错误，请检查网络或者退出重试！';
				var duration = arguments[1] ? arguments[1] : 1000;
				var callback = arguments[2] ? arguments[2] : '';
				$ionicLoading.hide();
				if(typeof callback === "function") {
					$ionicLoading.show({
						noBackdrop: true,
						template: text,
						duration: duration
					}).then(function() {
						callback();
					});
				} else {
					$ionicLoading.show({
						noBackdrop: true,
						template: text,
						duration: duration
					});
				}
			},
			loading: function() {
				var text = arguments[0] ? arguments[0] : '';
				$ionicLoading.hide();
				$ionicLoading.show({
					hideOnStateChange: false,
					duration: 10000,
					template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br/>' + text
				})
			},
			hidden: function() {
				$ionicLoading.hide();
			}
		};
	})

	.factory('TokenAuth', function($q, Storage, $location) {
		return {
			request: function(config) {
				var userInfo = Storage.get('user');
				config.headers = config.headers || {};
				if(userInfo && userInfo.token) {
					config.headers.TOKEN = userInfo.token;
				}
				return config;
			},
			response: function(response) {
				if(response.data.code === 403) {
					var aa = response.data.msg;
					//							alert('aa');
					Storage.remove('user');
					$location.path('/auth/login');
				}
				return response || $q.when(response);
			}
		};
	})

	.factory('Home', function($resource, $rootScope, $ionicLoading, ENV, $q, Message, $state, $http, Storage) {
		var home = {};
		var moreGoods = [];
		var resource = $resource(ENV.YD_URL, {
			do: 'home'
		});
		return {
			getnounDict: function() {
				var deferred = $q.defer();
				$http.get(ENV.YD_URL + '&do=home&op=getDict').then(function(response) {
					//					console.log(response);
					$rootScope.globalInfo.nounInfo = response.data.data;
					Storage.set('nounInfo', response.data.data);
					deferred.resolve(response);
				}, false);
				return deferred.promise;
			},
			getbanner: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'virtual'
				}
				resource.save(_json, function(response) {
						// Message.hidden();
						//					console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			shopsrolelist: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'shopsCountList'
				}
				resource.save(_json, function(response) {
						Message.hidden();
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getnoticelist: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'homenotice'
				}
				resource.save(_json, function(response) {
						Message.hidden();
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			fetch: function() {
				Message.loading();
				//文章收藏列表  为了方便放在这个服务里面
				var deferred = $q.defer();
				resource.get({
					op: 'display'
				}, function(response) {
					//					console.log(response);
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			getbannerdetail: function(type, total, page) {
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'virtualDetail',
					type: type,
					total: total,
					page: page

				}
				resource.save(_json, function(response) {
						//						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getOnlineSR: function(keyword, type, page) {
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'getOnlineSR',
					keyword: keyword,
					type: type,
					page: page

				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getOfflineSR: function(keyword, page) {
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'getOfflineSR',
					keyword: keyword,
					page: page

				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getShopSR: function(spid, keyword, type, page) {
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'getShopSR',
					spid: spid,
					keyword: keyword,
					type: type,
					page: page
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			fetchnav: function() {
				Message.loading();
				//文章收藏列表  为了方便放在这个服务里面
				var deferred = $q.defer();

				resource.get({
					op: 'category'
				}, function(response) {
					//					console.log(response);
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			onlinefetchShops: function(page) {
				//				Message.loading();
				page = page || 1;
				var deferred = $q.defer();
				resource.get({
					op: 'onlineDisplay',
					page: page
				}, function(response) {
					//					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			onlinefetchgoods: function(type,page) {
				Message.loading();
				page = page || 100;
				var deferred = $q.defer();
				resource.get({
					op: 'onlineGoods',
					page: page,
					type:type
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			onlineshopsinfo: function(page, id) {
				Message.loading();
				page = page || 1;
				var deferred = $q.defer();
				resource.save({
					op: 'onlineshopgood',
					page: page,
					spid: id
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			onlineshopgood: function(page, id, types, keywords, cid) {
				Message.loading();
				page = page || 1;
				var deferred = $q.defer();
				resource.get({
					op: 'onlinegoodslist',
					page: page,
					spid: id,
					moneytype: types,
					keyword: keywords,
					cid: cid
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//线下商家分类
			getlinecatelist: function() {
				Message.loading();
				var deferred = $q.defer();
				resource.get({
					op: 'lineCateList'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			fetchShops: function(page, lat, long, cid, ctype, sorts) {
				Message.loading();
				page = page || 1;
				var deferred = $q.defer();
				resource.get({
					op: 'shopsList',
					page: page,
					lat: lat,
					lng: long,
					cid: cid,
					rType: ctype,
					sorts: sorts
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getGoodsList: function(id) {
				//				console.log(id);
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'goods'
				});
				res.get({
					op: 'list',
					spid: id
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			getSearchCity: function(keyword) {
				Message.loading();
				var resource = $resource(ENV.YD_URL, {
					do: 'api'
				});
				var deferred = $q.defer();
				resource.get({
					op: 'getLatlng',
					keyword: keyword
				}, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 导航跳转
			//			getNav: function (id) {
			//				Message.loading();
			//				var deferred = $q.defer();
			//				resource.get({op: 'getNav', id: id}, function (response) {
			//					Message.hidden();
			//					if(response.code == 0){
			//						deferred.resolve(response.data);
			//					}else if(response.code == 1){
			//						Message.show(response.data);
			//					}
			//				});
			//				return deferred.promise;
			//			},
			// 首页商家搜索功能
			goCategory: function(keywords) {
				if(!keywords || keywords.length < 1) {
					Message.show("请输入一个以上关键字！");
					return false;
				}
				$state.go('shops.shopsCategory', {
					keywords: keywords
				});
			},
			categoryList: function(keywords, page) {
				var page = page || 1;
				Message.loading();
				var deferred = $q.defer();
				resource.get({
					op: 'shopsList',
					keywords: keywords,
					page: page
				}, function(response) {
					if(response.code == 1) {
						Message.show('您搜索的商家不存在！');
						return false;
					}
					deferred.resolve(response.data);
				})
				return deferred.promise;
			},
			getHomeRec: function() {
				var deferred = $q.defer();
				resource.get({
						op: "onlineLoveLife",
					},
					function(res) {
						if(res.code == 0) {
							deferred.resolve(res)
						} else {
							Message.show(res.msg)
						}
					}
				);
				return deferred.promise;
			}
		};
	})

	.factory('Article', function($resource, $rootScope, $ionicLoading, ENV, $q, Message, $state) {
		var home = {};
		var moreGoods = [];
		//var resource = $resource(ENV.YD_URL, {do: 'home'});
		var resource = $resource(ENV.YD_URL, {
			do: 'article'
		});
		return {
			//首页活动
			getindexActice: function(id) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'indexactive'

				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//首页活动详情
			getactiveinfo: function(id) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'indexactiveinfo',
					cid: id

				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getArticlesDetail: function(id) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'detail',
					id: id
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			fetch: function(cid) {
				Message.loading();
				//文章收藏列表  为了方便放在这个服务里面
				var deferred = $q.defer();
				resource.get({
					op: 'list',
					cid: cid
				}, function(response) {
					//					console.log(response);
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			newsavtive: function(types) {
				Message.loading();
				//文章收藏列表  为了方便放在这个服务里面
				var deferred = $q.defer();
				resource.get({
					op: 'newsactive',
					type: types
				}, function(response) {
					//					console.log(response);
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			fetchnav: function() {
				Message.loading();
				//文章收藏列表  为了方便放在这个服务里面
				var deferred = $q.defer();
				resource.get({
					op: 'category'
				}, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
		};
	})
	.factory('Good', function($resource, $ionicLoading, ENV, $q, Message, $state, Storage) {
		// var home = {};
		//var moreGoods = [];
		var resource = $resource(ENV.YD_URL, {
			do: 'goods'
		});
		return {
			//跨镜电商商品列表
			getAcrossGoodsList: function(showtypes, keywords, page) {
				var deferred = $q.defer();
				page = page || 1;

				var _json = {
					op: 'acrossGoodsList',
					page: page,
					type: showtypes,
					keywords: keywords
				}

				Message.loading();
				resource.save(_json, function(response) {
					//			console.log(response);
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getQRCOde: function() {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'qrCode'
				}
				resource.save(_json, function(res) {
					Message.hidden();
					if(res.code == 0) {
						deferred.resolve(res);
					} else {
						Message.show(res.msg);
					}

				});
				return deferred.promise;
			},
			//添加购物车
			addGoods: function(goodids) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'create',
					spid: goodids.spid,
					goodsId: goodids.goodsId,
					id: goodids.id,
					num: goodids.totNum
				}
				var res = $resource(ENV.YD_URL, {
					do: 'cart'
				});
				res.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//商品推荐
			getrecomCate: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'goods'
				});
				res.get({
					op: 'recomCate'
				}, function(response) {
					// 		console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			gethotgoodsList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'hotgood',
					page: page
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getactivegoodsList: function(types, page, showtypes, keywords) {
				var deferred = $q.defer();
				page = page || 1;
				if(types == 'five') {
					var _json = {
						op: 'fivelove',
						type: types,
						page: page,
						moneytype: showtypes,
						keywords: keywords
					}
				} else if(types == 'direct') {
					var _json = {
						op: 'fivelove',
						type: types,
						moneytype: showtypes,
						page: page,
						keywords: keywords
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					//			console.log(response);
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getonGoodsList: function(id, screentypes, Keywords, pages) {
	
				Message.loading();
				var deferred = $q.defer();
				var page = pages || 1;
				var _json = {};
				if(screentypes == '6') {
					_json = {
						op: 'ongoodslist',
						keywords: Keywords,
						screenshop: 1,
						page: page
					}

				} else {
					_json = {
						op: 'ongoodslist',
						cateid: id,
						keywords: Keywords,
						screentype: screentypes,
						page: page
					}

				}
				resource.get(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
				getcateGoodsList: function(type,cateid, pages) {
				Message.loading();
				var deferred = $q.defer();
				var page = pages || 1;
				var _json = {
						op: 'advert',
//						keywords: Keywords,
                        type:type,
						cateid:cateid,
						page: page
					}

				resource.get(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getonGoodsInfo: function(id) {
				Message.loading();
				var deferred = $q.defer();
				if(Storage.get('user')) {
					var uid = Storage.get('user').uid;
				} else {
					uid = ''
				}
				//var resource = $resource(ENV.YD_URL, {do: 'goods'});
				resource.get({
					op: 'ongoodsInfo',
					id: id,
					uid: uid
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				
				return deferred.promise;
			},
			getonTaoGoodsInfo: function(id) {
				var res = $resource(ENV.YD_URL, {
					do: 'users'
				});
				Message.loading();
				var deferred = $q.defer();
				//				if (Storage.get('user')) {
				//					var uid = Storage.get('user').uid;
				//				} else {
				//					uid = ''
				//				}
				//var resource = $resource(ENV.YD_URL, {do: 'goods'});
				res.save({
					op: 'get_tao_goods_info_by_id',
					goods_id: id,
					//					uid: uid
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getGoodsList: function(spid, id) {
				//				console.log(id);
				Message.loading();
				var deferred = $q.defer();
				//var resource = $resource(ENV.YD_URL, {do: 'goods'});
				resource.get({
					op: 'list',
					spid: spid,
					id: id
				}, function(response) {
					Message.hidden();
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			getSgoodsList: function(spid, pcid) {
				//				console.log(pcid);
				//				console.log(spid);
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'goods'
				});
				res.get({
					op: 'list',
					spid: spid,
					pcid: pcid
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
					//					if(response.code==0){
					//						deferred.resolve(response.data);
					//					}else{
					//						Message.show(response.msg);
					//					}

				});
				return deferred.promise;
			},
			//商品分类
			getCateList: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'shops',
					op: '@op'
				});
				res.get({
					op: 'cate',
					spid: spid
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			}

		}
	})
	.factory('Cart', function($resource, $ionicLoading, ENV, $q, Message, $state, Storage) {
		// var home = {};
		//var moreGoods = [];
		var resource = $resource(ENV.YD_URL, {
			do: 'cart'
		});
		return {
			//要展示订单信息
			cartSave: function(ids, types) {
				//				console.log(ids);
				console.log(Storage.get('orderinterim'));
				if(Storage.get('orderinterim') != '') {
					Storage.set('orderinterim', types);
				} else {
					Storage.set('orderinterim', types);
				}
				console.log(Storage.get('orderinterim'));
				var deferred = $q.defer();
				var _json = {};
				if(angular.isArray(ids) == false) {
					var _json = {
						op: 'cartsave',
						spid: ids.spid,
						goodsId: ids.goodsId,
						attrId: ids.id,
						goodsNum: ids.totNum,
						type: types
					}
				} else if(angular.isArray(ids) == true) {
					_json = {
						op: 'cartsave',
						id: ids,
						type: types
						//					id:orderId
					}
				}

				Message.loading();
				resource.save(_json, function(response) {
					//console.log('getinfo');
					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(angular.isArray(ids) == false) {
							$state.go('goods.onlineorderInfo');
						} else if(angular.isArray(ids) == true) {
							$state.go('goods.onlineorderInfo');
						}

					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//展示订单
			showorder: function(ordertype) {
				var deferred = $q.defer();
				var _json = {}
				if(ordertype != '') {
					_json = {
						op: 'checkorder',
						type: ordertype
						//					id:orderId
					}
				} else {
					_json = {
						op: 'checkorder'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						deferred.resolve(response);
						//						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			getcartsList: function() {
				Message.loading();
				var deferred = $q.defer();
				resource.get({
					op: 'cartList'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			updateNum: function(id, num) {
				console.log(id);
				console.log(num);
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'updatenum',
					cartid: id,
					num: num
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
					//					if(response.code==0){
					//						deferred.resolve(response.data);
					//					}else{
					//						Message.show(response.msg);
					//					}

				});
				return deferred.promise;
			},
			//删除购物车商品
			removeCart: function(ids) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'delcart',
					cartid: ids
				}, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
						Message.show('删除成功')
					} else {
						Message.show('删除失败,请重新操作');
					}
				});
				return deferred.promise;
			},
			//商品分类
			//			getCateList: function(spid) {
			//				Message.loading();
			//				var deferred = $q.defer();
			//				var res= $resource(ENV.YD_URL, {do: 'shops',op:'@op'});
			//				res.get({
			//					op: 'cate',
			//					spid: spid
			//				}, function(response) {
			//					Message.hidden();
			//					console.log(response);
			//					if(response.code==0){
			//						deferred.resolve(response);
			//					}else{
			//						Message.show(response.msg);
			//					}
			//					
			//				});
			//				return deferred.promise;
			//			}

		}
	})
	// 商家
	.factory('Shop', function($resource, $rootScope, $stateParams, $ionicLoading, ENV, $q, Message, $timeout) {
		var resource = $resource(ENV.YD_URL, {
			do: 'shops',
			op: "@op"
		});
		return {
			onshopsCateList: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				//console.log(spid);
				resource.save({
					op: 'onlineshopcate',
					spid: spid
				}, function(response) {
					Message.hidden();
					console.log(response);
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			shoprepoApply: function(pasa, type) {
				var deferred = $q.defer();
				if(type == 1) {
					var _json = {
						op: 'accountApply',
						cname: pasa.cname,
						mobile: pasa.mobile,
						withType: type,
						username: pasa.alipayAccount,
						uname: pasa.alipayName,
						price: pasa.price
					}
				} else if(type == 2) {
					var _json = {
						op: 'accountApply',
						cname: pasa.cname,
						mobile: pasa.mobile,
						withType: type,
						username: pasa.bankInfo.bankCard,
						uname: pasa.bankInfo.realname,
						cardType: pasa.bankInfo.bankName,
						subbranch: pasa.bankInfo.subbranch,
						price: pasa.price
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						$timeout(function() {
							Message.show('申请成功！');
						}, 1200);
						$state.go('shops.shopMoneyCenter');

					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			lineshopnear: function(types, pages) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {};
				var page = pages || 1;
				if(types == 'more') {
					_json = {
						op: 'lineshopnear',
						showmore: 'more',
						page: page
					}
				} else {
					_json = {
						op: 'lineshopnear'
					}
				}
				//console.log(spid);
				resource.save(_json, function(response) {
					//					console.log(response);
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getShopsDetail: function(spid) {
				Message.loading();
				var res = $resource(ENV.YD_URL, {
					do: 'shops',
					op: 'shopsInfo'
				});
				var deferred = $q.defer();
				//console.log(spid);
				res.save({
					op: 'shopsInfo',
					spid: spid
				}, function(response) {
					//					console.log(response);
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			//商家货款信息
			shopMoney: function() {
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'account',
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			iscollect: function(spid, uid, goodsid) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({
					op: 'shopcollect',
					spid: spid,
					uid: uid,
					goodsId: goodsid
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			praise: function(spid) {
				var res = $resource(ENV.YD_URL, {
					do: 'users'
				});
				var deferred = $q.defer();
				res.save({
					op: 'followShops',
					spid: spid
				}, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//商家激励类型
			getshopRebateType: function() {
				var deferred = $q.defer();
				resource.save({
					op: 'shopRebateType'
				}, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			/*获取周边商家列表*/
			//获取城市
			getAllCity: function(success, error) {
				$resource('lib/area.json').get(success, error);
			},
			//商家基本信息
			getShops: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'users'
				});
				var _json = {
					op: 'getShopsInfo',
					spid: spid
				}
				res.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
						//						$state.go('tab.tcmytc');
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 用户扫码后商家信息
			getUshops: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				//				var res = $resource(ENV.YD_URL, {
				//					do: 'shops'
				//				});
				var _json = {
					op: 'getShopsInfo',
					spid: spid
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 商家二维码
			shopQrcode: function() {
				Message.loading();
				var res = $resource(ENV.YD_URL, {
					do: 'users'
				});
				var deferred = $q.defer();
				res.save({
					op: 'getQrcode'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response.data);
				});
				return deferred.promise;
			}
		};
	})

	// 用户登录、注册、找回密码
	.factory('Auth', function($resource, $rootScope, $q, ENV, Message, $state, Storage, $ionicHistory, Jpush) {
		// var resource = $resource(ENV.YD_URL + '?do=auth', {op: "@op"});
		var resource = $resource(ENV.YD_URL + '&do=auth', {
			op: "@op"
		});
		var checkMobile = function(mobile) {
			if(!ENV.REGULAR_MOBILE.test(mobile)) {
				Message.show('请输入正确的11位手机号码', 800);
				return false;
			} else {
				return true;
			}
		};

		var checkPwd = function(pwd) {
			if(!pwd || pwd.length < 6) {
				Message.show('请输入正确的密码(最少6位)', 800);
				return false;
			}
			return true;
		};

		return {
			// 用户注册协议
			fetchAgreement: function() {
				var deferred = $q.defer();
				resource.get({
					op: 'agreement'
				}, function(response) {
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			// 登陆操作
			login: function(mobile, password) {

				//				if (!checkMobile(mobile)) {
				//					return false;
				//				}
				if(!checkPwd(password)) {
					return false;
				}
				Message.loading('登陆中……');
				//	Message.show('登陆成功', 1500);
				resource.save({
					op: 'login',
					mobile: mobile,
					password: password
				}, function(response) {
					console.log(response);
					if(response.code == 0) {
						Message.show('登陆成功', 1000);
						Storage.set("user", response.data);
						$rootScope.globalInfo.user = response.data;
						if(response.data.mobile == '') {
							$state.go('auth.addMobile', {
								uid: response.data.uid
							})
							return
						}
						//                       Jpush.setTagsWithAlias();
						//						Jpush.loginIm(mobile, mobile)
						if($ionicHistory.backView()) {
							if($ionicHistory.backView().stateName == 'poorson.introPage') {
								$state.go('tab.online', {
									iscache: 'false'
								});
							} else if($ionicHistory.backView().stateName == 'user.changeMobile') {
								$state.go('tab.online', {
									iscache: 'false'
								});
							} else {
								$ionicHistory.goBack()
							}
						} else {
							$state.go('tab.online', {
								iscache: 'false'
							});
						}

					} else {
						Message.show(response.msg, 1000);
					}
				}, function() {
					Message.show('通信错误，请检查网络', 1500);
				});
			},
			otherLogin: function(type, info) {
				resource.save({
					op: 'thirdLogin',
					info: info,
					type: type
				}, function(response) {
					//				alert(JSON.stringify(response))
					if(response.code == 0) {
						Message.show('登陆成功', 1500);
						Storage.set("user", response.data);
						$rootScope.globalInfo.user = response.data;
						Jpush.setTagsWithAlias();
						if($ionicHistory.backView()) {
							if($ionicHistory.backView() == 'poorson.introPage') {
								$state.go('tab.online', {
									iscache: 'false'
								});
							} else {
								$ionicHistory.goBack()
							}
						} else {
							$state.go('tab.online', {
								iscache: 'false'
							});
						}

					} else if(response.code == 307) {
						//前去绑定手机号
						$state.go('auth.addMobile', {
							uid: response.data,
							logintype: type
						})
					} else {
						// code 1 失败 
						Message.show(response.msg, 1500);
					}
				}, function() {
					Message.show('通信错误，请检查网络', 1500);
				});
			},
			//获取验证码
			getSmsCaptcha: function(type, tMobile, mobile, pictureCaptcha, when) {
				if(!checkMobile(mobile)) {
					return false;
				}
				var deferred = $q.defer();
				Message.loading('加载中');
				if(when && when == "sendAgain") {
					var _json = {
						op: "register",
						type: type,
						tMobile: tMobile,
						mobile: mobile,
						pictureCaptcha: pictureCaptcha,
						checkMess: 1
					};
				} else {
					var _json = {
						op: "register",
						type: type,
						tMobile: tMobile,
						mobile: mobile,
						pictureCaptcha: pictureCaptcha
					};
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code !== 0) {
						Message.show(response.msg);
						if(response.code == 2) {
							deferred.reject();
						}
						return false;
					} else {
						deferred.resolve();
					}
				});
				return deferred.promise;
			},
			//获取验证码 绑定手机号
			addPhone: function(type, info, logintype) {
				var _json = {}
				if(type == 'send') {
					_json = {
						op: 'bindPhone',
						type: type,
						mobile: info.mobile
					}
				}
				if(type == 'check') {
					_json = {
						op: 'bindPhone',
						type: type,
						mobile: info.mobile,
						uid: info.uid,
						code: info.code,
						//						logintype: logintype
					}
				}
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					//					if (type == 'check') {
					//						 alert(JSON.stringify(response))
					//					}
					Message.hidden();
					deferred.resolve();
					if(response.code == 0) {
						if(type == 'check') {
							Message.show('绑定成功', 1500);
							var newinfo = Storage.get("user")
							newinfo.mobile = info.mobile;
							Storage.set("user", newinfo);
							$rootScope.globalInfo.user = newinfo;
							//							Jpush.setTagsWithAlias();
							$state.go('tab.online', {
								iscache: 'false'
							});
						}
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//获取验证码 绑定手机号
			//			addMobile: function (type, info, logintype) {
			//				var _json = {
			//				}
			//				if (type == 'send') {
			//					_json = {
			//						op: 'bindMobile',
			//						type: type,
			//						mobile: info.mobile
			//					}
			//				}
			//				if (type == 'check') {
			//					_json = {
			//						op: 'bindMobile',
			//						type: type,
			//						mobile: info.mobile,
			//						uid: info.uid,
			//						code: info.code,
			//						logintype: logintype
			//					}
			//				}
			//				var deferred = $q.defer();
			//				resource.save(_json, function (response) {
			//					if (type == 'check') {
			//						// alert(JSON.stringify(response))
			//					}
			//					Message.hidden();
			//					deferred.resolve();
			//					if (response.code == 0) {
			//						if (type == 'check') {
			//							Message.show('绑定成功', 1500);
			//							Storage.set("user", response.data);
			//							$rootScope.globalInfo.user = response.data;
			//							Jpush.setTagsWithAlias();
			//							$state.go('tab.online', {
			//								iscache: 'false'
			//							});
			//						}
			//					} else {
			//						Message.show(response.msg);
			//					}
			//				});
			//				return deferred.promise;
			//			},
			getoneLogin: function(success, error) {
				var res = $resource(ENV.YD_URL + '?do=api');
				res.save({
					op: 'nav'
				}, success, error);
			},
			//忘记密码获取验证码
			getCaptcha: function(success, error, mobile) {
				if(!checkMobile(mobile)) {
					return false;
				}
				var _json = {
					op: 'forget',
					type: 'send',
					mobile: mobile
				};
				Message.loading();
				resource.save(_json, success, error);
			},
			//检查验证码
			checkCaptain: function(mobile, captcha, type) {
				if(!checkMobile(mobile)) {
					return false;
				}
				var _json = {
					op: 'register',
					type: 'verifycode',
					mobile: mobile,
					code: captcha
				};

				if(type) {
					_json = {
						op: 'forget',
						type: 'verifycode',
						mobile: mobile,
						code: captcha
					};
				}

				Message.loading();

				return resource.get(_json, function(response) {
					console.log(response);
					if(response.code !== 0) {
						Message.show(response.msg, 1500);
						return;
					}
					$rootScope.$broadcast('Captcha.success');
					Message.show(response.msg, 1000);
				}, function() {
					Message.show('通信错误，请检查网络！', 1500);
				});
			},

			/*设置密码*/
			setPassword: function(reg, type) {
				if(reg.password.length < 6) {
					Message.show('密码长度不能小于6位！', 1500);
					return false;
				}
				if(reg.password != reg.rePassword) {
					Message.show('两次密码不一致，请检查！', 1500);
					return false;
				}
				var _json = {
					op: 'register',
					tMobile: reg.tMobile,
					mobile: reg.mobile,
					password: reg.password,
					repassword: reg.rePassword,
					code: reg.captcha
				};

				if(type) {
					_json = {
						op: 'forget',
						mobile: reg.mobile,
						password: reg.password,
						repassword: reg.rePassword,
						code: reg.captcha
					};
				}

				Message.loading();
				return resource.get(_json, function(response) {
					if(response.code !== 0) {
						Message.show(response.msg, 1500);
						return;
					}
					// Jpush.initIm(reg.mobile, reg.mobile);
					$state.go('auth.login');
					Message.show("密码设置成功，请重新登录！", 1500);
				}, function() {
					Message.show('通信错误，请检查网络！', 1500);
				});
			},
			// 获取头像
			getUserLogo: function() {
				var res = $resource(ENV.YD_URL + '?do=api');
				var deferred = $q.defer();
				res.get({
					op: 'logo'
				}, function(response) {
					console.log(response);
					deferred.resolve(response.data);
				});
			}
		}
	})

	.factory('User', function($resource, $rootScope, $q, $ionicLoading, ENV, $ionicPopup, $state, Message, $timeout, Storage, $ionicHistory) {
		var resource = $resource(ENV.YD_URL, {
			do: 'users',
			op: '@op'
		});
		return {
			//
			taoCollect:function(type,goodsId){
				var deferred = $q.defer();
				var _json = {
					op: 'taocollect',
					type:type,
					goodsId:goodsId
				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			// 代理余额提现记录解冻
			agentWithDrawRelease: function(id) {
				var deferred = $q.defer();
				var _json = {
					op: 'agentWithDrawRelease',
					id: id
				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getbanner: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'virtual'
				}
				resource.save(_json, function(response) {
						// Message.hidden();
						//					console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			// 代理余额提现记录
			agentWithDrawList: function(select, agentId, page) {
				var deferred = $q.defer();
				var _json = {
					op: 'agentWithdraw',
					type: 'list',
					select: select,
					id: agentId,
					page: page || 1
				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			// 代理余额提现申请
			agentWithDraw: function(repoInfo, agentInfo) {

				var deferred = $q.defer();
				var _json = {
					op: 'agentWithdraw',
					type: 'apply',
					price: repoInfo.bean,
					password: repoInfo.passwords,
					agentId: agentInfo.agentId
				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							deferred.reject(response);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			// 代理余额明细和代理优惠券明细
			getAgentBalanceList: function(agentId, levelClass, page) {
				var deferred = $q.defer();
				var _json = {
					op: 'agentAssets',
					type: 'list',
					id: agentId,
					class: levelClass,
					page: page || 1
				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			// 代理中心数据
			getAgentCenterInfo: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'agentAssets',
					type: 'count '

				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			// 获取历史数据
			getHistoryData: function(page) {

				var res = $resource(ENV.YD_URL, {
					do: 'home'
				});
				var deferred = $q.defer();
				var _json = {
					op: 'awardHistory',
				}
				res.save(_json, function(res) {

						if(res.code == 0) {

							deferred.resolve(res);
						} else {
							Message.show(res.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			// 获取赠品券
			getWhiteIntegral: function(page) {
				var deferred = $q.defer();
				var _json = {
					op: 'whiteIntegral',
					page: page || 1
				}
				resource.save(_json, function(response) {

						if(response.code == 0) {

							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			qianDaoDate: function(uid) {
				var resource = $resource(ENV.YD_URL, {
					do: 'sign'
				});
				var deferred = $q.defer();
				var _json = {
					op: 'index',
					uid: uid
				}
				resource.get(_json, function(res) {
					if(res.code == 0) {
						deferred.resolve(res);
					} else {
						Message.show(res.msg)
					}

				}, function() {
					console.log('error')
				}, function() {
					console.log(deferred.promise)
				});
				return deferred.promise;
			},
			checkAuth: function() {
				return(Storage.get('user') && Storage.get('user').uid != '' && Storage.get('user').uid != undefined);
			},
			/*退出登录*/
			logout: function() {
				Storage.remove('user');
				$rootScope.globalInfo.user = {
					uid: '',
					isShop: 0
				}
				$ionicHistory.clearCache();
				$ionicHistory.clearHistory();
				Message.show('退出成功！', '1500', function() {
					$state.go("tab.online");
				});
			},
			//分享注册
			shareregsiterinfo: function(type) {
				var deferred = $q.defer();
				var _json = {
					op: 'registerconfig',
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//分享出去的参数
			sharelink: function() {
				var deferred = $q.defer();
				resource.get({
					op: 'sharewithme'
				}, function(response) {
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//实名认证
			identifyName: function(type, info) {
				var deferred = $q.defer();
				if(type) {
					var _json = {
						op: "identifyName",
						frontImg: info.frontImg, //正面
						idNumber: info.idNumber, //身份证号
						userName: info.userName, //姓名
						handImg: info.handImg, //手持照
						turnImg: info.turnImg, //反面
						type: "save"
					};
				} else {
					var _json = {
						op: "identifyName"
					};
				}
				resource.save(_json, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//aixinlianmeng代理利益
			unionclassinfo: function(type) {
				var deferred = $q.defer();
				var _json = {
					op: 'unionclass',
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//区域代理申请
			areaApply: function(info, areas) {
				var deferred = $q.defer();
				var _json = {
					op: 'agentApplyfor',
					userName: info.userName,
					idcard: info.idcard,
					agentArea: areas,
					address: info.address,
					mobile: info.mobile,
					myDescrip: info.myDescrip,
					qq: info.qq,
					rec_mobile: info.rec_mobile
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
						if(response.code == 0) {
							Message.show(response.msg);
							$timeout(function() {
								$state.go('user.agentApplyresult');
							}, 100)
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//区域代理查询
			agentQuery: function(agentArea) {
				var deferred = $q.defer();
				var _json = {
					op: 'checkAgent',
					agentArea: agentArea
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//申请结果列表
			agentapplyResult: function(page) {
				var deferred = $q.defer();
				var page = page || 1;
				var _json = {
					op: 'agentResult',
					//					page:page
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//aixinlianmeng中心信息
			getunioninfo: function(type) {
				var deferred = $q.defer();
				var _json = {}
				if(type == 'shop') {
					_json = {
						op: 'unioncenterinfo',
						type: 'shop'
					}
				} else {
					_json = {
						op: 'unioncenterinfo'
					}
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//申请aixinlianmeng
			applyunion: function(applytype, type, info) {
				var deferred = $q.defer();
				var _json = {}
				if(type == 'save') {
					_json = {
						op: 'lovehomeapply',
						applytype: applytype,
						info: info,
						type: 'save'
					}
				} else if(type == 'jobcate') {
					_json = {
						type: 'jobcate',
						applytype: applytype,
						op: 'lovehomeapply'
					}
				} else if(type == 'check') {
					_json = {
						type: 'check',
						applytype: applytype,
						op: 'lovehomeapply'
					}
				} else {
					_json = {
						applytype: applytype,
						op: 'lovehomeapply'
					}
				}

				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//商家服务信息
			saveserveinfo: function(type, info) {
				var deferred = $q.defer();
				var _json = {}
				if(type == 'save') {
					_json = {
						op: 'lineshopsmessage',
						spid: $rootScope.globalInfo.user.isShop,
						qq: info.qq,
						serveinfo: info.serveinfo,
						type: 'save'
					}
				} else {
					_json = {
						op: 'lineshopsmessage',
						spid: $rootScope.globalInfo.user.isShop
					}
				}

				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//余额支付获取验证码
			getbalancecode: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'getBalanceVerify'
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
						Message.show(response.msg);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//检查用户信息
			checkjobinfo: function(ids) {
				var deferred = $q.defer();
				var _json = {
					op: 'checkunionjob',
					id: ids
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//chuandishizhe
			chuandishizheinfo: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'chuandiinfo'
				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//aixinshizhe
			applyunioninfo: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'applyunioninfo'
				}
				resource.save(_json, function(response) {
						//						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			aixinshizheinfo: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'messenger'
				}
				resource.save(_json, function(response) {
						//						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//大使信息
			ambassadorinfo: function(type) {
				var deferred = $q.defer();
				var _json = {
					op: 'ambassador',
					type: type
				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//申请大使
			applyAmbass: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'becomeAmbassNoMoney'
				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//新闻动态
			getservenews: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'ambassador'
				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},

			//商家申请信息展示
			getShopsDetail: function(infotypes, infos, operate) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(infotypes == 'info') {
					if(operate) {
						_json = {
							op: 'shopsdetail',
							infotype: infotypes,
							spid: $rootScope.globalInfo.user.isShop,
							info: infos,
							operate: operate
						}
					} else {
						_json = {
							op: 'shopsdetail',
							infotype: infotypes,
							spid: $rootScope.globalInfo.user.isShop,
						}
					}

				} else if(infotypes == 'images') {
					if(operate) {
						_json = {
							op: 'shopsdetail',
							infotype: infotypes,
							spid: $rootScope.globalInfo.user.isShop,
							info: infos,
							operate: operate
						}
					} else {
						_json = {
							op: 'shopsdetail',
							infotype: infotypes,
							spid: $rootScope.globalInfo.user.isShop,
						}
					}
				}
				resource.save(_json, function(response) {
						console.log(response);
						Message.hidden();
						if(response.code == 0) {
							deferred.resolve(response);
						} else if(response.code == 2) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			checkShop: function(info) {
				var deferred = $q.defer();
				if(info && info.lng) {
					var _json = {
						op: 'checkShop',
						lng: info.lng,
						lat: info.lat
					}
				} else {
					var _json = {
						op: 'checkShop',
						photo: info.photo || "img.png",
						logo: info.logo || 'img.png'
					}
				}
				resource.save(_json, function(response) {
						console.log(response);
						console.log(info)
						deferred.resolve(response);
						if(response.code == 0) {
							if(info && info.lng && info.lng != '') {
								$state.go('shops.shop')
							} else {
								$state.go('shops.shopPosition')
							}
						} else if(response.code == 2) {
							if(info && info.lng && info.lng != '') {
								$state.go('shops.shop')
							} else {
								$state.go('shops.shopPosition')
							}

						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//收藏
			getcollect: function(sures, spid, id) {
				var deferred = $q.defer();
				var _json = {
					op: 'onlinecollect',
					sures: sures,
					spid: spid,
					goodsId: id
				}
				resource.save(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else if(response.code == 2) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//收藏列表
			getcollectlist: function(types, ids, operates) {
				var deferred = $q.defer();
				var _json = {}
				if(types == 'goods') {
					if(operates != '') {
						_json = {
							op: 'onlinecollectlist',
							type: 'goods',
							operate: operates,
							goodsId: ids
						}
					} else {
						_json = {
							op: 'onlinecollectlist',
							type: 'goods'
						}
					}
				} else if(types == 'shops') {
					if(operates != '') {
						_json = {
							op: 'onlinecollectlist',
							type: 'shops',
							operate: operates,
							spid: ids
						}
					} else {
						_json = {
							op: 'onlinecollectlist',
							type: 'shops'
						}
					}
				}
				resource.save(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else if(response.code == 2) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//商家线下订单
			shoplineOrder: function(ordertypes, pages) {
				var deferred = $q.defer();
				var page = pages || 1;
				var _json = {
					op: 'shoplineorder',
					spid: $rootScope.globalInfo.user.isShop,
					ordertype: ordertypes,
					page: page

				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//商家线上订单
			shoponlineOrder: function(spid, orderStatus, pages) {
				var deferred = $q.defer();
				var page = pages || 1;
				var _json = {
					op: 'shoponlineorder',
					spid: spid,
					orderStatus: orderStatus,
					page: page
				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//商品管理
			managegoods: function(operate, spid) {
				var deferred = $q.defer();
				var _json = {
					op: 'managegoods',
					goodstate: operate,
					spid: spid
				}
				resource.save(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//我的消费
			getconsume: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'orderList'
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							//Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getloves: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'lovesinfo'
				};
				resource.get(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getloveslist: function(page) {
				var deferred = $q.defer();
				var _json = {
					op: 'loveslist',
					page: page || 1
				};
				resource.get(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			couponList: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'heartMonth'
				};
				resource.get(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			lovesawardlist: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'awardlist'
				};
				resource.get(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//我的上级
			getMysuperior: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'getParent'
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							//Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//股权兑换明细
			getstockrechargelist: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'stocklist'
				};
				resource.get(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//股权信息
			getstockinfo: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'stockinfo'
				};
				resource.get(_json, function(response) {
						console.log(response);
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//股权兑换申请
			stockapply: function(nums) {
				var deferred = $q.defer();
				var _json = {
					op: 'buystock',
					num: nums
				};
				resource.get(_json, function(response) {
						if(response.code == 0) {
							$state.go('my.stockrightdetail');
						} else {
							Message.show(response.msg)
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//修改昵称
			setnickname: function(nickname) {
				var deferred = $q.defer();
				var _json = {
					op: 'saveInfo',
					nickname: nickname
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//团队
			getinvitainfo: function(level) {
				var deferred = $q.defer();
				//				var level= level||1;
				var _json = {
					op: 'getChild',
					level: level
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//检查用户信息
			checkuserinfo: function(mobile) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'checkUserInfo',
					mobile: mobile
				};
				resource.get(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//获取用户信息
			getuserinfo: function() {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'userinfo'
				};
				resource.get(_json, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//获取余额
			getBalance: function() {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'balance'
				};
				resource.get(_json, function(response) {
					Message.hidden();
					console.log(response);
					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//充值余额生成订单
			rechargealance: function(type, nums) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'rechargeBalance',
					payType: type,
					price: nums
				};
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						$state.go('my.balarechargepage', {
							'orderid': response.data.orderId
						})
					} else {
						Message.show(response.msg);
					}

					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 实名认证
			getRealName: function(pasa, type) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {};
				if(type) {
					_json = {
						op: 'certification',
						type: 'save',
						realname: pasa.realname,
						gender: pasa.gender,
						//						mobile: pasa.mobile,
						//						code: pasa.code
					}
				} else {
					_json = {
						op: 'certification'
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.center');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 实名认证获取验证码
			realNamePwd: function(pasa) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'certification',
					type: 'send',
					realname: pasa.realname,
					gender: pasa.gender,
					idcard: pasa.idcard
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 修改登录及支付密码 获取验证码
			getCaptcha: function(oldpsd, newpsd, respsd, type) {
				var _json = {};
				Message.loading();
				var deferred = $q.defer();
				if(type == 1) {
					_json = {
						op: 'updatePassword',
						type: 'send',
						userPassword: oldpsd,
						password: newpsd,
						repassword: respsd
					}
				} else if(type == 2) {
					_json = {
						op: 'updatePayPassword',
						type: 'send',
						userPassword: oldpsd,
						password: newpsd,
						repassword: respsd
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 忘记密码获取验证码
			resetPwd: function(newpsd, respsd) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'forgetPayPassword',
					type: 'send',
					password: newpsd,
					repassword: respsd
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 修改登录密码
			changeLoginPsd: function(oldpsd, code, newpsd, respsd) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'updatePassword',
					userPassword: oldpsd,
					//					code: code,
					password: newpsd,
					repassword: respsd
				};
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.safesetting');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 修改支付密码
			changePayPsd: function(oldpsd, code, newpsd, respsd) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'updatePayPassword',
					userPassword: oldpsd,
					code: code,
					password: newpsd,
					repassword: respsd
				};
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.safesetting');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 换绑手机号
			changeMobile: function(info, type) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'changeMobile',
					mobile: info.mobile,
					code: info.code,
					password: info.psd,
					type: type
				};
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 忘记支付密码提交修改
			resetPayPsd: function(newpsd, respsd, code) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'forgetPayPassword',
					code: code,
					password: newpsd,
					repassword: respsd
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$ionicHistory.goBack();
						//						$state.go('user.safesetting');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 消费收益
			getprofit: function() {
				var deferred = $q.defer();
				//				var _json = {};
				//				if(types){
				//					_json = {
				//						op: 'getGive',
				//						giveUid: pasa.userId,
				//						bean: pasa.giveBeanNum,
				//						password: pasa.payPassword,
				//						type: 'save'
				//					}
				//				}else{
				//					_json = {
				//						op: 'getGive'
				//					}
				//				}
				Message.loading();
				resource.save({
					op: 'getProfit'
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 用户帮助列表
			useHelp: function(type, page) {
				var res = $resource(ENV.YD_URL, {
					do: 'article',
					op: '@op'
				});
				var deferred = $q.defer();
				page = page || 1
				var _json = {
					op: 'helpList',
					type: type,
					page: page
				};
				Message.loading();
				res.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 用户帮助列表详情
			helpInfo: function(id) {
				var deferred = $q.defer();
				var _json = {
					op: 'helpInfo',
					id: id
				};
				Message.loading();
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else {
						Message.show(response.msg);
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 衣服是否要
			isbuyGilft: function() {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				resource.save({
					op: 'isBuyGift',
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 大使购买
			buyambassador: function(id, types, buyClothes) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(types == 'address') {
					_json = {
						op: 'applyambassador',
						id: id,
						//					type: types,
						address: types,
						//					buyClothes: buyClothes
					}
				} else {
					_json = {
						op: 'applyambassador',
						id: id,
						type: types,
						//					buyClothes: buyClothes
					}
				}
				resource.save(_json, function(response) {
					console.log(response);
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 消费单元
			consumeList: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getUnit'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 推荐商家收益
			remshopProfit: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getShopProfit'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 推荐会员收益remmemProfit   t, pasa
			remmemProfit: function() {
				var deferred = $q.defer();
				//				var _json = {};
				//				if(t){
				//					_json = {
				//						op: 'withdraw',
				//						bean: pasa.bean,
				//						password: pasa.password,
				//						type: 'save'
				//					}
				//				}else{
				//					_json = {
				//						op: 'withdraw'
				//					}
				//				}
				Message.loading();
				resource.save({
					'op': 'getMemberProfit'
				}, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response.data);
						//						if(t){
						//							$timeout(function () {
						//								Message.show('提交成功！');
						//							}, 1200);
						//							$state.go('user.repoList');
						//						}
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 收货地址列表
			getaddresslist: function(t, id, info, areas) {
				var deferred = $q.defer();
				var _json = {};
				if(t == 'select') {
					_json = {
						op: 'addressList',
						id: id,
						type: 'save'
					}
				} else if(t == 'delete') {
					_json = {
						op: 'addressList',
						id: id,
						type: 'delete'
					}
				} else if(t == 'order') {
					_json = {
						op: 'addressList',
						id: id,
						type: 'order'
					}
				} else if(t == 'edit') {
					if(info) {
						_json = {
							op: 'addressList',
							id: id,
							username: info.username,
							mobile: info.mobile,
							birth: areas,
							address: info.address,
							isDefault: info.isDefault,
							type: 'edit'
						}
					} else {
						_json = {
							op: 'addressList',
							id: id,
							type: 'edit'
						}
					}

				} else {
					_json = {
						op: 'addressList'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(t == 'select') {
						if(response.code == 0) {
							deferred.resolve(response.data);
							//							$state.go('shops.orderInfo',{id:Storage.get('goodsid')});
							$state.go('goods.onlineorderInfo');
							Storage.remove('goodsid');
						} else if(response.code == 1) {
							Message.show(response.msg);
						}
					} else if(t == 'delete') {
						deferred.resolve(response);
						if(response.code == 1) {
							Message.show(response.msg);
							return;
						}
					} else if(t == 'order') {
						deferred.resolve(response);
						if(response.code == 0) {
							$state.go('goods.onlineorderInfo');

						} else {
							Message.show(response.msg);
						}
					} else if(t == 'edit') {
						deferred.resolve(response);
						//						if(response.code == 0) {
						//							$state.go('goods.onlineorderInfo');
						//							
						//						}else{
						//							Message.show(response.msg);
						//						}
					} else {
						if(response.code == 0) {
							deferred.resolve(response.data);
						} else if(response.code == 1) {
							Message.show(response.msg);
						}
					}
				});
				return deferred.promise;
			},
			addAddress: function(pasa, birth) {
				var deferred = $q.defer();
				var _json = {
					op: 'addAddress',
					username: pasa.userName,
					mobile: pasa.mobile,
					birth: birth,
					address: pasa.address,
					isDefault: pasa.isDefault
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 银行卡列表
			getBank: function(t, id, from) {
				var deferred = $q.defer();
				var _json = {};
				if(t == 'select') {
					_json = {
						op: 'getBank',
						id: id,
						type: 'save'
					}
				} else if(t == 'delete') {
					_json = {
						op: 'getBank',
						id: id,
						type: 'delete'
					}
				} else {
					_json = {
						op: 'getBank'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(t == 'select') {
						if(response.code == 0) {
							deferred.resolve(response.data);
							if(from == 'shoprepo') {
								$state.go('shops.shopRepo');
							} else {
								$state.go('user.repo');
							}
						} else if(response.code == 1) {
							Message.show(response.msg);
						}
					} else if(t == 'delete') {
						deferred.resolve(response);
						if(response.code == 1) {
							Message.show(response.msg);
							return;
						}
					} else {
						if(response.code == 0) {
							deferred.resolve(response.data);
						} else if(response.code == 1) {
							Message.show(response.msg);
						}
					}
				});
				return deferred.promise;
			},
			// 添加银行卡
			getBankInfo: function(t, pasa) {
				var deferred = $q.defer();
				var _json = {};
				if(t) {
					_json = {
						op: 'getBankInfo',
						realname: pasa.userName,
						bankName: pasa.bankName,
						bankDown: pasa.bankDown,
						idCard: pasa.idCard,
						bankCard: pasa.bankCard,
						mobile: pasa.mobile,
						type: 'save'
					}
				} else {
					_json = {
						op: 'getBankInfo'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//收货地址
			getAddress: function(t, pasa) {
				var deferred = $q.defer();
				var _json = {};
				if(t) {
					_json = {
						op: 'address',
						price: pasa.bean,
						password: pasa.password,
						type: 'save'
					}
				} else {
					_json = {
						op: 'address'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
						if(t) {
							$timeout(function() {
								Message.show('提交成功！');
							}, 1200);
							$state.go('user.repoList');
						}
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//余额转账
			balanceOut: function(info, t) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {};
				if(t) {
					_json = {
						op: 'balanceOut',
						userMobile: info.userMobile,
						num: info.num,
						type: 'save'
					}
				} else {
					_json = {
						op: 'balanceOut'
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							$timeout(function() {
								Message.show('提交成功！');
							}, 1000);
							$state.go('goods.transferPay', {
								payId: response.data.payId,
								payMoney: response.data.payMoney
							});
						}
					} else if(response.code == 301) {
						var confirmPopup = $ionicPopup.confirm({
							ftitle: '提示',
							template: '您还没有实名，请前去认证',
							okText: '去认证',
							cancelText: '取消'
						});
						confirmPopup.then(function(res) {
							if(res) {
								$state.go('user.identifyname');
							} else {
								$ionicHistory.goBack()
							}
						});
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//代金券转账
			disDalanceOut: function(info, t) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {};
				if(t) {
					_json = {
						op: 'disDalanceOut',
						userMobile: info.userMobile,
						num: info.num,
						type: 'save'
					}
				} else {
					_json = {
						op: 'disDalanceOut'
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							$timeout(function() {
								Message.show('提交成功！');
							}, 1000);
							$state.go('goods.transferPay', {
								payId: response.data.payId,
								payMoney: response.data.payMoney
							});
						}
					} else if(response.code == 301) {
						var confirmPopup = $ionicPopup.confirm({
							ftitle: '提示',
							template: '您还没有实名，请前去认证',
							okText: '去认证',
							cancelText: '取消'
						});
						confirmPopup.then(function(res) {
							if(res) {
								$state.go('user.identifyname');
							} else {
								$ionicHistory.goBack()
							}
						});
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//代金券转账
			redIntegralOut: function(info, t) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {};
				if(t) {
					_json = {
						op: 'redIntegralOut',
						userMobile: info.userMobile,
						num: info.num,
						type: 'save'
					}
				} else {
					_json = {
						op: 'redIntegralOut'
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							$timeout(function() {
								Message.show('提交成功！');
							}, 1000);
							$state.go('goods.transferPay', {
								payId: response.data.payId,
								payMoney: response.data.payMoney
							});
						}
					} else if(response.code == 301) {
						var confirmPopup = $ionicPopup.confirm({
							ftitle: '提示',
							template: '您还没有实名，请前去认证',
							okText: '去认证',
							cancelText: '取消'
						});
						confirmPopup.then(function(res) {
							if(res) {
								$state.go('user.identifyname');
							} else {
								$ionicHistory.goBack()
							}
						});
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//代金券转账
			usefulVoucherList: function() {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: 'usefulVoucherList'
				}
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//代金券转账
			whiteIntegralOut: function(info, t) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {};
				if(t == 'self') {
					_json = {
						op: 'whiteIntegralOut',
						num: info.num,
						type: 'self'
					}
				} else if(t == 'other') {
					_json = {
						op: 'whiteIntegralOut',
						userMobile: info.userMobile,
						num: info.num,
						type: 'other'
					}
				} else {
					_json = {
						op: 'whiteIntegralOut'
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							$timeout(function() {
								Message.show('提交成功！');
							}, 1000);
							$state.go('goods.transferPay', {
								payId: response.data.payId,
								payMoney: response.data.payMoney
							});
						}
					} else if(response.code == 301) {
						var confirmPopup = $ionicPopup.confirm({
							ftitle: '提示',
							template: '您还没有实名，请前去认证',
							okText: '去认证',
							cancelText: '取消'
						});
						confirmPopup.then(function(res) {
							if(res) {
								$state.go('user.identifyname');
							} else {
								$ionicHistory.goBack()
							}
						});
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//回购
			getRepo: function(agentInfo, t, pasa) {
				var deferred = $q.defer();
				var _json = {};
				if(t && t == 'save') {
					//					if($rootScope.globalInfo.user.isShop==0){
					//						_json = {
					//						op: 'withdraw',
					//						price: pasa.bean,
					//						password: pasa.passwords,
					//						type: 'exchange',
					//						shopAccount:pasa.shopAccount
					//					}
					//					}else{
					_json = {
						op: 'withdraw',
						price: pasa.bean,
						password: pasa.passwords,
						type: 'save',
						selecedType: pasa.selecedType,

					}
					//					}
				} else {
					_json = {
						op: 'withdraw',
						agentId: agentInfo.agentId || ''

					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							$timeout(function() {
								Message.show('提现成功！');
							}, 1000);
							$state.go('user.repoList');
						}
					} else if(response.code == 1) {
						deferred.reject(response);
					} else if(response.code == 301) {
						var confirmPopup = $ionicPopup.confirm({
							ftitle: '提示',
							template: '您还没有实名，请前去认证',
							okText: '去认证',
							cancelText: '取消'
						});
						confirmPopup.then(function(res) {
							if(res) {
								$state.go('user.identifyname');

							} else {
								$ionicHistory.goBack()
							}
						});

					}
				});
				return deferred.promise;
			},
			// 余额明细列表
			baladetailList: function(type, page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'balanceList',
					type: type,
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 余额转出转入
			balanceExList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'balanceExList',
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 代金券转出转入
			disBalanceExList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'disBalanceExList',
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 优惠券转出转入
			redIntegralExList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'redIntegralExList',
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 赠品券转出转入
			whiteIntegralExList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'whiteIntegralExList',
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 回购列表
			getRepoList: function(type, page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'withdrawList',
					type: type,
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 回购单
			getRepoInfo: function(id) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getWithdrawInfo',
					id: id
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
					if(response.code == 1) {
						Message.show(response.msg);
						return;
					}
				});
				return deferred.promise;
			},
			// 直捐
			getDonate: function(t, para) {
				var deferred = $q.defer();
				var _json = {};
				if(t) {
					_json = {
						op: 'getDonate',
						bean: para.donateNum,
						password: para.password,
						type: 'save'
					}
				} else {
					_json = {
						op: 'getDonate'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							Message.show('直捐成功！');
							$timeout(function() {
								$state.go('user.donateList');
							}, 1200);
						}
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 直捐记录
			donateList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'getDonateList',
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 推荐码
			recomCode: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getUserQrcode'
				}, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 0) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 推荐记录
			recommendList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({
					op: 'histroyRecommend',
					page: page
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			myBean: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getUserBean'
				}, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			recommendBean: function(t, type, page, role) {
				var deferred = $q.defer();
				var _json = {};
				page = page || 1;
				if(t == 1) {
					_json = {
						op: 'getExcitationBean',
						type: type,
						page: page,
						role: role
					}
				} else if(t == 2) {
					_json = {
						op: 'getBeanRecUser',
						type: type,
						page: page
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 上个激励日
			getExcitation: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getDaysExcitation'
				}, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 我的爱心
			getLove: function(role) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'getLove',
					role: role
				}, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 爱心详情
			loveInfo: function(role, type, page) {
				var deferred = $q.defer();
				var _json = {};
				page = page || 1;
				_json = {
					op: 'getLoveDetails',
					role: role,
					type: type,
					page: page
				};
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getCostBalanceList: function(type, page) {
				var deferred = $q.defer();
				var _json = {};
				page = page || 1;
				_json = {
					op: 'costBalanceList',
					type: type,
					page: page
				};
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			}

		}
	})

	.factory("Area", function($resource) {
		var resource = $resource("lib/area-bak.json");
		return {
			getList: function(success, pid, cid) {
				resource.get({}, function(data) {
					success(data);
				});
			},
			getcityList: function(success) {
				var res = $resource("data/city.json");
				res.get({}, function(data) {
					success(data);
				});
			}
		}
	})

	.factory('Lbs', function(ENV, $resource) {
		var resource = $resource(ENV.YD_URL, {
			do: 'api'
		});
		/**
		 * @return {number}
		 */
		var Rad = function(d) {
			return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
		};
		return {
			calcDistance: function(p1, p2) {
				var radLat1 = Rad(p1.lat);
				var radLat2 = Rad(p2.lat);
				var a = radLat1 - radLat2;
				var b = Rad(p1.lng) - Rad(p2.lng);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10) / 10000; //输出为公里
				s = s.toFixed(2);
				return s;
			},
			getCity: function(success, error, posi) {
				return resource.get({
					op: 'getPlace',
					lat: posi.lat,
					lng: posi.lng
				}, success, error);
			}
		};
	})

	.factory('Order', function(ENV, $resource, Message, $q, $state, Storage, $timeout, $rootScope) {
		var resource = $resource(ENV.YD_URL, {
			do: 'order',
			op: '@op'
		});
		var users = Storage.get('user');
		// var subinfo=Storage.get('subinfo');
		//console.log(Storage.get('subinfo'));
		// var spid= Storage.get('spid');
		return {
			getTaoCommond: function(info) {
				console.log(info)
				Message.loading()
				var deferred = $q.defer();
				var _json = {
					op: 'get_tao_model_str',
					goods_id: info.goodsId
				};
				resource.save(_json, function(res) {
					Message.hidden()
					if(res.code == 0) {
						deferred.resolve(res);
					} else {
						Message.show(res.msg);
					}
				});
				return deferred.promise;
			},
			getCommission: function(info) {
				console.log(info)
				Message.loading()
				var deferred = $q.defer();
				var _json = {
					op: 'get_coupon_click_url',
					goods_id: info.goodsId
				};
				resource.save(_json, function(res) {
					Message.hidden()
					if(res.code == 0) {
						deferred.resolve(res);
					} else {
						Message.show(res.msg);
					}
				});
				return deferred.promise;
			},
			getRedPacket: function(payid, type) {
				var deferred = $q.defer();
				if(type && type == 'save') {
					var _json = {
						op: 'redPacket',
						payid: payid,
						type: 'save'
					}
				} else {
					var _json = {
						op: 'redPacket',
						payid: payid,
					}
				}
				resource.save(_json, function(res) {
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg)
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getRedPacketRec: function(page) {
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'users',
					op: '@op'
				});
				var _json = {
					op: 'redPacketList',
					page: page || 1,
				}
				res.save(_json, function(res) {
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg)
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			subcreate: function(money, voucher, remark, spid, orderType) {
				//				console.log(Storage.get('subinfo'));
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'create_offline',
					payPrice: money,
					orderType: orderType,
					//					uid: users.uid,
					spid: spid,
					withCredentials: true,
					userVoucher: voucher,
					remarks: remark
				};
				resource.save(_json, function(response) {
					Message.hidden();
					//	console.log('creat');
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('my.my-order', {
							'id': response.data,
							type: 'user'
						});
						//						$timeout(function () {
						//							Message.show(response.msg);
						//						}, 1200);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			exitApply: function(info, active) {
				Message.loading();
				var deferred = $q.defer();

				var _json = {
					orderId: info.id,
					reason: info.reason,
					type: info.exitId,
					price: info.money,
					op: 'orderBack'
				}
				if(active) {
					_json.submit = 'submit';
				}
				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);

					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			oncreate: function(remarksinfo, ordertype, selfReceive) {
				console.log(remarksinfo);
				Message.loading();
				var deferred = $q.defer();
				if(ordertype == 'interim') {
					var _json = {
						op: 'onCreate',
						type: ordertype,
						remarks: remarksinfo,
						site: selfReceive
					};
				} else {
					var _json = {
						op: 'onCreate',
						type: ordertype,
						//					uid: users.uid,
						//					spid: spid,
						//withCredentials: true
						//voucher: voucher,
						remarks: remarksinfo,
						site: selfReceive

					};
				}
				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('goods.onlinepay', {
							payid: response.data,
							type: 'user'
						});
						//				$timeout(function () {
						//				Message.show(response.msg);
						//						}, 1200);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			create: function(subinfo, num) {
				//		money,uid,spid,id,num
				//				console.log(Storage.get('subinfo'));
				Message.loading();
				var deferred = $q.defer();
				// var users=Storage.get('user');
				//console.log(users.uid);
				//				var subinfo = Storage.get('subinfo');
				//				console.log(subinfo.spe_price);
				var spid = subinfo.spid;
				var money = subinfo.spe_price;
				var num = Storage.get('subnum');
				var totmon = num * money;
				var _json = {
					op: 'create',
					money: totmon,
					goodsid: subinfo.id,
					uid: users.uid,
					spid: spid,
					num: num
					//withCredentials: true
					//voucher: voucher,
					//remarks: remark
				};
				resource.save(_json, function(response) {
					Storage.remove('subinfo');
					Storage.remove('subnum');
					Storage.remove('spid');
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('shops.orderInfo', {
							'id': response.data,
							type: 'user'
						});
						//						$timeout(function () {
						//							Message.show(response.msg);
						//						}, 1200);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			userlinepay: function(spid, info) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'memberLineOrder',
					payPrice: info,
					spid: spid
				}
				resource.save(_json, function(response) {
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('goods.onlinepay', {
							payid: response.data,
							type: 'user',
							from: 'offline'
						});
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getshoplinorder: function(info, spid, bili) {
				//				console.log(info);
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'shopLineOrder',
					orderList: info,
					spid: spid,
					shopsGiveRatio: bili
				}
				resource.save(_json, function(response) {
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('goods.onlinepay', {
							payid: response.data,
							type: 'shops'
						});
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//订单页面里付款获取payid
			newpayid: function(orderid) {
				var deferred = $q.defer();
				var _json = {
					op: 'getNewPayId',
					orderId: orderid
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);

				});
				return deferred.promise;
			},
			cancelorder: function(orderid, ids) {
				var deferred = $q.defer();
				var _json = {
					op: 'orderCancel',
					orderId: orderid,
					id: ids
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);

				});
				return deferred.promise;
			},
			deleteorder: function(orderid, ids) {
				var deferred = $q.defer();
				var _json = {
					op: 'orderDelete',
					orderId: orderid,
					id: ids
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);

				});
				return deferred.promise;
			},
			orderconfirm: function(orderid, ids) {
				var deferred = $q.defer();
				var _json = {
					op: 'orderConfirm',
					orderId: orderid,
					id: ids
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);

				});
				return deferred.promise;
			},
			getuserList: function(type, orderType, orderStatus, pages) {
				var deferred = $q.defer();
				page = pages || 1;
				var _json = {};
				//				console.log(orderStatus);
				if(type == 'shops') {
					_json = {
						op: 'getList',
						type: 'shops',
						orderStatus: orderStatus,
						orderType: orderType,
						page: page
					}
				} else if(type == 'user') {
					_json = {
						op: 'getList',
						type: 'user',
						orderStatus: orderStatus,
						orderType: orderType,
						page: page
					}
				} else {
					_json = {
						op: 'getList',
						type: 'user',
						orderStatus: orderStatus,
						orderType: orderType,
						page: page
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
					Storage.remove('shortStatus');
				});
				return deferred.promise;
			},
			gettaoList: function(type, pages) {
				var deferred = $q.defer();
				page = pages || 1;
				var _json = {
					op: 'taokeOrderList',
					status: type,
					page: page
				}
				Message.loading();
				resource.save(_json, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
					Storage.remove('shortStatus');
				});
				return deferred.promise;
			},
			getTaokeInput: function() {
				var deferred = $q.defer();
				resource.save({
					op: "getTaokeInput"
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;

			},

			getList: function(type, orderType, page) {
				var orderStatus = Storage.get('shortStatus');
				var deferred = $q.defer();
				page = page || 1;
				//				var _json = {};
				//				console.log(orderStatus);
				if(type == 'shops') {
					var _json = {
						op: 'getList',
						type: 'shops',
						orderStatus: orderStatus,
						payStatus: $rootScope.shortpayStatus,
						//						isComment: $rootScope.shortisComment,
						orderType: orderType,
						page: page
					}
				} else if(type == 'user') {
					var _json = {
						op: 'getList',
						type: 'user',
						orderStatus: orderStatus,
						payStatus: $rootScope.shortpayStatus,
						//						isComment: $rootScope.shortisComment,
						page: page
					}
				} else {
					var _json = {
						op: 'getList',
						type: 'shops',
						orderStatus: orderStatus,
						payStatus: $rootScope.shortpayStatus,
						//						isComment: $rootScope.shortisComment,
						page: page
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
					Storage.remove('shortStatus');
				});
				return deferred.promise;
			},
			//余额支付信息
			getbalanceInfo: function(id, type) {
				//				console.log(id);
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(type == 'ambass') {
					_json = {
						op: 'getBalancePay',
						payid: id,
						type: 'ambass'
					}
				} else {
					_json = {
						op: 'getBalancePay',
						payid: id
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			getInfo: function(id) {
				//var id=Storage.get('id');
				var deferred = $q.defer();
				var _json = {
					op: 'getInfo',
					id: id
					//id:orderId
				}
				Message.loading();
				resource.get(_json, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			refuse: function(refuseRemark, id) {
				var deferred = $q.defer();
				Message.loading();
				resource.get({
					op: 'refuse',
					refuseRemark: refuseRemark,
					id: id
				}, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			confirm: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.get({
					op: 'refuse'
				}, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			}
		};
	})
	.factory('Payment', function($resource, $rootScope, $ionicLoading, ENV, Message, $state, $q, $cordovaInAppBrowser, $ionicPopup) {
		var payType = {};
		var resource = $resource(ENV.YD_URL + '&do=payment', {
			op: '@op'
		});
		return {
			// 代金券充值
			voucherRecharge: function(info, type) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'voucherRecharge',
					money: info.num,
					payType: type
				}, function(response) {
					Message.hidden();
					if(response.code != 0) {
						Message.show(response.msg)
					}
					if(type == 'alipay') {
						cordova.plugins.alipay.payment(response.data.payInfo, function(successResults) {
							Message.show(successResults);
							if(successResults.resultStatus == "9000") {
								Message.show("支付成功");
								$state.go('user.cost-balance');
							}
						}, function(errorResults) {
							console.error('支付失败：' + errorResults);
						});
					}
					if(type == 'wechatpay') {
						Wechat.sendPaymentRequest(response.data, function(successResults) {
							Message.show("支付成功");
							$state.go('user.cost-balance');
							// $rootScope.$broadcast('payTypeWechat.updated');
						}, function(reason) {
							Message.show(angular.toJson(reason));
							console.error("支付失败:" + reason);
						});
					}
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 微信支付
			wechatPay: function(model, info, order, from, disPay) {
				//				Wechat.isInstalled('', function(reason) {
				//					Message.show('使用微信支付，请先安装微信', 2000);
				//				});
				//				Message.loading("正在打开微信支付！");
				var _json = {};
				if(model == 'welfare') {
					_json = {
						op: 'getWechat',
						/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
						model: 'welfare',
						money: info.money,
						payid: info.payid,
						spid: info.spid,
						disPay: disPay,
						paymoney: info.paymoney || '',
						dismoney: info.dismoney || ''
					}
				} else if(model == 'online') {
					_json = {
						op: 'mergeWechat',
						//						uid: $rootScope.globalInfo.user.uid,
						payid: info.payid,
						disPay: disPay,
						paymoney: info.paymoney || '',
						dismoney: info.dismoney || ''
					}
				} else {
					if(order == 'order') {
						_json = {
							op: 'getWechat',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							orderId: info,
							disPay: disPay,
							paymoney: info.paymoney || '',
							dismoney: info.dismoney || ''
						}
					} else {
						_json = {
							op: 'getWechat',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							goodsInfo: info,
							disPay: disPay,
							paymoney: info.paymoney || '',
							dismoney: info.dismoney || ''
						}
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					//					wechatParams = response.data;
					//					console.log(wechatParams);
					//          alert(angular.toJson(response.data));
					var params = {
						appid: response.data.appid,
						partnerid: response.data.partnerid, // merchant id
						prepayid: response.data.prepayid, // prepay id
						noncestr: response.data.noncestr, // nonce
						timestamp: response.data.timestamp, // timestamp
						sign: response.data.sign, // signed string
						package: response.data.package
					};
					Wechat.sendPaymentRequest(params, function(successResults) {
						Message.show("支付成功");
						if(from == 'offline') {
							$state.go('user.redPacket', {
								payid: info.payid
							});
						} else {
							$state.go('my.my-order', {
								type: 'user'
							});
						}

						// $rootScope.$broadcast('payTypeWechat.updated');
					}, function(reason) {
						Message.show(angular.toJson(reason));
						console.error("支付失败:" + reason);
					});
				}, function() {
					Message.show("通信超时，请重试！");
				});
			},
			// 微信支付
			exchangeWechatPay: function(info) {
				var _json = {
					op: 'exWechat',
					payId: info.payId,
					payMoney: info.payMoney
				}
				resource.get(_json, function(response) {
					Message.hidden();
					var params = {
						appid: response.data.appid,
						partnerid: response.data.partnerid, // merchant id
						prepayid: response.data.prepayid, // prepay id
						noncestr: response.data.noncestr, // nonce
						timestamp: response.data.timestamp, // timestamp
						sign: response.data.sign, // signed string
						package: response.data.package
					};
					Wechat.sendPaymentRequest(params, function(successResults) {
						Message.show("支付成功");
						$state.go('tab.tcmytc');

					}, function(reason) {
						Message.show(angular.toJson(reason));
						console.error("支付失败:" + reason);
					});
				}, function() {
					Message.show("通信超时，请重试！");
				});
			},
			// 支付宝支付
			alipay: function(model, info, order, from, disPay) {
				var _json = {};
				if(model == 'welfare') {
					_json = {
						op: 'getAlipay',
						/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
						//						model: 'welfare',
						orderId: info.payid,
						disPay: disPay,
						paymoney: info.paymoney || '',
						dismoney: info.dismoney || ''
					}
				} else if(model == 'online') {
					_json = {
						op: 'mergeAlipay',
						payid: info.payid,
						disPay: disPay,
						paymoney: info.paymoney || '',
						dismoney: info.dismoney || ''
					}
				} else {
					if(order == 'order') {
						_json = {
							op: 'getAlipay',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							orderId: info,
							disPay: disPay,
							paymoney: info.paymoney || '',
							dismoney: info.dismoney || ''
						}
					} else {
						_json = {
							op: 'getAlipay',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							goodsInfo: info,
							disPay: disPay,
							paymoney: info.paymoney || '',
							dismoney: info.dismoney || ''
						}
					}
				}
				//				console.log(_json);
				resource.get(_json, function(response) {
					//$state.go('shops.orderlist');
					if(response.code != 0) {
						Message.show(response.msg);
						return
					}
					payInfo = response.data.payInfo;
					cordova.plugins.alipay.payment(payInfo, function(successResults) {
						Message.show(successResults);
						if(successResults.resultStatus == "9000") {
							Message.show("支付成功");
							if(from == 'offline') {
								$state.go('user.redPacket', {
									payid: info.payid
								});
							} else {
								if(model == 'welfare') {
									$state.go('tab.tcmytc');
								} else {
									$state.go('my.my-order', {
										type: 'user'
									});
								}
							}

						}
					}, function(errorResults) {
						console.error('支付失败：' + errorResults);
					});

				}, function() {
					Message.show("通信超时，请重试！");
				})

			},
			// 支付宝支付
			exchangeAlipay: function(info) {
				var _json = {
					op: 'exAlipay',
					payId: info.payId,
					payMoney: info.payMoney
				}
				resource.get(_json, function(response) {
					//$state.go('shops.orderlist');
					var payInfo = response.data.payInfo;
					cordova.plugins.alipay.payment(payInfo, function(successResults) {
						Message.show(successResults);
						if(successResults.resultStatus == "9000") {
							Message.show("支付成功");
							$state.go('tab.tcmytc');

						}
					}, function(errorResults) {
						console.error('支付失败：' + errorResults);
					});

				}, function() {
					Message.show("通信超时，请重试！");
				})

			},
			// 建设银行支付
			ccbPay: function(model, info, order, from, disPay) {
				var _json = {};
				if(model == 'welfare') {
					_json = {
						op: 'CCBPay',
						orderId: info.payid,
						disPay: disPay,
						paymoney: info.paymoney || '',
						dismoney: info.dismoney || ''
					}
				} else if(model == 'online') {
					_json = {
						op: 'CCBPay',
						payid: info.payid,
						disPay: disPay,
						paymoney: info.paymoney || '',
						dismoney: info.dismoney || ''
					}
				} else {
					if(order == 'order') {
						_json = {
							op: 'CCBPay',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							orderId: info,
							disPay: disPay,
							paymoney: info.paymoney || '',
							dismoney: info.dismoney || ''
						}
					} else {
						_json = {
							op: 'CCBPay',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							goodsInfo: info,
							disPay: disPay,
							paymoney: info.paymoney || '',
							dismoney: info.dismoney || ''
						}
					}
				}
				//				console.log(_json);
				resource.get(_json, function(response) {

					var ccb_url = response.data;
					var options = {
						location: 'no',
						clearcache: 'yes',
						toolbar: 'yes'
					};
					document.addEventListener("deviceready", function() {

						window.open = cordova.InAppBrowser.open;
					}, false);
					var ref = window.open(ccb_url, '_blank', 'location=no,toolbar=yes')
					ref.addEventListener('loadstop', function() {

					});
					ref.addEventListener('exit', function() {
						$ionicPopup.confirm({
							template: '是否支付成功？',
							buttons: [{
								text: '取消',
								onTap: function() {
									return false;
								}
							}, {
								text: '确定',
								type: 'button-calm',
								onTap: function() {
									Message.show("支付成功");
									if(from == 'offline') {
										$state.go('user.redPacket', {
											payid: info.payid
										});
									} else {
										if(model == 'welfare') {
											$state.go('tab.tcmytc');
										} else {
											$state.go('my.my-order', {
												type: 'user'
											});
										}
									}
								}
							}]
						});
					});

				}, function() {
					Message.show("通信超时，请重试！");
				})

			},
			// 余额支付
			creditPay: function(info, type, from, disPay) {
				console.log(info)
				if(type == 'disBalance') {
					var _json = {
						op: 'balancePay',
						/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
						payid: info.payid,
						// paymoney: info.payPrice,
						code: info.code,
						passwords: info.passwords,
						type: 'disBalance',
						disPay: disPay,
						paymoney: info.payPrice || '',
						dismoney: info.disBalance || ''
					}
				} else {
					var _json = {
						op: 'balancePay',
						/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
						payid: info.payid,
						// paymoney: info.payPrice,
						code: info.code,
						passwords: info.passwords,
						disPay: disPay,
						paymoney: info.payPrice || '',
						dismoney: info.disBalance || ''
					}
				}

				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						if(type == 'order') {
							if(from) {
								$state.go('user.redPacket', {
									payid: info.payid
								});
							} else {
								$state.go('my.my-order', {
									type: 'user'
								});
							}

						} else {

							Message.show('购买成功');
							$state.go('tab.tcmytc');
						}

					} else {
						Message.show(response.msg);
					}
				});

			},
			creditShopPay: function(success, error, para) {
				resource.get({
					op: 'getCredit',
					/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
					model: 'oto',
					money: para.money,
					spid: para.spid
				}, success, error)
			},
			rechargecode: function(orderid, paytype) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(paytype) {
					_json = {
						op: 'zhongjinPay',
						payId: orderid,
						payType: paytype
					}
				} else {
					_json = {
						op: 'zhongjinPay',
						orderId: orderid
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				}, function(error) {
					Message.show('网络错误，请稍等重试');
				})
				return deferred.promise;
			},
		}
	})

	.factory('Mc', function($resource, $ionicLoading, ENV, Message, $q) {
		var resource = $resource(ENV.YD_URL, {
			do: 'mc',
			op: '@op'
		});
		return {
			getMy: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'display'
				}, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show('response.msg');
					}

				});
				return deferred.promise;
			}
		}
	})
	.factory('aboutUs', function($rootScope, $q, $timeout, $ionicLoading, $resource, $ionicPopup, $cordovaAppVersion, Message, ENV) {
		var resource = $resource(ENV.YD_URL, {
			do: 'config',
			op: '@op'
		});
		return {
			usInfo: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'aboutus'
				}, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show('response.msg');
					}

				});
				return deferred.promise;
			},
			agreement: function(shops) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				var shops = shops;
				if(shops) {
					_json = {
						op: 'agreement',
						type: 'shop'
					}
				} else {
					_json = {
						op: 'agreement',
						type: 'user'
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						//						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			serveInfo: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'service'
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			}
		}
	})
	.factory('evaluate', function($rootScope, $q, $timeout, $ionicLoading, $resource, Message, ENV, $state) {
		var resource = $resource(ENV.YD_URL, {
			do: 'users',
			op: '@op'
		});
		return {
			//			getEvaluate: function() {
			//				var deferred = $q.defer();
			//				Message.loading();
			//				resource.save({
			//					op: 'aboutus'
			//				}, function(response) {
			//					Message.hidden();
			//					console.log(response);
			//					if(response.code == 0) {
			//						deferred.resolve(response);
			//					} else if(response.code == 1) {
			//						Message.show('response.msg');
			//					}
			//
			//				});
			//				return deferred.promise;
			//			},
			goodsevaluate: function(goodsId) {
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'goods',
					op: '@op'
				});
				Message.loading();
				var _json = {
					op: 'goodsjudgelist',
					goodsId: goodsId
				}
				res.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			getEvaluate: function(orders, type, orderId) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(type) {
					_json = {
						op: 'onlinejudge',
						type: 'save',
						goodsInfo: orders,
						orderId: orderId
					}
				} else {
					_json = {
						op: 'onlinejudge',
						orderId: orders
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						Message.show('评价成功');
						$state.go('my.my-order');
						//deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					} else if(response.code == 2) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			}
		}
	})
	.factory('Apply', function($resource, $ionicLoading, ENV, Message, $q, $state, $rootScope, Storage) {
		var resource = $resource(ENV.YD_URL, {
			do: 'users'
		});
		return {
			getuserApply: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'applyfor'
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					deferred.resolve(response);
					//					if(response.code == 0) {
					//						deferred.resolve(response.data);
					//					} else if(response.code == 301) {
					//						Message.show(response.msg);
					//						$state.go('shops.wait');
					//					} else if(response.code == 2) {
					//						Message.show(response.msg);
					//						$state.go('shops.center', {
					//							spid: $rootScope.globalInfo.user.isShop
					//						});
					//						var shopApply = Storage.get('user');
					//						shopApply.isShop = response.data;
					//						Storage.set('user',shopApply);
					//						$rootScope.globalInfo.user = shopApply;
					//						console.log(Storage.get('user'));
					//					} else if(response.code == 1) {
					//						Message.show(response.msg);
					//					}
				});
				return deferred.promise;
			},
			// 进入申请商家或进入商家中心页面
			getApply: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'applyfor'
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('shops.wait');
					} else if(response.code == 2) {
						Message.show(response.msg);
						$state.go('tab.shop', {
							spid: $rootScope.globalInfo.user.isShop
						});
						var shopApply = Storage.get('user');
						shopApply.isShop = response.data;
						Storage.set('user', shopApply);
						$rootScope.globalInfo.user = shopApply;
						console.log(Storage.get('user'));
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 获取商家经营类型和让利类型
			getApplyType: function(reapply) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(reapply) {
					_json = {
						op: 'applyfor',
						reApply: 'reapply'
					}
				} else {
					_json = {
						op: 'applyfor',
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 审核等待刷新请求
			refreshApply: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'applyfor'
				}, function(response) {
					if(response.code == 301) {
						Message.show(response.msg);
					} else if(response.code == 2) {
						Message.show(response.msg);
						$state.go('shops.shop', {
							spid: $rootScope.globalInfo.user.isShop
						});
						$rootScope.globalInfo.user.isShop = response.data;
					} else if(response.code == 1) {
						Message.show(response.msg);
					} else if(response.code == 302) {
						$state.go('shops.shoprefuse');
					} else if(response.code == 303) {
						$state.go('shops.shopperfectInfo');
					} else if(response.code == 304) {
						$state.go('shops.shopPosition');
					}
				});
				return deferred.promise;
			},
			// 商家申请拒绝原因
			refuseApply: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({
					op: 'refuseApplyInfo'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 提交商家申请
			subApply: function(apply, area, types, ids, reagain) {
				console.log(apply);
				var deferred = $q.defer();
				Message.loading();
				if(types == 'person') {
					if(reagain != '') {
						var _json = {
							level: 'person',
							op: 'applyfor',
							type: 'save',
							shopName: apply.shopName,
							address: apply.address,
							birth: area,
							mobile: apply.mobile,
							cid: apply.selecedType,
							shopsRebateType: apply.selectedBili,
							idCardThumbA: apply.corrImg || 'img.png',
							idCardThumbB: apply.falImg || 'img.png',
							holdCard: apply.holdCard || 'img.png',
							street: apply.street,
							branch: apply.branch,
							reApply: 'reapply'
						}
					} else {
						var _json = {
							level: 'person',
							op: 'applyfor',
							type: 'save',
							shopName: apply.shopName,
							address: apply.address,
							birth: area,
							mobile: apply.mobile,
							cid: apply.selecedType,
							shopsRebateType: apply.selectedBili,
							idCardThumbA: apply.corrImg || 'img.png',
							idCardThumbB: apply.falImg || 'img.png',
							street: apply.street,
							holdCard: apply.holdCard || 'img.png',
							branch: apply.branch
						}
					}
				} else if(ids != '') {
					var _json = {
						op: 'applyfor',
						type: 'save',
						spid: ids
					}
				} else {
					if(reagain != '') {
						var _json = {
							level: 'shop',
							op: 'applyfor',
							type: 'save',
							shopName: apply.shopName,
							address: apply.address,
							birth: area,
							mobile: apply.mobile,
							cid: apply.selecedType,
							shopsRebateType: apply.selectedBili,
							businessLicence: apply.businessImg,
							//			foodExchangeCard:apply.foodExchangeCard,//食品流通证
							hygieneCard: apply.hygieneCard, //卫生许可证
							goodFaithCard: apply.goodFaithCard, //诚信承诺证
							legalPersonCard: apply.legalPersonCard, //法人委托照
							street: apply.street,
							branch: apply.branch,
							reApply: 'reapply'
						}
					} else {
						var _json = {
							level: 'shop',
							op: 'applyfor',
							type: 'save',
							//					username: apply.userName,
							shopName: apply.shopName,
							//					cname: apply.cName,
							//					shopPerUid: apply.shopPer,
							address: apply.address,
							birth: area,
							mobile: apply.mobile,
							//				description: apply.shopDescrip,
							cid: apply.selecedType,
							shopsRebateType: apply.selectedBili,
							businessLicence: apply.businessImg,
							hygieneCard: apply.hygieneCard, //卫生许可证
							goodFaithCard: apply.goodFaithCard, //诚信承诺证
							legalPersonCard: apply.legalPersonCard, //法人委托照
							street: apply.street,
							branch: apply.branch,
							//					accordingToTheDoor: apply.shopsImg
						}
					}
				}
				resource.save(_json, function(response) {
					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('shops.wait');
					} else if(response.code == 1) {
						// alert(response.data)
						Message.show(response.msg);
					} else if(response.code == 302) {
						$state.go('user.shoptypes');
					} else {
						deferred.resolve(response.data);
					}
				})
				return deferred.promise;
			}
		}
	})
	.factory('Poor', function($resource, $ionicLoading, ENV, Message, $q, $state, $rootScope, Storage) {
		var url = ENV.YD_URL;
		var resource = $resource(url, {
			do: 'poor',
			op: '@op'
		});
		var resNologin = $resource(url, {
			do: 'poorindex',
			op: '@op'
		});
		return {
			getHome: function() {
				if(Storage.get('user')) {
					var uid = Storage.get('user').uid;
					var _json = {
						op: "index",
						uid: uid
					}
				} else {
					var _json = {
						op: "index",
					}
				}

				Message.loading();
				var deferred = $q.defer();
				resNologin.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getPoorList: function(choose, type, page) {
				Message.loading();
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: "recList",
					type: type,
					choose: choose,
					page: page
				}
				resNologin.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getPoorDetail: function(id) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: "recDetail",
					id: id
				}
				resNologin.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getPoorGoodList: function(page) {
				Message.loading();
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: "goodsList",
					page: page
				}
				resNologin.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//获取扶贫商品详情
			getonGoodsInfo: function(id) {
				var res = $resource(url, {
					do: 'goods',
					op: '@op'
				});
				Message.loading();
				var deferred = $q.defer();
				//var resource = $resource(ENV.YD_URL, {do: 'goods'});
				res.get({
					op: 'ongoodsInfo',
					id: id
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//加入购物车
			//添加购物车 
			addGoods: function(goodids, reciId) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'create',
					spid: goodids.spid,
					goodsId: goodids.goodsId,
					id: goodids.id,
					num: goodids.totNum,
					recid: reciId
				}
				var res = $resource(url, {
					do: 'cart'
				});
				res.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			//请求购物车列表
			getcartsList: function(type) {
				Message.loading();
				var res = $resource(url, {
					do: 'cart'
				});
				var deferred = $q.defer();
				res.get({
					op: 'cartList',
					type: type
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//要展示订单信息
			cartSave: function(ids, types) {
				//				console.log(ids);
				var res = $resource(url, {
					do: 'cart'
				});
				//				console.log(Storage.get('orderinterim'));
				if(Storage.get('orderinterim') != '') {
					Storage.set('orderinterim', types);
				} else {
					Storage.set('orderinterim', types);
				}
				//				console.log(Storage.get('orderinterim'));
				var deferred = $q.defer();
				var _json = {};
				if(angular.isArray(ids) == false) {
					var _json = {
						op: 'cartsave',
						spid: ids.spid,
						goodsId: ids.goodsId,
						attrId: ids.id,
						goodsNum: ids.totNum,
						type: types
					}
				} else if(angular.isArray(ids) == true) {
					_json = {
						op: 'cartsave',
						id: ids,
						type: types
						//					id:orderId
					}
				}

				Message.loading();
				res.save(_json, function(response) {
					//console.log('getinfo');
					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(angular.isArray(ids) == false) {
							$state.go('poorson.ordersure');
						} else if(angular.isArray(ids) == true) {
							$state.go('poorson.ordersure');
						}

					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//展示订单
			showorder: function(ordertype) {
				var recid = Storage.get('recipientG').id
				if(!recid) {
					Message.show('请先选择受助人')
				}
				var res = $resource(url, {
					do: 'cart'
				});
				var deferred = $q.defer();
				var _json = {}
				if(ordertype != '') {
					_json = {
						op: 'checkorder',
						type: ordertype,
						recid: recid

						//					id:orderId
					}
				} else {
					_json = {
						op: 'checkorder',
						recid: recid
					}
				}
				Message.loading();
				res.save(_json, function(response) {
					//					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						deferred.resolve(response);
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//请求支付
			oncreate: function(remarksinfo, ordertype, hide, relation, leaveMes, info, address) {
				Message.loading();
				var res = $resource(url, {
					do: 'order'
				});
				var deferred = $q.defer();
				if(ordertype == 'interim') {
					var _json = {
						op: 'onCreate',
						type: ordertype,
						remarks: remarksinfo,
						hide: hide,
						relation: relation,
						leaveMes: leaveMes,
						mall: 'poor',
						province: address.province,
						city: address.city,
						district: address.district,
						address: address.address,
						username: info.addressinfo.username,
						mobile: info.addressinfo.mobile,
						addressId: info.addressinfo.addressId,
						recid: Storage.get('recipientG').id
					};
				} else {
					var _json = {
						op: 'onCreate',
						type: ordertype,
						remarks: remarksinfo,
						hide: hide,
						relation: relation,
						leaveMes: leaveMes,
						mall: 'poor',
						province: address.province,
						city: address.city,
						district: address.district,
						address: address.address,
						username: info.addressinfo.username,
						mobile: info.addressinfo.mobile,
						addressId: info.addressinfo.addressId,
						recid: Storage.get('recipientG').id

					};
				}
				res.save(_json, function(response) {
					Message.hidden();
					//	console.log('creat');
					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
						//Storage.set('id',response.data);
						//console.log(Storage.get('orderId'));
						$state.go('poorson.pay', {
							payid: response.data,
							type: 'user',
							money: info.total
						});
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 扶贫支付宝支付
			alipay: function(model, info, order) {

				var payType = {};
				var res = $resource(url + '&do=payment');
				var _json = {};
				if(model == 'welfare') {
					_json = {
						op: 'getAlipay',
						/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
						//						model: 'welfare',
						orderId: info.payid
					}
				} else if(model == 'online') {
					_json = {
						op: 'mergeAlipay',
						payid: info.payid
					}
				} else if(model == 'donateMoney') {
					//					console.log(info.info.reuid)
					_json = {
						op: 'giveAlipay',
						username: info.info.info.username,
						identity: info.info.info.identity,
						money: info.money,
						way: info.way,
						relation: info.relation,
						leaveMsg: info.leaveMsg,
						reuid: info.info.info.reuid,
						recid: Storage.get('recipientM').id
					}
				} else if(model == 'RecDonateMoney') {
					_json = {
						op: 'recAlipay',
						recid: info.info.recid,
					}
				} else if(model == 'poorGoodPay') {
					_json = {
						op: 'mergeAlipay',
						payid: info.payid
					}
				} else {
					if(order == 'order') {
						_json = {
							op: 'getAlipay',
							orderId: info
						}
					} else {
						_json = {
							op: 'getAlipay',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							goodsInfo: info
						}
					}
				}
				//				console.log(_json);
				res.get(_json, function(response) {
					//$state.go('shops.orderlist');
					payInfo = response.data.payInfo;
					//					console.log(payInfo);
					cordova.plugins.alipay.payment(payInfo, function(successResults) {
						Message.show(successResults);
						//alert(successResults.resultStatus);
						if(successResults.resultStatus == "9000") {
							Message.show("支付成功");
							$state.go('poorson.orderlist');
							// if (model == 'welfare') {
							// 	$state.go('tab.tcmytc');
							// } else {
							// 	$state.go('my.my-order', {
							// 		type: 'user'
							// 	});
							// }
						}
					}, function(errorResults) {
						console.error('支付失败：' + errorResults);
					});

				}, function() {
					Message.show("通信超时，请重试！");
				})

			},
			// 扶贫微信支付
			wechatPay: function(model, info, order) {
				var res = $resource(url + '&do=payment');
				var _json = {};
				if(model == 'welfare') {
					_json = {
						op: 'getWechat',
						/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
						model: 'welfare',
						money: info.money,
						orderId: info.orderId,
						spid: info.spid
					}
				} else if(model == 'online') {
					_json = {
						op: 'mergeWechat',
						//						uid: $rootScope.globalInfo.user.uid,
						payid: info.payid
					}
				} else if(model == 'donateMoney') {
					//					console.log(info.info.reuid)
					_json = {
						op: 'giveWechat',
						username: info.info.info.username,
						identity: info.info.info.identity,
						money: info.money,
						way: info.way,
						relation: info.relation,
						leaveMsg: info.leaveMsg,
						reuid: info.info.info.reuid,
						recid: Storage.get('recipientM').id
					}
				} else if(model == 'RecDonateMoney') {
					_json = {
						op: 'recWechat',
						recid: info.info.recid,
					}
				} else if(model == 'poorGoodPay') {
					_json = {
						op: 'mergeWechat',
						orderId: info.payid
					}
				} else {
					if(order == 'order') {
						_json = {
							op: 'getWechat',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							orderId: info
						}
					} else {
						_json = {
							op: 'getWechat',
							/*, uid: userInfo.uid, signature: sign.signature, timestamp: sign.timestamp*/
							goodsInfo: info
						}
					}
				}
				res.get(_json, function(response) {
					Message.hidden();
					wechatParams = response.data;
					//					console.log(wechatParams);
					var params = {
						appid: wechatParams.appid,
						partnerid: wechatParams.partnerid, // merchant id
						prepayid: wechatParams.prepayid, // prepay id
						noncestr: wechatParams.noncestr, // nonce
						timestamp: wechatParams.timestamp, // timestamp
						sign: wechatParams.sign, // signed string
						package: wechatParams.package
					};
					//					console.log(params);
					Wechat.sendPaymentRequest(params, function(successResults) {
						Message.show("支付成功");
						$state.go('poorson.orderlist');
						// $rootScope.$broadcast('payTypeWechat.updated');
					}, function(reason) {
						//						alert("支付失败: " + reason);
						console.error("支付失败: " + reason);
					});
				}, function() {
					Message.show("通信超时，请重试！");
				});
			},
			//获取商品分类
			getCateList: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(url, {
					do: 'shops',
					op: '@op'
				});
				res.get({
					op: 'cate',
					spid: spid,
					mall: 'poor'
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			//商品搜索
			getonGoodsList: function(id, screentypes, Keywords, pages) {
				Message.loading();
				var res = $resource(url, {
					do: 'user',
					op: '@op'
				});
				var deferred = $q.defer();
				var page = pages || 1;
				var _json = {};
				if(screentypes == '6') {
					_json = {
						op: 'ongoodslist',
						keywords: Keywords,
						screenshop: 1,
						page: page,
						mall: "poor"
					}
				} else {
					_json = {
						op: 'ongoodslist',
						cateid: id,
						keywords: Keywords,
						screentype: screentypes,
						page: page,
						mall: "poor"
					}

				}
				res.get(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//推荐受助人申请  createRec
			poorApply: function(applyInfo, way) {
				Message.loading();
				var deferred = $q.defer();
				var tMobile = Storage.get('user').mobile
				var _json = {
					op: "createRec",
					tMobile: tMobile,
					username: applyInfo.username,
					mobile: applyInfo.mobile,
					IDCard: applyInfo.IDCard,
					because: applyInfo.because, //致贫原因
					choose: applyInfo.choose,
					identity: applyInfo.identity,
					home_birth: applyInfo.home_birth,
					home_address: applyInfo.home_address,
					receive_birth: applyInfo.receive_birth,
					receive_address: applyInfo.receive_address,
					info: applyInfo.info,
					thumb: applyInfo.thumb,
					thumbs: applyInfo.thumbs,
					way: way,
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//上传图片
			uploadPic: function(imgUrl) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'uploadImg',
					img: imgUrl
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//删除图片
			deletePic: function(img) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'delImg',
					img: img
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//捐赠
			giveMoney: function(recid, money, way, relation, leaveMes) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'giveMoney',
					recid: recid, //受助人id
					money: money, //捐助金额
					way: way, //捐助方式
					realtion: relation, //捐助关系
					leaveMes: leaveMes, //留言
				}
				resource.get(_json, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			//获取捐赠排行榜
			getDonateRank: function(page) {
				Message.loading();
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'donateRank',
					page: page
				}
				resNologin.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg)
					}
				})
				return deferred.promise;
			},
			//捐助排行榜明细
			getDonateDetail: function(page) {
				Message.loading();
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'donateDetail',
					page: page
				}
				resNologin.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}
				})
				return deferred.promise;
			},
			//受助者记录
			getDetailRec: function(reuid, page) {
				Message.loading();
				var deferred = $q.defer();
				page = page || 1;
				var _json = {
					op: 'recDetailList',
					reuid: reuid,
					page: page
				}
				resNologin.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}
				})
				return deferred.promise;
			},
			//获取余额支付信息
			getbalanceInfo: function(id, type) {
				var res = $resource(url, {
					do: 'order',
					op: '@op'
				});
				var deferred = $q.defer();
				Message.loading();
				var _json = {}
				if(type == 'ambass') {
					_json = {
						op: 'getBalancePay',
						payid: id,
						type: 'ambass'
					}
				} else if(type == 'poor') {
					_json = {
						op: 'getBalancePay',
						type: 'poor'
					}
				} else {
					_json = {
						op: 'getBalancePay',
						payid: id
					}
				}
				res.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			//余额支付获取验证码
			getbalancecode: function() {
				var res = $resource(url, {
					do: 'users',
					op: '@op'
				});
				var deferred = $q.defer();
				var _json = {
					op: 'getBalanceVerify'
				}
				res.save(_json, function(response) {
						deferred.resolve(response);
						Message.show(response.msg);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			// 余额支付
			creditPay: function(info, type) {
				var res = $resource(url, {
					do: 'payment',
					op: '@op'
				});
				if(type == 'donateMoney') {
					var _json = {
						op: 'giveBalance',
						username: info.info.info.username,
						identity: info.info.info.identity,
						money: info.money,
						way: info.way,
						relation: info.relation,
						leaveMes: info.leaveMes,
						reuid: info.info.info.reuid,
						recid: Storage.get('recipientM').id,
						code: info.code,
						passwords: info.password
					}

				} else if(type == 'RecDonateMoney') {
					_json = {
						op: 'recBalance',
						recid: info.info.recid,
						code: info.code,
						passwords: info.password
					}
				} else {
					var _json = {
						op: 'balancePay',
						payid: info.payid,
						paymoney: info.payPrice,
						code: info.code,
						passwords: info.passwords
					}
				}
				res.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						Message.show(response.msg)
						$state.go('poor.my')
					} else {
						Message.show(response.msg);
					}
				});

			},
			//获取首页公告
			getnoticelist: function() {
				var res = $resource(url, {
					do: 'home',
					op: '@op'
				});
				var deferred = $q.defer();
				var _json = {
					op: 'homenotice'
				}
				res.save(_json, function(response) {
						Message.hidden();
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//获取演示业
			getFirstBanner: function() {
				var res = $resource(url, {
					do: 'index',
					op: '@op'
				});
				var deferred = $q.defer();
				var _json = {
					op: 'welcome'
				}
				Message.loading('加载中……');
				res.save(_json, function(response) {
						//					console.log(response.data);
						//						Message.hidden();
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							$state.go('tab.online');
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//aixinlianmeng中心信息,获取客服
			getunioninfo: function(type) {
				var res = $resource(url, {
					do: 'users',
					op: '@op'
				});
				var deferred = $q.defer();
				var _json = {}
				if(type == 'shop') {
					_json = {
						op: 'unioncenterinfo',
						type: 'shop'
					}
				} else {
					_json = {
						op: 'unioncenterinfo'
					}
				}
				res.save(_json, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			getPoorIntro: function() {

				var res = $resource(url, {
					do: 'poorindex',
					op: '@op'
				});
				var deferred = $q.defer();
				res.save({
						op: 'poorIntro'
					}, function(response) {
						deferred.resolve(response);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			}

		}
	})
	.factory('integralMall', function($resource, $ionicLoading, ENV, Message, $q, $state, $rootScope, Storage) {
		var resource = $resource(ENV.YD_URL, {
			do: 'integralMall',
			op: '@op'
		});
		return {
			getHome: function(type, page) {
				if(type) {
					var _json = {
						op: "homeGoods",
						page: page || 1
					}
				} else {
					var _json = {
						op: "homeTop"
					}
				}
				//					var uid = Storage.get('user').uid;
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//获取优惠专区商品列表
			getGoodsList: function(cid, types, keywords, page) {
				Message.loading();
				var page = page || 1;
				var deferred = $q.defer();
				var _json = {
					op: 'goodsList',
					cid: cid,
					keywords: keywords,
					type: types,
					page: page
				}
				//var resource = $resource(ENV.YD_URL, {do: 'goods'});
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//获取优惠专区商品详情
			getGoodsListType: function() {
				Message.loading();
				var deferred = $q.defer();
				resource.get({
					op: 'goodsListType'
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//获取优惠专区商品详情
			getGoodsInfo: function(id) {
				Message.loading();
				var deferred = $q.defer();
				//var resource = $resource(ENV.YD_URL, {do: 'goods'});
				resource.get({
					op: 'goodsInfo',
					goodsId: id
				}, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//	请求支付
			intePay: function(info, addressInfo, types) {
				Message.loading();
				var deferred = $q.defer();
				if(types == 'integral') {
					var _json = {
						op: 'integralPay',
						id: info.goodsId,
						loveNum: info.loveNum,
						money: info.factMoney,
						mobile: addressInfo.mobile,
						username: addressInfo.username,
						birth: addressInfo.birth.split(' '),
						address: addressInfo.address,
						payType: 'integral'
					}
				} else if(types == 'wechat') {
					var _json = {
						op: 'integralPay',
						id: info.goodsId,
						loveNum: info.loveNum,
						money: info.factMoney,
						mobile: addressInfo.mobile,
						username: addressInfo.username,
						birth: addressInfo.birth.split(' '),
						address: addressInfo.address,
						payType: 'wechat'
					}
				} else if(types == 'alipay') {
					var _json = {
						op: 'integralPay',
						id: info.goodsId,
						loveNum: info.loveNum,
						money: info.factMoney,
						mobile: addressInfo.mobile,
						username: addressInfo.username,
						birth: addressInfo.birth.split(' '),
						address: addressInfo.address,
						payType: 'alipay'
					}
				} else if(types == 'balance') {
					var _json = {
						op: 'integralPay',
						id: info.goodsId,
						loveNum: info.loveNum,
						money: info.factMoney,
						mobile: addressInfo.mobile,
						username: addressInfo.username,
						birth: addressInfo.birth.split(' '),
						address: addressInfo.address,
						payType: 'balance'
					}
				} else if(types == 'voucher') {
					var _json = {
						op: 'integralPay',
						id: info.goodsId,
						heartVoucher: info.heartVoucher,
						loveNum: info.loveNum,
						money: info.factMoney,
						mobile: addressInfo.mobile,
						username: addressInfo.username,
						birth: addressInfo.birth.split(' '),
						address: addressInfo.address,
						payType: 'heartVoucher'
					}
				}
				resource.save(_json, function(response) {
					Message.hidden();
					console.log(response);
					deferred.resolve(response);
					if(response.code == 0) {
						if(types == 'integral') {
							Message.show('兑换成功');
							$state.go('integralMall.lists');
						} else if(types == 'wechat') {
							wechatParams = response.data;
							var params = {
								appid: wechatParams.appid,
								partnerid: wechatParams.partnerid, // merchant id
								prepayid: wechatParams.prepayid, // prepay id
								noncestr: wechatParams.noncestr, // nonce
								timestamp: wechatParams.timestamp, // timestamp
								sign: wechatParams.sign, // signed string
								package: wechatParams.package
							};
							Wechat.sendPaymentRequest(params, function(successResults) {
								Message.show("支付成功");
								$state.go('integralMall.lists');
							}, function(reason) {
								console.error("支付失败: " + reason);
							});
						} else if(types == 'alipay') {
							payInfo = response.data.payInfo;
							cordova.plugins.alipay.payment(payInfo, function(successResults) {
								if(successResults.resultStatus == "9000") {
									Message.show("支付成功");
									$state.go('integralMall.lists');
								}
							}, function(errorResults) {
								console.error('支付失败：' + errorResults);
							});
						} else if(types == 'balance') {
							Message.show('兑换成功');
							$state.go('integralMall.lists');
						} else if(types == 'voucher') {
							Message.show('兑换成功');
							$state.go('integralMall.lists');
						}

					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 优惠专区支付宝支付
			alipay: function(info) {
				var payType = {};
				//				var res = $resource(url + '&do=payment');
				if(info.mode == 1) {
					var _json = {
						op: 'alipay',
						id: info.goodsId,
						loveNum: info.credit,
						price: info.money
					}
				} else {
					var _json = {
						op: 'alipay',
						id: info.goodsId,
						loveNum: info.loveNum,
						money: info.factMoney
					}
				}

				resource.get(_json, function(response) {
					payInfo = response.data.payInfo;
					//	console.log(payInfo);
					cordova.plugins.alipay.payment(payInfo, function(successResults) {
						//alert(successResults.resultStatus);
						if(successResults.resultStatus == "9000") {
							Message.show("支付成功");
							$state.go('integralMall.lists');
						}
					}, function(errorResults) {
						console.error('支付失败：' + errorResults);
					});

				}, function() {
					Message.show("通信超时，请重试！");
				})

			},
			// 优惠专区微信支付
			wechatPay: function(info) {
				//				var res = $resource(url + '&do=payment');
				var _json = {
					op: 'getWechat',
					id: info.goodsId,
					loveNum: info.loveNum
				}
				resource.get(_json, function(response) {
					Message.hidden();
					wechatParams = response.data;
					var params = {
						appid: wechatParams.appid,
						partnerid: wechatParams.partnerid, // merchant id
						prepayid: wechatParams.prepayid, // prepay id
						noncestr: wechatParams.noncestr, // nonce
						timestamp: wechatParams.timestamp, // timestamp
						sign: wechatParams.sign, // signed string
						package: wechatParams.package
					};
					Wechat.sendPaymentRequest(params, function(successResults) {
						Message.show("支付成功");
						$state.go('integralMall.lists');
					}, function(reason) {
						//						alert("支付失败: " + reason);
						console.error("支付失败: " + reason);
					});
				}, function() {
					Message.show("通信超时，请重试！");
				});
			},
			//余额支付获取验证码
			getbalancecode: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'getBalanceVerify'
				}
				resource.save(_json, function(response) {
						deferred.resolve(response);
						Message.show(response.msg);
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			// 余额支付
			creditPay: function(info) {
				var _json = {
					op: 'balancePay',
					id: info.goodsId,
					loveNum: info.loveNum,
					passwords: info.passwords
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						Message.show(response.msg)
						$state.go('poor.my')
					} else {
						Message.show(response.msg);
					}
				});

			},
			//兑换记录
			getRecord: function(level, page) {
				var deferred = $q.defer();
				var page = page || 1;
				var _json = {
					op: 'getRecord',
					type: level,
					page: page
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//兑换记录
			getRecordInfo: function(id) {
				var deferred = $q.defer();
				var page = page || 0;
				var _json = {
					op: 'recordInfo',
					id: id
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//兑换确认
			cancleRecord: function(id) {
				var deferred = $q.defer();
				var _json = {
					op: 'cancleRecord',
					id: id
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//兑换确认
			confirmRecord: function(id) {
				var deferred = $q.defer();
				var _json = {
					op: 'confirmRecord',
					id: id
				};
				resource.get(_json, function(response) {
						console.log(response);
						if(response.code == 0) {
							deferred.resolve(response);
						} else {
							Message.show(response.msg);
						}
					}),
					function() {
						Message.show('通信错误，请检查网络!', 1500);
					};
				return deferred.promise;
			},
			//获取商品分类
			getCateList: function(spid) {
				Message.loading();
				var deferred = $q.defer();

				resource.get({
					op: 'cate',
					spid: spid,
					mall: 'poor'
				}, function(response) {
					Message.hidden();
					//					console.log(response);
					if(response.code == 0) {
						deferred.resolve(response);
					} else {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			//商品搜索
			getonGoodsList: function(id, screentypes, Keywords, pages) {
				Message.loading();
				var deferred = $q.defer();
				var page = pages || 1;
				var _json = {};
				if(screentypes == '6') {
					_json = {
						op: 'ongoodslist',
						keywords: Keywords,
						screenshop: 1,
						page: page,
						mall: "poor"
					}
				} else {
					_json = {
						op: 'ongoodslist',
						cateid: id,
						keywords: Keywords,
						screentype: screentypes,
						page: page,
						mall: "poor"
					}

				}
				resource.get(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//积分券列表
			getvoucherlist: function(page) {
				Message.loading();
				var deferred = $q.defer();
				var page = page || 1;
				var _json = {
					op: 'voucherList',
					page: page
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			}

		}
	})
	.factory('crowdF', function($resource, $ionicLoading, ENV, Message, $q, $state, $rootScope, Storage) {
		var resource = $resource(ENV.YD_URL, {
			do: 'zcrowdf',
			op: '@op'
		});
		return {
			getindexSlide: function(type, page) {
				var _json = {
					op: "indexSlide",
					page: page || 1
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//
			getindexItem: function(type, page) {
				var _json = {
					op: "indexItem",
					type: type,
					page: page || 1
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						if(page == 1) {
							Message.show(response.msg);
						} else {
							deferred.resolve(response);
						}

					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			applyItem: function(type, info) {
				console.log(info);
				if(type) {
					var _json = {
						op: "applyItem",
						money: info.money,
						purpose: info.purpose, //用途
						days: info.days, //时间
						title: info.title, //标题
						desc: info.desc, //描述
						imgs: info.imgs,
						time: Date.parse(info.time), //截止时间
						starttime: Date.parse(info.starttime),
						type: 'apply'
					}
				} else {
					var _json = {
						op: "applyItem",
					}
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
						if(type) {
							$state.go('cf.my');
						}

					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getitemList: function(type, relation, page) {
				var _json = {
					op: "itemList",
					type: type,
					relation: relation,
					page: page || 1
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getitemInfo: function(id) {
				var _json = {
					op: "itemDetail",
					id: id
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			createOrder: function(info) {
				var _json = {
					op: "createOrder",
					name: info.name,
					money: info.money,
					id: info.id
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('cdF.cf-pay', {
							payid: response.data.payid,
							money: response.data.SMoney
						})
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			alipay: function(payid) {
				var _json = {
					op: "ZAlipay",
					payid: payid
				}
				Message.loading();
				var deferred = $q.defer();
				var res = $resource(ENV.YD_URL, {
					do: 'Zpayment',
					op: '@op'
				});
				res.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
						payInfo = response.data.payInfo;
						cordova.plugins.alipay.payment(payInfo, function(successResults) {
							Message.show(successResults);
							if(successResults.resultStatus == "9000") {
								Message.show("支付成功");
								$state.go('cf.my');
							}
						}, function(errorResults) {
							//						alert(JSON.stringify(errorResults))
							console.error('支付失败：' + errorResults);
						});
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getmyinfo: function() {
				var _json = {
					op: "userInfo"
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//关注众筹
			followItem: function(id) {
				var _json = {
					op: "itemAtten",
					id: id
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			//钱包列表记录
			getmoneyList: function() {
				var _json = {
					op: "moneyList"
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			repolist: function(type, info) {
				if(type) {
					var _json = {
						type: 'save',
						op: "cashBala",
						num: info.num,
						bankid: info.bankid
					}
				} else {
					var _json = {
						op: "cashBala"
					}
				}
				Message.loading();
				var deferred = $q.defer();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
		}
	})
	.factory("DB", function(
		$resource,
		$ionicLoading,
		ENV,

		$q,
		$state,
		$rootScope,
		Storage,
		$timeout,
		Message
	) {
		var indexRes = $resource(ENV.YD_URL, {
			do: "yindex",
			op: "@op"
		});
		var homeRes = $resource(ENV.YD_URL, {
			do: "yhome",
			op: "@op"
		});
		var cartRes = $resource(ENV.YD_URL, {
			do: "ycart",
			op: "@op"
		});
		var payRes = $resource(ENV.YD_URL, {
			do: "ypay",
			op: "@op"
		});
		return {
			homeFirst: function() {
				var deferred = $q.defer();
				Message.loading();
				indexRes.get({
						op: "first"
					},
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getHome: function() {
				var deferred = $q.defer();
				Message.loading();
				indexRes.get({
						op: "index"
					},
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getHomeList: function(type, cateId, keywords, page) {
				var deferred = $q.defer();
				Message.loading();
				if(type && type == "fast") {
					var _json = {
						op: "allGoods",
						page: page || 1,
						type: "",
						cateId: cateId,
						keywords: keywords
					};
				} else {
					var _json = {
						op: "allGoods",
						page: page || 1,
						type: type,
						cateId: cateId,
						keywords: keywords
					};
				}
				indexRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			goodsDetail: function(goodsId, type) {
				var deferred = $q.defer();
				Message.loading();
				if(type && type == 'reveal') {
					var _json = {
						op: "goodsDetail",
						periodId: goodsId
					};
				} else {
					var _json = {
						op: "goodsDetail",
						goodsId: goodsId
					};
				}

				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			buy: function(periodNumber, type) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "add",
					periodNumber: periodNumber
				};
				cartRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			cartList: function(page) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "list",
					page: page || 1
				};

				cartRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {

						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			cartEdit: function(id, type, num) {
				var deferred = $q.defer();
				Message.loading();

				var _json = {
					op: "edit",
					type: type,
					id: id,
					num: num || ''
				};
				cartRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 2000);
							deferred.reject();
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			delCart: function(id) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "delCart",
					id: id
				};
				cartRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			subCart: function() {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "subCart",
				};
				cartRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			payWeChat: function(payid, price) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "wechatPay",
					payid: payid,
					price: price
				};
				payRes.save(
					_json,
					function(response) {
						Message.hidden();
						if(res.code == 0) {
							var params = {
								appid: response.data.appid,
								partnerid: response.data.partnerid, // merchant id
								prepayid: response.data.prepayid, // prepay id
								noncestr: response.data.noncestr, // nonce
								timestamp: response.data.timestamp, // timestamp
								sign: response.data.sign, // signed string
								package: response.data.package
							};
							Wechat.sendPaymentRequest(
								params,
								function(successResults) {
									Message.show("支付成功");

								},
								function(reason) {
									console.error("支付失败:" + reason);
								}
							);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			payBalance: function(payid, price) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "balancePay",
					payid: payid,
					price: price
				};
				payRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							Message.show(res.msg, 1500);
							$timeout(function() {
								$state.go('dbson.paySuccess')
							}, 1500)
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getUserCenter: function() {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "home",
				};
				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getLastReveal: function(page) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "jiexiao",
					page: page || 1
				};
				indexRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getUserDBRec: function(status, page) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "recode",
					page: page || 1,
					status: status
				};
				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getAwardRec: function(page) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "winRecode",
					page: page || 1,
				};
				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			getAwardRecD: function(id) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "winDetail",
					id: id
				};
				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			sureAddress: function(id, info) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "address",
					id: id,
					username: info.defaultAddress.username,
					mobile: info.defaultAddress.mobile,
					address: info.defaultAddress.birth + ' ' + info.defaultAddress.address,
					comment: info.defaultAddress.comment
				};
				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			sureReceive: function(id) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "confirm",
					id: id,
				};
				homeRes.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			}

		};
	})
	.factory('Game', function($resource,
		$ionicLoading,
		ENV,
		Message,
		$q,
		$state) {
		var res = $resource(ENV.YD_URL, {
			do: "game",
			op: "@op"
		});

		return {
			getGameInfo: function(type) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "index",
				};
				if(type) {
					_json.gameId = 2
				}
				res.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			turntableDraw: function(type) {
				var deferred = $q.defer();

				var _json = {
					op: "lucky",

				};
				if(type) {
					_json.gameId = 2
				}
				res.save(
					_json,
					function(res) {

						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 2000);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			},
			turntableAward: function(page) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: "recode",
					page: page || 1

				};
				res.save(
					_json,
					function(res) {
						Message.hidden();
						if(res.code == 0) {
							deferred.resolve(res);
						} else {
							Message.show(res.msg, 1500);
						}
					},
					function() {
						Message.show("通信错误，请检查网络!", 1500);
					}
				);
				return deferred.promise;
			}
		}
	})