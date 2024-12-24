interface HeaderProps {
    meetingOpen: boolean;
    handleMeetingClose: () => void;
}

const Meeting = ({ meetingOpen, handleMeetingClose }: HeaderProps) => {
    if (!meetingOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity"
                onClick={handleMeetingClose}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-[1200px] transform overflow-hidden rounded-[25px] bg-white p-6 shadow-xl transition-all">
                    {/* Close Button */}
                    <button 
                        onClick={handleMeetingClose}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Calendar Container */}
                    <div className="h-[900px] w-full overflow-y">
                        <iframe
                            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0_gRtg-rrFxlL2-Wq1fKHVoiNSTS1lJ92s_LIPuWVj_6oAyN2RHahk1zUtqf5lTOEDphPwfC7q?gv=true"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            className="h-full w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meeting;