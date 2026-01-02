import React, { useState, useEffect } from "react";
import { API, IMAGE_BASE } from "../../api/client";

import { useAuth } from "../../context/AuthContext";


export default function MenuManager() {
  const { token } = useAuth();
  const [menu, setMenu] = useState([]);
  const [editing, setEditing] = useState(null);
  const [dragActive, setDragActive] = useState(false);
 
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
     foodType: "", 
    imageUrl: "",
  });
//filter categries
const categories = ["ALL", "Fastfood","Briyani","Meals", "Juice"];
const foodTypes = ["ALL", "Veg", "Non-Veg"];

const [categoryFilter, setCategoryFilter] = useState("ALL");
const [typeFilter, setTypeFilter] = useState("ALL");
const [search, setSearch] = useState("");
// filter logic
const filteredMenu = menu.filter((item) => {
  const matchCategory =
    categoryFilter === "ALL" || item.category === categoryFilter;

  const matchType =
    typeFilter === "ALL" || item.foodType === typeFilter;
    item.foodType?.toLowerCase() === typeFilter.toLowerCase();

  const matchSearch =
    item.name.toLowerCase().includes(search.toLowerCase());

  return matchCategory && matchType && matchSearch;
});


  // Load menu
  async function loadMenu() {
  try {
    const res = await fetch(`${API}/admin/menu`, {
      headers: { Authorization: `Bearer ${token}` },


    });

    const data = await res.json();
    setMenu(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Menu load failed", err);
    setMenu([]);
  }
}


  useEffect(() => {
    loadMenu();
  }, []);

  // UPLOAD IMAGE FUNCTION
  async function uploadImageFile(file) {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`${API}/admin/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();
    setForm({ ...form, imageUrl: data.url });
  }

  // DRAG EVENTS
  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) uploadImageFile(file);
  }

  // FILE INPUT
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) uploadImageFile(file);
  }

  // SAVE ITEM
  async function saveItem(e) {
    e.preventDefault();

  if (!form.foodType) {
    alert("Please select Veg or Non-Veg");
    return;
  }

  if (!form.category) {
    alert("Please select category");
    return;
  }

  if (!form.imageUrl) {
    alert("Please upload image");
    return;
  }

  const url = editing
    ? `${API}/admin/menu/${editing._id}`
    : `${API}/admin/menu`;

  const method = editing ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    alert(data.message || "Save failed");
    return;
  }

  setForm({
    name: "",
    price: "",
    category: "",
    foodType: "",
    imageUrl: "",
  });

  setEditing(null);
  loadMenu()
  }

  // DELETE ITEM
  async function deleteItem(id) {
  if (!window.confirm("Delete this item?")) return;

  const res = await fetch(`${API}/admin/menu/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Delete failed");
    return;
  }

  loadMenu();
}


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Menu Manager</h1>
<input
  className="input mb-3"
  placeholder="Search item..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<div className="flex gap-2 flex-wrap mb-3">
  {categories.map((c) => (
    <button
      key={c}
      onClick={() => setCategoryFilter(c)}
      className={`px-4 py-1 rounded-full border
        ${categoryFilter === c ? "bg-orange-600 text-white" : ""}`}
    >
      {c}
    </button>
  ))}
</div>


<div className="flex gap-2 flex-wrap mb-4">
  {foodTypes.map((t) => (
    
    <button
      key={t}
      onClick={() => setTypeFilter(t)}
      className={`px-4 py-1 rounded-full border
        ${typeFilter === t ? "bg-green-600 text-white" : ""}`}
    >
      {t}
    </button>
  ))}
</div>


      {/* FORM */}
      <form className="card p-4 grid gap-3 mb-4" onSubmit={saveItem}>

  {/* Name */}
  <input
    className="input"
    placeholder="Item Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    required
  />

  {/* Price */}
  <input
    className="input"
    type="number"
    placeholder="Price"
    value={form.price}
    onChange={(e) => setForm({ ...form, price: e.target.value })}
    required
  />

  {/* Category */}
  <select
  className="input"
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  required
>
  <option value="">Select Category</option>
  <option value="Fastfood">Fastfood</option>
    <option value="Briyani">Briyani</option>
  <option value="Meals">Meals</option>
   <option value="Juice">Juice</option>
</select>

<select
  className="input"
  value={form.foodType}
  onChange={(e) => setForm({ ...form, foodType: e.target.value })}
  required
>
  <option value="">Select Type</option>
  <option value="Veg">Veg</option>
  <option value="Non-Veg">Non-Veg</option>
</select>
{/*card badge */}

    


  
  {/* DRAG & DROP UPLOADER */}
  <div
    className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${
      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
    }`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    onClick={() => document.getElementById("fileInput").click()}
  >
    {dragActive ? (
      <p>Drop image here...</p>
    ) : (
      <p>Drag & drop JPG/PNG or click to upload</p>
    )}

    <input
      id="fileInput"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileSelect}
    />
  </div>

  {/* PREVIEW */}
  {form.imageUrl && (
    <div>
         {/* DEBUG: Show full image URL */}
    {console.log("Image URL:", API + form.imageUrl)}
      <img
       src={IMAGE_BASE + form.imageUrl}

        className="w-32 h-32 object-cover rounded border"
      />
      <button
        type="button"
        className="text-red-500 underline mt-2"
        onClick={() => setForm({ ...form, imageUrl: "" })}
      >
        Remove Image
      </button>
    </div>
  )}

  <button className="btn btn-primary w-full">
    {editing ? "Update Item" : "Add Item"}
  </button>
</form>


      {/* ITEMS LIST */}
      <div className="grid-menu">
  {filteredMenu.map((item) => (
    <div key={item._id} className="card p-4 relative">

      {/* VEG / NON-VEG BADGE */}
      <span
        className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold
        ${item.foodType === "Veg"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"}`}
      >
        {item.foodType}
      </span>

      <img
        src={IMAGE_BASE + item.imageUrl}
        className="w-full h-32 object-cover rounded"
      />

      <h3 className="font-bold mt-2">{item.name}</h3>
      <p>₹{item.price}</p>

      <button
        className="btn btn-outline w-full mt-2"
        onClick={() => deleteItem(item._id)}
      >
        Delete
      </button>
    </div>
  ))}
</div>

    </div>
  );
}


