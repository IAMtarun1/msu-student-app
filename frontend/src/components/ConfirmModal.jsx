function ConfirmModal({ open, onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                    Confirm Logout
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                    Are you sure you want to log out?
                </p>

                <div className="mt-5 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl bg-red-700 text-white hover:bg-red-800"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;