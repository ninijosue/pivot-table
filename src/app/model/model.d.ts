type OrderEntity= {
    readonly rowId: number,
    readonly orderId: string,
    readonly orderDate: string,
    readonly shipDate: string,
    readonly shipMode: string,
    readonly customerId: string,
    readonly customerName: string,
    readonly segment: string,
    readonly country: string,
    readonly city: string,
    readonly state: string,
    readonly postalCode: number,
    readonly region: string,
    readonly productId: string,
    readonly category: string,
    readonly subCategory: string,
    readonly productName: string,
    readonly sales: number,
    readonly quantity: number,
    readonly discount: number,
    readonly profit: number
}



type StateOrder = Map<string, {
    state: string,
    value: number  
  }>

type SubCategories = Map<string, {
    subCategoryName: string,
    ordersByState: StateOrder
}>

type CategoryTotalByState = Map<string, {
    state: string,
    total: number
}>

type GeneralTotal = Map<string, {
    state: string,
    total: number
}>

type SegregatedByCategoriesValue = {
    categoryName: string,
    subCategories: SubCategories,
    categoryTotalByState: CategoryTotalByState
}

type SegregatedByCategories = Map<string, SegregatedByCategoriesValue>

type SalesSuccessRes = {
    products: SegregatedByCategories,
    states: string[],
    generalTotal: GeneralTotal
}


export interface PivotTableRepository{
    getOrders(orders: OrderEntity[]):SalesSuccessRes;
}