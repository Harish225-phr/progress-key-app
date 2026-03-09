import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Mail,
  Phone,
  Shield,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Volume2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  User,
  Lock,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { parentService, type ParentProfile } from "@/services/parentService";

export default function ParentSettings() {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    resultNotifications: true,
    homeworkReminders: true,
    generalAnnouncements: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showContactInfo: false,
    allowDataSharing: true,
    twoFactorAuth: false,
    sessionTimeout: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    compactView: false,
    showAnimations: true,
    fontSize: "medium",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await parentService.getProfile();
        setProfile(profileData);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="p-2 border rounded-lg bg-gray-50">
                {profile?.userId.name || "Loading..."}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="p-2 border rounded-lg bg-gray-50">
                {profile?.userId.email || "Loading..."}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="p-2 border rounded-lg bg-gray-50">
                {profile?.userId.phone || "Not provided"}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="p-2 border rounded-lg bg-gray-50">
                <Badge className={profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {profile?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Update Email
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Update Phone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message alerts
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about attendance changes
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.attendanceAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("attendanceAlerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Fee Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive fee payment reminders
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.feeReminders}
                  onCheckedChange={(checked) => handleNotificationChange("feeReminders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Result Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when results are published
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.resultNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("resultNotifications", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Show Contact Information</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other parents to see your contact info
                </p>
              </div>
              <Switch
                checked={privacySettings.showContactInfo}
                onCheckedChange={(checked) => handlePrivacyChange("showContactInfo", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Data Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow data sharing for school analytics
                </p>
              </div>
              <Switch
                checked={privacySettings.allowDataSharing}
                onCheckedChange={(checked) => handlePrivacyChange("allowDataSharing", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={privacySettings.twoFactorAuth}
                onCheckedChange={(checked) => handlePrivacyChange("twoFactorAuth", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Auto Logout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically logout after inactivity
                </p>
              </div>
              <Switch
                checked={privacySettings.sessionTimeout}
                onCheckedChange={(checked) => handlePrivacyChange("sessionTimeout", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.darkMode}
                  onCheckedChange={(checked) => handleAppearanceChange("darkMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use more compact layout
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.compactView}
                  onCheckedChange={(checked) => handleAppearanceChange("compactView", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable interface animations
                  </p>
                </div>
                <Switch
                  checked={appearanceSettings.showAnimations}
                  onCheckedChange={(checked) => handleAppearanceChange("showAnimations", checked)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={appearanceSettings.fontSize}
                  onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Download My Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              <span className="text-sm">Export Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <HelpCircle className="h-6 w-6 mb-2" />
              <span className="text-sm">FAQ</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              <span className="text-sm">Contact Support</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
