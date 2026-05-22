import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Trash2, X, Bell } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { Button } from "./ui";

export default function NotificationDrawer() {
  const {
    notifications,
    removeNotification,
    clearNotifications,
    drawerOpen,
    toggleDrawer,
    setNotifications
  } = useNotification();

  const token = localStorage.getItem("token");
  const { user_id } = useParams();

  // Fetch notifications from backend when drawer opens
  useEffect(() => {
    if (drawerOpen && user_id && token) {
      fetch(`http://localhost:3000/${user_id}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) setNotifications(data.notifications.map(n => ({
            ...n,
            id: n._id // for local removal
          })));
        });
    }
  }, [drawerOpen, user_id, token, setNotifications]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-[#0a0a0f] border-l border-white/[0.08] shadow-2xl z-50 flex flex-col transform transition-all duration-300 ${
        drawerOpen 
          ? "translate-x-0 pointer-events-auto opacity-100" 
          : "translate-x-full pointer-events-none opacity-0 invisible"
      }`}
      style={{ maxWidth: "90vw" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
            <Bell className="text-violet-400" size={15} />
          </div>
          <span className="text-base font-semibold text-slate-100 tracking-tight">Notifications</span>
        </div>
        <button
          onClick={toggleDrawer}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Close notifications"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-3">
            <div className="h-10 w-10 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
              <Bell className="text-slate-600" size={20} />
            </div>
            <p className="text-sm font-medium">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-slate-900/40 border border-white/[0.06] rounded-xl p-4 flex items-start justify-between gap-3 shadow-lg hover:border-violet-500/20 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-violet-400 leading-snug">{n.title}</div>
                <div className="text-xs text-slate-300 leading-relaxed mt-1">{n.message}</div>
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Remove notification"
              >
                <FiX size={15} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end bg-slate-950/40">
        <Button
          onClick={clearNotifications}
          variant="danger"
          size="sm"
          disabled={notifications.length === 0}
          icon={Trash2}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}