import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { parentService, type ParentProfile } from "@/services/parentService";

export default function ParentProfile() {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    occupation: "",
    address: "",
    emergencyContact: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await parentService.getProfile();
        setProfile(profileData);
        setFormData({
          occupation: profileData.occupation || "",
          address: profileData.address || "",
          emergencyContact: profileData.emergencyContact || "",
        });
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const updatedProfile = await parentService.updateProfile(formData);
      setProfile(updatedProfile);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        occupation: profile.occupation || "",
        address: profile.address || "",
        emergencyContact: profile.emergencyContact || "",
      });
    }
    setEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{profile.userId.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{profile.userId.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{profile.userId.phone || "Not provided"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relation">Relation to Student</Label>
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium capitalize">{profile.relationToStudent}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                {editing ? (
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Enter your occupation"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{profile.occupation || "Not provided"}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                {editing ? (
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact number"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{profile.emergencyContact || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              {editing ? (
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your address"
                  className="w-full p-2 border rounded-lg resize-none"
                  rows={3}
                />
              ) : (
                <div className="flex items-start gap-2 p-2 border rounded-lg bg-gray-50">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <span className="font-medium">{profile.address || "Not provided"}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <Badge className={profile.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {profile.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(profile.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Children</span>
              </div>
              <div className="space-y-2">
                {profile.children.map((child) => (
                  <div key={child._id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">{child.firstName} {child.lastName}</p>
                        <p className="text-xs text-muted-foreground">{child.admissionNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{child.className}</p>
                      <p className="text-xs text-muted-foreground">{child.sectionName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">View Children</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              <span className="text-sm">Results</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Phone className="h-6 w-6 mb-2" />
              <span className="text-sm">Contact School</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
