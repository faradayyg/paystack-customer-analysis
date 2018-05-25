const app = angular.module("sliderApp",[]);

app.controller("sliderController", ($scope,$http) => {

	//Variable Declarations and initializations
	$scope.revenue 		= 0;
	$scope.percentage 	= 100;
	$scope.topCustomers = 12;
	const startDate 	= '2017-01-01';
	const secretKey  	= getSecretKey();

	//Get date of today 
	let dateObject 		= new Date();
	const endDate 		= `${dateObject.getFullYear()}-${dateObject.getMonth()}-${dateObject.getDate()}`;

	//Pluralization fix for customer(s)
	$scope.isPlural = (count) => {
		return count > 1 ? 's': '';
	}

	//Function to calculate percentage revenue
	$scope.calculatePercentage = () => {
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
	$scope.getCurrentRange = (key,object,position) => {
		let total_amount = 0;
		for (let i = position - 1; i >= 0; i--) {
			total_amount += object[i][key];
		}
		return total_amount;
	}

	$scope.setHint 		= () => {
		let slider 		= document.querySelector('#rangeSlider');
		let newPoint 	= (slider.value - slider.getAttribute("min")) / (slider.getAttribute("max") - slider.getAttribute("min"));
		let newPlace 	= slider.offsetWidth * newPoint;
		let offset 		= 1.2;
		let hintDiv 	= document.querySelector('#hint');

		offset += newPoint;
		hintDiv.style.left = newPlace+"px";
		if($scope.topCustomers == 1 ||$scope.topCustomers == 12) {
			hintDiv.style.display = "none";
		}
		else {
			hintDiv.style.display = "inline-block";
		}
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
		}).then(response=>{

			//Calculate total amount by all customers
			var total_transaction_amount = 0;
			response.data.data.forEach((customer)=> {
				total_transaction_amount += customer.total_transaction_amount;
			});

			//Sort transactions according to total transaction amount descending order
			$scope.sorted_transactions = response.data.data.sort((a,b)=>{
				return b.total_transaction_amount - a.total_transaction_amount;
			});

			$scope.revenue = total_transaction_amount;
		})
});