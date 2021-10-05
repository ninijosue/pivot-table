import {  GeneralTotal, OrderEntity, PivotTableRepository, SalesSuccessRes, SegregatedByCategories, SegregatedByCategoriesValue, SubCategories } from "./model";

export default class PivotTableModel implements PivotTableRepository {

    private orderByState(orders: OrderEntity[]): Map<string, OrderEntity[]> {
        const res: Map<string, OrderEntity[]> = new Map();
        orders.forEach(order => {
            if (res.has(order.state))
                res.get(order.state)?.push(order);
            else
                res.set(order.state, [order]);

        })
        return res;
    }

   private getCategorySales(orders: OrderEntity[]) {
        const category: Map<string, OrderEntity[]> = new Map();
        orders.forEach(order => {
            if (category.has(order.category))
                category.get(order.category)?.push(order);
            else category.set(order.category, [order]);
        })
        return category;
    }

     getOrders(orders: OrderEntity[]):SalesSuccessRes{
     
        const states: string[] = [];
     
        let segregatedByCategories: SegregatedByCategories = new Map();
        const generalTotal: GeneralTotal = new Map();
        const stateOrders: Map<string, OrderEntity[]> = this.orderByState(orders);
        for (const [state, orders] of Array.from(stateOrders.entries())) {
            states.push(state);
            const categories: Map<string, OrderEntity[]> = this.getCategorySales(orders);
            for (const [categoryName, categoryOrders] of Array.from(categories.entries())) {
                segregatedByCategories = this.createModelViewData(segregatedByCategories, state, {categoryName, orders: categoryOrders });
            }
            generalTotal.set(state, {state, total: this.getOrdersTotal(orders)});
            

        }
        return {
            generalTotal,
            products: segregatedByCategories,
            states: states
        }


    }
   private createModelViewData( viewMap: SegregatedByCategories, state: string, category: {categoryName: string, orders: OrderEntity[]}): SegregatedByCategories{
       if(viewMap.has(category.categoryName)){
        const c = viewMap.get(category.categoryName)!;
        
        // categoryTotalByState
        c.categoryTotalByState.has(state) ? c.categoryTotalByState.get(state)!.total += this.getOrdersTotal(category.orders)
        : c.categoryTotalByState.set(state, {state, total: this.getOrdersTotal(category.orders)});

        // SubCategories
        c.subCategories = this.createSubCategories(category.orders, state, c.subCategories);

        viewMap.set(category.categoryName, c);
    }else{
        const c: SegregatedByCategoriesValue =  {
            categoryName: category.categoryName,
            categoryTotalByState: new Map().set(state, {state, total: this.getOrdersTotal(category.orders)}),
            subCategories: this.createSubCategories(category.orders, state)
        }
        viewMap.set(category.categoryName, c);
    }
    return viewMap;

    }

   
    private createSubCategories( orders: OrderEntity[], state: string, oldSubCategories: SubCategories = new Map()): SubCategories{
        const subCategories:SubCategories = oldSubCategories;

        orders.forEach(order=>{
            const subCategoryOrders: OrderEntity[] = orders.filter((o)=> o.subCategory === order.subCategory);
            const ordersByState = subCategories.get(order.subCategory)?.ordersByState ?? new Map();
            
            ordersByState.set(state, {state, value: this.getOrdersTotal(subCategoryOrders)});
    
            subCategories.set(order.subCategory, {subCategoryName: order.subCategory, ordersByState})
        });
        return subCategories;
    }
    
    private getOrdersTotal(orders: OrderEntity[]): number{
        let sum = 0;
         orders.forEach((order)=> sum += order.sales);
         return sum;
    }

  
}