import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings as SettingsIcon, User, Building, Bell, Shield, Thermometer, Mail, Phone, MapPin, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { toast } = useToast()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [temperatureAlerts, setTemperatureAlerts] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [inventoryAlerts, setInventoryAlerts] = useState(true)

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-primary hover:bg-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+234 (801) 234-5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="Arctic Fresh Frozen Foods" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input id="businessPhone" defaultValue="+234 (700) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input id="businessEmail" type="email" defaultValue="info@arcticfresh.ng" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea 
                  id="businessAddress" 
                  defaultValue="15 Industrial Estate, Victoria Island, Lagos, Nigeria"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input id="registrationNumber" defaultValue="RC123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input id="taxId" defaultValue="TAX987654321" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Communication Methods</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Alert Types</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Temperature Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical temperature warnings</p>
                  </div>
                  <Switch checked={temperatureAlerts} onCheckedChange={setTemperatureAlerts} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Order Updates</Label>
                    <p className="text-sm text-muted-foreground">New orders and status changes</p>
                  </div>
                  <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">Low stock and expiry warnings</p>
                  </div>
                  <Switch checked={inventoryAlerts} onCheckedChange={setInventoryAlerts} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Temperature Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Alert Thresholds</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="freezerMin">Freezer Minimum (°C)</Label>
                    <Input id="freezerMin" type="number" defaultValue="-25" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="freezerMax">Freezer Maximum (°C)</Label>
                    <Input id="freezerMax" type="number" defaultValue="-15" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="checkInterval">Check Interval (minutes)</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Zone Configuration</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Main Freezer A</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Target: -18°C</p>
                    </div>
                    
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Ice Cream Storage</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Target: -20°C</p>
                    </div>
                    
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Fresh Fish Freezer</span>
                        <Badge className="bg-yellow-500 text-white">Warning</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Target: -18°C</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                
                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Session Management</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-background rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Lagos, Nigeria • Chrome on Windows</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Sign Out All Other Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}