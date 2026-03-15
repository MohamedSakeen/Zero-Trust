"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { Save, Shield, Bell, Building2, Globe, Server, Trash2, Plus } from "lucide-react";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  
  // Mock departments for the settings
  const [departments, setDepartments] = useState([
    { id: 1, name: "Computer Science", code: "CS" },
    { id: 2, name: "Mathematics", code: "MATH" },
    { id: 3, name: "Physics", code: "PHY" },
    { id: 4, name: "Engineering", code: "ENG" },
  ]);

  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");

  const handleAddDepartment = () => {
    if (newDeptName && newDeptCode) {
      setDepartments([
        ...departments,
        { id: Date.now(), name: newDeptName, code: newDeptCode }
      ]);
      setNewDeptName("");
      setNewDeptCode("");
    }
  };

  const handleRemoveDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Platform Settings" 
        description="Manage system configuration, security policies, and organizational structure."
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <Card className="w-full md:w-64 h-fit shrink-0">
          <CardContent className="p-2">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "general" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Globe className="h-4 w-4" />
                General
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "security" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Shield className="h-4 w-4" />
                Security & Compliance
              </button>
              <button
                onClick={() => setActiveTab("departments")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "departments" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Departments
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "notifications" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "system" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Server className="h-4 w-4" />
                System Status
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic configuration for the examination platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="Zero Trust University Exam Platform" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" defaultValue="support@zerotrust.edu" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select defaultValue="UTC">
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="MM/DD/YYYY">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>Configure zero-trust policies and access controls.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-900 border-b pb-2">Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">Require 2FA for Admins</p>
                      <p className="text-sm text-slate-500">Enforce two-factor authentication for all administrative accounts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">Biometric Verification</p>
                      <p className="text-sm text-slate-500">Require candidates to complete biometric verification before exams.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-900 border-b pb-2">Session Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Admin Session Timeout (Minutes)</Label>
                      <Input id="sessionTimeout" type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "departments" && (
            <Card>
              <CardHeader>
                <CardTitle>Department Management</CardTitle>
                <CardDescription>Manage university departments for organizing exams and candidates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="newDeptName">Department Name</Label>
                    <Input 
                      id="newDeptName" 
                      placeholder="e.g., Biology" 
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor="newDeptCode">Code</Label>
                    <Input 
                      id="newDeptCode" 
                      placeholder="e.g., BIO" 
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddDepartment} disabled={!newDeptName || !newDeptCode}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                      <tr>
                        <th className="px-6 py-3">Department Name</th>
                        <th className="px-6 py-3">Code</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.id} className="bg-white border-b last:border-0 hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{dept.name}</td>
                          <td className="px-6 py-4 text-slate-500">{dept.code}</td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveDepartment(dept.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {departments.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                            No departments found. Add one above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure system alerts and automated emails.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">Suspicious Activity Alerts</p>
                      <p className="text-sm text-slate-500">Receive immediate alerts when SOC flags a session.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">Exam Completion Summary</p>
                      <p className="text-sm text-slate-500">Receive a daily summary of completed exams.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">New Candidate Registrations</p>
                      <p className="text-sm text-slate-500">Notify when new candidates register for an exam.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current health and version information of the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Platform Version</span>
                    <span className="text-sm font-medium text-slate-900">v2.4.1 (Stable)</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Database Status</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">AI Proctoring Engine</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Last Backup</span>
                    <span className="text-sm font-medium text-slate-900">Today, 03:00 AM UTC</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
