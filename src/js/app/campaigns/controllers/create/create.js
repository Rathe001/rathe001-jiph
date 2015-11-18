let modCampaigns = angular.module('modCampaigns');

modCampaigns.controller('ctrlCampaignsCreate', ['$scope', 'Accounts', 'Campaigns', 'Dictionary', 'Objectives', 'Facebook',
    function($scope, Accounts, Campaigns, Dictionary, Objectives, Facebook) {
        let vm = this;

        vm.objectives = [];
        vm.dictionary = {};
        vm.campaign = {};
        vm.pages = [];
        vm.posts = [];
        vm.pixels = [];

        vm.showDetails = showDetails;

        _init();

        $scope.$watch(() => vm.campaign.objective, newVal => {
            if(newVal) {
                //console.log(newVal);
            }
        });

        $scope.$watch(() => Accounts.active, newVal => {
            if(newVal) {
                _init();
            }
        });

        $scope.$watch(() => vm.campaign.promoted_object.page_id, newVal => {
            if(newVal && vm.campaign.objective === "POST_ENGAGEMENT") {
                _getPagePosts();
            }
        });

        function _init(){
            vm.objectives = Objectives.all;
            vm.dictionary = Dictionary;
            vm.campaign = _setDefaultCampaign();
            vm.pages = _getAccountPages();
            vm.pixels = _getAccountPixels();
        }

        function _setDefaultCampaign() {
            return {
                name: "",
                objective: "",
                buying_type: "AUCTION",
                promoted_object: {
                    page_id: undefined,
                    application_id: undefined,
                    pixel_id: undefined,
                    custom_event_type: undefined,
                    object_store_url: undefined,
                    offer_id: undefined,
                    product_catalog_id: undefined,
                    product_set_id: undefined
                },
                spend_cap: undefined,
                execution_options: undefined,
                adlabels: undefined
            }
        }

        function _getAccountPages() {
            Facebook.get('/' + Accounts.active + '/connectionobjects').then(connectionobjects => {
                let ary = connectionobjects.data;
                vm.pages = ary.filter(obj => obj.type === 1);
                vm.applications = ary.filter(obj => obj.type === 2);
                vm.events = ary.filter(obj => obj.type === 3);
                vm.places = ary.filter(obj => obj.type === 6);
                vm.domains = ary.filter(obj => obj.type === 7);
            });
        }

        function _getAccountPixels() {
            Facebook.get('/' + Accounts.active + '/offsitepixels').then(offsitepixels => {
                vm.pixels = offsitepixels.data;
            });
        }

        function _getPagePosts() {
            Facebook.get('/' + vm.campaign.promoted_object.page_id + '/promotable_posts', {fields:["full_picture","icon","is_published","link","message","name","object_id","picture","story","type"]}).then(posts => {
                vm.posts = posts.data;
            });
        }

        function showDetails() {
            return !!vm.campaign.objective;
        }
    }
]);