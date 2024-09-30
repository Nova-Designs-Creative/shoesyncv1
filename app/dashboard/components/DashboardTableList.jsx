"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import SoldBtn from "./SoldBtn";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DashboardTableList = ({ shoes }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(shoes.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current items
  const currentItems = shoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Table>
      <TableCaption>A list of inventory.</TableCaption>
      <TableCaption>
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
            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
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
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>SKU NO.</TableHead>
          <TableHead>Shoes Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.map((shoeData) => (
          <TableRow className="dh-table-item" key={shoeData._id}>
            <TableCell className="font-medium">{shoeData.number}</TableCell>
            <TableCell>{shoeData.sku}</TableCell>
            <TableCell>{shoeData.name}</TableCell>
            <TableCell>{shoeData.size}</TableCell>
            <TableCell>₱{shoeData.price}</TableCell>
            <TableCell>{shoeData.location}</TableCell>
            <TableCell>{shoeData.owner}</TableCell>
            <TableCell className="text-center">
              <Link href={`/soldShoes/${shoeData._id}`}>
                <SoldBtn />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardTableList;
