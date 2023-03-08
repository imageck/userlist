import { forwardRef } from "react";

const Toast = forwardRef(function Toast(props, ref) {
  return (
      <div className="toast position-absolute z-1 my-3 align-items-center text-bg-danger border-0"
           ref={ref}
           role="alert"
           aria-live="assertive"
           aria-atomic="true">
        <div className="d-flex">
          <button type="button"
                  className="btn-close btn-close-white ms-2 align-self-center"
                  data-bs-dismiss="toast"
                  aria-label="Close"/>
          <div className="toast-body">
            Could not proceed. Try again later.
          </div>
        </div>
      </div>
  );
});

export default Toast;
