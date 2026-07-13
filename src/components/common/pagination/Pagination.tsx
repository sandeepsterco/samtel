import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./pagination.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: { currentPage: number, totalPages: number, onPageChange: any, maxVisiblePages: number }) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page: any) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="paginationContainer">
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {/* Previous Button */}
          <li
            className={`pageItem ${currentPage === 1 ? "disabled" : ""
              }`}
          >
            <button
              className="pageLink"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous"
            >
              <FaChevronLeft size={12} />
            </button>
          </li>

          {/* First Page */}
          {pageNumbers[0] > 1 && (
            <>
              <li className="pageItem">
                <button
                  className="pageLink"
                  onClick={() => handlePageClick(1)}
                >
                  1
                </button>
              </li>
              {pageNumbers[0] > 2 && (
                <li className="pageItem">
                  <span className="pageLink">...</span>
                </li>
              )}
            </>
          )}

          {/* Page Numbers */}
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`pageItem ${currentPage === page ? "active" : ""
                }`}
            >
              <button
                className="pageLink"
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Last Page */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <li className="pageItem">
                  <span className="pageLink">...</span>
                </li>
              )}
              <li className="pageItem">
                <button
                  className="pageLink"
                  onClick={() => handlePageClick(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {/* Next Button */}
          <li
            className={`pageItem ${currentPage === totalPages ? "disabled" : ""
              }`}
          >
            <button
              className="pageLink"
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next"
            >
              <FaChevronRight size={12} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
