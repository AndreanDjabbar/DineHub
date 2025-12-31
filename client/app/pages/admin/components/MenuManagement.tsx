import React from 'react';
import { FiTrash2, FiX, FiBookOpen } from 'react-icons/fi';
import type { MenuCategory, AddOn, AddOnOption } from './types';

interface MenuManagementProps {
  categories: MenuCategory[];
  newCategory: any;
  setNewCategory: (category: any) => void;
  handleAddCategory: (e: React.FormEvent) => void;
  newMenuItem: any;
  setNewMenuItem: (item: any) => void;
  handleAddMenuItem: (e: React.FormEvent) => void;
  newAddOn: AddOn;
  setNewAddOn: (addOn: AddOn) => void;
  newAddOnOption: AddOnOption;
  setNewAddOnOption: (option: AddOnOption) => void;
  handleAddAddOnToItem: () => void;
  handleAddOptionToAddOn: () => void;
  handleDeleteCategory: (id: string) => void;
  handleDeleteMenuItem: (id: string, categoryId: string) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({
  categories,
  newCategory,
  setNewCategory,
  handleAddCategory,
  newMenuItem,
  setNewMenuItem,
  handleAddMenuItem,
  newAddOn,
  setNewAddOn,
  newAddOnOption,
  setNewAddOnOption,
  handleAddAddOnToItem,
  handleAddOptionToAddOn,
  handleDeleteCategory,
  handleDeleteMenuItem
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 border-r border-gray-100 pr-8 space-y-8">
        {/* Add Category Form */}
        <div>
          <h3 className="text-lg font-bold mb-4">Add Menu Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Main Course"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">
              Add Category
            </button>
          </form>
        </div>

        <hr className="border-gray-100" />

        {/* Add Menu Item Form */}
        <div>
          <h3 className="text-lg font-bold mb-4">Add Menu Item</h3>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Fried Rice"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input 
                type="number" 
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({...newMenuItem, price: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                value={newMenuItem.categoryId}
                onChange={(e) => setNewMenuItem({...newMenuItem, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Add-ons Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-bold text-sm mb-3 text-gray-800">Add-ons (Optional)</h4>
              
              {/* List of added add-ons */}
              {newMenuItem.addOns.length > 0 && (
                <div className="mb-6 space-y-3">
                  {newMenuItem.addOns.map((addon: AddOn, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-gray-800">{addon.name}</span>
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Min: {addon.minSelect}, Max: {addon.maxSelect}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedAddOns = [...newMenuItem.addOns];
                            updatedAddOns.splice(idx, 1);
                            setNewMenuItem({ ...newMenuItem, addOns: updatedAddOns });
                          }}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {addon.options.map((opt, optIdx) => (
                          <span key={optIdx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                            {opt.name} (+{opt.price})
                          </span>
                        ))}
                        {addon.options.length === 0 && <span className="text-xs text-gray-400 italic">No options added</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new add-on form */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">New Add-on Group</h5>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Group Name (e.g. Spiciness Level)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={newAddOn.name}
                    onChange={(e) => setNewAddOn({...newAddOn, name: e.target.value})}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Min Select</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={newAddOn.minSelect}
                        onChange={(e) => setNewAddOn({...newAddOn, minSelect: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Max Select</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={newAddOn.maxSelect || ''}
                        onChange={(e) => setNewAddOn({...newAddOn, maxSelect: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  {/* Add options to add-on */}
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Options</label>
                    
                    {newAddOn.options.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3">
                        {newAddOn.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{opt.name}</span>
                              <span className="text-red-400">|</span>
                              <span>+{opt.price}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedOptions = [...newAddOn.options];
                                updatedOptions.splice(idx, 1);
                                setNewAddOn({ ...newAddOn, options: updatedOptions });
                              }}
                              className="text-red-400 hover:text-red-600"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <input 
                        type="text" 
                        placeholder="Option Name (e.g. Mild)"
                        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={newAddOnOption.name}
                        onChange={(e) => setNewAddOnOption({...newAddOnOption, name: e.target.value})}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOptionToAddOn();
                          }
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Price"
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={newAddOnOption.price === 0 ? '' : newAddOnOption.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) {
                            setNewAddOnOption({...newAddOnOption, price: val === '' ? 0 : parseInt(val)})
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOptionToAddOn();
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={handleAddOptionToAddOn}
                        className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleAddAddOnToItem}
                    disabled={!newAddOn.name || newAddOn.options.length === 0}
                    className={`w-full py-2 rounded-lg text-sm font-bold transition ${
                      !newAddOn.name || newAddOn.options.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    Save Add-on Group
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">
              Add Item
            </button>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">Current Menu</h3>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-bold text-gray-800">{category.name}</h4>
                <button 
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete Category"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="p-4">
                {category.items.length > 0 ? (
                  <div className="grid gap-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Rp {item.price.toLocaleString()}</p>
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {item.addOns.map((addon, idx) => (
                                <div key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                  <span className="font-semibold text-gray-700">{addon.name}:</span> 
                                  <span className="ml-1 text-gray-500">
                                    {addon.options.map(opt => opt.name).join(", ")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDeleteMenuItem(item.id, category.id)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm text-center py-2">No items in this category</p>
                )}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <FiBookOpen className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">No menu categories found. Start by adding one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
