import toast from 'react-hot-toast';

export const useConfirm = () => {
  const confirm = (message, onConfirm, onCancel) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-gray-200`}
          style={{
            animation: t.visible ? 'slideIn 0.3s ease-out' : 'slideOut 0.2s ease-in',
          }}
        >
          <div className="flex-1 w-full p-5">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Confirmation</h3>
                <p className="text-sm text-gray-600">{message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  if (onConfirm) onConfirm();
                }}
                className="flex-1 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  if (onCancel) onCancel();
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Don't auto-dismiss
        position: 'top-center',
      }
    );
  };

  return { confirm };
};

