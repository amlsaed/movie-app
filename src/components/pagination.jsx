import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Pagination = ({
  page,
  setPage,
  totalPages = 10,
  hasNextPage = true,
}) => {
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Calculate start and end of visible range around current page
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    // Add dots after first page if needed
    if (start > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        rangeWithDots.push(i);
      }
    }

    // Add dots before last page if needed
    if (end < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter(
      (item, index, arr) => arr.indexOf(item) === index
    );
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center justify-center mt-12 mb-8">
      <div className="pagination-container">
        <nav className="flex items-center space-x-2" aria-label="Pagination">
          {/* Previous Button */}
          <button
            onClick={() => handlePageClick(page - 1)}
            disabled={page === 1}
            className={`
              pagination-button flex items-center justify-center w-12 h-12 rounded-xl font-semibold
              transition-all duration-300 ease-in-out
              ${
                page === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-blue-600 hover:to-blue-500 hover:shadow-lg hover:scale-110 active:scale-95 shadow-md"
              }
            `}
            aria-label="Previous page"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {visiblePages.map((pageNum, index) => (
            <div key={index}>
              {pageNum === "..." ? (
                <span className="flex items-center justify-center w-12 h-12 text-gray-400 font-bold text-lg">
                  ⋯
                </span>
              ) : (
                <button
                  onClick={() => handlePageClick(pageNum)}
                  className={`
                    pagination-button flex items-center justify-center w-12 h-12 rounded-xl font-bold text-sm
                    transition-all duration-300 ease-in-out shadow-md
                    ${
                      pageNum === page
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25 shadow-lg scale-110 ring-2 ring-blue-400 ring-opacity-50"
                        : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-lg hover:scale-110 active:scale-95"
                    }
                  `}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === page ? "page" : undefined}
                >
                  {pageNum}
                </button>
              )}
            </div>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageClick(page + 1)}
            disabled={!hasNextPage || page >= totalPages}
            className={`
              pagination-button flex items-center justify-center w-12 h-12 rounded-xl font-semibold
              transition-all duration-300 ease-in-out
              ${
                !hasNextPage || page >= totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-blue-600 hover:to-blue-500 hover:shadow-lg hover:scale-110 active:scale-95 shadow-md"
              }
            `}
            aria-label="Next page"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Page Info */}
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-300 font-medium">
            Page <span className="text-blue-400 font-bold">{page}</span>
            {totalPages > 0 && (
              <>
                {" "}
                of{" "}
                <span className="text-blue-400 font-bold">
                  {totalPages.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
