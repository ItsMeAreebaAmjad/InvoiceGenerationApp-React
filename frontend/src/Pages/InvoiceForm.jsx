import React, { useState } from "react";
import { useRef,useEffect } from "react";
import html2pdf from "html2pdf.js";

const InvoiceForm = () => {
    const invoiceRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [image, setImage] = useState(null);
  const [billingDetails, setBillingDetails] = useState("");
    const [shippingDetails, setShippingDetails] = useState("");
    const [items, setItems] = useState([{ description: "", qty: 1, rate: "", amount: "" }]);
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // Open Modal
  const openModal = (title) => {
    setModalTitle(title);
    setIsModalOpen(true);
    if (title === "Bill To" && billingDetails) {
      setFormData(billingDetails);
    } else if (title === "Ship To" && shippingDetails) {
      setFormData(shippingDetails);
    } else {
      setFormData({
        companyName: "",
        country: "",
        phone: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
      });
    }
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save Data & Close Modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalTitle === "Bill To") {
      setBillingDetails(formData);
    } else {
      setShippingDetails(formData);
    }
    closeModal();
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItems = [...items];
        updatedItems[index][name] = value;
      
        // Calculate amount (qty * rate)
        if (name === "qty" || name === "rate") {
          updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].rate;
        }
      
        setItems(updatedItems);
      };
      
    
     // Add New Row
  const addRow = () => {
    setItems([...items, { description: "", qty: 1, rate: "", amount: "" }]);
    };
    
    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const tax = subtotal * 0.10; // 10% tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
      };
      
    const { subtotal, tax, total } = calculateTotal();
    
    useEffect(() => {
        if (!invoiceRef.current) {
          console.error("invoiceRef is still null after mounting.");
        } else {
          console.log("invoiceRef successfully assigned:", invoiceRef.current);
        }
      }, []);
    
      const handleDownloadPDF = () => {
        console.log("Download button clicked!");
    
        if (!invoiceRef.current) {
          console.error("invoiceRef is null. The invoice section may not be rendered yet.");
          return;
        }
    
        console.log("Element found:", invoiceRef.current);
    
        html2pdf()
          .from(invoiceRef.current)
          .set({
            margin: 10,
            filename: "invoice.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .save()
          .then(() => console.log("PDF saved successfully!"))
          .catch((err) => console.error("Error generating PDF:", err));
      };
      

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-700 p-6">
           <button
  onClick={handleDownloadPDF}
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition w-full sm:w-auto sm:px-4"
>
  Download as PDF
</button>

    <div ref={invoiceRef} className="max-w-4xl mx-auto p-6  bg-white shadow-lg rounded-lg mt-10">
                <h1 className="text-3xl font-bold mb-4">INVOICE</h1>
                

      {/* Image Upload */}
      <div
        className="w-40 h-40 border-2 border-dashed flex items-center justify-center cursor-pointer rounded-lg"
        onClick={() => document.getElementById("upload").click()}
      >
        {image ? (
          <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-gray-400">Upload Image</span>
        )}
      </div>
      <input type="file" id="upload" className="hidden" onChange={handleImageUpload} />

      {/* Bill To & Ship To Sections */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          className="border p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition"
          onClick={() => openModal("Bill To")}
        >
          <p className="text-gray-600 font-semibold">Billed To:</p>
          {billingDetails ? (
            <div className="text-gray-800">
              <p className="font-bold">{billingDetails.companyName}</p>
              <p>
                {billingDetails.address1}, {billingDetails.city}, {billingDetails.state}
              </p>
              <p>
                {billingDetails.country} - {billingDetails.postalCode}
              </p>
              <p>📞 {billingDetails.phone} | ✉️ {billingDetails.email}</p>
            </div>
          ) : (
            <p className="text-gray-400">Click to add details</p>
          )}
        </div>

        <div
          className="border p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition"
          onClick={() => openModal("Ship To")}
        >
          <p className="text-gray-600 font-semibold">Shipped To:</p>
          {shippingDetails ? (
            <div className="text-gray-800 to-indigo-700">
              <p className="font-bold">{shippingDetails.companyName}</p>
              <p>
                {shippingDetails.address1}, {shippingDetails.city}, {shippingDetails.state}
              </p>
              <p>
                {shippingDetails.country} - {shippingDetails.postalCode}
              </p>
              <p>📞 {shippingDetails.phone} | ✉️ {shippingDetails.email}</p>
            </div>
          ) : (
            <p className="text-gray-400">Click to add details</p>
          )}
        </div>
          </div>
          

           {/* Invoice Details */}
      <div className="mt-6 bg-purple-200 p-4 rounded-lg">
        <p className="font-semibold">Invoice No: <span className="text-gray-700">#INV123</span></p>
        <p className="font-semibold">Invoice Date: <span className="text-gray-700">03/16/2025</span></p>
        <p className="font-semibold">Due Date: <span className="text-gray-700">03/16/2025</span></p>
      </div>

      {/* Items Table */}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className=" bg-gradient-to-r from-purple-500 to-indigo-700 text-white">
              <th className="border p-2">Item Description</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
  {items.map((item, index) => (
    <tr key={index}>
      <td className="border p-2">
        <input
          type="text"
          name="description"
          value={item.description}
          onChange={(e) => handleItemChange(e, index)}
          className="w-full p-1 border rounded"
        />
      </td>
      <td className="border p-2 text-center">
        <input
          type="number"
          name="qty"
          value={item.qty}
          onChange={(e) => handleItemChange(e, index)}
          className="w-full p-1 border rounded text-center"
        />
      </td>
      <td className="border p-2 text-center">
        <input
          type="number"
          name="rate"
          value={item.rate}
          onChange={(e) => handleItemChange(e, index)}
          className="w-full p-1 border rounded text-center"
        />
      </td>
      <td className="border p-2 text-center">
        <input
          type="number"
          name="amount"
          value={item.amount}
          readOnly
          className="w-full p-1 border rounded text-center"
        />
      </td>
    </tr>
  ))}
</tbody>

        </table>
        <button  onClick={addRow} className="mt-4 w-full py-2 border border-dashed rounded  bg-gradient-to-r from-purple-500 to-indigo-700 text-white">
          + Add new row
        </button>
      </div>

      {/* Payment Info & Total */}
      <div className="mt-6 flex justify-between">
        <div>
          <p className="font-semibold">Payment Info:</p>
          <p>Account: HBL Limited</p>
          <p>A/C Name: Ms.Areeba Amjad</p>
          <p>Bank Details: 54545-87856344-6565 </p>
        </div>
        <div className="text-right">
  <p>Sub Total: <span className="font-semibold">{subtotal.toFixed(2)}</span></p>
  <p>Tax (10%): <span className="font-semibold">{tax.toFixed(2)}</span></p>
  <p className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white p-2 mt-2 rounded">Total: <span className="font-bold text-lg">{total.toFixed(2)}</span></p>
</div>

      </div>



      {/* Modal (Single Popup Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[700px]">
            <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Input Fields */}
              <div className="grid grid-cols-3 gap-3">
                <input type="text" name="companyName" placeholder="Company Name" className="w-full p-2 border rounded-lg" value={formData.companyName} onChange={handleChange} required />
                <input type="text" name="country" placeholder="Country" className="w-full p-2 border rounded-lg" value={formData.country} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone" className="w-full p-2 border rounded-lg" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded-lg" value={formData.email} onChange={handleChange} required />
                <input type="text" name="address1" placeholder="Address Line 1" className="w-full p-2 border rounded-lg" value={formData.address1} onChange={handleChange} required />
                <input type="text" name="address2" placeholder="Address Line 2" className="w-full p-2 border rounded-lg" value={formData.address2} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input type="text" name="city" placeholder="City" className="w-full p-2 border rounded-lg" value={formData.city} onChange={handleChange} required />
                <input type="text" name="state" placeholder="State" className="w-full p-2 border rounded-lg" value={formData.state} onChange={handleChange} required />
                <input type="text" name="postalCode" placeholder="Postal Code" className="w-full p-2 border rounded-lg" value={formData.postalCode} onChange={handleChange} required />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-1/2">Save</button>
                <button type="button" onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded w-1/2 ml-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
            </div>
            </div>
  );
};

export default InvoiceForm;
