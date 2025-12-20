import React from "react";
import {
    FaPlus,
    FaHome,
    FaBriefcase,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaTrash,
    FaSpinner,
    FaEdit,
} from "react-icons/fa";

const BillingAddress = ({
    language,
    showForm,
    setShowForm,
    sameAsShipping,
    setSameAsShipping,
    addresses,
    selectedAddressId,
    onSelect,
    onDelete,
    onEdit,
    form,
    setForm,
    errors,
    onSave,
    isSaving,
    countries,
    isEditing,
    onCancel,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    {language === "en" ? "Billing Address" : "عنوان الفواتير"}
                </h2>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="billingSameAsShipping"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                            htmlFor="billingSameAsShipping"
                            className="ml-2 text-sm text-gray-700"
                        >
                            {language === "en"
                                ? "Same as shipping address"
                                : "نفس عنوان الشحن"}
                        </label>
                    </div>
                    {!sameAsShipping && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            <FaPlus className="text-xs" />
                            <span>
                                {showForm
                                    ? language === "en"
                                        ? "Cancel"
                                        : "إلغاء"
                                    : language === "en"
                                        ? "Add New"
                                        : "إضافة جديد"}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {sameAsShipping ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center text-blue-700">
                        <FaCheckCircle className="w-5 h-5 mr-2" />
                        <p className="font-medium">
                            {language === "en"
                                ? "Billing address will use the shipping address"
                                : "سيتم استخدام عنوان الشحن لعنوان الفواتير"}
                        </p>
                    </div>
                </div>
            ) : !showForm ? (
                <div className="space-y-4">
                    {addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                                <div
                                    key={address._id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all relative group ${selectedAddressId === address._id
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => onSelect(address._id)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {address.type === "home" ? (
                                                <FaHome className="text-blue-500" />
                                            ) : address.type === "work" ? (
                                                <FaBriefcase className="text-green-500" />
                                            ) : (
                                                <FaMapMarkerAlt className="text-purple-500" />
                                            )}
                                            <span className="font-medium text-sm capitalize">
                                                {address.type === "home"
                                                    ? language === "en"
                                                        ? "Home"
                                                        : "المنزل"
                                                    : address.type === "work"
                                                        ? language === "en"
                                                            ? "Work"
                                                            : "العمل"
                                                        : language === "en"
                                                            ? "Other"
                                                            : "أخرى"}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {address.isDefault && (
                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                                    {language === "en" ? "Default" : "افتراضي"}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(address._id);
                                                }}
                                                className="text-blue-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaEdit className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(address._id, "billing");
                                                }}
                                                className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaTrash className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="font-medium">
                                            {address.firstName} {address.lastName}
                                        </p>
                                        <p>{address.address1}</p>
                                        {address.address2 && <p>{address.address2}</p>}
                                        <p>
                                            {address.city}, {address.state} {address.postalCode}
                                        </p>
                                        <p>{address.country}</p>
                                        <p className="font-medium mt-2">{address.phone}</p>
                                        <p>{address.email}</p>
                                    </div>

                                    {selectedAddressId === address._id && (
                                        <div className="absolute top-2 right-2">
                                            <FaCheckCircle className="text-green-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <FaMapMarkerAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">
                                {language === "en"
                                    ? "No billing addresses saved yet"
                                    : "لا توجد عناوين فواتير محفوظة"}
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <FaPlus />
                                <span>
                                    {language === "en"
                                        ? "Add Billing Address"
                                        : "إضافة عنوان الفواتير"}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Billing Address Form */
                <div id="billing-form-container" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Form fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "First Name *" : "الاسم الأول *"}
                            </label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        firstName: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={language === "en" ? "John" : "محمد"}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Last Name *" : "اسم العائلة *"}
                            </label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        lastName: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={language === "en" ? "Doe" : "أحمد"}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Phone Number *" : "رقم الهاتف *"}
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="+971 50 123 4567"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Email *" : "البريد الإلكتروني *"}
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Street Address *" : "العنوان *"}
                            </label>
                            <input
                                type="text"
                                value={form.address1}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        address1: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address1 ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={
                                    language === "en" ? "123 Main Street" : "شارع الشيخ زايد"
                                }
                            />
                            {errors.address1 && (
                                <p className="mt-1 text-xs text-red-600">{errors.address1}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en"
                                    ? "Apartment, Suite, etc. (Optional)"
                                    : "الشقة، الفيلا، إلخ (اختياري)"}
                            </label>
                            <input
                                type="text"
                                value={form.address2}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        address2: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={language === "en" ? "Apt 4B" : "فيلا ٤"}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "City *" : "المدينة *"}
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        city: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={language === "en" ? "Dubai" : "دبي"}
                            />
                            {errors.city && (
                                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "State/Province *" : "المنطقة *"}
                            </label>
                            <input
                                type="text"
                                value={form.state}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        state: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder={language === "en" ? "Dubai" : "دبي"}
                            />
                            {errors.state && (
                                <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Postal Code" : "الرمز البريدي"}
                            </label>
                            <input
                                type="text"
                                value={form.postalCode}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        postalCode: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="12345"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Country *" : "الدولة *"}
                            </label>
                            <select
                                value={form.country}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        country: e.target.value,
                                    })
                                }
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.country ? "border-red-500" : "border-gray-300"
                                    }`}
                            >
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            {errors.country && (
                                <p className="mt-1 text-xs text-red-600">{errors.country}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "en" ? "Address Type" : "نوع العنوان"}
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        type: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="home">
                                    {language === "en" ? "Home" : "المنزل"}
                                </option>
                                <option value="work">
                                    {language === "en" ? "Work" : "العمل"}
                                </option>
                                <option value="other">
                                    {language === "en" ? "Other" : "أخرى"}
                                </option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="billing-default"
                                checked={form.isDefault}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isDefault: e.target.checked,
                                    })
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="billing-default"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                {language === "en"
                                    ? "Set as default billing address"
                                    : "تعيين كعنوان فواتير افتراضي"}
                            </label>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSaving ? (
                                <>
                                    <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
                                    {language === "en" ? "Saving..." : "جاري الحفظ..."}
                                </>
                            ) : language === "en" ? (
                                isEditing ? "Update Address" : "Save Billing Address"
                            ) : (
                                isEditing ? "تحديث العنوان" : "حفظ عنوان الفواتير"
                            )}
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            {language === "en" ? "Cancel" : "إلغاء"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingAddress;
