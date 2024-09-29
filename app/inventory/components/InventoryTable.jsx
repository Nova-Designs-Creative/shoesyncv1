import React from "react";
import Link from "next/link"; // Import Link from Next.js
import "../InventoryStyle.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8; // Number of items to show per page

const InventoryTable = ({ shoeInventoryData }) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(shoeInventoryData.length / ITEMS_PER_PAGE);

  // Get the current items to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = shoeInventoryData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="inventoryTable">
      <div className="inventoryItems invetoryItems">
        {currentItems.map((shoeData, index) => (
          <Link href={`/inventory/${shoeData._id}`} key={index}>
            <div className="inventoryItem" style={{ cursor: "pointer" }}>
              <div className="flex justify-between items-start">
                <h1>{shoeData.number}</h1>
                <h5>{shoeData.size} Mens</h5>
              </div>
              <h2>{shoeData.name}</h2>
              <div className="flex justify-between mt-3 items-end metadata-price-owner">
                <h3>₱ {shoeData.price}</h3>
                <h4>Owner: {shoeData.owner}</h4>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination className="pagination-inventory">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() =>
                handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
              }
              style={{ color: "white" }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(index + 1)}
                style={{ color: "white" }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                handlePageChange(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages} // Disable when on the last page
              style={{
                color: "white",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }} // Change opacity when disabled
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default InventoryTable;
