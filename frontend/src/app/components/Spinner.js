export default function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}