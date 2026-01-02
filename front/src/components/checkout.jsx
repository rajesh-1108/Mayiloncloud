import React, { useState } from 'react';
import axios from 'axios';


export default function Checkout({ token, apiBase }){
const [address, setAddress] = useState({ line1:'', city:'', state:'', pincode:'', phone:'' });
const [itemsJson, setItemsJson] = useState('[]');


function readCart(){
const el = document.getElementById('cart-data');
if(el) setItemsJson(el.value);
return JSON.parse(el?.value || '[]');
}
async function pay(e){
e.preventDefault();
if(!token) return alert('Sign in first');


const items = readCart();
if(items.length===0) return alert('Cart empty');


// compute amount in paise
const amount = items.reduce((s,i)=>s + i.price*i.qty, 0);


try{
const res = await axios.post(`${apiBase}/orders/create`, { items, amount, deliveryAddress: address }, { headers: { Authorization: `Bearer ${token}` } });
const { orderId, razorpayOrder, localOrderId } = res.data;


const options = {
key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'RAZORPAY_KEY_ID',
amount: razorpayOrder.amount,
currency: razorpayOrder.currency,
name: 'Cloud Kitchen',
description: 'Order Payment',
order_id: razorpayOrder.id,
handler: async function (response){
// send verification to server
await axios.post(`${apiBase}/orders/verify`, {
razorpay_payment_id: response.razorpay_payment_id,
razorpay_order_id: response.razorpay_order_id,
razorpay_signature: response.razorpay_signature,
localOrderId
}, { headers: { Authorization: `Bearer ${token}` } });
alert('Payment success');
},
prefill: {
// prefill from user info stored in localStorage
}
};
const rzp = new window.Razorpay(options);
rzp.open();


}catch(err){
console.error(err);
alert(err.response?.data?.message || 'Payment creation failed');
}
}


return (
<section className="checkout">
<h2>Checkout</h2>
<form onSubmit={pay}>
<input placeholder="Address line 1" value={address.line1} onChange={e=>setAddress({...address, line1:e.target.value})} required />
<input placeholder="City" value={address.city} onChange={e=>setAddress({...address, city:e.target.value})} required />
<input placeholder="State" value={address.state} onChange={e=>setAddress({...address, state:e.target.value.replace(/[^a-zA-Z\s]/g, "")})} required />
<input placeholder="Pincode" value={address.pincode} onChange={e=>setAddress({...address, pincode:e.target.value})} required />
<input placeholder="Phone" value={address.phone} onChange={e=>setAddress({...address, phone:e.target.value})} required />
<button type="submit">Pay with Razorpay</button>
</form>
</section>
)
}