import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import "../dashboardStyle.css";

const DashboardTableHead = ({
  filter,
  setFilter,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
}) => {
  const handleSortChange = (newSortKey) => {
    if (sortKey === newSortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(newSortKey);
      setSortDirection("asc");
    }
  };

  return (
    <div className="dashboardTableHead">
      <div className="tableHeadInfo">
        <h3>Current Stock</h3>
        <p>All Shoes</p>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search Shoe Name or ID"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button type="submit">
          <IoIosSearch size={24} />
        </Button>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Button
          className="table-sortprice"
          onClick={() => handleSortChange("price")}
        >
          Sort by Price{" "}
          {sortKey === "price" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
        </Button>
        {/* Add more sorting options if needed */}
      </div>
    </div>
  );
};

export default DashboardTableHead;
