import React, { Fragment } from 'react';
import { arrowLeft, arrowRight } from "../../assets/icons/svgs";
import PivotTableModel from '../../model';
import { OrderEntity, SalesSuccessRes, SegregatedByCategories } from '../../model/model';
import "./style.css";


type PivotTableProps = {
  data: OrderEntity[]
};

const PivotTable = (props: PivotTableProps) => {

  
    const pivotTableModel = new PivotTableModel();
    const res: SalesSuccessRes =  pivotTableModel.getOrders(props.data);
    const generalTotal = res.generalTotal;
    const grandeTotal = Array.from(generalTotal.values());
    const products = res.products;
    const states = res.states

    return (
      <div className="table-container" >

        <div className="left-side_-of_--table">
          <div className="left-side_-header">
            <h3>Products</h3>
          </div>
          {categoriesAndSubCategories(products)}

        </div>
        <div className="right_-side-of_--table">
          <div className="right-head-row">
            <button type="button">{arrowLeft}</button>
            <h3>States</h3>
            <button type="button">{arrowRight}</button>
          </div>
          <div className="right_-side_table__container">
            <table className="right_-side-table">
              {statesTableHead(states)}
              <tbody>
                {stateTableBody(products, states)}
                <tr className="state-_total">
            {
              grandeTotal.map((stateOrderTotal, stateOrderTotalIndex) => <td key={`state_-order${stateOrderTotalIndex}`}>{stateOrderTotal.total.toLocaleString()}</td>)
            }
          </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  
}

const statesTableHead = (states: string[]) => {
  return (
    <thead >
      <tr>{states.map((st, index) => <th key={`states_-${index}`}>{st}</th>)}</tr>
    </thead>
  )
}

const categoriesAndSubCategories = (products: SegregatedByCategories) => {
   
  const categories = Array.from(products.values());

  return (
    <table>
      <thead>
        <tr>
          <th className="category-_thead-th">Category</th>
          <th>Sub-category</th>
        </tr>
      </thead>
      <tbody>
        {
          categories.map((cat, index) => {
            const subCategories = Array.from(cat.subCategories.values());
            return (
              <Fragment key={`categoriesCombiner_-${index}`}>
                <tr key={`cat_-${index}`}>

                  <td className="category-_-text" rowSpan={cat.subCategories.size}>
                    <div className="category_-indicator">
                      <div className="bar-icon">
                        <span></span>
                      </div>
                      <span className="category-_-name">{cat.categoryName}</span>
                    </div>
                  </td>
                  <td>{subCategories[0].subCategoryName}</td>

                </tr>
                {
                  subCategories.map((subCat, index) => {
                    if (index === 0) return <></>
                    return (
                      <tr key={`subcat_-${index}`}>
                        <td>{subCat.subCategoryName}</td>
                      </tr>
                    )
                  })
                }
                <tr className="total_-indicator" >
                  <td colSpan={2}>{cat.categoryName} Total</td>
                </tr>
              </Fragment>
            )
          })
        }
        <tr className="total_-indicator" >
          <td colSpan={2}>Grande total</td>
        </tr>
      </tbody>
    </table>
  )
}

const stateTableBody = (products: SegregatedByCategories, states: string[]) => {
  const categories = Array.from(products.values());
  return categories.map((cat, index) => {
    const subCatValue = Array.from(cat.subCategories.values());
    return <Fragment>
      { subCatValue.map((subCat, index) => {

      return (
        <tr>
          {
            states.map(state=>{
              
                 return <td > {cat.subCategories.get(subCat.subCategoryName)?.ordersByState.get(state)?.value?.toLocaleString() ?? ""}</td> 

               })
          }
        </tr>
      ) 
      
    })}
    <tr className="state-_total">
    {states.map(state=>{
      return <td>{cat.categoryTotalByState.get(state)?.total?.toLocaleString()}</td>
    })}
    </tr>
    </Fragment>
   
  })
}



export default PivotTable;