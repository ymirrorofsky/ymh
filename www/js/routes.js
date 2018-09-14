angular.module('starter.routes', [])
	.config(function ($stateProvider, $urlRouterProvider) {
		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		$stateProvider
			// setup an abstract state for the tabs directive
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})
			.state('tab.home', {
				url: '/home',
				//				cache: false,
				views: {
					'tab-home': {
						templateUrl: 'templates/tab/tab-home.html',
						controller: 'homeCtrl'
					}
				}
			})
			.state('tab.online', {
				url: '/online',
				//				cache: false,
				views: {
					'tab-online': {
						templateUrl: 'templates/tab/tab-online.html',
						controller: 'onlineCtrl'
					}
				}
			})
			.state("tab.rank", {
				url: "/rank",
				cache: false,
				views: {
					"tab-rank": {
						templateUrl: "templates/tab/tab-rank.html",
						controller: "rankCtrl"
					}
				}
			})
			//			.state('tab.shop', {
			//				url: '/shop',
			//				//				cache: false,
			//				views: {
			//					'tab-shop': {
			//						templateUrl: 'templates/tab/tab-shop.html',
			//						controller: 'tabshopCtrl'
			//					}
			//				}
			//			})
			.state('tab.location', {
				url: '/location',
				params: {
					"cid": null,
					"title": 'null'
				},
				cache: false,
				views: {
					'tab-location': {
						templateUrl: 'templates/tab/tab-location.html',
						controller: 'locationCtrl'
					}
				}
			})
			.state('tab.notice', {
				url: '/notice',
				params: {
					"iscache": ''
				},
				cache: false,
				views: {
					'tab-notice': {
						templateUrl: 'templates/tab/tab-notice.html',
						controller: 'noticeCtrl'
					}
				}
			})
			.state('tab.ordertc', {
				url: '/ordertc',
				params: {
					type: null
				},
				cache: false,
				views: {
					'tab-ordertc': {
						templateUrl: 'templates/tab/tab-ordertc.html',
						controller: 'ordertcCtrl'
					}
				}
			})
			.state('tab.tcmytc', {
				url: '/tcmytc',
				cache: false,
				views: {
					'tab-tcmytc': {
						templateUrl: 'templates/tab/tab-tcmytc.html',
						controller: 'myCtrl'
					}
				}
			})
			.state('tab.contact', {
				url: '/contact',
				cache: false,
				views: {
					'tab-contact': {
						templateUrl: 'templates/tab/tab-contact.html',
						controller: 'ContactCtrl'
					}
				}
			})
			.state('articles', {
				url: '/articles',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('articles.indexactiveInfo', {
				url: '/indexactiveInfo/:cid',
				params: {
					cid: null
				},
				cache: false,
				templateUrl: 'templates/article/indexactiveInfo.html',
				controller: 'indexactiveInfoCtrl'
			})
			.state('articles.articlesInfo', {
				url: '/articlesInfo/:id',
				params: {
					id: null
				},
				templateUrl: 'templates/article/articlesInfo.html',
				controller: 'articlesInfoCtrl'
			})
			.state('goods', {
				url: '/goods',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('goods.acrossGoodsList', {
				url: '/acrossGoodsList/:id',
				cache: false,
				params: {
					types: '',
					id: ''
				},
				templateUrl: 'templates/good/acrossGoodsList.html',
				controller: 'acrossGoodsListCtrl'
			})
			.state('goods.online-goodscate', {
				url: '/online-goodscate/:id',
				cache: false,
				params: {
					id: '',
					spid: ''
				},
				templateUrl: 'templates/good/online-goodscate.html',
				controller: 'online-goodscateCtrl'
			})
			.state('goods.onlineshopgoodscate', {
				url: '/onlineshopgoodscate/:spid',
				cache: false,
				params: {
					id: '',
					spid: ''
				},
				templateUrl: 'templates/good/onlineshopgoodscate.html',
				controller: 'onlineshopgoodscateCtrl'
			})
			.state('goods.goodslist-online', {
				url: '/goodslist-online/:id',
				cache: false,
				params: {
					id: ''
				},
				templateUrl: 'templates/good/goodslist-online.html',
				controller: 'goodslist-onlineCtrl'
			})
			.state('goods.goodslist-cate', {
				url: '/goodslist-cate/:type',
				cache: false,
				params: {
					type: '',
					title:''
				},
				templateUrl: 'templates/good/goodslist-cate.html',
				controller: 'goodslist-cateCtrl'
			})
			
			
			.state('goods.activegoodslist', {
				url: '/activegoodslist/:id',
				cache: false,
				params: {
					types: '',
					id: ''
				},
				templateUrl: 'templates/good/activegoodslist.html',
				controller: 'activegoodslistCtrl'
			})
			.state('goods.onlinegoodsInfo', {
				url: '/onlinegoodsInfo/:id',
				params: {
					spid: null,
					id: '',
					isAcross:'',
					from:''
				},
				cache: false,
				templateUrl: 'templates/good/onlinegoodsInfo.html',
				controller: 'onlinegoodsInfoCtrl'
			})
			.state('goods.taokeGoodsInfo', {
				url: '/taokeGoodsInfo/:id',
				params: {
					spid: null,
					goodsId: '',
					isAcross:'',
					from:''
				},
				cache: false,
				templateUrl: 'templates/good/taokeGoodsInfo.html',
				controller: 'taokeGoodsInfoCtrl'
			})
			.state('goods.taoCommond', {
				url: '/taoCommond',
				params: {
					spid: null,
					goodsId: '',
					isAcross:'',
					from:''
				},
				cache: false,
				templateUrl: 'templates/good/taoCommond.html',
				controller: 'taoCommondCtrl'
			})
			
			.state('goods.onlineorderInfo', {
				url: '/onlineorderInfo',
				params: {
					spid: null,
					id: '',
					ordertype: ''
				},
				cache: false,
				templateUrl: 'templates/good/onlineorderInfo.html',
				controller: 'onlineorderInfoCtrl'
			})
			.state('goods.goodscart', {
				url: '/goodscart',
				cache: false,
				templateUrl: 'templates/good/goodscart.html',
				controller: 'goodscartCtrl'
			})
			.state('goods.giftAddress', {
				url: '/giftAddress',
				cache: false,
				templateUrl: 'templates/good/giftAddress.html',
				controller: 'giftAddressCtrl'
			})
			.state('goods.orderAddress', {
				url: '/orderAddress',
				cache: false,
				templateUrl: 'templates/good/orderAddress.html',
				controller: 'orderAddressCtrl'
			})
			.state('goods.orderaddaddress', {
				url: '/orderaddaddress',
				cache: false,
				templateUrl: 'templates/good/orderaddaddress.html',
				controller: 'orderaddaddressCtrl'
			})
			.state('goods.onlinepay', {
				url: '/onlinepay',
				cache: false,
				params: {
					id: null,
					payid: null,
					ordertypes: '',
					shopPay: '',
					from: ''
				},
				templateUrl: 'templates/good/onlinepay.html',
				controller: 'onlinePayCtrl'
			})
			.state('goods.transferPay', {
				url: '/transferPay',
				cache: false,
				params: {
					payId: null,
					payMoney:0
				},
				templateUrl: 'templates/good/transferPay.html',
				controller: 'transferPayCtrl'
			})
			.state('goods.onlineshops', {
				url: '/onlineshops',
				cache: false,
				params: {
					spid: '',
					cid: ''
				},
				templateUrl: 'templates/good/onlineshops.html',
				controller: 'onlineshopsCtrl'
			})
			.state('modals', {
				url: '/modals',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('modals.location', {
				url: '/location',
				cache: false,
				params: {
					id: null
				},
				templateUrl: 'templates/modal/location.html',
				controller: 'homeCtrl'
			})
			.state('shops', {
				url: '/shop',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('shops.shopMoneyCenter', {
				url: '/shopMoneyCenter',
				params: {
					showmore: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shopMoneyCenter.html',
				controller: 'shopMoneyCenterCtrl'
			})
			.state('shops.shopRepo', {
				url: '/shopRepo',
				params: {
					showmore: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shopRepo.html',
				controller: 'shopRepoCtrl'
			})
			.state('shops.shop', {
				url: '/shop',
				cache: false,
				templateUrl: 'templates/shop/shop.html',
				controller: 'tabshopCtrl'
			})
			.state('shops.exitapply', {
				url: '/exitapply',
				params: {
					id: '',
					money: ''
				},
				cache: false,
				templateUrl: 'templates/shop/exitapply.html',
				controller: 'exitapplyCtrl'
			})
			.state('shops.shopallcate', {
				url: '/shopallcate',
				params: {
					showmore: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shopallcate.html',
				controller: 'shopallcateCtrl'
			})
			.state('shops.linenearshoplist', {
				url: '/linenearshoplist',
				params: {
					showmore: ''
				},
				cache: false,
				templateUrl: 'templates/shop/linenearshoplist.html',
				controller: 'linenearshoplistCtrl'
			})
			.state('shops.linelocations', {
				url: '/linelocations',
				params: {
					cid: null,
					title: ""
				},
				cache: false,
				templateUrl: 'templates/shop/linelocations.html',
				controller: 'linelocationsCtrl'
			})
			.state('shops.shoplinepay', {
				url: '/shoplinepay/:spid',
				params: {
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/shoplinepay.html',
				controller: 'shoplinepayCtrl'
			})
			.state('shops.managegoods', {
				url: '/managegoods/:cid',
				params: {
					spid: null,
					goodsstatus: ''
				},
				templateUrl: 'templates/shop/managegoods.html',
				controller: 'managegoodsCtrl'
			})
			.state('shops.shoplicences', {
				url: '/shoplicences',
				params: {
					spid: '',
					shoptypes: '',
					showcontent: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shoplicences.html',
				controller: 'shoplicencesCtrl'
			})
			.state('shops.shopperfectInfo', {
				url: '/shopperfectInfo',
				params: {
					spid: '',
					shoptypes: '',
					showcontent: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shopperfectInfo.html',
				controller: 'shopperfectInfoCtrl'
			})
			.state('shops.shopPosition', {
				url: '/shopPosition',
				cache: false,
				templateUrl: 'templates/shop/shopPosition.html',
				controller: 'shopPositionCtrl'
			})
			.state('shops.shopsCategory', {
				url: '/shopsCategory/:keywords',
				templateUrl: 'templates/shop/shopsCategory.html',
				controller: 'shopsCategoryCtrl'
			})
			.state('shops.shopserves', {
				url: '/shopserves/:spid',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/shopserves.html',
				controller: 'shopdetailCtrl'
			})
			.state('shops.shoprecommend', {
				url: '/shoprecommend/:spid',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/shoprecommend.html',
				controller: 'shopdetailCtrl'
			})
			.state('shops.shopintro', {
				url: '/shopintro/:spid',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/shopintro.html',
				controller: 'shopintroCtrl'
			})
			.state('shops.shopdetail', {
				url: '/shopdetail/:spid',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/shopdetail.html',
				controller: 'shopdetailCtrl'
			})
			.state('shops.loveunioncenter', {
				url: '/loveunioncenter',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/loveunioncenter.html',
				controller: 'loveunioncenterCtrl'
			})
			.state('shops.addgoods', {
				url: '/addgoods/:spid',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/addgoods.html',
				controller: 'addgoodsCtrl'
			})
			.state('shops.shopsInfo', {
				url: '/shopsInfo/:spid',
				params: {
					type: null,
					spid: null
				},
				cache: false,
				templateUrl: 'templates/shop/shopsInfo.html',
				controller: 'shopsInfoCtrl'
			})
			.state('shops.shopsMap', {
				url: '/shopsMap',
				params: {
					location: '',
					locationUrl: '',
					birthInfo: '',
					address: '',
					title: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shopsMap.html',
				controller: 'shopsMapCtrl'
			})
			.state('shops.shopsRoleMap', {
				url: '/shopsRoleMap',
				//				cache: false,
				templateUrl: 'templates/shop/shopsRoleMap.html',
				controller: 'shopsRoleMapCtrl'
			})
			.state('shops.orderInfo', {
				url: '/orderInfo/:id/:type',
				params: {
					id: null,
					type: null
				},
				cache: false,
				templateUrl: 'templates/shop/orderInfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('shops.useronlineorderInfo', {
				url: '/useronlineorderInfo/:id',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/useronlineorderInfo.html',
				controller: 'useronlineorderInfoCtrl'
			})
			.state('shops.userlineorderInfo', {
				url: '/userlineorderInfo/:id/:type',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/userlineorderInfo.html',
				controller: 'userlineorderInfoCtrl'
			})
			.state('shops.shoponlineorderInfo', {
				url: '/shoponlineorderInfo/:id',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/shoponlineorderInfo.html',
				controller: 'shoponlineorderInfoCtrl'
			})
			.state('shops.shoplineuserorderinfo', {
				url: '/shoplineuserorderinfo/:id',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/shoplineuserorderinfo.html',
				controller: 'shoplineuserorderinfoCtrl'
			})
			.state('shops.shoplineshoporderinfo', {
				url: '/shoplineshoporderinfo/:id',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/shoplineshoporderinfo.html',
				controller: 'shoplineshoporderinfoCtrl'
			})
			.state('shops.ordersubInfo', {
				url: '/ordersubInfo/:id/:type',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/ordersubInfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('shops.scanorderInfo', {
				url: '/scanorderInfo/:id/:type',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/scanorderInfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('shops.reporderInfo', {
				url: '/reporderInfo/:id/:type',
				params: {
					id: null,
					type: null,
					orderId: null
				},
				cache: false,
				templateUrl: 'templates/shop/reporderInfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('shops.payorderInfo', {
				url: '/payorderInfo/:id/:type',
				params: {
					id: null,
					type: null
				},
				cache: false,
				templateUrl: 'templates/shop/payorderInfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('shops.evaluate', {
				url: '/evaluate/:spid',
				params: {
					spid: '',
					type: null,
					orderid: null
				},
				cache: false,
				templateUrl: 'templates/shop/evaluate.html',
				controller: 'evaluateCtrl'
			})
			.state('shops.evaluaterList', {
				url: '/evaluaterList/:spid',
				//	params: {
				//		type:null,
				//		spid: null
				//		},
				cache: false,
				templateUrl: 'templates/shop/evaluaterList.html',
				controller: 'evaluateCtrl'
			})
			.state('shops.goodsevaluaterList', {
				url: '/goodsevaluaterList/:goodsid',
				params: {
					goodsid: null
				},
				cache: false,
				templateUrl: 'templates/shop/goodsevaluaterList.html',
				controller: 'goodsevaluaterListCtrl'
			})
			.state('shops.wait', {
				url: '/wait',
				templateUrl: 'templates/shop/waiting.html',
				controller: 'shopsWaitCtrl'
			})
			.state('shops.shoprefuse', {
				url: '/shoprefuse',
				templateUrl: 'templates/shop/shoprefuse.html',
				controller: 'shoprefuseCtrl'
			})
			.state('shops.orderList', {
				url: '/orderList/:type/:orderType',
				params: {
					type: null,
					orderType: ''
				},
				cache: false,
				templateUrl: 'templates/shop/orderList.html',
				controller: 'shopOrderListCtrl'
			})
			.state('shops.shoponlineorder', {
				url: '/shoponlineorder/',
				params: {
					spid: '',
					orderStatus: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shoponlineorder.html',
				controller: 'shoponlineorderCtrl'
			})
			.state('shops.shoplineorder', {
				url: '/shoplineorder',
				params: {
					type: null,
					orderType: ''
				},
				cache: false,
				templateUrl: 'templates/shop/shoplineorder.html',
				controller: 'shoplineorderCtrl'
			})
			.state('shops.qrcode', {
				url: '/qrcode',
				cache: false,
				templateUrl: 'templates/shop/qrcode.html',
				controller: 'shopQrcodeCtrl'
			})

			.state('shops.center', {
				url: '/center',
				cache: false,
				templateUrl: 'templates/shop/center.html',
				controller: 'shopCenterCtrl'
			})
			.state('shops.pay', {
				url: '/pay/:orderId',
				cache: false,
				params: {
					orderId: '',
					spid: '',
					payPrice: ''
				},
				templateUrl: 'templates/shop/pay.html',
				controller: 'shopPayCtrl'
			})
			.state('shops.credit', {
				url: '/pay/:orderId/:spid/:payPrice',
				params: {
					orderId: '',
					spid: '',
					payPrice: ''
				},
				templateUrl: 'templates/shop/credit.html',
				controller: 'shopPayCtrl'
			})
			.state('auth', {
				url: '/auth',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})

			.state('auth.login', {
				url: '/login',
				cache: false,
				templateUrl: 'templates/auth/login.html',
				controller: 'loginCtrl'
			})

			.state('auth.register', {
				url: '/register',
				cache: false,
				templateUrl: 'templates/auth/register.html',
				controller: 'registerCtrl'
			})
            .state('auth.addMobile', {
				url: '/addMobile',
				cache: false,
				params: {
					uid: '',
					logintype: ''
				},
				templateUrl: 'templates/auth/addMobile.html',
				controller: 'addMobileCtrl'
			})
			.state('auth.resetPsd', {
				url: '/resetPsd',
				cache: false,
				templateUrl: 'templates/auth/resetPsd.html',
				controller: 'resetPsdCtrl'
			})

			.state('my', {
				url: '/my',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('my.mySuperior', {
				url: '/mySuperior',
				cache: false,
				templateUrl: 'templates/my/mySuperior.html',
				controller: 'myCtrl'
			})
			.state('my.my-order', {
				url: '/my-order',
				cache: false,
				templateUrl: 'templates/my/my-order.html',
				controller: 'myorderCtrl'
			})
			.state('my.taoOrder', {
				url: '/taoOrder',
				cache: false,
				templateUrl: 'templates/my/taoOrder.html',
				controller: 'taoOrderCtrl'
			})
			.state('my.myconvert', {
				url: '/myconvert',
				cache: false,
				templateUrl: 'templates/my/myconvert.html',
				controller: 'consumeCtrl'
			})
			.state('my.consume', {
				url: '/consume',
				cache: false,
				templateUrl: 'templates/my/consume.html',
				controller: 'consumeCtrl'
			})
			.state('my.stockright', {
				url: '/stockright',
				cache: false,
				templateUrl: 'templates/my/stockright.html',
				controller: 'stockrightCtrl'
			})
			.state('my.stockapply', {
				url: '/stockapply',
				cache: false,
				templateUrl: 'templates/my/stockapply.html',
				controller: 'stockapplyCtrl'
			})
			.state('my.balanceindex', {
				url: '/balanceindex',
				cache: false,
				templateUrl: 'templates/my/balanceindex.html',
				controller: 'balanceindexCtrl'
			})
			.state('my.taoProfit', {
				url: '/taoProfit',
				cache: false,
				templateUrl: 'templates/my/taoProfit.html',
				controller: 'taoProfitCtrl'
			})
			.state('my.balarechargepage', {
				url: '/balarechargepage',
				params: {
					orderid: '',
					num: '',
					paytype: ''
				},
				cache: false,
				templateUrl: 'templates/my/balarechargepage.html',
				controller: 'balarechargepageCtrl'
			})
			.state('my.loves', {
				url: '/loves',
				cache: false,
				templateUrl: 'templates/my/loves.html',
				controller: 'lovesCtrl'
			})

			.state('my.collection', {
				url: '/collection',
				cache: false,
				templateUrl: 'templates/my/collection.html',
				controller: 'collectionCtrl'
			})
			.state('my.stockrightdetail', {
				url: '/stockrightdetail',
				cache: false,
				templateUrl: 'templates/my/stockrightdetail.html',
				controller: 'stockrightdetailCtrl'
			})
			.state('my.team', {
				url: '/team',
				cache: false,
				templateUrl: 'templates/my/team.html',
				controller: 'teamCtrl'
			})
			.state('my.servercenter', {
				url: '/servercenter',
				templateUrl: 'templates/my/servercenter.html',
				controller: 'aboutvrCtrl'
			})
			.state('my.aboutvr', {
				url: '/aboutvr',
				templateUrl: 'templates/my/aboutvr.html',
				controller: 'aboutvrCtrl'
			})
			.state('my.recommend', {
				url: '/recommend',
				cache: false,
				templateUrl: 'templates/my/recommend.html',
				controller: 'userRecommendCtrl'
			})
			.state('my.bussapply', {
				url: '/bussapply',
				templateUrl: 'templates/my/bussapply.html',
				controller: 'bussapplyCtrl'
			})
			.state('my.myorderlist', {
				url: '/myorderlist/:type',
				params: {
					type: '',
					page: null
				},
				cache: false,
				templateUrl: 'templates/my/myorderlist.html',
				controller: 'myorderlistCtrl'
			})
			.state('my.myorderinfo', {
				url: '/myorderinfo/:type',
				params: {
					type: '',
					id: null
				},
				cache: false,
				templateUrl: 'templates/my/myorderinfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('my.myreportinfo', {
				url: '/myreportinfo/:type',
				params: {
					type: '',
					id: null
				},
				cache: false,
				templateUrl: 'templates/my/myreportinfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('my.shopqrcode', {
				url: '/shopqrcode',
				cache: false,
				templateUrl: 'templates/my/shopqrcode.html',
				controller: 'shopQrcodeCtrl'
			})
			.state('my.report', {
				url: '/report',
				params: {
					type: ''
				},
				cache: false,
				templateUrl: 'templates/my/report.html',
				controller: 'userPayCtrl'
			})
			.state('my.helplist', {
				url: '/helplist',
				cache: false,
				templateUrl: 'templates/my/helplist.html',
				controller: 'userHelpListCtrl'
			})
			.state('my.bannerrank', {
				url: '/bannerrank',
				params: {
					type: null,
					total: null
				},
				cache: false,
				templateUrl: 'templates/my/bannerrank.html',
				controller: 'bannerRankCtrl'
			})
			.state('my.onlinesearch', {
				url: '/onlinesearch',
				cache: false,
				templateUrl: 'templates/my/onlinesearch.html',
				controller: 'onlineSearchCtrl'
			})
			.state('my.onlineSearchRes', {
				url: '/onlineSearchRes',
				params: {
					keyword: ''
				},
				cache: false,
				templateUrl: 'templates/my/onlineSearchRes.html',
				controller: 'onlineSearchResCtrl'
			})
			.state('my.offlinesearch', {
				url: '/offlinesearch',
				cache: false,
				templateUrl: 'templates/my/offlinesearch.html',
				controller: 'offlineSearchCtrl'
			})
			.state('my.offlineSearchRes', {
				url: '/offlineSearchRes',
				params: {
					keyword: null
				},
				cache: false,
				templateUrl: 'templates/my/offineSearchRes.html',
				controller: 'offlineSearchResCtrl'
			})
			.state('user', {
				url: '/user',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
         .state('user.imMessagePerson', {
				url: '/imMessagePerson',
				params:{
					username:''
				},
				cache: false,
				templateUrl: 'templates/user/imMessagePerson.html',
				controller: 'imMessagePersonCtrl'
			})

				// 代理提现记录  
				.state('user.agentWithDrawList', {
				url: '/agentWithDrawList',
				cache: false,
				params:{
					agentId:''
				},
				templateUrl: 'templates/user/agentWithDrawList.html',
				controller: 'agentWithDrawListCtrl'
			})  

			// 代理余额明细和代理优惠券明细
				.state('user.agentBalanceList', {
				url: '/agentBalanceList',
				cache: false,
				params:{
					level:'',
					levelClass:'',
					agentId:''
				},
				templateUrl: 'templates/user/agentBalanceList.html',
				controller: 'agentBalanceListCtrl'
			})  



			// 排行榜页面历史数据
						.state('user.historyData', {
				url: '/historyData',
				cache: false,
				templateUrl: 'templates/user/historyData.html',
				controller: 'historyDataCtrl'
			})  
						.state('user.historyDataD', {
				url: '/historyDataD',
				cache: false,
				params:{
					title:'',
					type:''
				},
				templateUrl: 'templates/user/historyDataD.html',
				controller: 'historyDataDCtrl'
			}) 
			

			// 赠品券
			.state('user.whiteIntegral', {
				url: '/whiteIntegral',
				cache: false,
				templateUrl: 'templates/user/whiteIntegral.html',
				controller: 'whiteIntegralCtrl'
			})
			// 红包   
			.state('user.redPacket', {
				url: '/redPacket',
				cache: false,
				params: {
					payid: ''
				},
				templateUrl: 'templates/user/redPacket.html',
				controller: 'redPacketCtrl'
			})
			.state('user.turntable', {
				url: '/turntable',
				cache: false,
				templateUrl: 'templates/user/turntable.html',
				controller: 'turntableCtrl'
			})

			.state('user.turntableAward', {
				url: '/turntableAward',
				cache: false,
				templateUrl: 'templates/user/turntableAward.html',
				controller: 'turntableAwardCtrl'
			})



			.state('user.loveunion', {
				url: '/loveunion',
				cache: false,
				templateUrl: 'templates/user/loveunion.html',
				controller: 'loveunionCtrl'
			})
			.state('user.loveunionapply', {
				url: '/loveunionapply',
				cache: false,
				templateUrl: 'templates/user/loveunionapply.html',
				controller: 'loveunionapplyCtrl'
			})
			.state('user.applyunioninfo', {
				url: '/applyunioninfo',
				params: {
					applytype: ''
				},
				cache: false,
				templateUrl: 'templates/user/applyunioninfo.html',
				controller: 'applyunioninfoCtrl'
			})
			.state('user.center', {
				url: '/center',
				cache: false,
				templateUrl: 'templates/user/center.html',
				controller: 'userCenterCtrl'
			})
			.state('user.safesetting', {
				url: '/safesetting',
				templateUrl: 'templates/user/safesetting.html',
				controller: 'userCenterCtrl'
			})
			.state('user.identifyname', {
				url: '/identifyname',
				cache: false,
				templateUrl: 'templates/user/identifyname.html',
				controller: 'identifynameCtrl'
			})
			.state('user.nickname', {
				url: '/nickname',
				cache: false,
				templateUrl: 'templates/user/nickname.html',
				controller: 'userCenterCtrl'
			})

			.state('user.realName', {
				url: '/realName',
				cache: false,
				templateUrl: 'templates/user/realName.html',
				controller: 'userRealNameCtrl'
			})

			.state('user.aboutUs', {
				url: '/aboutUs',
				cache: false,
				templateUrl: 'templates/user/aboutUs.html',
				controller: 'userAboutUsCtrl'
			})

			.state('user.loginPsw', {
				url: '/loginPsw/:type',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/loginPsw.html',
				controller: 'userLoginPswCtrl'
			})
			.state('user.resetPayWord', {
				url: '/resetPayWord',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/resetPayWord.html',
				controller: 'userResetPayWordCtrl'
			})
			.state('user.changeMobile', {
				url: '/changeMobile',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/changeMobile.html',
				controller: 'changeMobileCtrl'
			})
			.state('user.news', {
				url: '/news',
				templateUrl: 'templates/user/news.html',
				controller: 'userNewsCtrl'
			})
			.state('user.myserve-news', {
				url: '/myserve-news',
				params: {
					id: null
				},
				cache: false,
				templateUrl: 'templates/user/myserve-news.html',
				controller: 'myserve-newsCtrl'
			})
			.state('user.sandeacademy', {
				url: '/sandeacademy',
				params: {
					id: null
				},
				cache: false,
				templateUrl: 'templates/user/sandeacademy.html',
				controller: 'sandeacademyCtrl'
			})
			.state('user.academydetail', {
				url: '/academydetail',
				params: {
					id: null
				},
				cache: false,
				templateUrl: 'templates/user/academydetail.html',
				controller: 'academydetailCtrl'
			})
			.state('user.newsactive', {
				url: '/newsactive',
				params: {
					type: '',
					id: null
				},
				cache: false,
				templateUrl: 'templates/user/newsactive.html',
				controller: 'newsactiveCtrl'
			})
			.state('user.newsDetails', {
				url: '/newsDetails/:id',
				templateUrl: 'templates/user/newsDetails.html',
				controller: 'userNewsDetailsCtrl'
			})

			.state('user.userHelp', {
				url: '/userHelp',
				templateUrl: 'templates/user/userHelp.html',
				controller: 'userHelpCtrl'
			})
			.state('user.repo', {
				url: '/repo',
				cache: false,
				params:{
					from:'',
					agentId:''
				},
				templateUrl: 'templates/user/repo.html',
				controller: 'userRepoCtrl'
			})
			.state('user.balanceOut', {
				url: '/balanceOut',
				cache: false,
				templateUrl: 'templates/user/balanceOut.html',
				controller: 'balanceOutCtrl'
			})
			.state('user.balanceOutRecord', {
				url: '/balanceOutRecord',
				cache: false,
				templateUrl: 'templates/user/balanceOutRecord.html',
				controller: 'balanceOutRecordCtrl'
			})
			.state('user.costbalanceOut', {
				url: '/costbalanceOut',
				cache: false,
				templateUrl: 'templates/user/costbalanceOut.html',
				controller: 'costbalanceOutCtrl'
			})
			.state('user.costbalanceRecharge', {
				url: '/costbalanceRecharge',
				cache: false,
				templateUrl: 'templates/user/costbalanceRecharge.html',
				controller: 'costbalanceRechargeCtrl'
			})
			
			
			.state('user.costbalanceOutRecord', {
				url: '/costbalanceOutRecord',
				cache: false,
				templateUrl: 'templates/user/costbalanceOutRecord.html',
				controller: 'costbalanceOutRecordCtrl'
			})
			.state('user.redIntegralOut', {
				url: '/redIntegralOut',
				cache: false,
				templateUrl: 'templates/user/redIntegralOut.html',
				controller: 'redIntegralOutCtrl'
			})
			.state('user.redIntegralOutRecord', {
				url: '/redIntegralOutRecord',
				cache: false,
				templateUrl: 'templates/user/redIntegralOutRecord.html',
				controller: 'redIntegralOutRecordCtrl'
			})
			.state('user.whiteIntegralOut', {
				url: '/whiteIntegralOut',
				cache: false,
				templateUrl: 'templates/user/whiteIntegralOut.html',
				controller: 'whiteIntegralOutCtrl'
			})
			.state('user.whiteIntegralOutRecord', {
				url: '/whiteIntegralOutRecord',
				cache: false,
				templateUrl: 'templates/user/whiteIntegralOutRecord.html',
				controller: 'whiteIntegralOutRecordCtrl'
			})
			.state('user.icebalance', {
				url: '/icebalance/:type',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/icebalance.html',
				controller: 'icebalanceCtrl'
			})
			.state('user.baladetailList', {
				url: '/baladetailList/:type',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/baladetailList.html',
				controller: 'baladetailListCtrl'
			})
			.state('user.repoList', {
				url: '/repoList/:type',
				params: {
					type: null,
					from:''
				},
				cache: false,
				templateUrl: 'templates/user/repoList.html',
				controller: 'userRepoListCtrl'
			})

			.state('user.repoInfo', {
				url: '/repoInfo/:id',
				params: {
					id: null
				},
				cache: false,
				templateUrl: 'templates/user/repoInfo.html',
				controller: 'userRepoInfoCtrl'
			})
			.state('user.myaddress', {
				url: '/myaddress',
				cache: false,
				templateUrl: 'templates/user/myaddress.html',
				controller: 'myaddressCtrl'
			})
			.state('user.myaddressinfo', {
				url: '/myaddressinfo',
				params: {
					id: null
				},
				cache: false,
				templateUrl: 'templates/user/myaddressinfo.html',
				controller: 'myaddressinfoCtrl'
			})
			.state('user.myBank', {
				url: '/myBank',
				params: {
					button: '',
					from: ''
				},
				cache: false,
				templateUrl: 'templates/user/myBank.html',
				controller: 'userMyBankCtrl'
			})

			.state('user.give', {
				url: '/give',
				cache: false,
				templateUrl: 'templates/user/give.html',
				controller: 'userGiveCtrl'
			})

			.state('user.recommend', {
				url: '/recommend',
				cache: false,
				templateUrl: 'templates/user/recommend.html',
				controller: 'userRecommendCtrl'
			})

			.state('user.recommendHistory', {
				url: '/recommendHistory',
				templateUrl: 'templates/user/recommendHistory.html',
				controller: 'userRecommendHistoryCtrl'
			})

			.state('user.myMessage', {
				url: '/myMessage',
				cache: false,
				templateUrl: 'templates/user/myMessage.html',
				controller: 'userMyMessageCtrl'
			})

			.state('user.pay', {
				url: '/pay/:spid',
				params: {
					spid: null
				},
				cache: false,
				templateUrl: 'templates/user/pay.html',
				controller: 'userPayCtrl'
			})
			.state('user.linepay', {
				url: '/linepay/:spid',
				params: {
					spid: null
				},
				cache: false,
				templateUrl: 'templates/user/linepay.html',
				controller: 'linepayCtrl'
			})
			.state('user.addaddress', {
				url: '/addaddress',
				cache: false,
				templateUrl: 'templates/user/addaddress.html',
				controller: 'addaddressCtrl'
			})
			.state('user.apply', {
				url: '/apply',
				params: {
					shoptype: '',
					reapply: ''
				},
				cache: false,
				templateUrl: 'templates/user/apply.html',
				controller: 'userApplyCtrl'
			})
			.state('user.agentApply', {
				url: '/agentApply',
				//				params: {
				//					shoptype: '',
				//					reapply:''
				//				},
				cache: false,
				templateUrl: 'templates/user/agentApply.html',
				controller: 'agentApplyCtrl'
			})
			.state('user.agentApplyresult', {
				url: '/agentApplyresult',
				//				params: {
				//					type: null
				//				},
				cache: false,
				templateUrl: 'templates/user/agentApplyresult.html',
				controller: 'agentApplyresultCtrl'
			})
			.state('user.agentCenter', {
				url: '/agentCenter',
				cache: false,
				templateUrl: 'templates/user/agentCenter.html',
				controller: 'agentCenterCtrl'
			})
			.state('user.agentProList', {
				url: '/agentProList',
				cache: false,
				templateUrl: 'templates/user/agentProList.html',
				controller: 'agentProListCtrl'
			})
			.state('user.lovesdetail', {
				url: '/lovesdetail',
				cache: false,
				templateUrl: 'templates/user/lovesdetail.html',
				controller: 'lovesdetailCtrl'
			})
			.state('user.couponList', {
				url: '/couponList',
				cache: false,
				templateUrl: 'templates/user/couponList.html',
				controller: 'couponListCtrl'
			})
			.state('user.getlovesdetail', {
				url: '/getlovesdetail',
				cache: false,
				templateUrl: 'templates/user/getlovesdetail.html',
				controller: 'getlovesdetailCtrl'
			})
			.state('user.aixinshize', {
				url: '/aixinshize',
				cache: false,
				templateUrl: 'templates/user/aixinshize.html',
				controller: 'aixinshizeCtrl'
			})
			.state('user.chuandishizhe', {
				url: '/chuandishizhe',
				cache: false,
				templateUrl: 'templates/user/chuandishizhe.html',
				controller: 'chuandishizheCtrl'
			})
			.state('user.shareregsiter', {
				url: '/shareregsiter',
				//				cache: false,
				templateUrl: 'templates/user/shareregsiter.html',
				controller: 'shareregsiterCtrl'
			})
			.state('user.ambassadordelivery', {
				url: '/ambassadordelivery',
				cache: false,
				templateUrl: 'templates/user/ambassadordelivery.html',
				controller: 'ambassadordeliveryCtrl'
			})
			.state('user.suregift', {
				url: '/suregift',
				params: {
					id: ''
				},
				cache: false,
				templateUrl: 'templates/user/suregift.html',
				controller: 'suregiftCtrl'
			})
			.state('user.shoptypes', {
				url: '/shoptypes',
				cache: false,
				templateUrl: 'templates/user/shoptypes.html',
				controller: 'shoptypesCtrl'
			})
			.state('user.areaapply', {
				url: '/areaapply',
				cache: false,
				templateUrl: 'templates/user/areaapply.html',
				controller: 'areaapplyCtrl'
			})
			.state('user.notice', {
				url: '/notice/:id',
				params: {
					id: null
				},
				templateUrl: 'templates/user/notice.html',
				controller: 'userNoticeCtrl'
			})

			.state('user.myBean', {
				url: '/myBean',
				cache: false,
				templateUrl: 'templates/user/myBean.html',
				controller: 'userMyBeanCtrl'
			})

			.state('user.giveList', {
				url: '/giveList/:type',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/giveList.html',
				controller: 'userGiveListCtrl'
			})

			.state('user.totalBean', {
				url: '/totalBean/:type',
				params: {
					type: null
				},
				cache: false,
				templateUrl: 'templates/user/totalBean.html',
				controller: 'userTotalBeanCtrl'
			})
			.state('user.loveInfo', {
				url: '/loveInfo',
				cache: false,
				templateUrl: 'templates/user/loveInfo.html',
				controller: 'userLoveInfoCtrl'
			})
			.state("user.loves", {
				url: "/loves",
				cache: false,
				templateUrl: "templates/user/loves.html",
				controller: "lovesCtrl"
			})
			.state("user.role", {
				url: "/role",
				cache: false,
				templateUrl: "templates/user/role.html",
				controller: "roleCtrl"
			})
			.state("user.shop", {
				url: "/shop",
				cache: false,
				templateUrl: "templates/tab/tab-shop.html",
				controller: "tabshopCtrl"
			})
			.state("user.cost-balance", {
				url: "/cost-balance",
				cache: false,
				templateUrl: "templates/user/cost-balance.html",
				controller: "costBalanceCtrl"
			})
			.state("user.voucherUsefulList", {
				url: "/voucherUsefulList",
				cache: false,
				templateUrl: "templates/user/voucherUsefulList.html",
				controller: "voucherUsefulListCtrl"
			})
			
			
			.state("user.cost-balance-list", {
				url: "/cost-balance-list",
				cache: false,
				templateUrl: "templates/user/cost-balance-list.html",
				controller: "costBalanceListCtrl"
			})
			.state("user.qiandao", {
				url: "/qiandao",
				// cache: false,
				templateUrl: "templates/user/qiandao.html",
				controller: "qianDaoCtrl"
			})
			.state("user.profitRatio", {
				url: "/profitRatio",
				 cache: false,
				 params:{
				 	list:{}
				 },
				templateUrl: "templates/user/profitRatio.html",
				controller: "profitRatioCtrl"
			})
			.state('poor', {
				url: '/poor',
				abstract: true,
				templateUrl: 'templates/poor.html'
			})
			.state('poor.home', {
				url: '/home',
				params: {
					from: ''
				},
				cache: false,
				views: {
					'poor-home': {
						templateUrl: 'templates/poor/poor-home.html',
						controller: 'poorHomeCtrl'
					}
				}
			})
			.state('poor.shop', {
				url: '/shop',
				cache: false,
				views: {
					'poor-shop': {
						templateUrl: 'templates/poor/poor-shop.html',
						controller: 'poorShopCtrl'
					}
				}
			})
			.state('poor.shop.donateModal', {
				url: '/donateModal',
				cache: false,
				templateUrl: 'templates/poor/poor-donateGoodModal.html',

			})
			.state('poor.donate', {
				url: '/donate',
				cache: false,
				views: {
					'poor-donate': {
						templateUrl: 'templates/poor/poor-donate.html',
						controller: 'poorDonateCtrl'
					}
				}
			})
			.state('poor.my', {
				url: '/my',
				views: {
					'poor-my': {
						templateUrl: 'templates/poor/poor-my.html',
						controller: 'myCtrl'
					}
				}
			})
			.state('poorson', {
				url: '/poorson',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('poorson.intro', {
				url: '/intro',
				cache: false,
				templateUrl: 'templates/poor/poor-intro.html',
				controller: 'poorIntroCtrl'
			})
			.state('poorson.introPage', {
				url: '/introPage',
				// cache: false,
				templateUrl: 'templates/introPage.html',
				controller: 'poorIntroPageCtrl'
			})
			.state('poorson.list', {
				url: '/list',
				params: {
					fromPage: null,
					goodId: null
				},

				templateUrl: 'templates/poor/poor-list.html',
				controller: 'poorListCtrl'
			})
			.state('poorson.detail', {
				url: '/detail',
				params: {
					id: ''
				},
				cache: false,
				templateUrl: 'templates/poor/poor-detail.html',
				controller: 'poorDetailCtrl'
			})
			.state('poorson.gooddetail', {
				url: '/gooddetail',
				params: {
					id: null
				},
				cache: false,
				templateUrl: 'templates/poor/poor-gooddetail.html',
				controller: 'poorGoodDetailCtrl'
			})
			.state('poorson.goodcate', {
				url: '/goodcate',
				cache: false,
				templateUrl: 'templates/poor/poor-goodcate.html',
				controller: 'poorGoodCateCtrl'
			})
			.state('poorson.goodsear', {
				url: '/goodsear',
				cache: false,
				params: {
					keywords: null,
				},
				templateUrl: 'templates/poor/poor-goodsear.html',
				controller: 'poorGoodSearCtrl'
			})
			.state('poorson.goodsearres', {
				url: '/goodsearres',
				params: {
					keywords: null,
					id: null
				},
				cache: false,
				templateUrl: 'templates/poor/poor-goodsearres.html',
				controller: 'poorGoodSearResCtrl'
			})
			.state('poorson.recknow', {
				url: '/recknow',
				cache: false,
				params: {
					fromPage: null
				},
				templateUrl: 'templates/poor/poor-recknow.html',
				controller: 'poorRecKnowCtrl'
			})
			.state('poorson.recreason', {
				url: '/recreason',
				cache: false,
				templateUrl: 'templates/poor/poor-recreason.html',
				// controller: 'poorRecKnowCtrl'
			})
			.state('poorson.recform', {
				url: '/recform',
				cache: false,
				params: {
					type: null
				},
				templateUrl: 'templates/poor/poor-recform.html',
				controller: 'poorRecFormCtrl'
			})
			.state('poorson.recpay', {
				url: '/recpay',
				cache: false,
				params: {
					applyInfo: null
				},
				templateUrl: 'templates/poor/poor-recpay.html',
				controller: 'poorRecPayCtrl'
			})
			.state('poorson.pay', {
				url: '/pay',
				cache: false,
				params: {
					id: null,
					payid: null,
					ordertypes: null,
					money: null
				},
				templateUrl: 'templates/poor/poor-pay.html',
				controller: 'poorPayCtrl'
			})
			.state('poorson.cart', {
				url: '/cart',
				cache: false,
				templateUrl: 'templates/poor/poor-cart.html',
				controller: 'poorCartCtrl'
			})
			.state('poorson.ordersure', {
				url: '/ordersure',
				params: {
					info: null
				},
				cache: false,
				templateUrl: 'templates/poor/poor-ordersure.html',
				controller: 'poorOrderSureCtrl'
			})
			.state('poorson.donaterank', {
				url: '/donaterank',
				cache: false,
				templateUrl: 'templates/poor/poor-donaterank.html',
				controller: 'poorDonateRankCtrl'
			})
			.state('poorson.donatedetail', {
				url: '/donatedetail',
				cache: false,
				templateUrl: 'templates/poor/poor-donatedetail.html',
				controller: 'poorDonateDetailCtrl'
			})
			.state('poorson.detailrec', {
				url: '/detailrec',
				cache: false,
				params: {
					reuid: null
				},
				templateUrl: 'templates/poor/poor-detailrec.html',
				controller: 'poorDetailRecCtrl'
			})
			.state('poorson.newsactive', {
				url: '/newsactive',
				cache: false,
				templateUrl: 'templates/poor/poor-newsactive.html',
				controller: 'poorNewsActiveCtrl'
			})
			.state('poorson.orderlist', {
				url: '/orderlist',
				cache: false,
				templateUrl: 'templates/poor/poor-orderlist.html',
				controller: 'myorderCtrl'
			})
			.state('poorson.balanceindex', {
				url: '/balanceindex',
				cache: false,
				templateUrl: 'templates/my/balanceindex.html',
				controller: 'balanceindexCtrl'
			})
			.state('poorson.loves', {
				url: '/loves',
				cache: false,
				templateUrl: 'templates/my/loves.html',
				controller: 'lovesCtrl'
			})
			.state('poorson.collection', {
				url: '/collection',
				cache: false,
				templateUrl: 'templates/my/collection.html',
				controller: 'collectionCtrl'
			})
			.state('poorson.team', {
				url: '/team',
				cache: false,
				templateUrl: 'templates/my/team.html',
				controller: 'teamCtrl'
			})
			.state('poorson.servercenter', {
				url: '/servercenter',
				templateUrl: 'templates/my/servercenter.html',
				controller: 'aboutvrCtrl'
			})
			.state('poorson.recommend', {
				url: '/recommend',
				templateUrl: 'templates/my/recommend.html',
				controller: 'userRecommendCtrl'
			})
			.state('poorson.myorderinfo', {
				url: '/myorderinfo/:type',
				params: {
					type: '',
					id: null
				},
				cache: false,
				templateUrl: 'templates/my/myorderinfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('poorson.helplist', {
				url: '/helplist',
				cache: false,
				templateUrl: 'templates/my/helplist.html',
				controller: 'userHelpListCtrl'
			})
			.state('poorson.loveunion', {
				url: '/loveunion',
				cache: false,
				templateUrl: 'templates/poor/poor-loveunion.html',
				controller: 'loveunionCtrl'
			})
			//我的-商家店铺
			.state('poorson.sjshop', {
				url: '/sjshop',
				cache: false,
				templateUrl: 'templates/poor/poor-sjshop.html',
				controller: 'tabshopCtrl'
			})

			.state('poorson.safesetting', {
				url: '/safesetting',
				templateUrl: 'templates/user/safesetting.html',
				controller: 'userCenterCtrl'
			})

			.state('poorson.donatepay', {
				url: '/donatepay',
				params: {
					fromPage: null,
					way: null,
					money: null,
					relation: null,
					info: null,
					leaveMsg: null

				},
				cache: false,
				templateUrl: 'templates/poor/poor-donatepay.html',
				controller: 'poorDonatePayCtrl'
			})
			.state('integralMall', {
				url: '/integralMall',
				abstract: true,
				templateUrl: 'templates/integralMall.html'
			})
			.state('integralMall.home', {
				url: '/home',
				cache: false,
				views: {
					'integralMall-home': {
						templateUrl: 'templates/integralMall/integralMall-home.html',
						controller: 'inteMallHomeCtrl'
					}
				}
			})
			.state('integralMall.goods', {
				url: '/goods',
				cache: false,
				params: {
					title: '',
					cid: ''
				},
				views: {
					'integralMall-goods': {
						templateUrl: 'templates/integralMall/integralMall-goods.html',
						controller: 'integralMallGoodsCtrl'
					}
				}
			})
			.state('integralMall.lists', {
				url: '/lists',
				cache: false,
				views: {
					'integralMall-lists': {
						templateUrl: 'templates/integralMall/integralMall-lists.html',
						controller: 'integralMallListsCtrl'
					}
				}
			})
			.state('integral', {
				url: '/integral',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('integral.goodsInfo', {
				url: '/goodsInfo',
				params: {
					goodsId: ''
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-goodsInfo.html',
				controller: 'integralMallGoodsInfoCtrl'
			})
			.state('integral.checkOrder', {
				url: '/checkOrder',
				params: {
					id: '',
					types: {}
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-checkOrder.html',
				controller: 'integralMallCheckOrderCtrl'
			})
			.state('integral.addressList', {
				url: '/addressList',
				params: {
					id: '',
					types: {}
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-addressList.html',
				controller: 'integralMallAddressListCtrl'
			})
			.state('integral.addaddress', {
				url: '/addaddress',
				params: {
					id: '',
					types: {}
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-addaddress.html',
				controller: 'integralMallAddaddressCtrl'
			})
			.state('integral.pay', {
				url: '/pay',
				params: {
					payInfo: {},
					addressInfo: {}
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-pay.html',
				controller: 'integralMallPayCtrl'
			})
			.state('integral.recordInfo', {
				url: '/recordInfo',
				params: {
					id: ''
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-recordInfo.html',
				controller: 'integralMallRecordInfoCtrl'
			})
			.state('integral.voucherList', {
				url: '/voucherList',
				params: {
					issplit: null
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-voucherList.html',
				controller: 'integralMallvoucherListCtrl'
			})
			.state('integral.luckdraw', {
				url: '/luckdraw',
				params: {
					issplit: null
				},
				cache: false,
				templateUrl: 'templates/integralMall/integralMall-luckdraw.html',
				controller: 'integralMallluckdrawCtrl'
			})

			//众筹
			.state('cf', {
				url: '/cf',
				abstract: true,
				templateUrl: 'templates/cf-tabs.html'
			})
			.state('cf.home', {
				url: '/home',
				cache: false,
				views: {
					'cf-home': {
						templateUrl: 'templates/crowdfunding/cf-home.html',
						controller: 'cf-homeCtrl'
					}
				}
			})
			//			.state('cf.initiate', {
			//				url: '/initiate',
			//				cache: false,
			//				params: {
			//					title: '',
			//					cid: ''
			//				},
			//				views: {
			//					'cf-initiate': {
			//						templateUrl: 'templates/crowdfunding/cf-initiate.html',
			//						controller: 'integralMallGoodsCtrl'
			//					}
			//				}
			//			})
			.state('cf.cf-projectapply', {
				url: '/cf-projectapply',
				params: {
					goodsId: ''
				},
				cache: false,
				views: {
					'cf-projectapply': {
						templateUrl: 'templates/crowdfunding/cf-projectapply.html',
						controller: 'cfprojectapplyCtrl'
					}
				}
			})
			//			.state('cf.news', {
			//				url: '/news',
			//				cache: false,
			//				views: {
			//					'cf-news': {
			//						templateUrl: 'templates/crowdfunding/cf-news.html',
			//						controller: 'integralMallListsCtrl'
			//					}
			//				}
			//			})
			.state('cf.my', {
				url: '/my',
				cache: false,
				views: {
					'cf-my': {
						templateUrl: 'templates/crowdfunding/cf-my.html',
						controller: 'cfmyCtrl'
					}
				}
			})
			.state('cdF', {
				url: '/crowdfunding',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('cdF.cf-projectapply', {
				url: '/cf-projectapply',
				params: {
					goodsId: ''
				},
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-projectapply.html',
				controller: 'cfprojectapplyCtrl'
			})
			.state('cdF.cf-myprojectlist', {
				url: '/cf-myprojectlist',
				params: {
					relation: ''
				},
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-myprojectlist.html',
				controller: 'cfmyprojectlistCtrl'
			})
			.state('cdF.cf-myprojectinfo', {
				url: '/cf-myprojectinfo',
				params: {
					itemId: ''
				},
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-myprojectinfo.html',
				controller: 'cfmyprojectInfoCtrl'
			})
			.state('cdF.cf-mycenter', {
				url: '/cf-mycenter',
				params: {
					goodsId: ''
				},
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-mycenter.html',
				controller: 'cfmycenterCtrl'
			})
			.state('cdF.cf-bankList', {
				url: '/cf-bankList',
				params: {
					goodsId: ''
				},
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-bankList.html',
				controller: 'cfbankListCtrl'
			})
			.state('cdF.cf-pay', {
				url: '/cf-pay',
				params: {
					payid: '',
					money: ''
				},
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-pay.html',
				controller: 'cfpayCtrl'
			})
			.state('cdF.cf-money', {
				url: '/cf-money',
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-money.html',
				controller: 'cfmoneyCtrl'
			})
			.state('cdF.cf-repo', {
				url: '/cf-repo',
				cache: false,
				templateUrl: 'templates/crowdfunding/cf-repo.html',
				controller: 'cfrepoCtrl'
			})
			// 一元夺宝
			.state('db', {
				url: '/db',
				abstract: true,
				templateUrl: 'templates/duobao.html'
			})
			.state('db.home', {
				url: '/home',
				cache: false,
				views: {
					'db-home': {
						templateUrl: 'templates/db/db-home.html',
						controller: 'dbHomeCtrl'
					},
				}
			})
			.state('db.goodsList', {
				url: '/goodsList',
				cache: false,
				params: {
					cateId: null
				},
				views: {
					'db-goodsList': {
						templateUrl: 'templates/db/db-goodsList.html',
						controller: 'dbGoodsListCtrl'
					},
				}
			})
			.state('db.cart', {
				url: '/cart',
				cache: false,
				views: {
					'db-cart': {
						templateUrl: 'templates/db/db-cart.html',
						controller: 'dbCartCtrl'
					},
				}
			})
			.state('db.lastReveal', {
				url: '/lastReveal',
				cache: false,
				views: {
					'db-lastReveal': {
						templateUrl: 'templates/db/db-lastReveal.html',
						controller: 'dbLastRevealCtrl'
					},
				}
			})
			.state('db.userCenter', {
				url: '/userCenter',
				cache: false,
				views: {
					'db-userCenter': {
						templateUrl: 'templates/db/db-userCenter.html',
						controller: 'dbUserCenterCtrl'
					},
				}
			})
			.state('dbson', {
				url: '/dbson',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('dbson.goodsInfo', {
				url: '/goodsInfo',
				params: {
					goodsId: null
				},
				cache: false,
				templateUrl: 'templates/db/db-goodsInfo.html',
				controller: 'dbGoodsInfoCtrl'
			})
			.state('dbson.goodsDetail', {
				url: '/goodsDetail',
				params: {
					goodsId: null
				},
				cache: false,
				templateUrl: 'templates/db/db-goodsDetail.html',
				controller: 'dbGoodsDetailCtrl'
			})
			.state('dbson.createOrder', {
				url: '/createOrder',
				params: {
					list: null,
					payid: null,
					totalPrice: null,
					balance: null
				},
				cache: false,
				templateUrl: 'templates/db/db-createOrder.html',
				controller: 'dbCreateOrderCtrl'
			})
			.state('dbson.paySuccess', {
				url: '/paySuccess',
				cache: false,
				templateUrl: 'templates/db/db-paySuccess.html',
				controller: 'dbPaySuccessCtrl'
			})
			.state('dbson.userRec', {
				url: '/userRec',
				cache: false,
				templateUrl: 'templates/db/db-userRec.html',
				controller: 'dbUserRecCtrl'
			})
			.state('dbson.awardRec', {
				url: '/awardRec',
				cache: false,

				templateUrl: 'templates/db/db-awardRec.html',
				controller: 'dbAwardRecCtrl'
			})
			.state('dbson.awardRecD', {
				url: '/awardRecD',
				cache: false,
				params: {
					id: null,
					selectedAdd: null
				},
				templateUrl: 'templates/db/db-awardRecD.html',
				controller: 'dbAwardRecDCtrl'
			})
			.state('dbson.lastRevealD', {
				url: '/lastRevealD',
				cache: false,
				params: {
					periodId: null,
				},
				templateUrl: 'templates/db/db-lastRevealD.html',
				controller: 'dbLastRevealDCtrl'
			})
		//		$urlRouterProvider.otherwise("poorson/introPage");
		$urlRouterProvider.otherwise('tab/online');
		// $urlRouterProvider.otherwise('tab/home');
	});