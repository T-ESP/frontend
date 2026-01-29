import { FiUser, FiBell, FiDatabase, FiShield } from "react-icons/fi";

const settingsSections = [
  {
    title: "Account Settings",
    icon: FiUser,
    items: [
      { label: "Profile Information", description: "Update your personal information and profile picture" },
      { label: "Email Preferences", description: "Manage your email notifications and communication" },
      { label: "Password & Security", description: "Change your password and security settings" },
    ]
  },
  {
    title: "Notifications",
    icon: FiBell,
    items: [
      { label: "Push Notifications", description: "Control push notifications for important events" },
      { label: "Email Alerts", description: "Configure email alerts for stock and orders" },
      { label: "SMS Notifications", description: "Set up SMS alerts for critical updates" },
    ]
  },
  {
    title: "System Configuration",
    icon: FiDatabase,
    items: [
      { label: "API Keys", description: "Manage API keys and integrations" },
      { label: "Webhooks", description: "Configure webhooks for external services" },
      { label: "Data Export", description: "Export your data in various formats" },
    ]
  },
  {
    title: "Privacy & Security",
    icon: FiShield,
    items: [
      { label: "Two-Factor Authentication", description: "Enable 2FA for enhanced security" },
      { label: "Session Management", description: "View and manage active sessions" },
      { label: "Privacy Settings", description: "Control your data and privacy preferences" },
    ]
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="px-6 py-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Settings</h3>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account and application preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50">
                <section.icon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 transition-all border border-gray-200 rounded-lg bg-gray-50 hover:border-purple-300 hover:shadow-sm">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.label}</h4>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-purple-600 transition-colors bg-white border border-purple-200 rounded-lg hover:bg-purple-50">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


