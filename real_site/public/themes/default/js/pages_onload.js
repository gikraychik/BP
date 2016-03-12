function PagesPAjaxOnLoadCallbacks () 
{
 	this.pagesCallbacks = [];
 	this.formCallbacks = [];
 	this.addPageCb = function (func) 
 	{
 		this.pagesCallbacks.push(func)
 	}
 	this.addFormCb = function (func) 
 	{
 		this.formCallbacks.push(func)
 	}
 	this.callAllPagesCb = function () 
 	{
 		for (var i = this.pagesCallbacks.length - 1; i >= 0; i--) {
 			this.pagesCallbacks[i]();
 		}
 	}
 	 this.callAllFormsCb = function () 
 	{
 		for (var i = this.formCallbacks.length - 1; i >= 0; i--) {
 			this.formCallbacks[i]();
 		}
 	}
};

var pagesPAjaxOnLoadCallbacks = new PagesPAjaxOnLoadCallbacks();