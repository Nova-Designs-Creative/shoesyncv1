import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

const DeleteBtn = ({ id }) => {
  const router = useRouter();

  const removeShoes = async () => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/shoes?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete the shoe.");
      }

      router.push("/inventory");
    } catch (error) {
      console.error("Error deleting shoe:", error);
      alert("Failed to delete the shoe. Please try again.");
    }
  };

  return <FaTrash size={30} className="delete-btn" onClick={removeShoes} />;
};

export default DeleteBtn;
