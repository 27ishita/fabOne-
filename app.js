var budgetControl = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage= -1;

    };
 
    Expense.prototype.calcPercentage= function(totalIncome)
    {
        if(totalIncome>0)
        {
         this.percentage = Math.round((this.value / totalIncome))*100;        

        }else{
            this.percentage= -1;
        }


    };

    Expense.prototype.getPercentage = function(){

        return this.percentage;
    };


    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculatetotal = function(type)
    {
        var sum =0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;

            });
        data.total[type]= sum;
        

    };


    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
 
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
 
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //ID = 0;
            //create a new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
 
            //create item based on 'inc' or 'exp' type
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }
 
            //push it into our data structure
            data.allItems[type].push(newItem);
 
            //return the new element
            return newItem;
        },

        deleteItem : function(type,id){

            var ids,index;

            ids = data.allItems[type].map(function(current){
                return current.id ;

            });

            index = ids.indexOf(id);

            if (index !== -1){

                data.allItems[type].splice(index,1);

            }



        },


        calculateBudget : function()
        {
            //calculat etotal income and expenses
            calculatetotal('exp');
            calculatetotal('inc');
            //calculate the budget : income- exp
            
            data.budget = data .total.inc - data.total.exp;
            
            //calculate the percentage of income and expenses

            if(data.total.inc >0){
            data.percentage = Math.round((data.total.exp/data.total.inc) * 100);
            }else{
                data.percentage=-1;
            }

        },

        calculatePercentages : function(){

            data.allItems.exp.forEach(function(cur){

                cur.calcPercentage(data.total.inc);
            });




        },
        getPercentage : function(){

            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });

            return allPerc;

        },


        getBudget: function(){

            return {

                budget: data.budget,
                totalInc : data.total.inc,
                totalExp:data.total.exp,
                percentage: data.percentage
            };

        },
 
        testing: function () {
            console.log(data);
        }
    };
    //some code
})();
 
var UIControl = (function () {
    var DOMstring = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        expensesContainer: ".expenses__list",
        incomContainer : ".income__list",
        budegtLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container : '.container',
        expensesPerLabel: '.item__percentage',
        dateLabel: '.budget__title--month'


    };



           var  formatNumber = function(num,type){

                num = Math.abs(num);
                num = num.toFixed(2);

                numSplit = num.split('.');

                int = numSplit[0];
                if(int.length > 3){
                    int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);

                }

                dec = numSplit[1];

                type === 'exp' ? sign = '-' : sign = '+';

                return (type=== 'exp' ? '-' : '+')+ ' ' + int +'.' + dec;



            };


             var nodeListForEach = function(list,callback)
                {
                    for(var i= 0; i<list.length;i++)
                    {
                        callback(list[i],i);
                    }

                };






    
 
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                description: document.querySelector(DOMstring.inputDescription)
                    .value,
                value:parseFloat(document.querySelector(DOMstring.inputValue).value)

            };
        },
 
        addListItem: function (obj, type) {
            var html, newHtml,element;
            //create a HTML string with placeholder text
            //replace the placeholder text with some actual data
            //insert the HmTL
 
            if (type === "inc") {
                element = DOMstring.incomContainer;

                html = `
                <div class="item clearfix" id="inc-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>
                    </div>
                </div>
                `;
            } else if (type === "exp") {

                element = DOMstring.expensesContainer;
                html = `
                <div class="item clearfix" id="exp-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>
                    </div>
                </div>
                `;
            }
 
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value,type));
 


            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            //document.querySelector(element).insertAdjacentHTML()



        },  


        deleteListItem: function(selectorID){

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
    
        var fields,fieldsArr;
        fields= document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);
        fieldsArr= Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current,index,array)
        {
            current.value = "";
        });

        fieldsArr[0].focus();

        },

        displayBudget: function(obj){

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstring.budegtLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
            //document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage;    
           
           if(obj.percentage >0 ){
            document.querySelector(DOMstring.percentageLabel).textContent=obj.percentage + '%';

           }else {
            document.querySelector(DOMstring.percentageLabel).textContent = '---';

           }


            },

            displayPercentages: function(percentages){


                var fields=document.querySelectorAll(DOMstring.expensesPerLabel);

              

                nodeListForEach(fields,function(current,index){

                    if(percentages[index]>0){
                    current.textContent = percentages[index] + '%';
                    }else{
                        current.textContent= '---';
                    }
                });
            },

            displayMonth : function(){

                var now,year,month,months;
                 var now = new Date ();
                 month= now.getMonth();

                 months =['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
                
                 //var christmas = new Date(2016,11,25);
                 year = now.getFullYear();
                
                 document.querySelector(DOMstring.dateLabel).textContent =months[month]+ ' '+year;
            

            },


            changedType: function()
            {
                var fields = document.querySelectorAll(
                    DOMstring.inputType+","+
                    DOMstring.inputDescription+ ','+
                    DOMstring.inputValue);


                    nodeListForEach(fields,function(cur){
                        cur.classList.toggle('red-focus');
                    });

                    document.querySelector(DOMstring.inputButton).classList.toggle('red');


            },


                    
            getDOMstring: function () {
            return DOMstring;
        }
    };
})();
 
var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListener = function () {
        var DOM = UICtrl.getDOMstring();
 
        document
            .querySelector(DOM.inputButton)
            .addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
                //console.log('Enter was pressed');
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);

    };



    var updateBudget = function() {
        // call the budgetDO

        budgetCtrl.calculateBudget();

        //return then budget
         var budget = budgetCtrl.getBudget();


        //diplay the budget in the UI

        UICtrl.displayBudget(budget);


    }; 


    var updatePercentages = function(){

        
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentage();

        //console.log(percentages);
        UICtrl.displayPercentages(percentages);
    
    };

    
 
    var ctrlAddItem = function () {
        var input, newItem;
 
        //get the field input data
        var input = UICtrl.getInput();
 
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {


        newItem = budgetCtrl.addItem(input.type, input.description,input.value);
        UICtrl.addListItem(newItem,input.type);
        UICtrl.clearFields();

        updateBudget();
        updatePercentages();

        }
        //add item to the budget controller
         
        //calculate and update budget
    };

    var ctrlDeleteItem = function(event){
        var itemId ,splitID,type,ID;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //console.log(itemId);

        if(itemId)
        {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type,ID);
            UICtrl.deleteListItem(itemId);

            updateBudget();
            updatePercentages();

        }
    };




 
    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayMonth();

            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage: -1
            });





            setupEventListener();
        }
    };
})(budgetControl, UIControl);
 
controller.init();