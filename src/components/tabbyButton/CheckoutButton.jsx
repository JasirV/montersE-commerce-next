'use client';
import axios from 'axios';
export default function CheckoutButton({ order }) {
const handleCheckout = async () => {
try {
const res = await axios.post('http://localhost:9000/api/tabby/create-tabbycheckout', {
amount: order.total,
currency: 'AED',
customer: {
buyer: {
name: order.name,
email: order.email,
phone: order.phone
},
shipping: order.address
},
order: { id: order.id, items: order.items }
});
if (res.data.checkout_url) {
window.location.href = res.data.checkout_url;
} else {
alert('Checkout URL not returned. Check server logs.');
console.log(res.data);
}
} catch (err) {
console.error(err?.response?.data || err.message);
alert('Error creating Tabby checkout. See console.');
}
};
return (
<button onClick={handleCheckout} style={{ padding: '10px 16px' }}>
Pay with Tabby
</button>
);
}   