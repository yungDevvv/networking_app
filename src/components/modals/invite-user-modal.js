import { X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { success, error } from "../../lib/toastify";
import { useTranslation } from "next-i18next";

function InviteUserModal({ setInviteUserModalOpen }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {t} = useTranslation("common")
  const handleSubmit = async () => {
    if (!email) {
      error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/auth/invite', { email });

      if (response.status === 200) {
        success(`Invitation sent to ${email}`);
      } else {
        error('Failed to send the invitation.');
      }
    } catch (err) {
      console.error("Error during invite", err);
      error('Failed to send the invitation.');
    } finally {
      setIsSubmitting(false);
      setInviteUserModalOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold -mt-1">{t("invite_user")}</h2>
          </div>
          <button
            onClick={() => setInviteUserModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 block mb-auto"
          >
            <X />
          </button>
        </div>
        <div className="my-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("email")} <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 self-start text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : t("send_invite")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteUserModal;
