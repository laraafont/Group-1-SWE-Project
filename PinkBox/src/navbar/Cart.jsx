import React, { useEffect, useState } from "react";
import "./Cart.css"; // the css styling template

export default function Cart() { // main cart component
    const [cartData, setCartData] = useState({}); // state to hold cart quantities by item ID
    const [movies, setMovies] = useState([]); // state to hold the full list of all movies from database
    const [total, setTotal] = useState(0); // state to hold the total price of cart

    const fetchCart = async () => { // get user's cart from the backend using token
        const res = await fetch("http://localhost:4000/getcart", { // our API!
            method: "POST",
            headers: { // the headers we set in request
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token"), // JWT token from login API
            },
        });
        const data = await res.json(); // cartData is just { itemId: quantity, ...}
        setCartData(data); // holding data as a variable and then passing it through here
    };

    const fetchMovies = async () => { // get all movies in database so we can display all their info
        const res = await fetch("http://localhost:4000/allmovies"); // another API!
        const data = await res.json();
        if (data.length || data.movies) {
            setMovies(data.movies || data); // normalize response
        }
    };

    useEffect(() => { // load cart and movies on first render
        fetchCart();
        fetchMovies();
    }, []);

    const updateQuantity = async (itemId, action) => { // update quantity for certain movie
    const route = action === "add" ? "addtocart" : "removefromcart";
    await fetch(`http://localhost:4000/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ itemId }), // backend expects itemId
    });
    fetchCart(); // refresh cart after change
  };

  const cartItems = movies // combine movie data with cart quantities to get items in the cart
    .filter((movie) => cartData[movie.id] > 0) // only show items with quantity > 0
    .map((movie) => {
      const quantity = cartData[movie.id];
      const total = quantity * movie.cost;
      return { ...movie, quantity, total }; // add quantity and total to each movie object
    });

  useEffect(() => { // recalculate total cost whenever items change
    const sum = cartItems.reduce((acc, item) => acc + item.total, 0);
    setTotal(sum);
  }, [cartItems]);

  const handleCheckout = async () => { // handle checkout and send cart details through email
    const email = prompt("Enter your email to receive your streaming links:");
    if (!email) return; // exit if user cancels

    const res = await fetch("http://localhost:4000/sendEmail", { // email API!
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ to: email, body: cartItems }), // backend expects { to, body }
    });

    const data = await res.json();
    if (data.success) alert("Confirmation email sent!");
    else alert("Error sending email.");
  };

  // render and calling css templates
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {/* if cart is empty, show a message */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* loop over all items in cart and display them */}
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className="cart-details">
                <h3>{item.title}</h3>
                <p>Price: ${item.cost}</p>

                {/* qantity controls: - quantity + */}
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, "remove")}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, "add")}>+</button>
                </div>

                <p>Total: ${item.total.toFixed(2)}</p>
              </div>
            </div>
          ))}

          {/* final total and checkout button */}
          <div className="cart-summary">
            <h2>Total: ${total.toFixed(2)}</h2>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* breakdown of the structure
cart-container
│
├── cart-item
│   ├── <img />
│   └── cart-details
│       ├── Title
│       ├── Price
│       ├── quantity-control
│       │   ├── - button
│       │   ├── quantity #
│       │   └── + button
│       └── Total price
│
├── cart-item (next movie)
│
└── cart-summary
    ├── Total amount
    └── Checkout button */

/* some notes from lara:
- signing up and then being taken to the home page does not successfuly create a token
- weird pop up shows up when something is added to cart
- we should add posters in the movie info
*/