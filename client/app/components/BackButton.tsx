import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="hover:cursor-pointer w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
      >
        <FiArrowLeft className="w-6 h-6 text-gray-800" />
      </button>
    </div>
  );
};

export default BackButton;
