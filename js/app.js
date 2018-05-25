var app = angular.module("sliderApp",[]);

app.controller("sliderController", function($scope,$http) {

	//Variable Declarations and initializations
	$scope.revenue 		= 0;
	$scope.percentage 	= 100;
	$scope.topCustomers = 12;
	var startDate 		= '2017-01-01';
	var secretKey  		= getSecretKey();

	//Get date of today 
	var dateObject 		= new Date();
	var endDate 		= `${dateObject.getFullYear()}-${dateObject.getMonth()}-${dateObject.getDate()}`;

	//Pluralization fix for customer(s)
	$scope.isPlural = function(count) {
		if(count > 1) {
			return 's';
		}
		return;
	}

	//Function to calculate percentage revenue
	$scope.calculatePercentage = function() {
		if($scope.sorted_transactions.length !=0) {
			$currentRange = $scope.getCurrentRange('total_transaction_amount', $scope.sorted_transactions, $scope.topCustomers);
			$percentage = $currentRange/$scope.revenue * 100;

			return Math.floor($percentage);
		}
	}

	/**
		* Function to sum a range of values given a key, position and object
		* @param String key. - the key to be summed
		* @param Array Object, the object to be used in the summing 
		* @param Position the position to count down from
		* @return a Summed up something
	**/
	$scope.getCurrentRange = function(key,object,position) {
		var total_amount = 0;
		for (var i = position - 1; i >= 0; i--) {
			total_amount += object[i][key];
		}
		return total_amount;
	}

	//Get and Set the total Transaction Amount
	$scope.sorted_transactions = [];
	$http({
		url 	: 'https://studio-api.paystack.co/insights/spenders',
		params 	: {
			      from: startDate,
			      to: endDate
		},
		 headers: {
		 	'Authorization': `Bearer ${secretKey}`
		 }
		}).then(r=>{

			//Calculate total amount by all customers
			var total_transaction_amount = 0;
			r.data.data.forEach((customer)=> {
				total_transaction_amount += customer.total_transaction_amount;
			});

			//Sort transactions according to total transaction amount descending order
			$scope.sorted_transactions = r.data.data.sort((a,b)=>{
				return b.total_transaction_amount - a.total_transaction_amount;
			});

			$scope.revenue = total_transaction_amount;
		})
});