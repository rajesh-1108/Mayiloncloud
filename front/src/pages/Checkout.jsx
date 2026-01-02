import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* ================= WHATSAPP ================= */
function sendWhatsApp(order) {
  const itemsText = order.items
    .map((i) => `• ${i.name} x${i.qty}`)
    .join("\n");

  const msg = `
🍽️ Order Confirmed!
🆔 Order ID: ${order._id}
💳 Payment: ${order.paymentMethod}
💰 Total: ₹${order.totalAmount}

📦 Items:
${itemsText}

🚚 Status: ${order.status}
Thank you ❤️
`;

  window.open(
    `https://wa.me/91${order.deliveryAddress.phone}?text=${encodeURIComponent(
      msg
    )}`,
    "_blank"
  );
}

/* ================= RAZORPAY ================= */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ================= COMPONENT ================= */
export default function Checkout() {
  const { items = [], totalRupees = 0, clearCart } = useCart();
  const { token, isAuthed, user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [saveAddress, setSaveAddress] = useState(true);

  const [address, setAddress] = useState({
    name:"",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!isAuthed) navigate("/auth");
    if (items.length === 0) navigate("/cart");
  }, [isAuthed, items.length]);

  /* ================= DELETE ADDRESS ================= */
  async function deleteAddress(index) {
    await fetch(`${API}/address/${index}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
  }

  /* ================= PLACE ORDER ================= */
  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (items.length === 0) return alert("Cart is empty");

    /* -------- CASH ON DELIVERY -------- */
    if (paymentMethod === "cod") {
      const res = await fetch(`${API}/orders/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          deliveryAddress: address,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      sendWhatsApp(data.order);
      clearCart();
      navigate(`/orders/${data.order._id}`);
      return;
    }

    /* -------- ONLINE PAYMENT -------- */
    const ok = await loadRazorpay();
    if (!ok) return alert("Razorpay failed to load");

    const razorKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorKey) return alert("Razorpay key missing");

    const res = await fetch(`${API}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        amount: totalRupees * 100,
        deliveryAddress: address,
        saveAddress,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    new window.Razorpay({
      key: razorKey,
      amount: data.razorpayOrder.amount,
      currency: "INR",
      order_id: data.razorpayOrder.id,
      name: "Cloud Kitchen",
      handler: async (resp) => {
        const verifyRes = await fetch(`${API}/orders/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...resp,
            localOrderId: data.localOrderId,
          }),
        });

        const verifyData = await verifyRes.json();
        sendWhatsApp(verifyData.order);
        clearCart();
        navigate(`/orders/${verifyData.order._id}`);
      },
    }).open();
  }

  /* ================= UI ================= */
  return (
    <>
      {/* MAIN GRID */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 pb-28">

        {/* LEFT – FORM */}
        <form
          id="checkout-form"
          onSubmit={handlePlaceOrder}
          className="sm:col-span-2 bg-white rounded-xl shadow p-4 space-y-4"
        >
          <h1 className="text-xl font-bold mb-2">Checkout</h1>

          {/* SAVED ADDRESSES */}
          {user?.addresses?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Saved Addresses</h3>
              {user.addresses.map((a, i) => (
                <div key={i} className="border rounded-lg p-3 mb-2 text-sm">
                  <p
                    onClick={() => setAddress(a)}
                    className="cursor-pointer"
                  >
                    {a.line1}, {a.city} - {a.pincode}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteAddress(i)}
                    className="text-red-600 text-xs mt-1"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
{user?.addresses?.length > 0 && (
  <div>
    <h3 className="text-sm font-semibold mb-2">
      Saved Addresses
    </h3>

    {user.addresses.map((a, i) => (
      <div
        key={i}
        className="border rounded-lg p-3 mb-2 text-sm cursor-pointer"
        onClick={() => setAddress(a)}
      >
        <p className="font-semibold text-orange-600">
          {a.label} {/* 🏠 Home / 🏢 Work */}
        </p>
        <p>
          {a.line1}, {a.city} - {a.pincode}
        </p>
        <p className="text-xs text-gray-500">
          📞 {a.phone}
        </p>
      </div>
    ))}
  </div>
)}


          {/* ADDRESS */}
          <input
            className="input"
            placeholder="Name"
            value={address.name}
            onChange={(e) =>
              setAddress({ ...address, name: e.target.value.replace(/[^a-zA-Z\s]/g, ""), })
            }
            required
          />
          <input
            className="input"
            placeholder="Address"
            value={address.line1}
            onChange={(e) =>
              setAddress({ ...address, line1: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value.replace(/[^a-zA-Z\s]/g, ""), })
              }
              required
            />
            <input
              className="input"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value.replace(/[^a-zA-Z\s]/g, ""), })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Pincode"
              maxLength={6}
              value={address.pincode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  pincode: e.target.value.replace(/\D/g, ""),
                })
              }
              required
            />
            <input
              className="input"
              placeholder="Phone"
              maxLength={10}
              value={address.phone}
              onChange={(e) =>
                setAddress({
                  ...address,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={() => setSaveAddress(!saveAddress)}
            />
            Save this address
          </label>

          {/* PAYMENT */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Payment Method</h3>

            <label className="flex items-center gap-3 border rounded-lg p-3 mb-2">
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online (UPI / Card)
            </label>

            <label className="flex items-center gap-3 border rounded-lg p-3">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>
        </form>

        {/* RIGHT – DESKTOP SUMMARY */}
        <div className=" sm:hidden sticky top-24">
          <div className="bg-white shadow-lg rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-3">Order Summary</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>₹{totalRupees}</span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-green-600 hover:bg-green-700
                         text-white font-semibold py-3 rounded-xl"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BAR */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 
                        bg-white border-t shadow-xl 
                        z-50 ">
          <div className="container flex items-center justify-between py-3">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold">₹{totalRupees}</p>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="bg-green-600 text-white 
                         font-semibold px-6 py-3 rounded-xl"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      )}
    </>
  );
}



