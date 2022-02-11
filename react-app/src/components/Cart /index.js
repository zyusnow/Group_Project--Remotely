import { useEffect,  useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { loadCart, deleteFromCart, addToCart } from '../../store/cart'
import {Link} from 'react-router-dom';
import {getAllProducts} from '../../store/product'
import AddRemoveItem from './Add_Remove_Item';
import './Cart.css'

function CartPage() {
  const id = useSelector((state) => state.session?.user.id);
  const cartItemsArray = useSelector((state) => state.carts?.cart);
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(loadCart(id))
      .then(() => setTotal(!cartItemsArray ? null :
        cartItemsArray
          .reduce((accum, curr) => {
            return accum + (curr.productPrice * curr.quantity);
          }, 0)))
      .then(() => setIsLoaded(true));
  }, [dispatch, isLoaded, id, total]);

  const handleDelete = (cartId) => {
    cartId = +cartId;
    dispatch(deleteFromCart(cartId));
    setIsLoaded(!isLoaded)
    dispatch(loadCart(id));
  }

  return !isLoaded ? null : (
    <>
      <div className="cart_title_container">
        <h1 className="cart_title">My Shopping Cart</h1>
      </div>
      <div className="cart_container">
        <div className="cart_details">
          <ul className="cart_items">
            {!cartItemsArray || !cartItemsArray.length ? (
              <h1>You have no items in your cart.</h1>
            ) : (
              cartItemsArray?.map((product) => {
                return (
                  <div key={product.id} className="single_item">
                    <li key={product.productImg}>
                      <Link to={`/products/${product.productId}`}>
                        <img
                          alt={product.productTitle}
                          src={product.productImageUrl}
                          className="cart_image"
                        />
                      </Link>
                    </li>
                    <AddRemoveItem
                      productId={product.id}
                      cartId={id}
                      quantity={product.quantity}
                      setTotal={setTotal}
                    />
                    <li>
                      <button
                        id={product.id}
                        onClick={(e) => handleDelete(e.target.id)}
                      >
                        Delete
                      </button>
                    </li>
                  </div>
                );
              })
            )}
          </ul>
        </div>
        <div className="total_div">
          <div className="order_summary_title">
            <h3>Order Summary</h3>
          </div>
          <div className="cart_item_card">
            {!cartItemsArray || !cartItemsArray.length
              ? null
              : cartItemsArray?.map((product) => {
                  return (
                    <>
                      <ul key={product.id} className="single_item">
                        <li
                          key={product.productTitle}
                          className="cart_item_label"
                        >
                        {product.productTitle}
                        </li>
                        <li className="cart_item_category">{product.productCategory}</li>
                        <li className="cart_item_quantity">Quantity: {product.quantity}</li>
                        <li className="cart_item_price">Price: ${product.productPrice}</li>
                      </ul>
                    </>
                  );
                })}
          </div>
          <div className="order_total">
            <div className="divider" />
            {!total ? null : (
              <h2>
                Total Price: ${(Math.round(total * 100) / 100).toFixed(2)}
              </h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
