import React from 'react';
import PivotTable from './components/pivot-table';
import { OrderEntity } from './model/model';
type AppState = {
  orders: OrderEntity[],
  isLoading: boolean
}

type AppProps = {

}
export default class App extends React.Component<{}, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      orders: [],
      isLoading: false
    }
  }

  async getOrders() {
    try {
      this.setState({ isLoading: true });
      const ordersModule = await import("./core/salesOrders.json");
      this.setState({ isLoading: false });
      const orders: OrderEntity[] = ordersModule.default.sort();
      this.setState({ orders });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    return (
      <div className="App">
        {
          !this.state.isLoading
            ? <PivotTable data={this.state.orders} />
            : (
              <div className="loading_-indicator">
                <span>Loading . . .</span>
              </div>
            )
        }
      </div>
    );
  }
}