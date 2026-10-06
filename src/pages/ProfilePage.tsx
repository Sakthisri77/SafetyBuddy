import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  User,
  Shield,
  Phone,
  Mail,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Edit2,
  Bell,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    trustedContacts,
    updateContact,
    addContact,
    deleteContact,
    loginAs,
    addToast,
  } = useSafety();

  const [isAddingContact, setIsAddingContact] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactRel, setNewContactRel] = useState<string>('Parent');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactEmail, setNewContactEmail] = useState<string>('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    addContact({
      name: newContactName,
      relationship: newContactRel,
      phone: newContactPhone,
      email: newContactEmail || 'contact@example.com',
      notifyOnDeviation: true,
      notifyOnEmergency: true,
      canViewLiveEmergency: true,
    });

    setNewContactName('');
    setNewContactPhone('');
    setNewContactEmail('');
    setIsAddingContact(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center font-black text-lg">
            {currentUser.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#059669] uppercase bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0]">
                ACTIVE ACCOUNT
              </span>
              <span className="text-xs text-[#6B7280]">Role: {currentUser.role}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">{currentUser.email} • {currentUser.phone}</p>
          </div>
        </div>

        {/* Demo Persona Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#6B7280] hidden md:inline font-medium">Demo Switcher:</span>
          <button
            onClick={() => loginAs('student')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentUser.role === 'student'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'bg-white text-[#6B7280] hover:text-[#1E1B4B] border border-[#EDE9FE]'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => loginAs('parent')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentUser.role === 'parent'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'bg-white text-[#6B7280] hover:text-[#1E1B4B] border border-[#EDE9FE]'
            }`}
          >
            Parent
          </button>
          <button
            onClick={() => loginAs('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'bg-white text-[#6B7280] hover:text-[#1E1B4B] border border-[#EDE9FE]'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Trusted Contacts Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1E1B4B] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#7C3AED]" />
              <span>Trusted Safety Contacts Circle ({trustedContacts.length})</span>
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Individuals entitled to receive urgent notifications and optional emergency GPS streaming.
            </p>
          </div>

          <button
            onClick={() => setIsAddingContact(!isAddingContact)}
            className="px-4 py-2 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold flex items-center gap-1.5 border border-[#DDD6FE] transition cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#7C3AED]" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Add Contact Form Drawer */}
        {isAddingContact && (
          <form
            onSubmit={handleAddSubmit}
            className="p-5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] space-y-3 animate-in fade-in"
          >
            <h3 className="text-xs font-bold text-[#1E1B4B]">Add New Trusted Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EDE9FE] text-xs text-[#1E1B4B] focus:outline-none focus:border-[#7C3AED]"
                required
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Parent)"
                value={newContactRel}
                onChange={(e) => setNewContactRel(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EDE9FE] text-xs text-[#1E1B4B] focus:outline-none focus:border-[#7C3AED]"
                required
              />
              <input
                type="text"
                placeholder="Phone (+1 ...)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EDE9FE] text-xs text-[#1E1B4B] focus:outline-none focus:border-[#7C3AED]"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EDE9FE] text-xs text-[#1E1B4B] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingContact(false)}
                className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#1E1B4B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        {/* Contact Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trustedContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] space-y-3 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-[#1E1B4B]">{contact.name}</div>
                  <div className="text-xs text-[#7C3AED] font-medium">{contact.relationship}</div>
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="text-[#9CA3AF] hover:text-[#DC2626] p-1 transition cursor-pointer"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-[#6B7280] space-y-1">
                <div className="font-medium text-[#1E1B4B]">{contact.phone}</div>
                <div className="text-[11px] text-[#9CA3AF]">{contact.email}</div>
              </div>

              <div className="pt-3 border-t border-[#EDE9FE] space-y-2 text-[11px]">
                <label className="flex items-center justify-between text-[#6B7280] cursor-pointer">
                  <span>Notify on Route Deviation</span>
                  <input
                    type="checkbox"
                    checked={contact.notifyOnDeviation}
                    onChange={(e) =>
                      updateContact(contact.id, {
                        notifyOnDeviation: e.target.checked,
                      })
                    }
                    className="accent-[#7C3AED]"
                  />
                </label>

                <label className="flex items-center justify-between text-[#6B7280] cursor-pointer">
                  <span>Authorized Live Emergency GPS</span>
                  <input
                    type="checkbox"
                    checked={contact.canViewLiveEmergency}
                    onChange={(e) =>
                      updateContact(contact.id, {
                        canViewLiveEmergency: e.target.checked,
                      })
                    }
                    className="accent-[#059669]"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
