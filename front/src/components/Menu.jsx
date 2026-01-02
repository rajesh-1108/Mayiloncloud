import React, { useState } from 'react';
import Chicken  from "../images/Biryani1.avif"
import butter from "../images/Burger.avif"
import veg from "../images/Cheese Burger.avif"


// Sample menu data. In production this would come from a DB endpoint.
const SAMPLE_MENU = [
{ id: 'm1', name: 'Chicken Biryani', price: 220, image: Chicken }, // price in paise
{ id: 'm2', name: 'Paneer Butter Masala', price: 150, image: butter },
{ id: 'm3', name: 'Veg Thali', price: 120, image: veg }
];


export default function Menu({ token, apiBase }){
const [cart, setCart] = useState([]);


function add(item){
setCart(prev => {
const existing = prev.find(i=>i.itemId===item.id);
if(existing) return prev.map(i=>i.itemId===item.id?{...i, qty:i.qty+1}:i);
return [...prev, { itemId: item.id, name: item.name, price: item.price, qty: 1, image: item.image }];
});
}
function remove(itemId){
setCart(prev => prev.filter(i=>i.itemId!==itemId));
}


return (
<section className="menu">
<h2>Menu</h2>
<div className="items">
{SAMPLE_MENU.map(item=> (
<div key={item.id} className="card">
<img src={item.image} alt={item.name} />
<h3>{item.name}</h3>
<p>Price: ₹{(item.price/100).toFixed(2)}</p>
<button onClick={()=>add(item)}>Add</button>
</div>
))}
</div>


<div className="cart">
<h3>Cart</h3>
{cart.length===0 ? <p>No items</p> : (
<ul>
{cart.map(i=> (
<li key={i.itemId}>
{i.name} x{i.qty} — ₹{((i.price*i.qty)/100).toFixed(2)} <button onClick={()=>remove(i.itemId)}>Remove</button>
</li>
))}
</ul>
)}
<p>Total: ₹{(cart.reduce((s,i)=>s+i.price*i.qty,0)/100).toFixed(2)}</p>
<input type="hidden" id="cart-data" value={JSON.stringify(cart)} />
</div>
</section>
)
}