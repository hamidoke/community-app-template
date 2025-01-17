(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateFixedDepositAccountController: function (scope, resourceFactory, location, routeParams, dateFilter,$uibModal, WizardHandler) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.transientData ={};
            scope.restrictDate = new Date();
            scope.fixedDetails = {};
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            if (routeParams.centerEntity) {
                scope.centerEntity = true;
            }

            scope.date = {};
			scope.date.submittedOnDate = new Date();
            scope.disabled = true;

            //interest rate chart details
            scope.chart = {};
            scope.fromDate = {}; //required for date formatting
            scope.endDate = {};//required for date formatting

            scope.charges = [];
            scope.inparams = {};

            scope.maturityDetails = {};

            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId
            }
            ;
            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId
            }
            ;
            if (scope.centerId) {
                scope.inparams.centerId = scope.centerId
            }
            ;

            resourceFactory.fixedDepositAccountTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.clientName = data.clientName;
                scope.groupName = data.groupName;
                scope.savingsAccounts = data.savingsAccounts;
            });

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
            }

            scope.changeProduct = function () {
                scope.inparams.productId = scope.formData.productId;
                resourceFactory.fixedDepositAccountTemplateResource.get(scope.inparams, function (data) {
                    scope.depositRolloverOptions = data.maturityInstructionOptions;
                    scope.savingsAccounts = data.savingsAccounts;
                    scope.data = data;
                    scope.charges = data.charges;

                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value === "Annual Fee" && scope.charges[i].feeOnMonthDay) {
                            scope.charges[i].feeOnMonthDay.push('2013');
                            scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                        }
                    }
                    scope.fieldOfficers = data.fieldOfficerOptions;
                    scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                    scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
                    scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
                    scope.formData.withHoldTax = data.withHoldTax;
                    scope.formData.allowPartialLiquidation = data.allowPartialLiquidation;
                    scope.formData.totalLiquidationAllowed = data.totalLiquidationAllowed;

                    if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                    if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
                    if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
                    if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                    if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                    if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;
                    if (data.interestFreePeriodApplicable) scope.formData.interestFreePeriodApplicable = data.interestFreePeriodApplicable;
                    if (data.preClosurePenalApplicable) scope.formData.preClosurePenalApplicable = data.preClosurePenalApplicable;

                    scope.disabled = false;
                    scope.fixedDetails = angular.copy(scope.formData);
                    scope.fixedDetails.productName = scope.formValue(scope.products,scope.formData.productId,'id','name');
                    scope.allowManuallyEnterInterestRate = scope.formValue(scope.products,scope.formData.productId,'id','allowManuallyEnterInterestRate');
                    console.log(scope.allowManuallyEnterInterestRate);

                    scope.chart = data.accountChart;
                    scope.chartSlabs = scope.chart.chartSlabs;
                    //format chart date values
                    if (scope.chart.fromDate) {
                        var fromDate = dateFilter(scope.chart.fromDate, scope.df);
                        scope.fromDate.date = new Date(fromDate);
                    }
                    if (scope.chart.endDate) {
                        var endDate = dateFilter(scope.chart.endDate, scope.df);
                        scope.endDate.date = new Date(endDate);
                    }



                    var interestFreePeriodFrequencyTypeId = (_.isNull(data.interestFreePeriodFrequencyType) || _.isUndefined(data.interestFreePeriodFrequencyType)) ? '' : data.interestFreePeriodFrequencyType.id;
                    var preClosurePenalInterestOnTypeId = (_.isNull(data.preClosurePenalInterestOnType) || _.isUndefined(data.preClosurePenalInterestOnType)) ? '' : data.preClosurePenalInterestOnType.id;
                    var minDepositTermTypeId = (_.isNull(data.minDepositTermType) || _.isUndefined(data.minDepositTermType)) ? '' : data.minDepositTermType.id;
                    var maxDepositTermTypeId = (_.isNull(data.maxDepositTermType) || _.isUndefined(data.maxDepositTermType)) ? '' : data.maxDepositTermType.id;
                    var inMultiplesOfDepositTermTypeId = (_.isNull(data.inMultiplesOfDepositTermType) || _.isUndefined(data.inMultiplesOfDepositTermType)) ? '' : data.inMultiplesOfDepositTermType.id;

                    scope.formData.interestFreePeriodApplicable = data.interestFreePeriodApplicable;
                    scope.formData.interestFreeFromPeriod = data.interestFreeFromPeriod;
                    scope.formData.interestFreeToPeriod = data.interestFreeToPeriod;
                    scope.formData.interestFreePeriodFrequencyTypeId = interestFreePeriodFrequencyTypeId;
                    scope.formData.preClosurePenalApplicable = data.preClosurePenalApplicable;
                    scope.formData.preClosurePenalInterest = data.preClosurePenalInterest;
                    scope.formData.preClosurePenalInterestOnTypeId = preClosurePenalInterestOnTypeId;
                    scope.formData.minDepositTerm = data.minDepositTerm;
                    scope.formData.maxDepositTerm = data.maxDepositTerm;
                    scope.formData.minDepositTermTypeId = minDepositTermTypeId;
                    scope.formData.maxDepositTermTypeId = maxDepositTermTypeId;
                    scope.formData.inMultiplesOfDepositTerm = data.inMultiplesOfDepositTerm;
                    scope.formData.inMultiplesOfDepositTermTypeId = inMultiplesOfDepositTermTypeId;
                    scope.formData.transferInterestToSavings = 'false';
                });
            };


            scope.isUserDefinedInterestRate = false;
            scope.setInterestRate = function() {
            		scope.isUserDefinedInterestRate = true;
            };
            scope.calculateInterestRate = function() {
            console.log(scope.chartSlabs, scope.isUserDefinedInterestRate, scope.formData.depositAmount, scope.formData.depositPeriod,
            scope.formData.depositPeriodFrequencyId);
				if (!scope.isUserDefinedInterestRate &&
					(scope.formData.depositAmount && scope.formData.depositPeriod && scope.formData.depositPeriodFrequencyId > -1)) {
					var amount = parseFloat(scope.formData.depositAmount);
					var depositPeriod = parseFloat(scope.formData.depositPeriod);
					var periodFrequency = scope.formData.depositPeriodFrequencyId;
					var filteredSlabs = scope.chartSlabs.filter(function (x) { return amount >= x.amountRangeFrom &&  (amount <= x.amountRangeTo || !x.amountRangeTo) });
					filteredSlabs.map(function(x) {

						var period = scope.computePeriod(depositPeriod, periodFrequency, x.periodType.id);
						console.log("x", period);
						if(x.toPeriod && x.fromPeriod){
						    if (period && x.fromPeriod <= period && x.toPeriod >= period) {
                        		 scope.formData.nominalAnnualInterestRate = x.annualInterestRate;
						}}else
						if (period && x.fromPeriod <= period){
                                 scope.formData.nominalAnnualInterestRate = x.annualInterestRate;
						}

					});
				}
			};

			scope.computePeriod = function(depositPeriod, depositPeriodFrequency, filteredPeriod) {
				if (depositPeriodFrequency == filteredPeriod) {
					return depositPeriod;
				}
				if (filteredPeriod == 0) {
					if (depositPeriodFrequency == 1) {
						return depositPeriod * 7;
					}
					if (depositPeriodFrequency == 2) {
						return depositPeriod * 30;
					}
					if (depositPeriodFrequency == 3) {
						return depositPeriod * 365;
					}
				} else if (filteredPeriod == 1) {
					if (depositPeriodFrequency == 0) {
						return depositPeriod / 7;
					}
					if (depositPeriodFrequency == 2) {
						return depositPeriod * 4;
					}
					if (depositPeriodFrequency == 3) {
						return depositPeriod * 52;
					}
				} else if (filteredPeriod == 2) {
					if (depositPeriodFrequency == 0) {
						return depositPeriod / 30;
					}
					if (depositPeriodFrequency == 1) {
						return depositPeriod / 4;
					}
					if (depositPeriodFrequency == 3) {
						return depositPeriod * 12;
					}
				} else if (filteredPeriod == 3) {
					if (depositPeriodFrequency == 0) {
						return depositPeriod / 365;
					}
					if (depositPeriodFrequency == 1) {
						return depositPeriod / 52;
					}
					if (depositPeriodFrequency == 2) {
						return depositPeriod / 12;
					}
				}
			};


            scope.$watch('formData',function(newVal){
               scope.fixedDetails = angular.extend(scope.fixedDetails,newVal);
            });

            scope.formValue = function(array,model,findattr,retAttr){
                findattr = findattr ? findattr : 'id';
                retAttr = retAttr ? retAttr : 'value';
                console.log(findattr,retAttr,model);
                return _.find(array, function (obj) {
                    return obj[findattr] === model;
                })[retAttr];
            };

            scope.addCharge = function (chargeId) {
                scope.errorchargeevent = false;
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        if (data.chargeTimeType.value == "Annual Fee") {
                            if (data.feeOnMonthDay) {
                                data.feeOnMonthDay.push(2013);
                                data.feeOnMonthDay = new Date(dateFilter(data.feeOnMonthDay, scope.df));
                            }
                        } else if (data.chargeTimeType.value == "Monthly Fee") {
                            if (data.feeOnMonthDay) {
                                data.feeOnMonthDay.push(2013);
                                data.feeOnMonthDay = new Date(dateFilter(data.feeOnMonthDay, scope.df));
                            }
                        }
                        scope.charges.push(data);
                        scope.chargeId = undefined;
                    });
                } else {
                    scope.errorchargeevent = true;
                    scope.labelchargeerror = "selectcharge";
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.submit = function () {
                if (scope.date) {
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate, scope.df);
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.monthDayFormat = "dd MMM";
                this.formData.charges = [];

                if (scope.clientId) this.formData.clientId = scope.clientId;
                if (scope.groupId) this.formData.groupId = scope.groupId;
                if (scope.centerId) this.formData.centerId = scope.centerId;

                if (scope.charges.length > 0) {
                    for (var i in scope.charges) {

                        var chargeData = { chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount};
                        if(scope.charges[i].chargeTimeType.value == 'Annual Fee' || scope.charges[i].chargeTimeType.value == 'Monthly Fee'){
                            chargeData.feeOnMonthDay = dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM');
                        }
                        if (scope.charges[i].chargeTimeType.value == 'Specified due date' || scope.charges[i].chargeTimeType.code=='chargeTimeType.weeklyFee') {
                            chargeData.dueDate = dateFilter(scope.charges[i].dueDate, scope.df);
                        }

                        if (scope.charges[i].chargeTimeType.value == 'Monthly Fee' || scope.charges[i].chargeTimeType.code=='chargeTimeType.weeklyFee') {
                            chargeData.feeInterval = scope.charges[i].feeInterval;
                        }

                        if(scope.charges[i].chargeTimeType.code = 'chargeTimeType.fdaPartialLiquidationFee'){
                            delete chargeData.amount
                        }

                        this.formData.charges.push(chargeData);
                    }
                }

                this.formData.charts = [];//declare charts array
                this.formData.charts.push(copyChartData(scope.chart));//add chart details
                this.formData = removeEmptyValues(this.formData);

                resourceFactory.fixedDepositAccountResource.save(this.formData, function (data) {
                    location.path('/viewfixeddepositaccount/' + data.savingsId);
                });
            };

            scope.cancel = function () {
                if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                } else if (scope.centerEntity) {
                    location.path('/viewcenter/' + scope.groupId);
                } else {
                    location.path('/viewgroup/' + scope.groupId);
                }
            }
            scope.changeMaturityInstruction = function(){
                
                scope.maturityDetails.maturityInstructionId = scope.formData.maturityInstructionId;
                // scope.maturityDetails.onAccountClosure = scope.depositRolloverOptions.find(function(item){
                //     return item.id == scope.formData.maturityInstructionId
                // });

                scope.maturityDetails.onAccountClosure = _.find(scope.depositRolloverOptions,function(item){
                    return item.id == scope.formData.maturityInstructionId;
                });
                
                scope.maturityDetails.transferToSavingsAccount = _.find(scope.savingsAccounts,function(item){ 
                    return item.id == scope.formData.transferToSavingsId;
                });
                  
            }          

            /**
             * Add a new row with default values for entering chart details
             */
            scope.addNewRow = function () {
                var fromPeriod = '';
                var amountRangeFrom = '';
                var periodType = '';
                if (_.isNull(scope.chart.chartSlabs) || _.isUndefined(scope.chart.chartSlabs)) {
                    scope.chart.chartSlabs = [];
                } else {
                    var lastChartSlab = {};
                    if (scope.chart.chartSlabs.length > 0) {
                        lastChartSlab = angular.copy(scope.chart.chartSlabs[scope.chart.chartSlabs.length - 1]);
                    }
                    if (!(_.isNull(lastChartSlab) || _.isUndefined(lastChartSlab))) {
                        fromPeriod = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.toPeriod) + 1;
                        amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.amountRangeTo) + 1;
                        periodType = angular.copy(lastChartSlab.periodType);
                    }
                }


                var chartSlab = {
                    "periodType": periodType,
                    "fromPeriod": fromPeriod,
                    "amountRangeFrom": amountRangeFrom
                };

                scope.chart.chartSlabs.push(chartSlab);
            }


            /**
             *  create new chart data object
             */

            copyChartData = function () {
                var newChartData = {
                    id: scope.chart.id,
                    name: scope.chart.name,
                    description: scope.chart.description,
                    fromDate: dateFilter(scope.fromDate.date, scope.df),
                    endDate: dateFilter(scope.endDate.date, scope.df),
                    isPrimaryGroupingByAmount:scope.chart.isPrimaryGroupingByAmount,
                    //savingsProductId: scope.productId,
                    dateFormat: scope.df,
                    locale: scope.optlang.code,
                    chartSlabs: angular.copy(copyChartSlabs(scope.chart.chartSlabs)),
                    isActiveChart: 'true'
                }

                //remove empty values
                _.each(newChartData, function (v, k) {
                    if (!v)
                        delete newChartData[k];
                });

                return newChartData;
            }

            /**
             *  copy all chart details to a new Array
             * @param chartSlabs
             * @returns {Array}
             */
            copyChartSlabs = function (chartSlabs) {
                var detailsArray = [];
                _.each(chartSlabs, function (chartSlab) {
                    var chartSlabData = copyChartSlab(chartSlab);
                    detailsArray.push(chartSlabData);
                });
                return detailsArray;
            }

            /**
             * create new chart detail object data from chartSlab
             * @param chartSlab
             *
             */

            copyChartSlab = function (chartSlab) {
                var newChartSlabData = {
                    id: chartSlab.id,
                    description: chartSlab.description,
                    fromPeriod: chartSlab.fromPeriod,
                    toPeriod: chartSlab.toPeriod,
                    amountRangeFrom: chartSlab.amountRangeFrom,
                    amountRangeTo: chartSlab.amountRangeTo,
                    annualInterestRate: chartSlab.annualInterestRate,
                    locale: scope.optlang.code,
                    incentives:angular.copy(copyIncentives(chartSlab.incentives))
                }
                if(chartSlab.periodType != undefined) {
                    newChartSlabData.periodType = chartSlab.periodType.id;
                }
                //remove empty values
                _.each(newChartSlabData, function (v, k) {
                    if (!v && v != 0)
                        delete newChartSlabData[k];
                });

                return newChartSlabData;
            }

            removeEmptyValues = function (objArray) {
                _.each(objArray, function (v, k) {
                    //alert(k + ':' + v);
                    if (_.isNull(v) || _.isUndefined(v) || v === '') {
                        //alert('remove' + k + ':' + v);
                        delete objArray[k];
                    }

                });

                return objArray;
            }

            /**
             * Remove chart details row
             */
            scope.removeRow = function (index) {
                scope.chart.chartSlabs.splice(index, 1);
            }
            scope.incentives = function(index){
                $uibModal.open({
                    templateUrl: 'incentive.html',
                    controller: IncentiveCtrl,
                    resolve: {
                        data: function () {
                            return scope.chart;
                        },
                        chartSlab: function () {
                            return scope.chart.chartSlabs[index];
                        }
                    }
                });
            }

            /**
             *  copy all chart details to a new Array
             * @param incentiveDatas
             * @returns {Array}
             */
            copyIncentives = function (incentives) {
                var detailsArray = [];
                _.each(incentives, function (incentive) {
                    var incentiveData = copyIncentive(incentive);
                    detailsArray.push(incentiveData);
                });
                return detailsArray;
            }

            /**
             * create new chart detail object data from chartSlab
             * @param incentiveData
             *
             */

            copyIncentive = function (incentiveData) {
                var newIncentiveDataData = {
                    id: incentiveData.id,
                    "entityType":incentiveData.entityType,
                    "attributeName":incentiveData.attributeName.id,
                    "conditionType":incentiveData.conditionType.id,
                    "attributeValue":incentiveData.attributeValue,
                    "incentiveType":incentiveData.incentiveType.id,
                    "amount":incentiveData.amount
                }
                return newIncentiveDataData;
            }

            var IncentiveCtrl = function ($scope, $uibModalInstance, data,chartSlab) {
                $scope.data = data;
                $scope.chartSlab = chartSlab;
                _.each($scope.chartSlab.incentives, function (incentive) {
                    if(!incentive.attributeValueDesc){
                        incentive.attributeValueDesc = incentive.attributeValue;
                    }
                });
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.addNewRow = function () {
                    var incentive = {
                        "entityType":"2",
                        "attributeName":"",
                        "conditionType":"",
                        "attributeValue":"",
                        "incentiveType":"",
                        "amount":""
                    };

                    $scope.chartSlab.incentives.push(incentive);
                }

                /**
                 * Remove chart details row
                 */
                $scope.removeRow = function (index) {
                    $scope.chartSlab.incentives.splice(index, 1);
                }
            };

        }
    });
    mifosX.ng.application.controller('CreateFixedDepositAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter','$uibModal', 'WizardHandler', mifosX.controllers.CreateFixedDepositAccountController]).run(function ($log) {
        $log.info("CreateFixedDepositAccountController initialized");
    });
}(mifosX.controllers || {}));
