import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export default function NotificationBell({ recipientId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [trigger, setTrigger] = useState(false)
  const {t} = useTranslation("common")
  async function fetchNotifications() {
    try {
      const response = await axios.get(`/api/notifications/${recipientId}`);
      
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  }
  useEffect(() => {
    fetchNotifications();
  }, [recipientId]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  async function markAsRead(notificationId) {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      router.replace(router.asPath);
      setTrigger(prev => !prev)
      
    } catch (err) {
      console.error('Error updating notification status', err);
    }
  }
  function getTime(dateTimeString) {
    const time = dateTimeString.split('T')[1];
    return time.replace('Z', '').slice(0, 5);
  }

  function getDate(dateTimeString) {
    return dateTimeString.split('T')[0];
  }

  useEffect(() => {
    fetchNotifications();
  }, [trigger])
  return (
    <div className="relative">
      <button onClick={toggleNotifications} className="relative p-2">
        <Bell className='text-indigo-600' />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 z-50">
          <h4 className="text-lg font-semibold mb-2">{t("notifs")}</h4>
          <ul className="space-y-2">
            {notifications.map((notif) => (
              <li key={notif.id} className="border-b border-gray-200 pb-2">
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>{getTime(notif.created_at)}</span>
                  <span className='text-sm text-gray-400'>{getDate(notif.created_at)}</span>
                </div>
                <p className="text-gray-800 my-1">{notif.message}</p>
                <div className='flex items-center justify-between'>
                  {notif.inviteLink && (
                    <a href={notif.inviteLink} onClick={() => markAsRead(notif.id)} className="text-blue-500 hover:underline">{t("join")}</a>
                  )}
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-blue-500 hover:underline block"
                    >
                      {t("mark_readed")}
                    </button>
                  )}
                </div>
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

