var User = function(){
    var d = new Date;
    d.setDate(d.getDate() - Math.ceil(Math.random()*15));
    this.lastVisitDate = +d;
    this.globalDiscount = Math.ceil(Math.random()*100);
    this.nightDiscount = Math.ceil(Math.random()*100);
    this.weekendDiscount = Math.ceil(Math.random()*100);
    this.ordersCount = Math.ceil(Math.random()*100);
    this.ordersTotalPrice = Math.ceil(Math.random()*100);
    this.bonus = Math.ceil(Math.random()*100);
    this.decoratorsList = {
        discounts : [],
        bonus : []
    };
};

User.decorators = {
    discounts: {},
    bonus: {}
};

User.decorators.discounts.nightCount = {
    getDiscount: function(discount){
        return discount+this.nightDiscount;
    }
}

User.decorators.discounts.weekendDiscount = {
    getDiscount: function(discount){
        return discount+this.weekendDiscount;
    }
}

User.decorators.bonus.daysBonus = {
    getBonus: function(bonus,hours){
        return bonus + hours + this.ordersCount;
    }
}

User.prototype.getDiscount = function(){
    var date = new Date, presentHours, weekendDay, max, i, discount, prop;
    discount = this.globalDiscount;
    presentHours = date.getHours();
    weekendDay = date.getDay();
    if( presentHours >= 23 || presentHours <= 5 ){
        this.decoratorsList.discounts.push('nightCount');
    }
    if( weekendDay == 0 || weekendDay == 6 ){
        this.decoratorsList.discounts.push('weekendDiscount');
    }
    max = this.decoratorsList.discounts.length;
    for(i=0; i<max; i++){
        prop = this.decoratorsList.discounts[i];
        discount = User.decorators.discounts[prop].getDiscount.call(this,discount)
    }
    return discount;    
}

User.prototype.getBonus = function(){
    var date = new Date, presentDate, diffDate, max, i, bonus, prop;
    bonus = this.bonus;
    presentDate = +new Date;
    diffDate = Math.round((presentDate - this.lastVisitDate)/(1000*3600));
    if(diffDate <= 240){
        this.decoratorsList.bonus.push('daysBonus');
    }
    max = this.decoratorsList.bonus.length;
    for(i=0; i<max; i++){
        prop = this.decoratorsList.bonus[i];
        bonus = User.decorators.bonus[prop].getBonus.call(this,bonus,diffDate)
    }
    return bonus;    
}