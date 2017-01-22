four51.app.directive('orderbilling', ['$rootScope', 'Address', 'AddressList', function($rootScope, Address, AddressList) {
	var obj = {
		restrict: 'AE',
		templateUrl: 'partials/controls/orderBilling.html',
		controller: ['$scope', function($scope) {
			AddressList.clear();
			AddressList.billing(function(list) {
				$scope.billaddresses = list;
				if ($scope.isEditforApproval) {
					if (!AddressList.contains($scope.currentOrder.BillAddress))
						$scope.billaddresses.push($scope.currentOrder.BillAddress);
				}
			});

			$scope.currentOrder.copyShipAddress = false;

			$scope.billaddress = { Country: 'US', IsShipping: false, IsBilling: true };

			$scope.$on('event:AddressSaved', function(event, address) {
				if (address.IsBilling) {
					$scope.currentOrder.BillAddressID = address.ID;
					$scope.billaddressform = false;
				}

				AddressList.billing(function(list) {
					$scope.billaddresses = list;
					if ($scope.isEditforApproval) {
						$scope.billaddresses.push($scope.currentOrder.BillAddress);
					}
				});
				$scope.billaddress = { Country: 'US', IsShipping: false, IsBilling: true };
			});

			$scope.$watch('currentOrder.BillAddressID', function(newValue) {
				if (newValue) {
					Address.get(newValue, function(add) {
						if ($scope.user.Permissions.contains('EditBillToName') && !add.IsCustEditable) {
							$scope.currentOrder.BillFirstName = add.FirstName;
							$scope.currentOrder.BillLastName = add.LastName;
						}
						$scope.BillAddress = add;
					});

					if ($scope.currentOrder.BillAddressID != $scope.orderShipAddress.ID) {
						$scope.currentOrder.copyShipAddress = false;
					}
					if ($scope.currentOrder.BillAddressID == $scope.orderShipAddress.ID) {
						$scope.currentOrder.copyShipAddress = true;
					}

				}
			});

			$scope.$on('event:AddressCancel', function(event) {
				$scope.billaddressform = false;
			});


			$scope.resetBilling = function() {

				if ($scope.currentOrder.copyShipAddress == true) {
					$scope.currentOrder.BillAddressID = $scope.orderShipAddress.ID;
					$scope.shipaddress.IsBilling = true;
				}
				if ($scope.currentOrder.copyShipAddress == false) {
					$scope.currentOrder.BillAddressID = '';
					$scope.shipaddress.IsBilling = false;
				}
			}

			$scope.$on('shipChange', function() {
				$scope.currentOrder.BillAddressID = '';
				$scope.shipaddress.IsBilling = false;
				$scope.currentOrder.copyShipAddress = false;
			});
		}]
	};
	return obj;
}]);

four51.app.directive('billingmessage', function() {
	var obj = {
		restrict: 'E',
		templateUrl: 'partials/messages/billing.html'
	};
	return obj;
});