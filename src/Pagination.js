export default function Pagination({
  pageIndex,
  canPreviousPage,
  previousPage,
  canNextPage,
  nextPage,
  loading
}) {
  return (
    <nav aria-label="pagination">
      <ul className="pagination pagination-lg">
        <li className="page-item">
          <button type="button"
            onClick={previousPage}
            disabled={!canPreviousPage}
            className={"page-link" + (!canPreviousPage ? " disabled" : '')}
            aria-label="Previous">
            <span aria-hidden="true">«</span>
          </button>
        </li>
        <li className="page-item">
          <span className="page-link" aria-label="Current">
          {loading ? (
            <span className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </span>
          ) : pageIndex + 1}
          </span>
        </li>
        <li className="page-item">
          <button type="button"
            onClick={nextPage}
            disabled={!canNextPage}
            className={"page-link" + (!canNextPage ? " disabled" : '')}
            aria-label="Next">
            <span aria-hidden="true">»</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
