import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import "../InventoryStyle.css";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

const InventoryHead = ({
  filter,
  setFilter,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
  locationFilter,
  setLocationFilter,
  ownerFilter,
  setOwnerFilter,
}) => {
  const handlePriceSortChange = (e) => {
    if (e.target.checked) {
      setSortKey("price");
      setSortDirection("desc");
    } else {
      setSortKey(null);
      setSortDirection("asc");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <Input
          type="text"
          placeholder="Search Shoe Name or SKU No."
          className="p-5 h-14 text-xl inventory-table-search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Link href={"/createShoes"}>
          <button className="create-btn">
            <FaPlus />
            <h3>Create</h3>
          </button>
        </Link>
      </div>
      <div className="flex gap-7">
        <input
          type="checkbox"
          name="Price"
          className="sort-btn"
          id="price-checkbox"
          onChange={handlePriceSortChange}
          checked={sortKey === "price"}
        />
        <label htmlFor="price-checkbox">Price</label>

        {/* Location Dropdown */}
        <select
          className="dropdown-select"
          name="Location"
          id="location-dropdown"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Locations</option>
          <option value="House">House</option>
          <option value="Store">Store</option>
        </select>

        {/* Owner Dropdown */}
        <select
          className="dropdown-select"
          name="Owner"
          id="owner-dropdown"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
        >
          <option value="">Owner</option>
          <option value="Bryan">Bryan</option>
          <option value="Fitz">Fitz</option>
          <option value="Ashley">Ashley</option>
        </select>
      </div>
    </div>
  );
};

export default InventoryHead;
