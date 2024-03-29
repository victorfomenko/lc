import React from 'react';
import { orderBy } from 'lodash';

// services
import $http from '../services/$http';

// components
import Layout from '../components/layout';


export default class Orders extends Layout {
	static async getInitialProps(obj) {
	    const [
	      baseProps,
	      orders
	    ] = await Promise.all([
	      super.getInitialProps(obj),
	      $http.post('/ajax/getOrdersInfo.php')
	    ]);

	    if(obj.req && !baseProps.session.user) {
	    	obj.res.writeHead(302, { Location: '/' })
	    	return 
	    }
	    else if(!baseProps.session.user) {
			document.location.pathname = '/'
			return
	    }

	    return {
	      ...baseProps,
	      orders
	    }
	}

	constructor(props) {
		super(props);
		this.state = {
			orders: props.orders,
			nameSort: 'asc',
			phoneSort: 'asc',
			addressSort: 'asc',
			sizeSort: 'asc',
			priceSort: 'asc',
			dateSort: 'asc'
		};
		this.onNameHeaderClick = this.onNameHeaderClick.bind(this);
		this.onPriceHeaderClick = this.onPriceHeaderClick.bind(this);
	}

	onNameHeaderClick(e, order) {
		e.preventDefault();
		const orders = orderBy(this.state.orders, (o) => { return o.name}, order)
		this.setState({ 
			orders,
			nameSort: this.reverseSort(order)
		})
	}

	onPriceHeaderClick(e, order) {
		e.preventDefault();
		const orders = orderBy(this.state.orders, (o) => { return Number(o.price)}, order)
		this.setState({ 
			orders,
			priceSort: this.reverseSort(order)
		})
	}

	onDateHeaderClick(e, order) {
		e.preventDefault();
		const orders = orderBy(this.state.orders, (o) => { return o.date}, order)
		this.setState({ 
			orders,
			dateSort: this.reverseSort(order)
		})
	}

	reverseSort(sortType = 'asc'){
		return sortType === 'asc' ? 'desc' : 'asc'
	}

	content(){
		const { nameSort, phoneSort, addressSort, sizeSort, priceSort, dateSort } = this.state;
		const orders = (this.state.orders || []).map((order, index) => {
			return (
				<tr key={index}>
				<td>{order.date}</td>
				<td>{order.name}</td>
				<td>{order.phone}</td>
				<td>{order.address}</td>
				<td>{`${order.producttype}-${order.frametype}-${order.framesize}`}</td>
				<td>{order.price}</td>
				<td><a href={order.image} target='_blank'>img</a></td>
				</tr>
			)
		})

		return (
			<section className="container m-padding-default orders">
		    <div className="row">
		        <table className="table table-striped">
		            <thead>
			            <tr>
			            	<th><a href="#" onClick={(e)=>{this.onDateHeaderClick(e, dateSort)}}>Дата заказа</a></th>
			                <th><a href="#" onClick={(e)=>{this.onNameHeaderClick(e, nameSort)}}>Имя</a></th>
			                <th>Телефон</th>
			                <th>Адрес</th>
			                <th>Наименование</th>
			                <th><a href="#" onClick={(e)=>{this.onPriceHeaderClick(e, priceSort)}}>Цена</a></th>
			                <th>Изображение</th>
			            </tr>
		            </thead>
		            <tbody>
	                {orders}
		            </tbody>
		        </table>
		    </div>
			</section>
		)
	}
}